import asyncio
import logging

from channels.generic.websocket import AsyncJsonWebsocketConsumer

from games.connect_handler import ConnectHandler
from games.disconnect_handler import DisconnectHandler
from games.pong import Pong

logger = logging.getLogger('main')


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
            logger.info('Websocket GAME Try to connect')
            connect_handler = ConnectHandler(self)
            await connect_handler.run()
            logger.info('Websocket GAME CONNECT')
        except Exception as e:
            await self.close()
            print(e)

    async def disconnect(self, code):
        try:
            logger.info('Websocket GAME Try to disconnect')
            disconnect_handler = DisconnectHandler(self)
            await disconnect_handler.run()
            logger.info('Websocket GAME DISCONNECT')
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        try:
            await super().receive(text_data, bytes_data, **kwargs)
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def receive_json(self, content, **kwargs):
        try:
            if content['type'] == 'start_game':
                await self.start_pong_game()
            if content['type'] == 'push_button':
                await self.receive_push_button(content['sender_player'], content['button'])
        except KeyError as e:
            await self.send_json({'error': f'{str(e)} is required'})
        except ValueError as e:
            await self.send_json({'error': str(e)})

    async def start_pong_game(self):
        if not (self.type == 'remote' and self.user.intra_id == self.player2_name):
            self.pong = Pong(self)
            self.pong_task = asyncio.create_task(self.pong.run())

    async def receive_push_button(self, sender_player, button):
        if not (sender_player == self.player1_name or sender_player == self.player2_name):
            raise ValueError('sender_player must be player name')

        if self.pong_task:
            self.push_button(sender_player, button)
        else:
            await self.channel_layer.send(self.remote_game[self.group_name][0], {
                'type': 'send_push_button_event',
                'sender_player': sender_player,
                'button': button
            })

    def push_button(self, sender_player, button):
        player = self.pong.player1
        if sender_player == self.player2_name:
            player = self.pong.player2
        player.move(button)

    async def send_push_button_event(self, event):
        try:
            self.push_button(event['sender_player'], event['button'])
        except KeyError as e:
            await self.send_json({'error': f'{str(e)} is required'})

    # event
    async def get_user_info(self, event):
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
