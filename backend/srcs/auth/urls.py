from django.urls import path

from auth.views import LoginAPIView, RefreshTokenAPIView

app_name = 'auth'
urlpatterns = [
    path('login/', LoginAPIView.as_view()),
    path('token/refresh/', RefreshTokenAPIView.as_view()),
]