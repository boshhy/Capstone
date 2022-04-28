from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.urls import reverse
from .models import User, Game, Score
import json


def index(request):
    return render(request, "capstone/index.html")


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


def flappy(request):
    title = "Flappy Bird"
    return render(request, "capstone/game.html", {
        'title': title,
    })


def snake(request):
    title = "Snake"
    return render(request, "capstone/game.html", {
        'title': title,
    })


@csrf_exempt
def score(request):
    if request.method == "POST":
        data = json.loads(request.body)
        game = Game.objects.get(title=data['game'])
        points = data['points']
        user_id = User.objects.get(username=request.user)
        score = Score(username=user_id, game=game, points=points)
        score.save()
        print("-----------------")
        print(game)
        print(score)
        print(user_id)
        print("-----------------")
        return JsonResponse({"outcome": "Updated Score"})
    return JsonResponse({"outcome": "request 'post' not satisfied"})
