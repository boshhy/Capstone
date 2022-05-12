// Once you have the page loaded look for a title to redirect to 
// currect game
document.addEventListener("DOMContentLoaded", function () {
    title = document.getElementById('title');
    like_icons = document.querySelectorAll("#like_icon");
    // Add an event listener to all heart icons, so user can like a game
    like_icons.forEach(icon => {
        icon.addEventListener("click", like_icon_clicked)
    })

    // If game found run current title else don't run anything
    if (title != null) {

        // go to set up flappy bird
        if (title.innerHTML == "Flappy Bird") {
            start_flappy();
        }
        // go to set up snake
        else if (title.innerHTML == "Snake") {
            start_snake();
        }
    }
})


// This variable will be used so only once instance of a game is ran
running = false;


// Sets up flappy bird canvas and starting image
function start_flappy() {
    canvas = document.getElementById('canvas')
    div_canvas = document.getElementById('div_canvas');
    div_canvas.setAttribute('style', 'max-width: 308px;')
    // Hide canvas until player starts the game
    canvas.width = "0";
    canvas.height = "0";
    canvas.style.display = 'none';
    img = document.getElementById("start_image");
    img.src = '/static/capstone/images/start_flappy.png';
    img.height = "512";
    img.width = "288";

    // Listen for player to start the game, when clicking the 's' key
    document.addEventListener("keydown", (event) => {
        if (!event.repeat) {
            if (event.key === 's' && !running) {
                // If 's' key and a game is currently not running, display the canvas
                canvas.style.display = '';
                canvas.height = "512";
                canvas.width = "288";
                img.style.display = 'none';
                // go to start flappy bird game
                flappy();
            }
        }
    })
}


// Sets up snake canvas and starting image
function start_snake() {
    canvas = document.getElementById('canvas')
    div_canvas = document.getElementById('div_canvas');
    div_canvas.setAttribute('style', 'max-width: 628px;')
    // Hide canvas until player starts the game
    canvas.width = "0";
    canvas.height = "0";
    canvas.style.display = 'none';
    img = document.getElementById("start_image");
    img.src = '/static/capstone/images/start_snake.png';
    img.height = "608";
    img.width = "608";

    // Listen for player to start the game, when clicking the 's' key
    document.addEventListener("keydown", (event) => {
        if (!event.repeat) {
            if (event.key === 's' && !running) {
                // If 's' key and a game is currently not running, display the canvas
                canvas.width = "608";
                canvas.height = "608";
                canvas.style.display = '';
                img.style.display = 'none';
                // go to start snake game
                snake();
            }
        }
    })
}


