# Generated by Django 5.0.1 on 2024-02-20 06:39

import pyotp
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='otp_secret_key',
            field=models.CharField(default=pyotp.random_base32, max_length=32),
        ),
    ]