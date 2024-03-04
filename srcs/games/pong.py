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

        paddle1_x = 15
        paddle2_x = self.WIDTH - paddle1_x - Paddle.WIDTH
        paddle_y = (self.HEIGHT - Paddle.HEIGHT) / 2
        self.player1 = Paddle(paddle1_x, paddle_y)
        self.player2 = Paddle(paddle2_x, paddle_y)

        ball_x = (self.WIDTH - Ball.SIZE) / 2
        ball_y = (self.HEIGHT - Ball.SIZE) / 2
        self.ball = Ball(ball_x, ball_y)

    async def run(self):
        while True:
            await self.update_positions()

    async def update_positions(self):
        try:
            game = await self.get_game()
            self.player1.set_position(game.player1_y)
            self.player2.set_position(game.player2_y)
            self.ball.set_position(game.ball_x, game.ball_y)
        except ValueError as e:
            self.consumer.send_json({'error': str(e)})

    @database_sync_to_async
    def get_game(self):
        try:
            return Game.objects.get(id=self.id)
        except Game.DoesNotExist as e:
            raise ValueError(str(e))
