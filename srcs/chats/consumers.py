from channels.generic.websocket import AsyncJsonWebsocketConsumer

GROUP_NAME = 'pong-together'


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        try:
            await self.channel_layer.group_add(GROUP_NAME, self.channel_name)
            await self.accept()
        except Exception as e:
            await self.close()
