from django.urls import URLPattern, path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    # TODO change this to <str:title> and get names of games from models
    path("game/<str:game_title>", views.game, name='game'),
    # working on above
    #path("flappy", views.flappy, name="flappy"),
    #path("snake", views.snake, name='snake'),
    path("score", views.score, name='score'),
    path("update_score/<str:game>", views.update_score, name="update"),
    path("search", views.search, name='search'),
]
