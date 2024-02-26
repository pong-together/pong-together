from datetime import datetime

from channels.generic.websocket import AsyncJsonWebsocketConsumer


class ChatConsumer(AsyncJsonWebsocketConsumer):
    GROUP_NAME = 'pong-together-chats'

    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.user = None

    async def connect(self):
        try:
            self.user = self.scope['user']

            await self.channel_layer.group_add(self.GROUP_NAME, self.channel_name)
            await self.accept()
        except Exception:
            await self.close()

    async def disconnect(self, code):
        try:
            await self.channel_layer.group_discard(self.GROUP_NAME, self.channel_name)
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def receive(self, text_data=None, bytes_data=None, **kwargs):
        if text_data is None:
            await self.send_json({'error': 'No message'})
        try:
            await self.receive_json(await self.decode_json(text_data), **kwargs)
        except Exception as e:
            await self.send_json({'error': str(e)})

    async def receive_json(self, content, **kwargs):
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
