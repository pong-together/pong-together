import random

from rest_framework import serializers

from tournaments.models import Tournament


class TournamentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ('player1_name', 'player2_name', 'player3_name', 'player4_name', 'game_mode')

    def create(self, validated_data):
        player_names = list(validated_data.values())

        shuffled_player_names = random.sample(player_names, len(player_names))

        tournament = Tournament(
            player1_name=shuffled_player_names[0],
            player2_name=shuffled_player_names[1],
            player3_name=shuffled_player_names[2],
            player4_name=shuffled_player_names[3],
            game_mode=validated_data.get('game_mode'),
        )
        tournament.save()
        return tournament


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ('id', 'player1_name', 'player2_name', 'player3_name', 'player4_name', 'game_turn',
                  'first_winner', 'second_winner', 'final_winner', 'game_mode')
