from django.urls import path

from chats.consumers import ChatConsumer

websocket_urlpatterns = [
    path('ws/chats/', ChatConsumer.as_asgi()),
]