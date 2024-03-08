import asyncio

from channels.db import database_sync_to_async


class DisconnectHandler:
    def __init__(self, consumer):
        self.consumer = consumer

    async def run(self):
        if self.consumer.type == 'remote':
            await self.disconnect_remote()
        await self.consumer.channel_layer.group_discard(self.consumer.group_name, self.consumer.channel_name)
        await self.cancel_pong_task()

    async def disconnect_remote(self):
        if self.is_abnormal():
            await self.disconnect_abnormal()
        else:
            await self.disconnect_normal()

        if self.consumer.user in self.consumer.remote_game[self.consumer.group_name]:
            self.consumer.remote_game[self.consumer.group_name].remove(self.consumer.user)

    def is_abnormal(self):
        return not self.consumer.pong.winner

    async def disconnect_normal(self):
        if self.consumer.user.intra_id == self.consumer.pong.winner:
            await self.update_win()
        else:
            await self.update_lose()

    async def disconnect_abnormal(self):
        await self.update_lose()
        self.consumer.pong.winner = self.get_other_player()
        await self.consumer.channel_layer.group_send(self.consumer.group_name, {
            'type': 'end',
            'is_normal': False,
            'winner': self.consumer.user.intra_id
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

    @database_sync_to_async
    def update_lose(self):
        self.consumer.user.lose_count += 1
        self.consumer.user.game_count += 1
        self.consumer.user.save()

    @database_sync_to_async
    def update_win(self):
        self.consumer.user.win_count += 1
        self.consumer.user.game_count += 1
        self.consumer.user.save()
