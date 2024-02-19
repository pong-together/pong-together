from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from tournaments.models import Tournament
from tournaments.serializers import TournamentSerializer, TournamentCreateSerializer


# Create your views here.

class TournamentsAPIView(APIView):
    def post(self, request):
        serializer = TournamentCreateSerializer(data=request.data)
        if serializer.is_valid():
            tournament = serializer.save()
            response_serializer = TournamentSerializer(tournament)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TournamentAPIView(APIView):
    def get(self, request, id):
        tournament = get_object_or_404(Tournament, id=id)
        serializer = TournamentSerializer(tournament)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        tournament = get_object_or_404(Tournament, id=id)
        game_turn = tournament.game_turn
        winner = request.data.get('winner')
        if not winner:
            return Response({'error': 'winner field is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if game_turn == 1:
            tournament.first_winner = winner
            tournament.game_turn += 1
        elif game_turn == 2:
            tournament.second_winner = winner
            tournament.game_turn += 1
        elif game_turn == 3:
            tournament.final_winner = winner

        tournament.save()
        serializer = TournamentSerializer(tournament)
        return Response(serializer.data, status=status.HTTP_200_OK)