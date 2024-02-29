from django.db import models

from users.models import User
# Create your models here.


class Remote(models.Model):
    class GameModeChoice(models.TextChoices):
        DEFAULT = 'default'
        EXTREME = 'extreme'
    player1_name = models.CharField()
    player2_name = models.CharField()
    game_mode = models.CharField(max_length=7, choices=GameModeChoice)