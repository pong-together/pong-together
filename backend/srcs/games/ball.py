import logging
import math
import random
from random import randint

from games import constants
from games.score import Score

logger = logging.getLogger('main')


class Ball:
    WIDTH = 20
    HEIGHT = 20

    DEFAULT_START_SPEED = 4
    DEFAULT_MINIMUM_SPEED = 6
    DEFAULT_MAXIMUM_SLOPE = 1.2
    EXTREME_START_SPEED = 6
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
        self.rely = -1

        self.start_speed = self.DEFAULT_START_SPEED
        self.minimum_speed = self.DEFAULT_MINIMUM_SPEED
        self.maximum_slope = self.DEFAULT_MAXIMUM_SLOPE
        if mode == 'extreme':
            self.start_speed = self.EXTREME_START_SPEED
            self.minimum_speed = self.EXTREME_MINIMUM_SPEED
            self.maximum_slope = self.EXTREME_MAXIMUM_SLOPE
        logger.info(f'mode: {mode}, start_speed: {self.start_speed}')
        self.velocity = [self.start_speed, 0]

    def set_position(self, x, y):
        self.x = x
        self.y = y

    def reset(self):
        x = (constants.GAME_WIDTH - self.WIDTH) / 2
        y = (constants.GAME_HEIGHT - self.HEIGHT) / 2 + randint(-100, 100)
        self.set_position(x, y)

    def bounce(self, paddle):
        self.velocity[0] *= -1
        self.velocity[1] = (self.y - paddle.y - (paddle.HEIGHT - self.HEIGHT) / 2) / 3 + random.randint(-10,10) / 10
        self.adjust_slope()
        self.adjust_speed()

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
        self.adjust_speed(start_turn=True)
        self.reset()

    def adjust_slope(self):
        slope = self.velocity[1] / self.velocity[0]
        if abs(slope) > self.maximum_slope:
            self.velocity[1] *= abs(self.velocity[0]) / abs(self.velocity[1])
            self.velocity[0] *= self.maximum_slope

    def adjust_speed(self, start_turn=False):
        size2 = self.velocity[0] ** 2 + self.velocity[1] ** 2
        if start_turn:
            self.change_velocity_by_speed(self.start_speed, size2)
            return
        if size2 < self.minimum_speed ** 2:
            self.change_velocity_by_speed(self.minimum_speed, size2)

    def change_velocity_by_speed(self, speed, size2):
        rate = speed / math.sqrt(size2)
        self.velocity = [self.velocity[0] * rate, self.velocity[1] * rate]
