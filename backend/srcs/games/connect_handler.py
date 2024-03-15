from urllib.parse import parse_qs

from channels.db import database_sync_to_async

from local.models import Local
from remote.models import Remote
from tournaments.models import Tournament
from users.models import User


class ConnectHandler:
    def __init__(self, consumer):
        self.consumer = consumer
        self.consumer.user = self.consumer.scope['user']
        self.consumer.type, self.type_id = self.parse_query_string()

    def parse_query_string(self):
        query_string = parse_qs(self.consumer.scope['query_string'].strip().decode())
        type = query_string.get('type', [None])[0]
        type_id = query_string.get('type_id', [None])[0]
        if type is None or type_id is None:
            raise ValueError("type or type_id가 지정되지 않았습니다.")
        return type, type_id

    async def run(self):
        self.consumer.game = await self.set_game()
        self.consumer.group_name = f'{self.consumer.type}_{self.type_id}'

        await self.consumer.channel_layer.group_add(self.consumer.group_name, self.consumer.channel_name)
        await self.consumer.accept()

        if self.consumer.type == 'remote':
            await self.start_remote_game()
        else:
            self.set_players_name()
            await self.consumer.channel_layer.group_send(self.consumer.group_name, {
                'type': 'get_user_info',
                'player1_name': self.consumer.player1_name,
                'player2_name': self.consumer.player2_name,
            })

    async def start_remote_game(self):
        if self.consumer.group_name not in self.consumer.remote_game:
            self.consumer.remote_game[self.consumer.group_name] = []
        self.consumer.remote_game[self.consumer.group_name].append(self.consumer.channel_name)

        if len(self.consumer.remote_game[self.consumer.group_name]) >= 2:
            self.set_players_name()
            images = await self.get_players_image()
            await self.consumer.channel_layer.group_send(self.consumer.group_name, {
                'type': 'get_user_info',
                'player1_name': self.consumer.player1_name,
                'player1_image': images[0],
                'player2_name': self.consumer.player2_name,
                'player2_image': images[1]
            })

    def set_players_name(self):
        game = self.consumer.game
        if self.consumer.type == 'tournament':
            self.set_players_tournament(game)
        elif self.consumer.type == 'remote':
            self.set_remote_game_players(game)
        else:
            self.consumer.player1_name = game.player1_name
            self.consumer.player2_name = game.player2_name

    def set_players_tournament(self, game):
        if game.game_turn == 1:
            self.consumer.player1_name = game.player1_name
            self.consumer.player2_name = game.player2_name
        elif game.game_turn == 2:
            self.consumer.player1_name = game.player3_name
            self.consumer.player2_name = game.player4_name
        elif game.game_turn == 3:
            self.consumer.player1_name = game.first_winner
            self.consumer.player2_name = game.second_winner

    def set_remote_game_players(self, game):
        self.consumer.player2_name = self.consumer.user.intra_id
        self.consumer.player1_name = game.player1_name
        if self.consumer.player1_name == self.consumer.player2_name:
            self.consumer.player1_name = game.player2_name

    @database_sync_to_async
    def set_game(self):
        if self.consumer.type == 'local':
            return Local.objects.get(id=self.type_id)
        if self.consumer.type == 'tournament':
            return Tournament.objects.get(id=self.type_id)
        if self.consumer.type == 'remote':
            return Remote.objects.get(id=self.type_id)

    @database_sync_to_async
    def get_players_image(self):
        player1 = User.objects.get(intra_id=self.consumer.player1_name)
        player2 = User.objects.get(intra_id=self.consumer.player2_name)
        return [player1.image, player2.image]
