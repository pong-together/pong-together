import os

import requests

from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models import User

# Create your views here.

REDIRECT_URI = os.environ.get('REDIRECT_URI')
STATE = os.environ.get('STATE')
TOKEN_URI = 'https://api.intra.42.fr/oauth/token'
API_URI = 'https://api.intra.42.fr/v2/me'


class LoginView(APIView):
    permission_classes = [AllowAny]
    client_id = os.environ.get('CLIENT_ID')
    client_secret = os.environ.get('CLIENT_SECRET')

    def post(self, request):
        code = request.data.get('code')
        try:
            if code is None:
                raise ValidationError()
            access_token = self.get_access_token(code)

            header = {'Authorization': f'Bearer {access_token}'}
            api_response = requests.get(API_URI, headers=header)
            if api_response.status_code != status.HTTP_200_OK:
                raise ValidationError()
            api_response = api_response.json()
            intra_id = api_response.get('login')
            image_url = api_response.get('image').get('versions').get('medium')
            if intra_id is None or image_url is None:
                raise ValidationError()

            try:
                user = User.objects.get(intra_id=intra_id)
            except User.DoesNotExist:
                user = User.objects.create_user(intra_id, image_url)

            data = {
                "id": user.id
            }

        except ValidationError:
            data = {'login': 'fail'}
            return Response(data=data, status=status.HTTP_400_BAD_REQUEST)

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
        token_response = requests.post(TOKEN_URI, data=body)
        if token_response.status_code != status.HTTP_200_OK:
            raise ValidationError()
        token_response = token_response.json()
        error = token_response['error']
        access_token = token_response['access_token']
        return access_token
