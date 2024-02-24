from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from rest_framework.exceptions import ValidationError

from auth.utils import decode_token
from users.models import User


class WebSocketJWTAuthenticationMiddleware(BaseMiddleware):
    def __init__(self, inner):
        super().__init__(inner)
        self.inner = inner

    async def __call__(self, scope, receive, send):
        try:
            access_token = self.get_access_token(scope['headers'])
            user = await self.get_user(access_token)
            scope['user'] = user
        except Exception:
            await send({'type': 'websocket.close'})
            return
        return await super().__call__(scope, receive, send)

    @staticmethod
    def get_access_token(headers):
        for key, value in headers:
            if key == b'authorization':
                token = value.decode('utf-8')
                return token.replace('Bearer ', '', 1)
        raise ValidationError

    @staticmethod
    @database_sync_to_async
    def get_user(access_token):
        user_id = decode_token(access_token)
        user = User.objects.get(id=user_id)
        return user
