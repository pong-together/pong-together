from django.shortcuts import render
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models import User
from users.serializers import UserInfoSerializer, UserLanguageSerializer


# Create your views here.

class UserInfoAPIView(APIView):

    def get(self, request, id):
        user = get_object_or_404(User, id=id)
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
        return Response({'message': '언어 설정 수정 실패'}, status=status.HTTP_400_BAD_REQUEST)



