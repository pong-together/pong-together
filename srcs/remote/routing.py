from django.urls import path

from remote.consumers import RemoteConsumer

websocket_urlpatterns = [
    path('ws/remote/', RemoteConsumer.as_asgi()),
]
