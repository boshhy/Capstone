
document.addEventListener("DOMContentLoaded", function () {
    title = document.getElementById('title');

    if (title.innerHTML == "Flappy Bird") {
        flappy();
    }
    else if (title.innerHTML == "Snake") {
        snake();
    }
    else {
        console.log("You are not on a game page")
    }
})

function flappy() {
    console.log("you are now running flappy bird");
    randomx = Math.floor(Math.random() * 101);
    console.log(randomx);
    var canvas = document.getElementById('canvas');
    canvas.width = "288";
    canvas.height = "512";
    var ctx = canvas.getContext('2d');



    var bird = new Image();
    var background = new Image();
    var ground = new Image();
    var pipeup = new Image();
    var pipedown = new Image();

    bird.src = '/static/capstone/images/bird.png';
    background.src = 'static/capstone/images/background.png';
    ground.src = 'static/capstone/images/ground.png';
    pipeup.src = 'static/capstone/images/pipeup.png';
    pipedown.src = 'static/capstone/images/pipedown.png';

    var gap = 100;
    var constant = pipeup.height + gap;

    var bX = 12;
    var bY = 128;
    var gravity = 2;
    var score = 0;

    document.addEventListener("keydown", moveUp);

    function moveUp() {
        bY -= 50
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

            if (pipe[i].x == 86) {
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
                || bY + bird.height >= canvas.height - ground.height) {
                location.reload();
            }

            if (pipe[i].x == 6) {
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





    // END


    // fetch('/score', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //         'points': randomx,
    //         'game': 'flappy_bird',
    //     })
    // })
    //     .then(result => result.json())
    //     .then(console.log('we have saved a score for flappy bird'))
}

function snake() {
    console.log("you are now running snake");
    randomx = Math.floor(Math.random() * 101);
    console.log(randomx);
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
