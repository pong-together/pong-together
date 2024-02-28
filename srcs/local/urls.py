from django.urls import path

from local.views import LocalAPIView

urlpatterns = [
    path('', LocalAPIView.as_view()),
]