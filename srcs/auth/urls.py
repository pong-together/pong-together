from django.urls import path

from auth.views import LoginView

app_name = 'auth'
urlpatterns = [
    path('login/', LoginView.as_view()),
]