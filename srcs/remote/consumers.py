import asyncio
import json
from datetime import datetime
from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from remote.models import Remote


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

        except Exception:
            await self.close()

    async def disconnect(self, code):
        try:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            await self.cancel_ping_task()

            if self.channel_name in self.waiting_list[self.group_name]:
                self.waiting_list[self.group_name].remove(self.channel_name)

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

        await self.save_remote_model(first_id, second_id)

        await self.send_channel(first_channel, first_id, second_id)
        await self.send_channel(second_channel, second_id, first_id)

        self.waiting_list[self.group_name] = self.waiting_list[self.group_name][2:]

    async def send_channel(self, channel, intra_id, opponent_id):

        await self.channel_layer.send(channel, {
            'type': 'find_opponent',
            'opponent': opponent_id,

            'intra_id': intra_id
        })

    async def find_opponent(self, event):
        try:
            message = {
                'type': 'find_opponent',
                'opponent': event['opponent'],
                'intra_id': event['intra_id']
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

    @database_sync_to_async
    def save_remote_model(self, first_id, second_id):
        Remote.objects.create(player1_name=first_id, player2_name=second_id, game_mode=self.group_name)
