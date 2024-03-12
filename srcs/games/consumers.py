import logging

from channels.generic.websocket import AsyncJsonWebsocketConsumer

from games.connect_handler import ConnectHandler
from games.disconnect_handler import DisconnectHandler

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
            connect_handler = ConnectHandler(self)
            await connect_handler.run()
            logger.info('Game websocket connect')
        except Exception as e:
            await self.close()
            print(e)

    async def disconnect(self, code):
        try:
            disconnect_handler = DisconnectHandler(self)
            await disconnect_handler.run()
            logger.info('Game websocket disconnect')
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        try:
            await super().receive(text_data, bytes_data, **kwargs)
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def receive_json(self, content, **kwargs):
        try:
            if content['type'] == 'push_button':
                await self.receive_push_button(content)
        except KeyError as e:
            await self.send_json({'error': f'{str(e)} is required'})

    async def receive_push_button(self, content):
        if self.pong_task is None:
            await self.channel_layer.send(self.remote_game[self.group_name][1], {
                'type': 'send_push_button_event',
                'sender_player': content['sender_player'],
                'button': content['button']
            })
        else:
            self.push_button(content['sender_player'], content['button'])

    def push_button(self, sender_player, button):
        player = self.pong.player1
        if sender_player == 'player2':
            player = self.pong.player2
        player.move(button)

    async def send_push_button_event(self, event):
        try:
            self.push_button(event['sender_player'], event['button'])
        except KeyError as e:
            await self.send_json({'error': f'{str(e)} is required'})

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
