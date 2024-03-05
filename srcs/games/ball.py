import math


class Ball:
    SIZE = 30
    MINIMUM_VELOCITY = 7

    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.velocity = [5, 0]

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
        bottom_limit = Pong.HEIGHT - self.SIZE
        if self.y <= top_limit:
            self.velocity[1] *= -1
        if self.y >= bottom_limit:
            self.velocity[1] *= -1

        escape_degree = 15
        left_limit = -(self.SIZE + escape_degree)
        right_limit = Pong.WIDTH + escape_degree
        if self.x < left_limit:
            self.go_off_screen(game, (turn == 1) - (turn == 0))
            return 0
        if self.x > right_limit:
            self.go_off_screen(game, (turn == 1) - (turn == 0))
            return 1
        return -1

    def go_off_screen(self, game, sign):
        self.velocity = [game.player1_y % 7, game.player2_y % 7]
        self.velocity[0] *= sign
        self.normalize_velocity()

    def normalize_velocity(self):
        size = math.sqrt(self.velocity[0] ** 2 + self.velocity[1] ** 2)
        if size > self.MINIMUM_VELOCITY:
            rate = self.MINIMUM_VELOCITY / size
            self.velocity = [self.velocity[0] * rate, self.velocity[1] * rate]
