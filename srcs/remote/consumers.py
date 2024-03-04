import asyncio
import json
from datetime import datetime
from urllib.parse import parse_qs

from channels.generic.websocket import AsyncJsonWebsocketConsumer


class RemoteConsumer(AsyncJsonWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.ping_task = None
        self.user = None
        self.group_name = None
        self.channel_name = None

    async def connect(self):
        try:
            await self.init_connection()
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            self.ping_task = asyncio.create_task(self.send_ping())
        except Exception:
            await self.close()

    async def disconnect(self, code):
        try:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            await self.cancel_ping_task()
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def init_connection(self):
        self.user = self.scope['user']
        query_string = parse_qs(self.scope['query_string'].strip().decode())
        game_mode = query_string.get('game_mode', [None])[0]
        if game_mode is None:
            raise ValueError("게임 모드가 지정되지 않았습니다.")
        self.group_name = game_mode

    async def send_ping(self):
        while True:
            await asyncio.sleep(60)
            await self.send(text_data=json.dumps({
                'type': 'ping',
                'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }))

    async def cancel_ping_task(self):
        self.ping_task.cancel()
        try:
            await self.ping_task
        except asyncio.CancelledError:
            pass
