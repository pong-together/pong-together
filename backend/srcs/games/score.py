from enum import Enum


class Score(Enum):
    NONE = -1
    PLAYER1 = 0
    PLAYER2 = 1
    RUNNER_UP = 2

    @classmethod
    def end_normal(cls, end_status):
        return end_status in [cls.PLAYER1, cls.PLAYER2]

    @classmethod
    def end_abnormal(cls, end_status):
        return end_status == cls.NONE
