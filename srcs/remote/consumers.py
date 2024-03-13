import asyncio
import json
import logging
from datetime import datetime
from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from remote.models import Remote

logger = logging.getLogger('main')


class RemoteConsumer(AsyncJsonWebsocketConsumer):
    waiting_list = {}

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.ping_task = None
        self.matching_task = None
        self.user = None
        self.group_name = None
        self.channel_name = None
        self.remote = None

    async def connect(self):
        try:
            logger.info('Websocket REMOTE Try to connect')
            await self.init_connection()
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            self.ping_task = asyncio.create_task(self.send_ping())

            if self.group_name not in self.waiting_list:
                self.waiting_list[self.group_name] = []
            self.waiting_list[self.group_name].append((self.channel_name, self.user))

            if len(self.waiting_list[self.group_name]) >= 2:
                await self.start_matching()
            logger.info('Websocket REMOTE CONNECT')
        except Exception:
            await self.close()

    async def disconnect(self, code):
        try:
            logger.info('Websocket REMOTE Try to disconnect')
            await self.channel_layer.group_send(self.group_name, {
                'type': 'send_disconnection',
            })
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            await self.cancel_ping_task()

            for user in self.waiting_list[self.group_name]:
                if user[0] == self.channel_name:
                    self.waiting_list[self.group_name].remove(user)
                    break
            logger.info('Websocket REMOTE DISCONNECT')
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

        first_channel, first_user = self.waiting_list[self.group_name][0]
        second_channel, second_user = self.waiting_list[self.group_name][1]

        await self.save_remote_model(first_user, second_user)

        await self.send_channel(first_channel, first_user, second_user)
        await self.send_channel(second_channel, second_user, first_user)

        self.waiting_list[self.group_name] = self.waiting_list[self.group_name][2:]

    async def send_channel(self, channel, user, opponent_user):

        await self.channel_layer.send(channel, {
            'type': 'find_opponent',
            'opponent': opponent_user.intra_id,
            'opponent_image': opponent_user.image,

            'intra_id': user.intra_id,
            'id': self.remote.pk
        })

    async def find_opponent(self, event):
        try:
            message = {
                'type': 'find_opponent',
                'opponent': event['opponent'],
                'opponent_image': event['opponent_image'],
                'intra_id': event['intra_id'],
                'id': event['id']
            }
            await self.send_json(message)
        except KeyError as e:
            await self.send({'error': f'{str(e)} is required'})
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def send_disconnection(self, event):
        try:
            await self.send_json(event)
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
    def save_remote_model(self, first_user, second_user):
        self.remote = Remote.objects.create(player1_name=first_user.intra_id, player2_name=second_user.intra_id, game_mode=self.group_name)
