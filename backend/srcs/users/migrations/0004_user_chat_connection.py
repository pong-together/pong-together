# Generated by Django 5.0.1 on 2024-02-29 05:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_user_game_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='chat_connection',
            field=models.BooleanField(default=False),
        ),
    ]
