import os
from json import JSONDecodeError

import pyotp
import requests

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from auth.utils import get_user
from pong_together.settings import logger
from users.models import User

# Create your views here.

REDIRECT_URI = os.environ.get('REDIRECT_URI')
STATE = os.environ.get('STATE')
TOKEN_URI = 'https://api.intra.42.fr/oauth/token'
API_URI = 'https://api.intra.42.fr/v2/me'


class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    client_id = os.environ.get('CLIENT_ID')
    client_secret = os.environ.get('CLIENT_SECRET')
    intra_id = None
    image_url = None

    def post(self, request):
        try:
            code = request.data['code']
            access_token = self.get_access_token(code)
            self.set_userinfo(access_token)
        except (KeyError, ValueError, JSONDecodeError) as e:
            message = str(e)
            if e.__class__ is KeyError:
                message = f'{str(e)} is required'
            data = {
                'login': 'fail',
                'message': message
            }
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)

        user = self.get_user()
        if user.chat_connection:
            data = {
                'chat_connection': True
            }
            return Response(data=data, status=status.HTTP_200_OK)
        refresh = RefreshToken.for_user(user)
        data = {
            'id': user.id,
            'login': 'success',
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        }
        logger.info(f'LOGIN SUCCESS {self.intra_id}')
        return Response(data=data, status=status.HTTP_200_OK)

    def get_access_token(self, code):
        body = {
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': REDIRECT_URI,
            'state': STATE
        }
        token_response = requests.post(TOKEN_URI, data=body).json()
        if token_response.get('error') is not None:
            raise ValueError('Failed to issue access token')
        access_token = token_response['access_token']
        return access_token

    def set_userinfo(self, access_token):
        header = {'Authorization': f'Bearer {access_token}'}
        api_response = requests.get(API_URI, headers=header).json()
        self.intra_id = api_response['login']
        self.image_url = api_response['image']['versions']['medium']

    def get_user(self):
        try:
            user = User.objects.get(intra_id=self.intra_id)
        except User.DoesNotExist:
            user = User.objects.create_user(self.intra_id, self.image_url)
        return user


class RefreshTokenAPIView(TokenRefreshView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except TokenError:
            return Response({'message': 'Token is invalid or expired'}, status=status.HTTP_401_UNAUTHORIZED)


class CreateOTPAPIView(APIView):
    def get(self, request):
        user = get_user(request)
        if not isinstance(user, User):
            return user

        totp = pyotp.totp.TOTP(user.otp_secret_key)
        qrcode_uri = totp.provisioning_uri(name=user.intra_id, issuer_name='pong-together')
        return Response({'qrcode_uri': qrcode_uri}, status=status.HTTP_200_OK)


class VerifyOTPAPIView(APIView):
    def get(self, request):
        user = get_user(request)
        if not isinstance(user, User):
            return user

        code = request.GET.get('code')
        if code is None:
            return Response({'message': '\'code\' is required'}, status=status.HTTP_400_BAD_REQUEST)

        totp = pyotp.totp.TOTP(user.otp_secret_key)
        if not totp.verify(code):
            return Response({'message': 'Invalid otp code'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'authentication': 'success'}, status=status.HTTP_200_OK)
