from django.urls import path

from auth.views import LoginAPIView, RefreshTokenAPIView, CreateOTPAPIView, VerifyOTPAPIView

app_name = 'auth'
urlpatterns = [
    path('login/', LoginAPIView.as_view()),
    path('token/refresh/', RefreshTokenAPIView.as_view()),
    path('otp/', CreateOTPAPIView.as_view()),
    path('otp/verify/', VerifyOTPAPIView.as_view()),
]