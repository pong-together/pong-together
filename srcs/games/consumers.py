import asyncio

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from games.connect_handler import ConnectHandler


class GameConsumer(AsyncJsonWebsocketConsumer):
    remote_game = {}

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.pong_task = None
        self.pong = None

    async def connect(self):
        try:
            connect_handler = ConnectHandler(self)
            self.pong_task = await connect_handler.run()
        except Exception as e:
            await self.close()
            print(e)

    async def disconnect(self, code):
        try:
            if self.type == 'remote':
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
    def update_lose(self):
        self.user.lose_count += 1
        self.user.game_count += 1
        self.user.save()

    @database_sync_to_async
    def update_win(self):
        self.user.win_count += 1
        self.user.game_count += 1
        self.user.save()

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

    async def start(self, event):
        try:
            await self.send_json(event)
        except Exception as e:
            await self.send_json({'error': str(e)})

    def push_button(self, sender_player, button):
        player = self.pong.player1
        if sender_player == 'player2':
            player = self.pong.player2
        player.move(button)

