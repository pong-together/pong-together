from channels.generic.websocket import AsyncJsonWebsocketConsumer


class GameConsumer(AsyncJsonWebsocketConsumer):
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