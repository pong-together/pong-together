from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from local.serializers import LocalSerializer


# Create your views here.
class LocalAPIView(APIView):
    def post(self, request):
        serializer = LocalSerializer(data=request.data)
        if serializer.is_valid():
            local = serializer.save()
            response_serializer = LocalSerializer(local)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
