import asyncio
import json
from datetime import datetime
from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from pong_together.settings import logger
from remote.models import Remote


class RemoteConsumer(AsyncJsonWebsocketConsumer):
    waiting_list = {}
    matched_group = {}

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.ping_task = None
        self.user = None
        self.group_name = None
        self.channel_name = None
        self.remote = None
        self.is_normal = False

    async def connect(self):
        try:
            await self.init_connection()
            logger.info(f'Websocket REMOTE Try to connect {self.user.intra_id}')
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            self.ping_task = asyncio.create_task(self.send_ping())

            if self.group_name not in self.waiting_list:
                self.waiting_list[self.group_name] = []
            self.waiting_list[self.group_name].append((self.channel_name, self.user))

            if len(self.waiting_list[self.group_name]) >= 2:
                await self.start_matching()
            logger.info(f'Websocket REMOTE CONNECT {self.user.intra_id}')
        except Exception:
            await self.close()

    async def disconnect(self, code):
        try:
            logger.info(f'Websocket REMOTE Try to disconnect {self.user.intra_id}')
            if not self.is_normal:
                await self.disconnect_abnormal()

            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            await self.cancel_ping_task()

            for user in self.waiting_list[self.group_name]:
                if user[0] == self.channel_name:
                    self.waiting_list[self.group_name].remove(user)
                    break
            logger.info(f'Websocket REMOTE DISCONNECT {self.user.intra_id}')
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

        self.matched_group[second_channel] = []
        self.matched_group[second_channel].append(first_channel)
        self.matched_group[second_channel].append(second_channel)
        self.waiting_list[self.group_name] = self.waiting_list[self.group_name][2:]

        await self.save_remote_model(first_user, second_user)
        await self.send_channel(first_channel, first_user, second_user)
        await self.send_channel(second_channel, second_user, first_user)

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

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        try:
            await super().receive(text_data, bytes_data, **kwargs)
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def receive_json(self, content, **kwargs):
        try:
            if content['type'] == 'match_success':
                self.is_normal = True
        except KeyError as e:
            await self.send({'error': f'{str(e)} is required'})
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def disconnect_abnormal(self):

        if self.channel_name in self.matched_group:
            opponent_channel = self.matched_group[self.channel_name][0]
        else:
            opponent_channel = await self.disconnect_opponent_channel()
        if opponent_channel is not None:
            await self.channel_layer.send(opponent_channel, {
                'type': 'send_disconnection',
            })

    async def disconnect_opponent_channel(self):
        opponent_channel = None
        for key, groups in self.matched_group.items():
            if groups[0] == self.channel_name:
                opponent_channel = groups[1]
                break
            elif groups[1] == self.channel_name:
                opponent_channel = groups[0]
                break
        return opponent_channel

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
