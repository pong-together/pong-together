class Ball:
    SIZE = 30

    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.velocity = []

    def set_position(self, x, y):
        self.x = x
        self.y = y
