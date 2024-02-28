from django.db import models

# Create your models here.


class Local(models.Model):
    class GameModeChoice(models.TextChoices):
        DEFAULT = 'default'
        EXTREME = 'extreme'

    player1_name = models.CharField(max_length=10)
    player2_name = models.CharField(max_length=10)
    game_mode = models.CharField(max_length=7, choices=GameModeChoice)