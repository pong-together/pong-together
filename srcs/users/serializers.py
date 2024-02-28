from rest_framework import serializers

from users.models import User


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'intra_id', 'image', 'win_count', 'lose_count', 'game_count', 'language', 'game_status')


class UserLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('language',)


class UserGameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('win_count', 'lose_count', 'game_count',)
