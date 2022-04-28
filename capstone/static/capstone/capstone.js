
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
    // START
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var bird = new Image();
    var background = new Image();
    var ground = new Image();
    var pipeup = new Image();
    var pipedown = new Image();
    // need to figure out how to add image




    // END


    fetch('/score', {
        method: 'POST',
        body: JSON.stringify({
            'points': randomx,
            'game': 'flappy_bird',
        })
    })
        .then(result => result.json())
        .then(console.log('we have saved a score for flappy bird'))
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
