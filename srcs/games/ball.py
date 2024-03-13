import math
from random import randint

from games import constants
from games.score import Score


class Ball:
    WIDTH = 20
    HEIGHT = 20

    START_SPEED = 4
    MAXIMUM_SPEED = 10
    DEFAULT_MINIMUM_SPEED = 6
    DEFAULT_MAXIMUM_SLOPE = 1.2
    EXTREME_MINIMUM_SPEED = 8
    EXTREME_MAXIMUM_SLOPE = 1.5

    ESCAPE_DEGREE = 20

    TOP_LIMIT = 0
    BOTTOM_LIMIT = constants.GAME_HEIGHT - HEIGHT
    LEFT_LIMIT = -(WIDTH + ESCAPE_DEGREE)
    RIGHT_LIMIT = constants.GAME_WIDTH + ESCAPE_DEGREE

    def __init__(self, x, y, mode):
        self.x = x
        self.y = y
        self.velocity = [self.START_SPEED, 0]
        self.minimum_speed = self.DEFAULT_MINIMUM_SPEED
        self.maximum_slope = self.DEFAULT_MAXIMUM_SLOPE
        if mode == 'extreme':
            self.minimum_speed = self.EXTREME_MINIMUM_SPEED
            self.maximum_slope = self.EXTREME_MAXIMUM_SLOPE

    def set_position(self, x, y):
        self.x = x
        self.y = y

    def reset(self):
        x = (constants.GAME_WIDTH - self.WIDTH) / 2
        y = (constants.GAME_HEIGHT - self.HEIGHT) / 2 + randint(-100, 100)
        self.set_position(x, y)

    def bounce(self, paddle):
        self.velocity[0] *= -1
        self.velocity[1] = int((self.y - paddle.y - (paddle.HEIGHT - self.HEIGHT) / 2) / 3)
        self.adjust_slope()
        self.adjust_speed(self.minimum_speed)

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
        if abs(slope) > self.maximum_slope:
            self.velocity[1] *= abs(self.velocity[0]) / abs(self.velocity[1])
            self.velocity[0] *= self.maximum_slope

    def adjust_speed(self, speed=START_SPEED):
        size2 = self.velocity[0] ** 2 + self.velocity[1] ** 2
        if speed == self.START_SPEED or size2 < speed ** 2:
            rate = speed / math.sqrt(size2)
            self.velocity = [self.velocity[0] * rate, self.velocity[1] * rate]
        # if size2 > self.MAXIMUM_SPEED ** 2:
        #     rate = math.sqrt(size2) / self.MAXIMUM_SPEED
        #     self.velocity = [self.velocity[0] * rate, self.velocity[1] * rate]
