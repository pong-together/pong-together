import asyncio

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from games.models import Game


class GameConsumer(AsyncJsonWebsocketConsumer):
    GROUP_NAME = 'game'

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.task = None

    async def connect(self):
        try:
            await self.init_connection()
            await self.channel_layer.group_add(self.GROUP_NAME, self.channel_name)
            await self.accept()

            game = await self.create_game('one', 'two')
            #pong = Pong(game.id, self)
            #self.task = asyncio.create_task(pong.run())
        except Exception:
            await self.close()

    async def disconnect(self, code):
        try:
            await self.channel_layer.group_discard(self.GROUP_NAME, self.channel_name)
            await self.cancel_task()
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        try:
            await super().receive(text_data, bytes_data, **kwargs)
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def receive_json(self, content, **kwargs):
        data = {
            'receive': True
        }
        await self.send_json(data)

    async def get_game_info(self, event):
        await self.send_json(event)


    @database_sync_to_async
    def create_game(self, player1_name, player2_name):
        return Game.objects.create(player1_name=player1_name, player2_name=player2_name)

    async def cancel_task(self):
        self.task.cancel()
        try:
            await self.task
        except asyncio.CancelledError:
            pass
