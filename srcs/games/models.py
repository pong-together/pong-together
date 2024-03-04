from django.db import models

# Create your models here.


class Game(models.Model):
    player1_name = models.CharField()
    player2_name = models.CharField()
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    player1_x = models.IntegerField()
    player1_y = models.IntegerField()
    player2_x = models.IntegerField()
    player2_y = models.IntegerField()
    ball_x = models.IntegerField()
    ball_y = models.IntegerField()
