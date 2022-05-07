document.addEventListener("DOMContentLoaded", function () {
    title = document.getElementById('title');

    if (title.innerHTML == "Flappy Bird") {
        start_flappy();
    }
    else if (title.innerHTML == "Snake") {
        start_snake();
    }
    else {
        console.log("You are not on a game page")
    }
})

running = false;

function start_flappy() {
    canvas = document.getElementById('canvas')
    div_canvas = document.getElementById('div_canvas');
    div_canvas.setAttribute('style', 'max-width: 308px;')
    canvas.width = "0";
    canvas.height = "0";
    canvas.style.display = 'none';
    img = document.getElementById("start_image");
    img.src = '/static/capstone/images/start_flappy.png';
    img.height = "512";
    img.width = "288";

    document.addEventListener("keydown", (event) => {
        if (!event.repeat) {
            if (event.key === 's' && !running) {
                canvas.style.display = '';
                canvas.height = "512";
                canvas.width = "288";
                img.style.display = 'none';
                flappy();
            }
        }
    })
}

function start_snake() {
    canvas = document.getElementById('canvas')
    div_canvas = document.getElementById('div_canvas');
    div_canvas.setAttribute('style', 'max-width: 628px;')
    canvas.width = "0";
    canvas.height = "0";
    canvas.style.display = 'none';
    img = document.getElementById("start_image");
    img.src = '/static/capstone/images/start_snake.png';
    img.height = "608";
    img.width = "608";
    document.addEventListener("keydown", (event) => {
        if (!event.repeat) {
            if (event.key === 's' && !running) {
                canvas.width = "608";
                canvas.height = "608";
                canvas.style.display = '';
                img.style.display = 'none';
                snake();
            }
        }
    })
}


function flappy() {
    running = true;
    console.log("you are now running flappy bird");
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var bird = new Image();
    var background = new Image();
    var ground = new Image();
    var pipeup = new Image();
    var pipedown = new Image();
    //var fly = new Audio();
    var point = new Audio();
    var hit = new Audio();

    bird.src = '/static/capstone/images/bird.png';
    background.src = '/static/capstone/images/background.png';
    ground.src = '/static/capstone/images/ground.png';
    pipeup.src = '/static/capstone/images/pipeup.png';
    pipedown.src = '/static/capstone/images/pipedown.png';
    hit.src = '/static/capstone/sounds/hit.wav';
    point.src = '/static/capstone/sounds/point.mp3';
    //fly.src = '/static/capstone/sounds/fly.mp3';

    if (pipeup.height == 0) {
        pipeup.height = 242;
    }
    var gap = 100;
    var constant = pipeup.height + gap;

    var bX = 12;
    var bY = 128;
    var gravity = 2.8;
    var score = 0;

    document.addEventListener("keydown", (event) => {
        if (!event.repeat) {
            if (event.key === 'k' && running) {
                moveUp();
            }
        }
    })

    function moveUp() {
        bY -= 50;
        //fly.pause();
        //fly.currentTime = 0;
        //fly.play();
    }

    var pipe = [];

    pipe[0] = {
        x: canvas.width,
        y: 0
    }


    function draw() {
        ctx.drawImage(background, 0, 0);

        for (var i = 0; i < pipe.length; i++) {

            ctx.drawImage(pipeup, pipe[i].x, pipe[i].y);
            ctx.drawImage(pipedown, pipe[i].x, pipe[i].y + constant);

            pipe[i].x = pipe[i].x - 2;

            if (pipe[i].x == 10) {
                pipe.push({
                    x: canvas.width,
                    y: Math.floor(Math.random() * pipeup.height) - pipeup.height
                });
            }


            if (bX + bird.width >= pipe[i].x
                && bX <= pipe[i].x + pipeup.width
                && (bY <= pipe[i].y + pipeup.height
                    ||
                    bY + bird.height >= pipe[i].y + constant)
                || (bY + bird.height >= canvas.height - ground.height)) {

                go_fetch(score, "flappy_bird");
                running = false;
                //flappy();


                ctx.drawImage(pipeup, pipe[i].x, pipe[i].y);
                ctx.drawImage(pipedown, pipe[i].x, pipe[i].y + constant);
                ctx.drawImage(ground, 0, canvas.height - ground.height);
                ctx.drawImage(bird, bX, bY);
                ctx.fillstyle = "#000";
                ctx.font = "26px Verdana";
                ctx.fillText("Score: " + score, 10, canvas.height - 20);
                hit.volume = 0.4;
                hit.play();
                //fly.pause();
                //fly.currentTime = 0;
                //flappy();
                return;
            }

            if (pipe[i].x == -32) {
                point.play();
                score = score + 1;
            }
        }

        ctx.drawImage(ground, 0, canvas.height - ground.height);
        ctx.drawImage(bird, bX, bY);

        bY += gravity;
        ctx.fillstyle = "#000";
        ctx.font = "26px Verdana";
        ctx.fillText("Score: " + score, 10, canvas.height - 20);
        requestAnimationFrame(draw);
    }
    draw();
}


