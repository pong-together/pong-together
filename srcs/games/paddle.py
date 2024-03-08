from games import constants


class Paddle:
    WIDTH = 19
    HEIGHT = 63

    MOVEMENT = 10

    TOP_LIMIT = 0
    BOTTOM_LIMIT = constants.GAME_HEIGHT - HEIGHT

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def set_position(self, y):
        self.y = y

    def move_up(self, movement=MOVEMENT):
        self.y += movement
        if self.y < self.TOP_LIMIT:
            self.set_position(self.TOP_LIMIT)

    def move_down(self, movement=MOVEMENT):
        self.y -= movement
        if self.y > self.BOTTOM_LIMIT:
            self.set_position(self.BOTTOM_LIMIT)
