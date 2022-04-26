from django.urls import URLPattern, path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    # TODO change this to <str:title> and get names of games from models
    path("flappy", views.flappy, name="flappy"),
]
