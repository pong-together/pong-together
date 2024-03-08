"""
ASGI config for pong_together project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pong_together.settings')
asgi_application = get_asgi_application()

from pong_together.middlewares import WebSocketJWTAuthenticationMiddleware
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

import chats.routing
import remote.routing
import games.routing

websocket_urlpatterns = (chats.routing.websocket_urlpatterns
                         + remote.routing.websocket_urlpatterns
                         + games.routing.websocket_urlpatterns)

application = ProtocolTypeRouter({
    'http': asgi_application,
    'websocket':
    WebSocketJWTAuthenticationMiddleware(
        AllowedHostsOriginValidator(
            URLRouter(
                websocket_urlpatterns
            )
        )
    )
})
