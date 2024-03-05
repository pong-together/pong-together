from channels.db import database_sync_to_async

from games.ball import Ball
from games.paddle import Paddle
from games.models import Game

PLAYER1 = 0
PLAYER2 = 1


class Pong:
    WIDTH = 637
    HEIGHT = 446

    def __init__(self, game_id, consumer):
        self.id = game_id
        self.consumer = consumer
        self.scores = [0, 0]
        self.turn = PLAYER1

        paddle1_x = 15
        paddle2_x = self.WIDTH - paddle1_x - Paddle.WIDTH
        paddle_y = (self.HEIGHT - Paddle.HEIGHT) / 2
        self.player1 = Paddle(paddle1_x, paddle_y)
        self.player2 = Paddle(paddle2_x, paddle_y)

        ball_x = (self.WIDTH - Ball.SIZE) / 2
        ball_y = (self.HEIGHT - Ball.SIZE) / 2
        self.ball = Ball(ball_x, ball_y)

    async def run(self):
        await self.save_game()
        try:
            while True:
                await self.play_round()
                self.turn = (self.turn + 1) % 2
        except ValueError as e:
            await self.consumer.send_json({'error': str(e)})

    async def play_round(self):
        status = -1

        while status == -1:
            game = await self.get_game()
            self.update_positions(game)

            self.ball.update(game, self.turn)
            status = self.ball.update_velocity(game, self.turn)

            game_info = {
                'type': 'get_game_info',
                'player1_y': self.player1.y,
                'player2_y': self.player2.y,
                'ball_x': self.ball.x,
                'ball_y': self.ball.y
            }
            # await self.consumer.send_json(game_info)
            await self.consumer.channel_layer.group_send(self.consumer.GROUP_NAME, game_info)
            await self.save_game()

    def update_positions(self, game):
        self.player1.set_position(game.player1_y)
        self.player2.set_position(game.player2_y)
        self.ball.set_position(game.ball_x, game.ball_y)

    @database_sync_to_async
    def get_game(self):
        try:
            return Game.objects.get(id=self.id)
        except Game.DoesNotExist as e:
            raise ValueError(str(e))

    @database_sync_to_async
    def save_game(self):
        try:
            game = Game.objects.get(id=self.id)
            game.player1_score = self.scores[PLAYER1]
            game.player2_score = self.scores[PLAYER2]
            game.player1_y = self.player1.y
            game.player2_y = self.player2.y
            game.ball_x = self.ball.x
            game.ball_y = self.ball.y
            game.save()
        except Game.DoesNotExist as e:
            raise ValueError(str(e))
