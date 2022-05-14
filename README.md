# Capstone
Gaming web application using Python and JavaScript.

## CS50's Project: Capstone
Designing and implementing a web application with Python and JavaScript.

## Distinctiveness and Complexity
This project Is a Gaming web applications using Python and JavaScript. This application consists of two games but more games could be added. Only logged in users are able to play the games, a user must log in to play games. On the main page users can look at all games available to play. Users can look up games by name using the search bar. There is heart icons so a user can like and unlike a game that will be added to the users liked game list. Once a user has clicked a game they will be brought to the game page. Here only one HTML page for all games is used, depending on what game was clicked the page will display the correct game. When a user scores one point or more an entry will be added to that specific users profile score history. Each time the player ends with one point or more an API call will be made to see if the player has made it to the top ten scores. If so the top ten scores will be updated without reloading the whole page. If a player has made it to the top ten their name will appear in a different color then other players. Scores are displayed on the left, game in the middle and instructions on the right. If viewing the page from a phone the page will respond by stacking the score, game and instructions on top of each other to fit the view window. If a user clicks their profile a table of the users scores will be displayed. The user can arrange these scores either by score, game name, or time of each entry, all of which can be ascending or descending order. All of this data is retrieved using python to get the information from the sqlite3 database. Pages are first displayed using Django and HTML templates, then Use JavaScript to listen for any changes that need to be made and updated accordingly. 


## What’s contained in each file you created.
- **index.HTML**: If a user is not logged in a message will display prompting the user to log in to play games. this page also includes all available games that can be played. A search form is used to search for games be name. Each game has an image, name and a brief description associated with each game. Users also have the ability to like games from this page.
- **game.HTML**: Used to display proper game to the user. This is a template and depending on the game requested Django will pass the proper setup for the game. JavaScript will listen for the game requested and load correct game.
## How to run your application

## Any other additional information the staff should know about your project.