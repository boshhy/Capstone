# Capstone
Gaming web application using Python and JavaScript.

## CS50's Project: Capstone
Designing and implementing a web application with Python and JavaScript.

## Distinctiveness and Complexity
This project Is a Gaming web applications using Python and JavaScript. This application consists of two games but more games could be added. Only logged in users are able to play the games, a user must log in to play games. On the main page users can look at all games available to play. Users can look up games by name using the search bar. There is heart icons so a user can like and unlike a game that will be added to the users liked game list. Once a user has clicked a game they will be brought to the game page. Here only one HTML page for all games is used, depending on what game was clicked the page will display the correct game. When a user scores one point or more an entry will be added to that specific users profile score history. Each time the player ends with one point or more an API call will be made to see if the player has made it to the top ten scores. If so the top ten scores will be updated without reloading the whole page. If a player has made it to the top ten their name will appear in a different color then other players. Scores are displayed on the left, game in the middle and instructions on the right. If viewing the page from a phone the page will respond by stacking the score, game and instructions on top of each other to fit the view window. If a user clicks their profile a table of the users scores will be displayed. The user can arrange these scores either by score, game name, or time of each entry, all of which can be ascending or descending order. All of this data is retrieved using python to get the information from the sqlite3 database. Pages are first displayed using Django and HTML templates, then Use JavaScript to listen for any changes that need to be made and updated accordingly. 


## What’s contained in each file you created.
- **index.html**: If a user is not logged in a message will display prompting the user to log in to play games. this page also includes all available games that can be played. A search form is used to search for games be name. Each game has an image, name and a brief description associated with each game. Users also have the ability to like games from this page.
- **game.html**: Used to display proper game to the user. This is a template and depending on the game requested Django will pass the proper setup for the game. JavaScript will listen for the game requested and load correct game. This also displays top ten scores for the game being played. The main element to listen for is a canvas a title of game. If player is not logged in they will not get either of those and just be displayed with an image and be prompted to log in. A brief game description and how to play will also display on this page.
- **liked.html**: Used to display only the liked games for the logged in user. Users also have the option to remove or add liked games to the list from this page.
- **profile.html**: Used to display a game history for the user. All games every played and scored one or more points will be displayed on this page. Table can be ordered by scores, game name, or time of entry.
- **capstone.js**: Used to set up game variables for selected game. Listens for key presses to start game. Once game is started JavaScript listens for proper key presses for proper gameplay to occur. Has functions that uses fetch calls to call API. Creates and removes elements from the DOM according to the results of the API call. This file is also responsible for listening for clicks on the like icons and handles event with an fetch call to API.
- **models.py**: Contains the models for Score, Game, and Profile. Score will contain only the top ten scores for each game. Game will contain the information about the game directions and instructions. Profile will contain all scores that the user has made.
- **views.py**: Contains functions that compose the information that is to be passed to html pages or API calls.
    - **index**: Used to get all game titles for main page.
    - **game**: Used to load selected game information and top points for user.
    - **score**: Used as API to check to see if player has made it to the top 10. Outcome will either be 'same' or 'updated' and outcome will be used by JavaScript to leave things as is or load new scores.
    - **update_score**: Used as API if a game score was updated, get current top 10 scores and return to change DOM.
    - **search**: Used to search game names and return results matching substring.
    - **like**: Used to add or remove player for game's like list.
    - **liked**: Get the player's liked games and return liked games.
    - **Profile**: Gets the game history table for user and orders it by requested scheme
## How to run your application
To run the application locally first download the repository and have python installed. Using an IDE like Visual Studio Code change directory into the folder and run `python manage.py runserver`. That's it users should be able to visit `127.0.0.1:8000` to view the page. User needs to register before playing any game.
