class Paddle:
    WIDTH = 18
    HEIGHT = 62

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def set_position(self, y):
        self.y = y
