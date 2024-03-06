import math
from random import randint


class Ball:
    WIDTH = 20
    HEIGHT = 20
    RESET_SPEED = 5
    MAXIMUM_SLOPE = 1

    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.velocity = [5, 0]

    def set_position(self, x, y):
        self.x = x
        self.y = y

    def reset(self):
        from games.pong import Pong

        x = (Pong.WIDTH - self.WIDTH) / 2
        y = (Pong.HEIGHT - self.HEIGHT) / 2 + randint(-100, 100)
        self.set_position(x, y)

    def update_position(self):
        self.x += self.velocity[0]
        self.y += self.velocity[1]

    def update_velocity(self, turn):
        self.update_vertical_velocity()
        return self.update_horizontal_velocity(turn)

    def update_vertical_velocity(self):
        from games.pong import Pong

        top_limit = 0
        bottom_limit = Pong.HEIGHT - self.HEIGHT
        if self.y <= top_limit:
            self.velocity[1] *= -1
        if self.y >= bottom_limit:
            self.velocity[1] *= -1

    def update_horizontal_velocity(self, turn):
        from games.pong import Score, Pong

        escape_degree = 15
        left_limit = -(self.WIDTH + escape_degree)
        right_limit = Pong.WIDTH + escape_degree
        if self.x < left_limit:
            self.go_off_screen((turn == 1) - (turn == 0))
            return Score.PLAYER2
        if self.x > right_limit:
            self.go_off_screen((turn == 1) - (turn == 0))
            return Score.PLAYER1
        return Score.NONE

    def go_off_screen(self, vertical_direct):
        self.velocity = [randint(3, 5), randint(0, 4)]
        self.velocity[0] *= vertical_direct
        self.adjust_slope()
        self.adjust_speed()
        self.reset()

    def adjust_slope(self):
        slope = self.velocity[1] / self.velocity[0]
        if abs(slope) > self.MAXIMUM_SLOPE:
            self.velocity[1] = 0

    def adjust_speed(self, speed=RESET_SPEED):
        size = math.sqrt(self.velocity[0] ** 2 + self.velocity[1] ** 2)
        if speed == self.RESET_SPEED or size < speed:
            rate = speed / size
            self.velocity = [self.velocity[0] * rate, self.velocity[1] * rate]
