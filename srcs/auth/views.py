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
        except (KeyError, ValueError, JSONDecodeError):
            data = {'login': 'fail'}
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)

        user = self.get_user()
        refresh = RefreshToken.for_user(user)
        data = {
            'id': user.id,
            'intra_id': user.intra_id,
            'login': 'success',
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        }
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
            raise ValueError()
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
    def post(self, request, *args, **kwargs):
        try:
            return super().post(request, *args, **kwargs)
        except TokenError:
            data = {'message': 'Token is invalid or expired'}
            return Response(data=data, status=status.HTTP_401_UNAUTHORIZED)


class CreateOTPAPIView(APIView):
    def get(self, request):
        try:
            intra_id = request.GET['intra_id']
            user = User.objects.get(intra_id=intra_id)
        except KeyError as e:
            return Response({'message': f'{e} is required'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'message': 'Non-existent users'}, status=status.HTTP_404_NOT_FOUND)

        totp = pyotp.totp.TOTP(user.otp_secret_key)
        qrcode_uri = totp.provisioning_uri(name=intra_id, issuer_name='pong-together')
        return Response({'qrcode_uri': qrcode_uri}, status=status.HTTP_200_OK)


class VerifyOTPAPIView(APIView):
    def get(self, request):
        try:
            intra_id = request.GET['intra_id']
            code = request.GET['code']
            user = User.objects.get(intra_id=intra_id)
        except KeyError as e:
            return Response({'message': f'{e} is required'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'message': 'Non-existent users'}, status=status.HTTP_404_NOT_FOUND)

        totp = pyotp.totp.TOTP(user.otp_secret_key)
        if not totp.verify(code):
            return Response({'message': 'Invalid otp code'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'authentication': 'success'}, status=status.HTTP_200_OK)