function snake() {
    running = true;
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const box = 32;

    const floor = new Image();
    floor.src = "/static/capstone/images/floor.png";

    const foodImg = new Image();
    foodImg.src = "/static/capstone/images/food.png";

    let snake = [];

    snake[0] = {
        x: 9 * box,
        y: 10 * box
    };

    let food = {
        x: Math.floor(Math.random() * 17 + 1) * box,
        y: Math.floor(Math.random() * 15 + 3) * box
    }

    let score = 0;

    let d;

    document.addEventListener("keydown", direction);

    function direction(event) {
        event.preventDefault();
        if (event.keyCode == 37 && d != "RIGHT") {
            d = "LEFT";
        } else if (event.keyCode == 38 && d != "DOWN") {
            d = "UP";
        } else if (event.keyCode == 39 && d != "LEFT") {
            d = "RIGHT";
        } else if (event.keyCode == 40 && d != "UP") {
            d = "DOWN";
        }
    }

    function collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x == array[i].x && head.y == array[i].y) {
                return true;
            }
        }
        return false;
    }

    function draw() {
        ctx.drawImage(floor, 0, 0);

        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = (i == 0) ? "green" : "white";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);

            ctx.strokeStyle = "red";
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }
        ctx.drawImage(foodImg, food.x, food.y);


        let snakeX = snake[0].x;
        let snakeY = snake[0].y;



        if (d == "LEFT") snakeX -= box;
        if (d == "UP") snakeY -= box;
        if (d == "RIGHT") snakeX += box;
        if (d == "DOWN") snakeY += box;

        if (snakeX == food.x && snakeY == food.y) {
            score++;
            food = {
                x: Math.floor(Math.random() * 17 + 1) * box,
                y: Math.floor(Math.random() * 15 + 3) * box
            }
        } else {
            snake.pop();
        }

        let newHead = {
            x: snakeX,
            y: snakeY
        }

        if (snakeX < box || snakeX > 17 * box
            || snakeY < 3 * box || snakeY > 17 * box
            || collision(newHead, snake)) {
            clearInterval(game);
            ctx.fillStyle = "white";
            ctx.font = "45px Changa one";
            ctx.fillText(score, 2 * box, 1.6 * box);
            go_fetch(score, "snake");
            running = false;
            return;
        }


        snake.unshift(newHead);

        ctx.fillStyle = "white";
        ctx.font = "45px Changa one";
        ctx.fillText(score, 2 * box, 1.6 * box);

    }

    let game = setInterval(draw, 128);
}


function go_fetch(points, game) {
    console.log("made it to go_fetch")
    fetch('/score', {
        method: 'POST',
        body: JSON.stringify({
            'points': points,
            'game': game,
        })
    })
        .then(result => result.json())
        .then(result => {
            console.log("you made it to the outcome")
            if (result['outcome'] == 'updated') {
                fetch('/update_score/' + game)
                    .then(response => response.json())
                    .then(scores => {
                        top_scores = document.getElementById('points');
                        top_scores.innerHTML = "<h1>TOP 10</h1>";
                        scores.forEach((score) => {
                            div = document.createElement("div");
                            div.innerHTML = score['points'] + ' - ' + score['user'];
                            top_scores.append(div);
                        })
                    })
            }
        })
}