from channels.generic.websocket import AsyncJsonWebsocketConsumer


class ChatConsumer(AsyncJsonWebsocketConsumer):
    GROUP_NAME = 'pong-together'

    async def connect(self):
        try:
            await self.channel_layer.group_add(self.GROUP_NAME, self.channel_name)
            await self.accept()
        except Exception:
            await self.close()

    async def disconnect(self, code):
        try:
            await self.channel_layer.group_discard(self.GROUP_NAME, self.channel_name)
        except Exception as e:
            await self.send_json({'error': str(e)})
