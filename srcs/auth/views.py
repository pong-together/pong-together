import os

import requests

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


# Create your views here.

REDIRECT_URI = os.environ.get('REDIRECT_URI')
STATE = os.environ.get('STATE')
TOKEN_URI = 'https://api.intra.42.fr/oauth/token'


class LoginView(APIView):
    permission_classes = [AllowAny]
    client_id = os.environ.get('CLIENT_ID')
    client_secret = os.environ.get('CLIENT_SECRET')

    def post(self, request):
        code = request.data.get('code')
        try:
            if code is None:
                raise status.HTTP_400_BAD_REQUEST
            access_token = self.get_access_token(code)
        except status:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(access_token, status=status.HTTP_200_OK)

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
        error = token_response.get('error')
        access_token = token_response.get('access_token')
        if error is not None or access_token is None:
            raise status.HTTP_400_BAD_REQUEST
        return access_token
