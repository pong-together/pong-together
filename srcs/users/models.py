import pyotp
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from django.db import models

from users.managers import UserManager


# Create your models here.
class User(AbstractUser):
    class LanguageChoice(models.TextChoices):
        KOREAN = 'KR', 'Korean'
        ENGLISH = 'EN', 'English'
        JAPANESE = 'JP', 'Japanese'

    class GameStatusChoice(models.TextChoices):
        LOCAL = 'local'
        TOURNAMENT = 'tournament'
        REMOTE = 'remote'
        DISCONNECTED = 'disconnected'

    intra_id = models.CharField(unique=True)
    image = models.URLField()
    win_count = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    lose_count = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    game_count = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    language = models.CharField(max_length=2, choices=LanguageChoice, default=LanguageChoice.KOREAN)
    otp_secret_key = models.CharField(max_length=32, default=pyotp.random_base32)
    game_status = models.CharField(max_length=12, choices=GameStatusChoice, default=GameStatusChoice.DISCONNECTED)
    objects = UserManager()

    USERNAME_FIELD = 'intra_id'

    class DoesNotExist(Exception):
        def __init__(self, message='does not exist user'):
            super().__init__(message)
