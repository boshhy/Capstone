from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.urls import reverse
from .models import User, Game, Score, Profile
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


# get the game and its corresponding top scores
# this is when the user first views the page
@csrf_exempt
def game(request, game_title):
    the_game = Game.objects.get(title=game_title)
    top_points = Score.objects.filter(game=the_game).order_by('-points')
    return render(request, "capstone/game.html", {
        'the_game': the_game,
        'top_points': top_points,
    })


# Used as API to check to see if player has made it to the top 10
@csrf_exempt
def score(request):
    if request.method == "POST":
        data = json.loads(request.body)
        game = Game.objects.get(title=data['game'])
        points = data['points']
        user_id = User.objects.get(username=request.user)
        score = Score(username=user_id, game=game, points=points)
        top_scores_for_game = Score.objects.filter(
            game=game).order_by("-points")

        # Save point history for player only if they get 1 point or more
        if points > 0:
            profile = Profile(user=user_id, game=game, points=points)
            profile.save()

        # If player did not recieve any points return 'same' for
        # no change to be updated
        if points == 0:
            return JsonResponse({"outcome": "same"})

        # If game doesnt have a top 10 yet add the score to the top scores
        # and return with an 'update' to change the DOM
        if top_scores_for_game.count() < 10:
            score.save()
            return JsonResponse({"outcome": "updated"})
        # If top 10 already exists check to see if the points
        # are higher than the last entry of top 10
        # if so save the score and delete the lowest game score
        elif points > top_scores_for_game[9].points:
            score.save()
            while top_scores_for_game.count() > 10:
                top_scores_for_game[10].delete()
            return JsonResponse({"outcome": "updated"})
        # If player points did not make it to top 10 return 'same'
        return JsonResponse({"outcome": "same"})
    return JsonResponse({"outcome": "request 'post' not satisfied"})


# Used as API if a game score was updated, get current top 10
# scores and return to change the DOM
def update_score(request, game):
    game_id = Game.objects.get(title=game)
    top_points = Score.objects.filter(game=game_id).order_by('-points')
    return JsonResponse([score.serialize() for score in top_points], safe=False)


# Used to search game  names and return results matching substring
def search(request):
    if request.method == "GET":
        # Gets the search and games and assigns them to variables
        the_search = request.GET.get("q").lower()
        all_games = Game.objects.all()
        the_list = []

        # Look at all the games and see if any game.name matches with the_search
        for game in all_games:
            if the_search == game.name.lower():
                return HttpResponseRedirect(reverse("game", args=[game.title]))

        # Look through the game names for matching substring
        for game in all_games:
            if the_search in game.name.lower():
                # If substring matches entry add entry to the_list
                the_list.append(game)

        # If nothing was found return proper response
        if not the_list:
            return render(request, "capstone/index.html", {
                "nothing_found": True
            })

        # Display the games that match the substring
        return render(request, "capstone/index.html", {
            "nothing_found": False,
            "all_games": the_list
        })
    else:
        return HttpResponse("An error occured")


# Used to add or remove player for game's likes
@csrf_exempt
def like(request):
    data = json.loads(request.body)
    game = Game.objects.get(id=data['id'])
    user_id = User.objects.get(username=request.user)

    # Check to see if user is already liking this game
    if user_id in game.likes.all():
        # If user already liking, then remove from likes
        game.likes.remove(user_id)
        game.save()
        return JsonResponse({"outcome": "Removed"})

    # If user is not in the game's likes then
    # add user to likes
    game.likes.add(user_id)
    game.save()
    return JsonResponse({"outcome": "Added"})


# Get the player's liked games and return liked games
def liked(request):
    if request.user.is_authenticated:
        user_id = User.objects.get(username=request.user)
        all_games = Game.objects.all()
        liked_games = []

        # For every game check to see if user is liking the game
        # if they are add the game to the liked_games list
        for game in all_games:
            if user_id in game.likes.all():
                liked_games.append(game)

        # If nothing was found return proper response
        if not liked_games:
            return render(request, "capstone/liked.html", {
                "nothing_found": True
            })

        # Return the list of liked games for the user
        return render(request, "capstone/liked.html", {
            "nothing_found": False,
            "liked_games": liked_games
        })
    # If user is not authenticated set nothing_found to True
    else:
        return render(request, "capstone/liked.html", {
            "nothing_found": True
        })


# Get the game history table and order it by requested scheme
def profile(request, scheme):
    # Set scheme to proper model name
    if scheme == 'points_descending':
        scheme = '-points'
    if scheme == 'game_descending':
        scheme = '-game'
    if scheme == 'time_descending':
        scheme = '-time'

    # Get the list of all game history and order them by the scheme
    all_user_scores = Profile.objects.filter(
        user=request.user.id).order_by(f'{scheme}')

    # Set default for scheme look up names
    points = 'points'
    game_title = "game"
    time = 'time'
    username = 'user'

    # change scheme to opposite of what was requested to send
    # back so user can order from ascending or descending
    if scheme == 'points':
        points = 'points_descending'
    elif scheme == '-points':
        points = 'points'

    if scheme == 'game':
        game_title = 'game_descending'
    elif scheme == '-game':
        game_title = 'game'

    if scheme == 'time':
        time = 'time_descending'
    elif scheme == '-time':
        time = 'time'

    # return the proper scheme names with updated name
    return render(request, "capstone/profile.html", {
        "all_user_scores": all_user_scores,
        "points": points,
        "game_title": game_title,
        'username': username,
        "time": time,
    })
