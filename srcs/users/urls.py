from django.urls import path

from users.views import UserInfoAPIView, UserLanguageAPIView

urlpatterns = [
    path('<int:id>/', UserInfoAPIView.as_view()),
    path('<int:id>/language/', UserLanguageAPIView.as_view())
]