// This will run the flappy bird game and load all needed images and audio
function flappy() {
    running = true;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // Make a new image or audio for each variable
    var bird = new Image();
    var background = new Image();
    var ground = new Image();
    var pipeup = new Image();
    var pipedown = new Image();
    var point = new Audio();
    var hit = new Audio();

    // Set all source attributes for above image and audio elements
    bird.src = '/static/capstone/images/bird.png';
    background.src = '/static/capstone/images/background.png';
    ground.src = '/static/capstone/images/ground.png';
    pipeup.src = '/static/capstone/images/pipeup.png';
    pipedown.src = '/static/capstone/images/pipedown.png';
    hit.src = '/static/capstone/sounds/hit.wav';
    point.src = '/static/capstone/sounds/point.mp3';

    // This is used to display the correct gap for the first pipes
    if (pipeup.height == 0) {
        pipeup.height = 242;
    }

    // set up pipe gap
    var gap = 100;
    var constant = pipeup.height + gap;

    // Set up bird location on screen before starting
    // Set up gravity and score
    var bX = 12;
    var bY = 128;
    var gravity = 2.8;
    var score = 0;

    // Listen to see if player has pressed the 'k' key for jump function
    document.addEventListener("keydown", (event) => {
        if (!event.repeat) {
            if (event.key === 'k' && running) {
                moveUp();
            }
        }
    })

    // ecexuted once player presses the 'k' key
    function moveUp() {
        bY -= 50;
    }

    // Set up a list for the pipes 
    var pipe = [];
    // Set up the first pipe to beggin and canvas width
    pipe[0] = {
        x: canvas.width,
        y: 0
    }

    // Used to display the correct 'frame' to the screen
    function draw() {
        // Draw the background image
        ctx.drawImage(background, 0, 0);

        // for all pipes in pipe list
        for (var i = 0; i < pipe.length; i++) {
            // Draw the pipe up and pipe down on the screen
            ctx.drawImage(pipeup, pipe[i].x, pipe[i].y);
            ctx.drawImage(pipedown, pipe[i].x, pipe[i].y + constant);
            // Update the pipe location and move it over by 2
            pipe[i].x = pipe[i].x - 2;
            // If pipe reaches left of canvas we need to push another pipe
            // into the pipe list at a random height
            if (pipe[i].x == 10) {
                pipe.push({
                    x: canvas.width,
                    y: Math.floor(Math.random() * pipeup.height) - pipeup.height
                });
            }

            // If bird touched the pipeup or pipedown or floor end the game
            if (bX + bird.width >= pipe[i].x
                && bX <= pipe[i].x + pipeup.width
                && (bY <= pipe[i].y + pipeup.height
                    ||
                    bY + bird.height >= pipe[i].y + constant)
                || (bY + bird.height >= canvas.height - ground.height)) {
                // Go see if the player has achieved a score in the top 10 for game
                go_fetch(score, "flappy_bird");
                running = false;

                // Used to draw the current frame where bird touched pipes or ground
                ctx.drawImage(pipeup, pipe[i].x, pipe[i].y);
                ctx.drawImage(pipedown, pipe[i].x, pipe[i].y + constant);
                ctx.drawImage(ground, 0, canvas.height - ground.height);
                ctx.drawImage(bird, bX, bY);
                ctx.fillstyle = "#000";
                ctx.font = "26px Verdana";
                ctx.fillText("Score: " + score, 10, canvas.height - 20);
                hit.volume = 0.4;
                hit.play();
                return;
            }

            // If pipe has reached left of screen add a point to player score
            if (pipe[i].x == -32) {
                point.play();
                score = score + 1;
            }
        }

        // Drawing the ground and the bird in their current locations
        ctx.drawImage(ground, 0, canvas.height - ground.height);
        ctx.drawImage(bird, bX, bY);
        // Move bird y location accordingly by what the gravity is
        bY += gravity;
        // used to display the curernt score for player
        ctx.fillstyle = "#000";
        ctx.font = "26px Verdana";
        ctx.fillText("Score: " + score, 10, canvas.height - 20);
        // go the the next frame
        requestAnimationFrame(draw);
    }
    // start to start drawing animations of game
    draw();
}

// This will run the snake game and load all needed images and audio
function snake() {
    running = true;
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // Make a box 32 pixels, which is what the canvas image size is
    const box = 32;
    // Make a new image or audio for each variable
    const floor = new Image();
    const foodImg = new Image();
    const point = new Audio();
    const hit = new Audio();

    // Set all source attributes for above images and audio elements
    floor.src = "/static/capstone/images/floor.png";
    foodImg.src = "/static/capstone/images/food.png";
    point.src = '/static/capstone/sounds/point.mp3';
    hit.src = '/static/capstone/sounds/hit.wav';

    // Create a list for snake head and body 
    let snake = [];

    // Add the first box (head) to the beginning of snake list
    // and locate it in the middle of the canvas
    snake[0] = {
        x: 9 * box,
        y: 10 * box
    };

    // Add a food to be randomly placed on the canvas
    let food = {
        x: Math.floor(Math.random() * 17 + 1) * box,
        y: Math.floor(Math.random() * 15 + 3) * box
    }

    // Set the score to 0
    let score = 0;

    // Used to make sure player doesn't go the oppsite direction
    // of current moving direction
    let d;

    // Listen to see if a key was pressed and go to direction function
    document.addEventListener("keydown", direction);

    // Check to see if an arrow key was pressed and make sure
    // it was not oppsite of current moving direction
    function direction(event) {
        if (event.keyCode == 37 && d != "RIGHT") {
            d = "LEFT";
            event.preventDefault();
        } else if (event.keyCode == 38 && d != "DOWN") {
            d = "UP";
            event.preventDefault();
        } else if (event.keyCode == 39 && d != "LEFT") {
            d = "RIGHT";
            event.preventDefault();
        } else if (event.keyCode == 40 && d != "UP") {
            d = "DOWN";
            event.preventDefault();
        }
    }

    // Checks whether the head of the snake has collided with itself
    function collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x == array[i].x && head.y == array[i].y) {
                return true;
            }
        }
        return false;
    }

    // Used to update and draw current frame
    function draw() {
        // draw the background (floor) of the canvas
        ctx.drawImage(floor, 0, 0);

        // If each box in the snake, check to see if its the head,
        // if it is color it black otherwise color it green
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = (i == 0) ? "black" : "green";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
            // Set the outline of each box to black
            ctx.strokeStyle = "black";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }
        // Draw the food image in the current food location x and y positions
        ctx.drawImage(foodImg, food.x, food.y);

        // Get current position of head x and y locations
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;


        // Update the location of the head accoding to what directions
        // the snake is currently moving by moving a box size (32 pixels)
        if (d == "LEFT") snakeX -= box;
        if (d == "UP") snakeY -= box;
        if (d == "RIGHT") snakeX += box;
        if (d == "DOWN") snakeY += box;

        // If the snake head x and y location match the 
        // location of x and y then add a point and choose another 
        // location for a food block
        if (snakeX == food.x && snakeY == food.y) {
            point.pause();
            point.currentTime = 0;
            point.play();
            score++;
            food = {
                x: Math.floor(Math.random() * 17 + 1) * box,
                y: Math.floor(Math.random() * 15 + 3) * box
            }
        } else {
            // if snake had not ran into a piece of food pop the tail off
            snake.pop();
        }

        // make a new head for the snake with update x and y locations
        let newHead = {
            x: snakeX,
            y: snakeY
        }

        // Check to see if the snake head has hit and endge or if it
        // has ran into itslef
        if (snakeX < box || snakeX > 17 * box
            || snakeY < 3 * box || snakeY > 17 * box
            || collision(newHead, snake)) {
            clearInterval(game);
            // used to display score upon death
            ctx.fillStyle = "white";
            ctx.font = "45px Changa one";
            ctx.fillText(score, 2 * box, 1.6 * box);
            hit.play();
            // Go check if the player has made it to the top 10
            go_fetch(score, "snake");
            running = false;
            return;
        }

        // Add the update snakehead to the begining of the snake list
        snake.unshift(newHead);
        // used to dispaly score every frame
        ctx.fillStyle = "white";
        ctx.font = "45px Changa one";
        ctx.fillText(score, 2 * box, 1.6 * box);
    }

    // start to start drawing animations of game with 
    // frame rate adjusted
    let game = setInterval(draw, 80);
}

