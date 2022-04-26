from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Game(models.Model):
    title = models.CharField(max_length=64, blank=False)
    description = models.TextField(blank=False)

    def __str__(self):
        return f"{self.title}"


class Score(models.Model):
    username = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="score")
    game = models.ForeignKey(
        Game, on_delete=models.CASCADE, related_name="score")
    points = models.DecimalField(
        max_digits=16, decimal_places=0, default=0)

    def __str__(self):
        return f"{self.points},  By: {self.username}, game: {self.game}"
