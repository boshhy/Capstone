from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Game(models.Model):
    title = models.CharField(max_length=64, blank=False)
    name = models.CharField(max_length=64, blank=False)
    instructions = models.TextField(max_length=500, blank=False)
    description = models.TextField(max_length=500, blank=False)
    imageURL = models.CharField(max_length=1024, blank=True)
    likes = models.ManyToManyField("User", blank=True)

    def __str__(self):
        return f"{self.title}"


class Score(models.Model):
    username = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="score")
    game = models.ForeignKey(
        Game, on_delete=models.CASCADE, related_name="score")
    points = models.DecimalField(
        max_digits=16, decimal_places=0, default=0)

    def serialize(self):
        return {
            "points": self.points,
            "user": self.username.username,
            "id": self.username.id,
        }

    def __str__(self):
        return f"{self.points} - {self.username}"


class Profile(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='profile')
    game = models.ForeignKey(
        Game, on_delete=models.CASCADE, related_name="profile")
    points = models.DecimalField(
        max_digits=16, decimal_places=0, default=0)
    time = models.DateTimeField(auto_now_add=True, blank=False)

    def __str__(self):
        return f"{self.points} - {self.user}"
