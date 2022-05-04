document.addEventListener("DOMContentLoaded", function () {
    title = document.getElementById('title');

    if (title.innerHTML == "Flappy Bird") {
        start_flappy();
    }
    else if (title.innerHTML == "Snake") {
        snake();
    }
    else {
        console.log("You are not on a game page")
    }
})

running = false;

function start_flappy() {
    canvas = document.getElementById('canvas')
    canvas.width = "0";
    canvas.height = "0";
    img = document.getElementById("start_image");
    img.src = 'static/capstone/images/start_flappy.png';
    img.height = "512";
    img.width = "288";

    document.addEventListener("keydown", (event) => {
        if (!event.repeat) {
            if (event.key === 's' && !running) {
                img.style.display = 'none';
                flappy();
            }
        }
    })
}


function flappy() {
    running = true;
    console.log("you are now running flappy bird");
    var canvas = document.getElementById('canvas');
    canvas.width = "288";
    canvas.height = "512";
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
    background.src = 'static/capstone/images/background.png';
    ground.src = 'static/capstone/images/ground.png';
    pipeup.src = 'static/capstone/images/pipeup.png';
    pipedown.src = 'static/capstone/images/pipedown.png';
    hit.src = 'static/capstone/sounds/hit.wav';
    point.src = 'static/capstone/sounds/point.mp3';
    //fly.src = 'static/capstone/sounds/fly.mp3';

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
                fetch('/update_score/' + game)
                    .then(response => response.json())
                    .then(scores => {
                        top_scores = document.getElementById('points');
                        top_scores.innerHTML = "";
                        scores.forEach((score) => {
                            div = document.createElement("div");
                            div.innerHTML = score['points'] + ' - ' + score['user'];
                            top_scores.append(div);
                        })
                    })
            }
        })
}














function snake() {
    console.log("you are now running snake");
    fetch('/score', {
        method: 'POST',
        body: JSON.stringify({
            'points': randomx,
            'game': 'snake',
        })
    })
        .then(result => result.json())
        .then(console.log('we have saved a score for snake'))
}


