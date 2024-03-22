import asyncio

from channels.db import database_sync_to_async

from games.constants import PLAYER1, PLAYER2
from games.score import Score
from users.models import User


class DisconnectHandler:
    def __init__(self, consumer):
        self.consumer = consumer
        self.pong = self.consumer.common[self.consumer.group_name]['pong']
        if self.pong:
            self.consumer.common[self.consumer.group_name]['disconnection_status'] = self.pong.end_status

    async def run(self):
        await self.handle_reconnection()
        if self.consumer.type == 'remote':
            await self.disconnect_remote()
        elif self.consumer.type == 'tournament':
            await self.disconnect_tournament()
        else:
            await self.consumer.channel_layer.group_discard(self.consumer.group_name, self.consumer.channel_name)
            await self.cancel_pong_task()

    async def handle_reconnection(self):
        if self.consumer.is_reconnection_socket():
            await self.consumer.channel_layer.group_discard(self.consumer.group_name, self.consumer.channel_name)
            raise ValueError()

    async def disconnect_tournament(self):
        status = self.consumer.common[self.consumer.group_name]['disconnection_status']
        if Score.end_normal(status):
            await self.tournament_update(self.consumer.game)
        await self.consumer.channel_layer.group_discard(self.consumer.group_name, self.consumer.channel_name)
        await self.cancel_pong_task()

    async def disconnect_remote(self):
        status = self.consumer.common[self.consumer.group_name]['disconnection_status']
        if Score.end_abnormal(status):
            await self.disconnect_abnormal()
        if Score.end_normal(status):
            await self.disconnect_normal()
        await self.consumer.channel_layer.group_discard(self.consumer.group_name, self.consumer.channel_name)

    async def disconnect_normal(self):
        await self.update_result()
        if self.consumer.user.intra_id == self.consumer.get_player_name(PLAYER2):
            await self.cancel_pong_task()

    async def update_result(self):
        winner = self.pong.get_winner()
        if winner == self.consumer.user.intra_id:
            await self.update_win()
        else:
            await self.update_lose()

    async def disconnect_abnormal(self):
        self.consumer.common[self.consumer.group_name]['disconnection_status'] = Score.RUNNER_UP
        loser = self.consumer.user.intra_id
        winner = self.get_other_player(loser)
        await self.update_win(winner)
        await self.update_lose(loser)
        await self.consumer.channel_layer.group_send(self.consumer.group_name, {
            'type': 'end',
            'is_normal': False,
            'winner': winner
        })
        await self.cancel_pong_task()

    def get_other_player(self, name):
        other = self.consumer.get_player_name(PLAYER1)
        if name == other:
            other = self.consumer.get_player_name(PLAYER2)
        return other

    async def cancel_pong_task(self):
        pong_task = self.consumer.common[self.consumer.group_name]['pong_task']
        pong_task.cancel()
        try:
            await pong_task
        except asyncio.CancelledError:
            pass

    @database_sync_to_async
    def update_lose(self, loser=None):
        if loser is None:
            loser = self.consumer.user.intra_id
        try:
            user = User.objects.get(intra_id=loser)
            user.lose_count += 1
            user.game_count += 1
            user.save()
        except User.DoesNotExist:
            pass

    @database_sync_to_async
    def update_win(self, winner=None):
        if winner is None:
            winner = self.consumer.user.intra_id
        try:
            user = User.objects.get(intra_id=winner)
            user.win_count += 1
            user.game_count += 1
            user.save()
        except User.DoesNotExist:
            pass

    @database_sync_to_async
    def tournament_update(self, game):
        winner = self.pong.get_winner()
        if game.game_turn == 1:
            game.first_winner = winner
        elif game.game_turn == 2:
            game.second_winner = winner
        elif game.game_turn == 3:
            game.final_winner = winner
        game.game_turn += 1
        game.save()
