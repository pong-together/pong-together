from channels.generic.websocket import AsyncJsonWebsocketConsumer

from games.connect_handler import ConnectHandler
from games.constants import PLAYER2
from games.disconnect_handler import DisconnectHandler
from games.receive_handler import ReceiveHandler
from pong_together.settings import logger


class GameConsumer(AsyncJsonWebsocketConsumer):
    # pong, pong_task, player1/2_name
    common = dict()

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.type = None
        self.user = None
        self.game = None
        self.group_name = None

    async def connect(self):
        try:
            connect_handler = ConnectHandler(self)
            logger.info(f'Websocket GAME Try to connect {self.user.intra_id} {self.group_name}')
            await connect_handler.run()
            logger.info(f'Websocket GAME CONNECT {self.user.intra_id} {self.group_name}')
        except Exception as e:
            await self.close()

    async def disconnect(self, code):
        try:
            logger.info(f'Websocket GAME Try to disconnect {self.user.intra_id} {self.group_name}')
            disconnect_handler = DisconnectHandler(self)
            await disconnect_handler.run()
            logger.info(f'Websocket GAME DISCONNECT {self.user.intra_id} {self.group_name}')
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        try:
            await super().receive(text_data, bytes_data, **kwargs)
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def receive_json(self, content, **kwargs):
        try:
            receive_handler = ReceiveHandler()
            await receive_handler.run(self, content)
        except KeyError as e:
            await self.send_json({'error': f'{str(e)} is required'})
        except ValueError as e:
            await self.send_json({'error': str(e)})

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

    # getter/setter
    def get_player_name(self, player):
        key = 'player1_name'
        if player == PLAYER2:
            key = 'player2_name'
        return self.common[self.group_name][key]

    def set_player_name(self, player, name):
        key = 'player1_name'
        if player == PLAYER2:
            key = 'player2_name'
        self.common[self.group_name][key] = name

    # utils
    def is_reconnection(self):
        number_of_connection = len(self.common[self.group_name]['channels'])
        return (self.type == 'remote' and number_of_connection > 2) \
            or (self.type != 'remote' and number_of_connection > 1)

    def is_reconnection_socket(self):
        channel_names = self.common[self.group_name]['channels']
        return self.channel_name not in channel_names[0:2]
