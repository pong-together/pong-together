from rest_framework import serializers

from tournaments.models import Tournament


class TournamentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ('player1_name', 'player2_name', 'player3_name', 'player4_name')


class TournamentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tournament
        fields = ('id', 'player1_name', 'player2_name', 'player3_name', 'player4_name', 'game_turn',
                  'first_winner', 'second_winner', 'final_winner')
