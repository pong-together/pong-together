import asyncio

from games import constants
from games.ball import Ball
from games.paddle import Paddle
from games.score import Score


class Pong:
    def __init__(self, consumer):
        self.consumer = consumer
        self.winner = None
        self.scores = [0, 0]
        self.turn = constants.PLAYER1

        paddle1_x = 10
        paddle2_x = constants.GAME_WIDTH - paddle1_x - Paddle.WIDTH
        paddle_y = (constants.GAME_HEIGHT - Paddle.HEIGHT) / 2
        self.player1 = Paddle(paddle1_x, paddle_y)
        self.player2 = Paddle(paddle2_x, paddle_y)

        ball_x = (constants.GAME_WIDTH - Ball.WIDTH) / 2
        ball_y = (constants.GAME_HEIGHT - Ball.HEIGHT) / 2 - 50
        self.ball = Ball(ball_x, ball_y, self.consumer.game.game_mode)

    async def run(self):
        try:
            while not self.finish():
                await self.play_round()
                await self.send_scores()
                self.turn = (self.turn + 1) % 2
            self.set_winner()
            await self.send_game_finish()
        except Exception as e:
            await self.consumer.send_json({'error': str(e)})

    async def play_round(self):
        status = Score.NONE
        while status == Score.NONE:
            self.ball.update_position()
            status = self.ball.update_velocity(self.turn)
            if self.player1.hit_ball(self.ball):
                self.ball.bounce(self.player1)
            if self.player2.hit_ball(self.ball):
                self.ball.bounce(self.player2)
            await self.send_game_info()
            await asyncio.sleep(constants.SLEEP_TIME)
        self.update_score(status)

    def update_score(self, status):
        index = constants.PLAYER1
        if status == Score.PLAYER2:
            index = constants.PLAYER2
        if status != Score.NONE:
            self.scores[index] += 1

    def finish(self):
        return self.scores[constants.PLAYER1] == constants.END_POINT \
            or self.scores[constants.PLAYER2] == constants.END_POINT

    def set_winner(self):
        self.winner = self.consumer.player1_name
        if self.scores[constants.PLAYER2] == constants.END_POINT:
            self.winner = self.consumer.player2_name

    async def send_game_info(self):
        game_info = {
            'type': 'get_game_info',
            'player1_y': self.player1.y,
            'player2_y': self.player2.y,
            'ball_x': self.ball.x,
            'ball_y': self.ball.y
        }
        await self.consumer.channel_layer.group_send(self.consumer.group_name, game_info)

    async def send_scores(self):
        data = {
            'type': 'score',
            'player1_score': self.scores[constants.PLAYER1],
            'player2_score': self.scores[constants.PLAYER2]
        }
        await self.consumer.channel_layer.group_send(self.consumer.group_name, data)

    async def send_game_finish(self):
        data = {
            'type': 'end',
            'winner': self.winner
        }
        await self.consumer.channel_layer.group_send(self.consumer.group_name, data)
