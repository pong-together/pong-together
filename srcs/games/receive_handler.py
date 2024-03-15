import asyncio

from games.constants import PLAYER1, PLAYER2
from games.pong import Pong


class ReceiveHandler:
    async def run(self, consumer, content):
        if content['type'] == 'start_game':
            await self.start_pong_game(consumer)
        if content['type'] == 'push_button':
            await self.receive_push_button(content['sender_player'], content['button'])

    # start_game
    @staticmethod
    async def start_pong_game(consumer):
        if not (consumer.type == 'remote'
                and consumer.user.intra_id == consumer.get_player_name(PLAYER2)):
            pong = Pong(consumer)
            consumer.common[consumer.group_name]['pong'] = pong
            consumer.common[consumer.group_name]['pong_task'] = asyncio.create_task(pong.run())

    # push_button
    async def receive_push_button(self, consumer, sender_player, button):
        if self.is_valid_push_button_event(consumer, sender_player):
            raise ValueError('sender_player is invalid')

        if consumer.common[consumer.group_name]['pong_task']:
            consumer.push_button(sender_player, button)
        else:
            await consumer.channel_layer.send(consumer.common[consumer.group_name]['channels'], {
                'type': 'send_push_button_event',
                'sender_player': sender_player,
                'button': button
            })

    @staticmethod
    def is_valid_push_button_event(consumer, sender_player):
        if consumer.type == 'remote' and \
                sender_player not in [consumer.get_player_name(PLAYER1), consumer.get_player_name(PLAYER2)]:
            raise ValueError('sender_player must be player name')
        if consumer.type != 'remote' and \
                sender_player not in ['player1', 'player2']:
            raise ValueError('sender_player must be \'player1\' or \'player2\'')
