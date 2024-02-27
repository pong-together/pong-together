from django.urls import path

from users.views import UserInfoAPIView, UserLanguageAPIView, UserGameAPIView

urlpatterns = [
    path('', UserInfoAPIView.as_view()),
    path('<int:id>/language/', UserLanguageAPIView.as_view()),
    path('result/', UserGameAPIView.as_view()),
]