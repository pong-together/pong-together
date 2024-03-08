import math
from random import randint

from games import constants
from games.score import Score


class Ball:
    WIDTH = 20
    HEIGHT = 20

    START_SPEED = 5
    MAXIMUM_SLOPE = 1.1
    ESCAPE_DEGREE = 20

    TOP_LIMIT = 0
    BOTTOM_LIMIT = constants.GAME_HEIGHT - HEIGHT
    LEFT_LIMIT = -(WIDTH + ESCAPE_DEGREE)
    RIGHT_LIMIT = constants.GAME_WIDTH + ESCAPE_DEGREE

    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.velocity = [self.START_SPEED, 0]

    def set_position(self, x, y):
        self.x = x
        self.y = y

    def reset(self):
        x = (constants.GAME_WIDTH - self.WIDTH) / 2
        y = (constants.GAME_HEIGHT - self.HEIGHT) / 2 + randint(-100, 100)
        self.set_position(x, y)

    def update_position(self):
        self.x += self.velocity[0]
        self.y += self.velocity[1]

    def update_velocity(self, turn):
        self.update_vertical_velocity()
        return self.update_horizontal_velocity(turn)

    def update_vertical_velocity(self):
        if self.y <= self.TOP_LIMIT:
            self.velocity[1] *= -1
        if self.y >= self.BOTTOM_LIMIT:
            self.velocity[1] *= -1

    def update_horizontal_velocity(self, turn):
        if self.x < self.LEFT_LIMIT:
            self.go_off_screen((turn == 1) - (turn == 0))
            return Score.PLAYER2
        if self.x > self.RIGHT_LIMIT:
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
            self.velocity[1] *= abs(self.velocity[0]) / abs(self.velocity[1])
            self.velocity[0] *= self.MAXIMUM_SLOPE

    def adjust_speed(self, speed=START_SPEED):
        size2 = self.velocity[0] ** 2 + self.velocity[1] ** 2
        if speed == self.START_SPEED or size2 < speed ** 2:
            rate = speed / math.sqrt(size2)
            self.velocity = [self.velocity[0] * rate, self.velocity[1] * rate]
