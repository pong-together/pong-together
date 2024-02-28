from django.db import models

# Create your models here.
from django.db import models

# Create your models here.


class Tournament(models.Model):
    class GameModeChoice(models.TextChoices):
        DEFAULT = 'default', 'default'
        EXTREME = 'extreme', 'extreme'

    player1_name = models.CharField(max_length=10)
    player2_name = models.CharField(max_length=10)
    player3_name = models.CharField(max_length=10)
    player4_name = models.CharField(max_length=10)
    first_winner = models.CharField(null=True, max_length=10)
    second_winner = models.CharField(null=True, max_length=10)
    final_winner = models.CharField(null=True, max_length=10)
    game_turn = models.IntegerField(default=1)
    game_mode = models.CharField(max_length=7, choices=GameModeChoice)
