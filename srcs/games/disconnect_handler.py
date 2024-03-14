import asyncio

from channels.db import database_sync_to_async

from users.models import User


class DisconnectHandler:
    def __init__(self, consumer):
        self.consumer = consumer

    async def run(self):
        if self.consumer.type == 'remote':
            await self.disconnect_remote()
        elif self.consumer.type == 'tournament':
            await self.disconnect_tournament()
        else:
            await self.consumer.channel_layer.group_discard(self.consumer.group_name, self.consumer.channel_name)
            await self.cancel_pong_task()

    @database_sync_to_async
    async def disconnect_tournament(self):
        game = self.consumer.game

        game.game_turn += 1
        if game.game_turn == 1:
            game.first_winner = self.consumer.pong.winner
        elif game.game_turn == 2:
            game.second_winner = self.consumer.pong.winner
        elif game.game_turn == 3:
            game.final_winner = self.consumer.pong.winner
        game.save()
        await self.consumer.channel_layer.group_discard(self.consumer.group_name, self.consumer.channel_name)
        await self.cancel_pong_task()

    async def disconnect_remote(self):
        if self.is_abnormal():
            await self.disconnect_abnormal()
            await self.cancel_pong_task()

        if self.consumer.pong_task is not None and not self.is_abnormal():
            await self.disconnect_normal()
            await self.cancel_pong_task()

        await self.consumer.channel_layer.group_discard(self.consumer.group_name, self.consumer.channel_name)

        if self.consumer.user in self.consumer.remote_game[self.consumer.group_name]:
            self.consumer.remote_game[self.consumer.group_name].remove(self.consumer.user)

    def is_abnormal(self):
        return not self.consumer.pong.winner

    async def disconnect_normal(self):
        winner = self.consumer.pong.winner
        loser = self.consumer.player1_name
        if loser == winner:
            loser = self.consumer.player2_name
        await self.update_game_result(loser, winner)

    async def disconnect_abnormal(self):
        loser = self.consumer.user.intra_id,
        winner = self.get_other_player()
        await self.update_game_result(loser, winner)
        await self.consumer.channel_layer.group_send(self.consumer.group_name, {
            'type': 'end',
            'is_normal': False,
            'winner': winner
        })

    def get_other_player(self):
        other = self.consumer.player1_name
        if self.consumer.user.intra_id == other:
            other = self.consumer.player2_name
        return other

    async def cancel_pong_task(self):
        self.consumer.pong_task.cancel()
        try:
            await self.consumer.pong_task
        except asyncio.CancelledError:
            pass

    async def update_game_result(self, lose_player, win_player):
        await self.update_lose(lose_player)
        await self.update_win(win_player)

    @database_sync_to_async
    def update_lose(self, intra_id):
        try:
            user = User.objects.get(intra_id=intra_id)
            user.lose_count += 1
            user.game_count += 1
            user.save()
        except User.DoesNotExist as e:
            pass

    @database_sync_to_async
    def update_win(self, intra_id):
        try:
            user = User.objects.get(intra_id=intra_id)
            user.win_count += 1
            user.game_count += 1
            user.save()
        except User.DoesNotExist as e:
            pass
