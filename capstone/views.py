from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.urls import reverse
from .models import User, Game, Score
import json


def index(request):
    all_games = Game.objects.all()
    return render(request, "capstone/index.html", {
        "all_games": all_games,
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "capstone/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "capstone/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "capstone/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "capstone/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "capstone/register.html")


@csrf_exempt
def game(request, game_title):

    the_game = Game.objects.get(title=game_title)
    top_points = Score.objects.filter(game=the_game).order_by('-points')

    return render(request, "capstone/game.html", {
        'the_game': the_game,
        'top_points': top_points,
    })


# def flappy(request):
#     title = "Flappy Bird"
#     game_id = Game.objects.get(title="flappy_bird")
#     top_points = Score.objects.filter(game=game_id).order_by('-points')
#     return render(request, "capstone/game.html", {
#         'title': title,
#         'top_points': top_points,
#     })


# def snake(request):
#     title = "Snake"
#     return render(request, "capstone/game.html", {
#         'title': title,
#     })


@csrf_exempt
def score(request):
    if request.method == "POST":

        print('--------------------------------------------not yet')
        data = json.loads(request.body)
        game = Game.objects.get(title=data['game'])
        points = data['points']
        user_id = User.objects.get(username=request.user)
        score = Score(username=user_id, game=game, points=points)
        print('----------------made it')

        top_scores_for_game = Score.objects.filter(
            game=game).order_by("-points")
        if top_scores_for_game.count() < 10 and points != 0:
            score.save()
            return JsonResponse({"outcome": "updated"})
        elif points > top_scores_for_game[9].points:
            print(top_scores_for_game.count())
            score.save()
            while top_scores_for_game.count() > 10:
                top_scores_for_game[10].delete()
            return JsonResponse({"outcome": "updated"})
        return JsonResponse({"outcome": "same"})
    return JsonResponse({"outcome": "request 'post' not satisfied"})


def update_score(request, game):
    game_id = Game.objects.get(title=game)
    top_points = Score.objects.filter(game=game_id).order_by('-points')
    return JsonResponse([score.serialize() for score in top_points], safe=False)
