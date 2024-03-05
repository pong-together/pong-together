import math


class Ball:
    WIDTH = 20
    HEIGHT = 20
    MINIMUM_SPEED = 7

    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.velocity = [7, 0]

    def set_position(self, x, y):
        self.x = x
        self.y = y

    def update(self, game, turn):
        self.update_position()
        return self.update_velocity(game, turn)

    def update_position(self):
        self.x += self.velocity[0]
        self.y += self.velocity[1]

    def update_velocity(self, game, turn):
        top_limit = 0
        from games.pong import Pong
        bottom_limit = Pong.HEIGHT - self.HEIGHT
        if self.y <= top_limit:
            self.velocity[1] *= -1
        if self.y >= bottom_limit:
            self.velocity[1] *= -1

        escape_degree = 15
        left_limit = -(self.WIDTH + escape_degree)
        right_limit = Pong.WIDTH + escape_degree
        from games.pong import Score
        if self.x < left_limit:
            self.go_off_screen(game, (turn == 1) - (turn == 0))
            return Score.PLAYER1
        if self.x > right_limit:
            self.go_off_screen(game, (turn == 1) - (turn == 0))
            return Score.PLAYER2
        return Score.NONE

    def go_off_screen(self, game, sign):
        self.velocity = [game.player1_y % 7, game.player2_y % 7]
        self.velocity[0] *= sign
        if self.velocity[0] == 0:
            self.velocity[0] = 1
        self.adjust_slope()
        self.adjust_speed()

    def adjust_slope(self):
        slope = self.velocity[1] / self.velocity[0]
        if abs(slope) > 1:
            self.velocity[1] = 0

    def adjust_speed(self, speed=MINIMUM_SPEED):
        size = math.sqrt(self.velocity[0] ** 2 + self.velocity[1] ** 2)
        if size < speed:
            rate = speed / size
            self.velocity = [self.velocity[0] * rate, self.velocity[1] * rate]
