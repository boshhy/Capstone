from django.urls import URLPattern, path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("game/<str:game_title>", views.game, name='game'),
    path("score", views.score, name='score'),
    path("update_score/<str:game>", views.update_score, name="update"),
    path("search", views.search, name='search'),
    path('like', views.like, name="like"),
    path("liked", views.liked, name="liked"),
    path("profile/<str:scheme>", views.profile, name="profile"),
]
