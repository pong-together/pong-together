import asyncio
from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from rest_framework.generics import get_object_or_404

from games.models import Game
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
                await self.remote_game_start()
            else:
                await self.get_player_user()
                await self.channel_layer.group_send(self.group_name, {
                    'type': 'start',
                    'player1_name': self.player1_name,
                    'player2_name': self.player2_name,
                })
                await self.game_start()

        except Exception:
            await self.close()

    async def disconnect(self, code):
        try:
            if type == 'remote':
                if self.pong.winner is None: #비정상 종료 처리
                    await self.update_lose()
                    await self.send_end_abnormal()
                    if self.task is None:
                        await self.update_win()
                else: #정상 종료 처리
                    if self.task:
                        await self.update_result(self.pong.winner)

                if self.user in self.remote_game[self.group_name]:
                    self.remote_game[self.group_name].remove(self.user)

            #토너먼트, 로컬
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            await self.cancel_task()
        except Exception as e:
            await self.send_json({'error': str(e)})

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

    async def init_connection(self):
        self.user = self.scope['user']
        query_string = parse_qs(self.scope['query_string'].strip().decode())
        type = query_string.get('type', [None])[0]
        type_id = query_string.get('type_id', [None])[0]
        if type is None or type_id is None:
            raise ValueError("type or type_id 가 지정되지 않았습니다.")
        self.type = type
        self.game = self.get_game(type, type_id)
        self.group_name = 'type + type_id'

    async def get_game(self, type, type_id):
        if type == 'local':
            return Local(id=type_id)
        if type == 'tournament':
            return Tournament(id=type_id)
        if type == 'remote':
            return Remote(id=type_id)

    async def remote_game_start(self):
        if self.group_name not in self.remote_game:
            self.remote_game[self.group_name] = []
        self.remote_game[self.group_name].append(self.user)

        if len(self.remote_game[self.group_name]) >= 2:
            await self.get_player_user()
            player1 = get_object_or_404(User, intra_id=self.player1_name)
            player2 = get_object_or_404(User, intra_id=self.player2_name)
            await self.channel_layer.group_send(self.group_name, {
                'type': 'start',
                'player1_name': self.player1_name,
                'player1_image': player1.image,
                'player2_name': self.player2_name,
                'player2_image': player2.image
            })
            await self.game_start()


    async def get_player_user(self):
        self.player1_name = self.game.player1_name
        self.player2_name = self.game.player2_name

    async def start(self, event):
        try:
            await self.send_json(event)
        except KeyError as e:
            await self.send({'error': f'{str(e)} is required'})
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def game_start(self):
        self.pong = Pong(self)
        self.task = asyncio.create_task(self.pong.run())

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