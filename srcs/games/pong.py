from channels.db import database_sync_to_async

from games.ball import Ball
from games.paddle import Paddle
from games.models import Game

PLAYER1 = 0
PLAYER2 = 1


class Pong:
    def __init__(self, id, consumer):
        self.id = id
        self.consumer = consumer
        self.width = 637
        self.height = 446
        self.scores = [0, 0]

        paddle1_x = 20
        paddle2_x = self.width - paddle1_x - Paddle.WIDTH
        paddle_y = (self.height - Paddle.HEIGHT) / 2
        self.player1 = Paddle(paddle1_x, paddle_y)
        self.player2 = Paddle(paddle2_x, paddle_y)

        ball_x = (self.width - Ball.SIZE) / 2
        ball_y = (self.height - Ball.SIZE) / 2
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