// Uses API to check if the score of the player was in the top 10
function go_fetch(points, game) {
    fetch('/score', {
        method: 'POST',
        body: JSON.stringify({
            'points': points,
            'game': game,
        })
    })
        .then(result => result.json())
        .then(result => {
            if (result['outcome'] == 'updated') {
                // If outcome was 'updated' then 
                // go getch the game update game scores for game
                fetch('/update_score/' + game)
                    .then(response => response.json())
                    .then(scores => {
                        // clear the current table
                        top_scores = document.getElementById('points');
                        top_scores.innerHTML = "";

                        // Create a table and add the headers
                        table1 = document.createElement("table");
                        tr = document.createElement("tr");
                        th_1 = document.createElement("th");
                        th_2 = document.createElement("th");

                        th_1.innerHTML = "Top 10";
                        th_2.innerHTML = "User";

                        tr.append(th_1);
                        tr.append(th_2);
                        // Add row with headers to table
                        table1.append(tr)

                        // Used to get current logged in user
                        game_background = document.getElementById("game_background");
                        player_id = game_background.dataset.playerid;
                        scores.forEach((score) => {
                            // create a table row for each score
                            tr = document.createElement("tr");
                            td_1 = document.createElement("td");
                            td_2 = document.createElement("td");

                            td_1.innerHTML = score['points'];
                            td_2.innerHTML = score['user'];

                            // If score being added is made by current logged in
                            // user then chage color to aqua
                            if (player_id == score['id']) {
                                td_1.style.color = "aqua";
                                td_2.style.color = "aqua";
                            }
                            tr.append(td_1);
                            tr.append(td_2);
                            // Add row to table
                            table1.append(tr);
                        })
                        // Add table to points div
                        top_scores.append(table1);
                    })
            }
        })
}

// Adds game to users 'liked' list
function like_icon_clicked() {
    // Get the id of the game for which the clicked like icon belongs to
    game_id = this.dataset.iconid

    // Call the like function in the backend to deal with the click
    // either add or removes the user from the games likes table
    fetch('/like', {
        method: 'POST',
        body: JSON.stringify({
            'id': game_id,
        })
    })
        .then(result => result.json())
        .then(data => {
            // When added to the table change to red heart icon
            if (data['outcome'] == 'Added') {
                this.className = "fa-solid fa-heart liked"
            }
            // When removed from the table change to hollow heart icon
            else {
                this.className = "fa-regular fa-heart"
            }
        })
}
