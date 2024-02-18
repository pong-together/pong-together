from django.urls import path

from tournaments.views import TournamentsAPIView, TournamentAPIView

urlpatterns = [
    path('', TournamentsAPIView.as_view()),
    path('<int:id>/', TournamentAPIView.as_view()),
    path('<int:id>/', TournamentAPIView.as_view()),
]