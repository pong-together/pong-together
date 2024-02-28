from rest_framework import serializers

from local.models import Local


class LocalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Local
        fields = ('id', 'player1_name', 'player2_name', 'game_mode')