from django.urls import path

from games.consumers import GameConsumer

websocket_urlpatterns = [
    path('ws/games/', GameConsumer.as_asgi()),
]