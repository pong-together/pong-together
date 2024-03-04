import asyncio
import json
from datetime import datetime
from urllib.parse import parse_qs

from channels.generic.websocket import AsyncJsonWebsocketConsumer


class RemoteConsumer(AsyncJsonWebsocketConsumer):
    waiting_list = {}

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.ping_task = None
        self.matching_task = None
        self.user = None
        self.group_name = None
        self.channel_name = None

    async def connect(self):
        try:
            await self.init_connection()
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            self.ping_task = asyncio.create_task(self.send_ping())

            if self.group_name not in self.waiting_list:
                self.waiting_list[self.group_name] = []
            self.waiting_list[self.group_name].append((self.channel_name, self.user.intra_id))

            if len(self.waiting_list[self.group_name]) >= 2:
                await self.start_matching()
            print(self.user.intra_id)
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

    async def start_matching(self):
        first_channel, first_id = self.waiting_list[self.group_name][0]
        second_channel, second_id = self.waiting_list[self.group_name][1]

        await self.channel_layer.send(first_channel, {
            'type': 'find_opponent',
            'opponent': second_id
        })

        await self.channel_layer.send(second_channel, {
            'type': 'find_opponent',
            'opponent': first_id
        })

    async def find_opponent(self, event):
        try:
            message = {
                'type': 'find_opponent',
                'opponent': event['opponent'],
            }
            await self.send_json(message)
        except KeyError as e:
            await self.send({'error': f'{str(e)} is required'})
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def cancel_ping_task(self):
        self.ping_task.cancel()
        try:
            await self.ping_task
        except asyncio.CancelledError:
            pass
