class Paddle:
    WIDTH = 19
    HEIGHT = 63
    MOVEMENT = 10

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def set_position(self, y):
        self.y = y

    def move_up(self, movement=MOVEMENT):
        self.y += movement
        if self.y < 0:
            self.set_position(0)

    def move_down(self, movement=MOVEMENT):
        from games.pong import Pong

        self.y -= movement
        if self.y > Pong.HEIGHT - self.HEIGHT:
            self.set_position(Pong.HEIGHT - self.HEIGHT)
