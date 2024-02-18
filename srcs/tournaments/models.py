from django.db import models

# Create your models here.
from django.db import models

# Create your models here.


class Tournament(models.Model):
    player1_name = models.CharField(max_length=10)
    player2_name = models.CharField(max_length=10)
    player3_name = models.CharField(max_length=10)
    player4_name = models.CharField(max_length=10)
    first_winner = models.CharField(null=True)
    second_winner = models.CharField(null=True)
    final_winner = models.CharField(null=True)
    game_turn = models.IntegerField(default=1)
