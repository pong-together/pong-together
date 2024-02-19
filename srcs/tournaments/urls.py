from django.urls import path

from tournaments.views import TournamentPostAPIView, TournamentAPIView

urlpatterns = [
    path('', TournamentPostAPIView.as_view()),
    path('<int:id>/', TournamentAPIView.as_view()),
]