class Paddle:
    WIDTH = 19
    HEIGHT = 63

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def set_position(self, y):
        self.y = y
