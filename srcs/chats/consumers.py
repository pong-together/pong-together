import asyncio
import json
from datetime import datetime

from channels.generic.websocket import AsyncJsonWebsocketConsumer


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
            self.user = self.scope['user']

            intra_id = self.user.intra_id
            if intra_id in self.chat_users:
                raise ValueError()
            self.chat_users[intra_id] = self.channel_name

            await self.channel_layer.group_add(self.GROUP_NAME, self.channel_name)
            await self.accept()

            self.ping_task = asyncio.create_task(self.send_ping())

        except Exception:
            await self. close()

    async def disconnect(self, code):
        try:
            intra_id = self.user.intra_id
            if self.chat_users[intra_id] is self.channel_name:
                del self.chat_users[intra_id]

            await self.channel_layer.group_discard(self.GROUP_NAME, self.channel_name)

            self.ping_task.cancel()
            try:
                await self.ping_task
            except asyncio.CancelledError:
                pass

        except Exception as e:
            await self.send_json({'error': str(e)})

    async def send_ping(self):
        while True:
            await asyncio.sleep(60)
            await self.send(text_data=json.dumps({
                'type': 'ping',
                'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }))

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        if text_data is None or bytes_data is None:
            await self.send_json({'error': 'No message'})
        try:
            await self.receive_json(await self.decode_json(text_data), **kwargs)
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def receive_json(self, content, **kwargs):
        message_type = content.get('type')
        if message_type == 'pong':
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
                'intra_id': event['intra_id'],
                'message': event['message'],
                'timestamp': event['timestamp']
            }
            await self.send_json(message)
        except KeyError as e:
            await self.send({'error': f'{str(e)} is required'})
        except Exception as e:
            await self.send_json({'error': str(e)})
