import asyncio

from games.constants import PLAYER1, PLAYER2
from games.pong import Pong


class ReceiveHandler:
    async def run(self, consumer, content):
        if content['type'] == 'start_game':
            await self.start_pong_game(consumer)
        if content['type'] == 'push_button':
            sender_player = content['sender_player']
            button = content['button']
            self.validate_push_button_event(consumer, sender_player)
            self.push_button(consumer, sender_player, button)

    # start_game
    @staticmethod
    async def start_pong_game(consumer):
        if not (consumer.type == 'remote' and consumer.user.intra_id == consumer.get_player_name(PLAYER1)) \
                and consumer.common[consumer.group_name].get('pong') is None:
            pong = Pong(consumer)
            consumer.common[consumer.group_name]['pong'] = pong
            consumer.common[consumer.group_name]['pong_task'] = asyncio.create_task(pong.run())

    # push_button
    @staticmethod
    def push_button(consumer, sender_player, button):
        pong = consumer.common[consumer.group_name]['pong']
        player = pong.player1
        if (consumer.type == 'remote' and sender_player == consumer.get_player_name(PLAYER2)) or \
                (consumer.type != 'remote' and sender_player == 'player2'):
            player = pong.player2
        player.move(button)

    @staticmethod
    def validate_push_button_event(consumer, sender_player):
        if consumer.type == 'remote' and \
                sender_player not in [consumer.get_player_name(PLAYER1), consumer.get_player_name(PLAYER2)]:
            raise ValueError('sender_player must be player name')
        if consumer.type != 'remote' and \
                sender_player not in ['player1', 'player2']:
            raise ValueError('sender_player must be \'player1\' or \'player2\'')
