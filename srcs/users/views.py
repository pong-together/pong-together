from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from auth.utils import get_user
from users.models import User
from users.serializers import UserInfoSerializer, UserLanguageSerializer, UserGameSerializer


# Create your views here.
class UserInfoAPIView(APIView):
    def get(self, request):
        user = get_user(request)
        if not isinstance(user, User):
            return user
        serializer = UserInfoSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserLanguageAPIView(APIView):
    def get(self, request, id):
        user = get_object_or_404(User, id=id)
        serializer = UserLanguageSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        user = get_object_or_404(User, id=id)
        serializer = UserLanguageSerializer(instance=user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class UserGameAPIView(APIView):
    def put(self, request):
        user = get_user(request)
        result = request.data.get('result')
        if not isinstance(user, User):
            return user
        if not result:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if result == 'win':
            user.win_count += 1
        else:
            user.lose_count += 1
        user.game_count += 1
        user.save()
        serializer = UserGameSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

