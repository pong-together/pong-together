import asyncio
from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from rest_framework.generics import get_object_or_404

from local.models import Local
from remote.models import Remote
from tournaments.models import Tournament
from users.models import User


class GameConsumer(AsyncJsonWebsocketConsumer):
    remote_game = {}

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.task = None
        self.user = None
        self.type = None
        self.game = None
        self.group_name = None
        self.channel_name = None
        self.player1_name = None
        self.player2_name = None
        self.pong = None

    async def connect(self):
        try:
            await self.init_connection()
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()

            if self.type == 'remote':
                await self.start_remote_game()
            else:
                await self.set_players_name()
                await self.channel_layer.group_send(self.group_name, {
                    'type': 'start',
                    'player1_name': self.player1_name,
                    'player2_name': self.player2_name,
                })
                await self.start_pong_game()

        except Exception:
            await self.close()

    async def init_connection(self):
        self.user = self.scope['user']
        query_string = parse_qs(self.scope['query_string'].strip().decode())
        self.type = query_string.get('type', [None])[0]
        type_id = query_string.get('type_id', [None])[0]
        if self.type is None or type_id is None:
            raise ValueError("type or type_id가 지정되지 않았습니다.")
        self.game = self.get_game(type_id)
        self.group_name = f'{self.type}_{type_id}'

    async def get_game(self, type_id):
        if self.type == 'local':
            return Local(id=type_id)
        if self.type == 'tournament':
            return Tournament(id=type_id)
        if self.type == 'remote':
            return Remote(id=type_id)

    async def start_remote_game(self):
        if self.group_name not in self.remote_game:
            self.remote_game[self.group_name] = []
        self.remote_game[self.group_name].append(self.user)

        if len(self.remote_game[self.group_name]) >= 2:
            await self.set_players_name()
            player1 = get_object_or_404(User, intra_id=self.player1_name)
            player2 = get_object_or_404(User, intra_id=self.player2_name)
            await self.channel_layer.group_send(self.group_name, {
                'type': 'start',
                'player1_name': self.player1_name,
                'player1_image': player1.image,
                'player2_name': self.player2_name,
                'player2_image': player2.image
            })
            await self.start_pong_game()

    async def set_players_name(self):
        self.player1_name = self.game.player1_name
        self.player2_name = self.game.player2_name

    async def start(self, event):
        try:
            await self.send_json(event)
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def start_pong_game(self):
        self.pong = Pong(self)
        self.task = asyncio.create_task(self.pong.run())

    async def disconnect(self, code):
        try:
            if type == 'remote':
                await self.disconnect_remote()

            #토너먼트, 로컬
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            await self.cancel_task()
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def disconnect_remote(self):
        if self.pong.winner is None:  # 비정상 종료 처리
            await self.update_lose()
            await self.send_end_abnormal()
            if self.task is None:
                await self.update_win()
        else:  # 정상 종료 처리
            if self.task:
                await self.update_result(self.pong.winner)

        if self.user in self.remote_game[self.group_name]:
            self.remote_game[self.group_name].remove(self.user)

    @database_sync_to_async
    async def update_lose(self):
        self.user.lose_count += 1
        self.user.game_count += 1
        self.user.save()

    @database_sync_to_async
    async def update_win(self):
        self.user.win_count += 1
        self.user.game_count += 1
        self.user.save()

    @database_sync_to_async
    async def update_result(self):
        winner = get_object_or_404(User, intra_id=self.pong.winner)

    async def send_end_abnormal(self):
        await self.channel_layer.group_send(self.group_name, {
            'type': 'end_abnormal',
            'winner': self.user.intra_id
        })

    async def end_abnormal(self, event):
        await self.send_json(event)

    async def cancel_task(self):
        self.task.cancel()
        try:
            await self.task
        except asyncio.CancelledError:
            pass

    def is_player1(self):
        return self.user.intra_id == self.player1_name

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        try:
            await super().receive(text_data, bytes_data, **kwargs)
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def receive_json(self, content, **kwargs):
        try:
            if content['type'] == 'push_button':
                self.push_button(content['sender_player'], content['button'])
        except KeyError as e:
            await self.send_json({'error': f'{str(e)} is required'})

    def push_button(self, sender_player, button):
        player = self.pong.player1
        if sender_player == 'player2':
            player = self.pong.player2
        player.move(button)

