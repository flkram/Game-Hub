# models.py
from django.db import models

class Score(models.Model):
    GAME_CHOICES = [
        ('Tetris', 'Tetris'),
        ('Doodle Jump', 'Doodle Jump'),
        ('Flappy Bird', 'Flappy Bird'),
        ('2048', '2048'),
    ]

    player_name = models.CharField(max_length=100)
    game_name = models.CharField(max_length=50, choices=GAME_CHOICES)
    score = models.IntegerField()
    games_played = models.IntegerField(default=1)
    time_played = models.FloatField()  # in minutes
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player_name}: {self.game_name} - Score: {self.score}"
