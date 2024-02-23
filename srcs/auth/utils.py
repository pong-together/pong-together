import jwt
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from pong_together import settings
from users.models import User


def decode_token(request):
    try:
        access_token = request.META['HTTP_AUTHORIZATION']
    except KeyError as e:
        raise ValidationError(f'{str(e)} is required')
    access_token = access_token[7:]
    payload = jwt.decode(access_token, settings.SIMPLE_JWT['SIGNING_KEY'], settings.SIMPLE_JWT['ALGORITHM'])
    user_id = payload.get('user_id')
    return user_id


def get_user(request):
    try:
        user_id = decode_token(request)
        user = User.objects.get(id=user_id)
    except ValidationError as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'message': 'Non-existent users'}, status=status.HTTP_404_NOT_FOUND)
    return user
