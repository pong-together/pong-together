import asyncio
import json
from datetime import datetime

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from pong_together.settings import logger


class ChatConsumer(AsyncJsonWebsocketConsumer):
    chat_users = dict()
    GROUP_NAME = 'pong-together-chats'

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.ping_task = None
        self.user = None
        self.channel_name = None

    async def connect(self):
        try:
            await self.init_connection()
            logger.info(f'Websocket CHAT Try to connect {self.user.intra_id}')
            await self.channel_layer.group_add(self.GROUP_NAME, self.channel_name)
            await self.accept()
            await self.handle_multiple_connection()
            self.ping_task = asyncio.create_task(self.send_ping())
            await self.update_user_chat_connection(True)
            logger.info(f'Websocket CHAT CONNECT {self.user.intra_id}')
        except Exception:
            await self.close()

    async def disconnect(self, code):
        try:
            logger.info(f'Websocket CHAT Try to disconnect {self.user.intra_id}')
            await self.delete_chat_users()
            await self.channel_layer.group_discard(self.GROUP_NAME, self.channel_name)
            await self.cancel_ping_task()
            await self.update_user_chat_connection(False)
            logger.info(f'Websocket CHAT DISCONNECT {self.user.intra_id}')
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        try:
            await super().receive(text_data, bytes_data, **kwargs)
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def receive_json(self, content, **kwargs):
        if await self.is_pong(content.get('type')):
            return
        try:
            data = {
                'type': 'chat_message',
                'intra_id': self.user.intra_id,
                'message': content['message'],
                'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            await self.channel_layer.group_send(self.GROUP_NAME, data)
        except KeyError as e:
            await self.send({'error': f'{str(e)} is required'})
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def chat_message(self, event):
        try:
            message = {
                'type': 'chat_message',
                'intra_id': event['intra_id'],
                'message': event['message'],
                'timestamp': event['timestamp']
            }
            await self.send_json(message)
        except KeyError as e:
            await self.send({'error': f'{str(e)} is required'})
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def send_ping(self):
        while True:
            await asyncio.sleep(60)
            await self.send(text_data=json.dumps({
                'type': 'ping',
                'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }))

    async def init_connection(self):
        self.user = self.scope['user']

    async def handle_multiple_connection(self):
        if self.user.intra_id in self.chat_users:
            await self.send_json({
                'type': 'send_multiple_connection'
            })
            return
        self.chat_users[self.user.intra_id] = self.channel_name

    async def delete_chat_users(self):
        intra_id = self.user.intra_id
        if self.chat_users[intra_id] is self.channel_name:
            del self.chat_users[intra_id]

    async def cancel_ping_task(self):
        self.ping_task.cancel()
        try:
            await self.ping_task
        except asyncio.CancelledError:
            pass

    @staticmethod
    async def is_pong(type):
        return type == 'pong'

    @database_sync_to_async
    def update_user_chat_connection(self, is_connected):
        self.user.chat_connection = is_connected
        self.user.save()
