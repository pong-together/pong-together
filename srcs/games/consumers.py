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
        self.type = None
        self.user = None
        self.group_name = None
        self.player1_name = None
        self.player2_name = None

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
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
            await self.cancel_pong_task()
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def disconnect_remote(self):
        if self.is_abnormal():  # 비정상 종료 처리
            await self.disconnect_abnormal()
        else:  # 정상 종료 처리
            await self.disconnect_normal()

        if self.user in self.remote_game[self.group_name]:
            self.remote_game[self.group_name].remove(self.user)

    async def is_abnormal(self):
        return self.pong.winner is None

    async def disconnect_normal(self):
        if self.user.intra_id == self.pong.winner:
            await self.update_win()
        else:
            await self.update_lose()

    async def disconnect_abnormal(self):
        await self.update_lose()
        self.pong.winner = self.get_other_player()
        await self.send_end()

    def get_other_player(self):
        other = self.player1_name
        if self.user.intra_id == other:
            other = self.player2_name
        return other

    async def send_end(self):
        await self.channel_layer.group_send(self.group_name, {
            'type': 'end',
            'is_normal': False,
            'winner': self.user.intra_id
        })

    async def cancel_pong_task(self):
        self.pong_task.cancel()
        try:
            await self.pong_task
        except asyncio.CancelledError:
            pass

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

    # event
    async def start(self, event):
        await self.send_event(event)

    async def get_game_info(self, event):
        await self.send_event(event)

    async def score(self, event):
        await self.send_event(event)

    async def end(self, event):
        await self.send_event(event)

    async def send_event(self, event):
        try:
            await self.send_json(event)
        except Exception as e:
            await self.send_json({'error': str(e)})
