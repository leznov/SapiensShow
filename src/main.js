
// Initialization
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// Images
//const charBender = document.getElementById("bender");

// Dynamics
let needMove = 0;

// All balls objects
const balls = [];
createNewBall();

// Listeners
document.getElementById('newBall').addEventListener('click', createNewBall);
document.getElementById('takeControl').addEventListener('click', toggleControl);
document.getElementById('freeTheBall').addEventListener('click', toggleControl);

// Controls

let ballUnderControlID = 0;

let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

const newBall = {
    //id: balls.length+1,
    x: 300,
    y: 300,
    dx: 3, // Velocity
    dy: 3,
    manualSpeed: 5,
    radius: 25,
    color: 'red',
    auto: false,
    draw: function(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
};

let showData = false;





document.addEventListener('keydown', e => {

    // Key values: https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/key/Key_Values
    // TEST:
    // console.log(`e.key: ${e.key}`);
    switch(e.key){
        case 'Left': // Left arrow for IE/Edge
            leftPressed = true;
            break;

        case 'ArrowLeft':
            leftPressed = true;
            break;

        case 'Rigth': // Right arrow for IE/Edge
            rightPressed = true;
            break;

        case 'ArrowRight':
            rightPressed = true;
            break;

        case 'ArrowUp':
            upPressed = true;
            break;

        case 'ArrowDown':
            downPressed = true;
            break;
    }

    //console.log(`Нажатие. upPressed: ${upPressed}`);

    showData = true;

});

document.addEventListener('keyup', e => {

    // Key values: https://developer.mozilla.org/ru/docs/Web/API/KeyboardEvent/key/Key_Values
    // TEST:
    // console.log(`e.key: ${e.key}`);
    
    switch(e.key){
        case 'Left': // Left arrow for IE/Edge
            leftPressed = false;
            break;

        case 'ArrowLeft':
            leftPressed = false;
            break;

        case 'Rigth': // Right arrow for IE/Edge
            rightPressed = false;
            break;

        case 'ArrowRight':
            rightPressed = false;
            break;

        case 'ArrowUp':
            upPressed = false;
            break;

        case 'ArrowDown':
            downPressed = false;
            break;
    }

    //console.log(`Отжатие. upPressed: ${upPressed}`);

    showData = false;

});






// Main loop
let raf;
let lastTime = 0;
let deltaTime = 0;

// FPS measurement
let FPS;
let meanFPS;
const FPSArray = [];


function mainLoop(timestamp){

    
    // if (!lastTime) lastTime = timestamp;

    deltaTime = timestamp - lastTime;
    FPS = 1000/deltaTime;
    FPSArray.push(FPS);
    
    //console.log(`deltaTime: ${deltaTime}, FPS: ${FPS}`);
    //console.log(`timestamp: ${timestamp}, lastTime: ${lastTime}, deltaTime: ${deltaTime}`);
    lastTime = timestamp;

    
    
    // Clear canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    newBall.draw();
    animate();
  

    // ctx.fillStyle = '#0ff';
    // Draw paddle
    // paddleUpdate(deltaTime);
    // paddleDraw();

    // Draw character
    // charUpdate(deltaTime);
    // charDraw();


    

    // requestAnimationFrame don't work (pausing) on a background tab
    // Use the Page Visibility API to detect when a tab is hidden
    raf = requestAnimationFrame(mainLoop);
}



// Pause/speed down
document.getElementById('speedDown').addEventListener('click', function(){
    cancelAnimationFrame(raf);
});

// Speed up
document.getElementById('speedUp').addEventListener('click', function(){
    raf = requestAnimationFrame(mainLoop);
});


////////////
// INTERVALS

const everySecTimer = window.setInterval(everySecond, 1000);
function everySecond(){

    let sumOfFrames = 0;
    for (const frame of FPSArray){
        sumOfFrames += frame;
    }

    meanFPS = Math.round((sumOfFrames / FPSArray.length) * 100) / 100;
    //console.log(`meanFPS: ${meanFPS}`);
}

const every5SecTimer = window.setInterval(every5Second, 5000);
function every5Second(){

    for(const ball of balls){
        //changeDirection(ball);
    }

}

// Stop all intervals
document.getElementById('stopAll').addEventListener('click', function(){
    clearInterval(everySecTimer);
    clearInterval(every5SecTimer);
});






function animate(){
    
    for(const ball of balls){

        
        if(ball.auto){

            // For autonomous balls

            // Moving
            ball.x += ball.dx;
            ball.y += ball.dy;

            //ball.dy *= 0.93;
            //ball.dy += 0.90;

            collisionDetection(ball, 'auto');

        }else{ 

            // for manual controled balls
            if (leftPressed) {
                ball.x -= ball.manualSpeed;
            }else if(rightPressed){
                ball.x += ball.manualSpeed;
            }else if(upPressed){
                ball.y -= ball.manualSpeed;
            }else if(downPressed){
                ball.y += ball.manualSpeed;
            }
            

            collisionDetection(ball, 'manual');

        }
        

        

        ball.draw();

        //console.log(`ball.x: ${ball.x}, ball.dx: ${ball.dx}, ball.y: ${ball.y}`);
    }  

}



function collisionDetection(ball, mode){

    // Boundaries detection and reaction

    if (mode == 'auto'){

        if(ball.x + ball.dx < ball.radius || ball.x + ball.dx > canvas.width-ball.radius){
            ball.dx = -ball.dx;
           // if (mode == 'manual') ball.x = canvas.width-ball.radius;
        }
        if(ball.y + ball.dy < ball.radius || ball.y + ball.dy > canvas.height-ball.radius){
            ball.dy = -ball.dy;
           // if (mode == 'manual') ball.y = canvas.height-ball.radius;
        }

    }else {

        if (ball.x + ball.manualSpeed < ball.radius){ // Left border
            ball.x = ball.radius;
        }else if(ball.x + ball.manualSpeed > canvas.width-ball.radius){ // Right border
            ball.x = canvas.width-ball.radius;
        }else if (ball.y + ball.manualSpeed < ball.radius){ // Top border
            ball.y = ball.radius;
        }else if (ball.y + ball.manualSpeed > canvas.height-ball.radius){ // Bottom border
            ball.y = canvas.height-ball.radius;
        }

    }

    if (showData) {
        console.log(`ball.x: ${ball.x}, ball.y: ${ball.y}`);
        console.log(`newBall.x: ${newBall.x}, newBall.y: ${newBall.y}, newBall start: ${newBall.x - newBall.radius}, newBall end: ${newBall.x + newBall.radius}`);
    }
    

}

function changeDirection(ball){
    // Random 0 or 1
    const xRand = Math.floor(Math.random() * 2);
    const yRand = Math.floor(Math.random() * 2);

    if (xRand) ball.dx *= -1;
    if (yRand) ball.dy *= -1;

    //console.log(`xRand: ${xRand}, yRand: ${yRand}`);
}

function createNewBall(e){

    const newBall = {
        id: balls.length+1,
        x: 100,
        y: 100,
        dx: 3, // Velocity
        dy: 3,
        manualSpeed: 5,
        radius: 25,
        color: 'blue',
        auto: false,
        draw: function(){
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    }

    balls.push(newBall);
}



function toggleControl(e){

    // Get ID of the ball
    const id = document.getElementById('ballID').value;
    // Get our ball
    const ourBall = balls.filter(ball => ball.id == id);


    switch (e.target.id){
        case 'takeControl':
            // IF we have already the ball on manual control than to free it
            if (ballUnderControlID) {
                const ballToFree = balls.filter(ball => ball.id == ballUnderControlID);
                ballToFree[0].auto = true;
            }
            ourBall[0].auto = false; // Now our ball is on manual mode
            ballUnderControlID = ourBall[0].id;
            break;
        case 'freeTheBall':
            ourBall[0].auto = true; // Now our ball is on auto mode
            ballUnderControlID = 0;
            break;
    }


    //console.log(ourBall[0].auto);
}



















// Later
/*


  // Food zone
    ctx.fillStyle = 'green';
    ctx.fillRect(400, 400, 100, 100);


*/
















// Draw paddle (just for learning)
let paddleSize = { width: 150, height: 20 };

let paddleMaxSpeed = 5;
let paddleCurrentSpeed = 0;

ctx.fillStyle = '#0ff';

let paddlePosition = {
    x: GAME_WIDTH/2 - paddleSize.width/2,
    y: GAME_HEIGHT - paddleSize.height - 10
}

function moveLeft(){
    paddleCurrentSpeed = -paddleMaxSpeed;
}

function moveRight(){
    paddleCurrentSpeed = paddleMaxSpeed;
}

function padStop(){

    paddleCurrentSpeed = 0;

}

function paddleDraw(){

    ctx.fillRect(paddlePosition.x, paddlePosition.y, paddleSize.width, paddleSize.height);

}

function paddleUpdate(deltaTime){

    paddlePosition.x += paddleCurrentSpeed;

    if(paddlePosition.x < 0) paddlePosition.x = 0;

    if(paddlePosition.x + paddleSize.width > GAME_WIDTH) paddlePosition.x = GAME_WIDTH - paddleSize.width;

    // let speed = 3;

    // let firstPosition = paddlePosition.x;

    // if (speed == 3){
    //     paddlePosition.x += 3 / deltaTime;
    // }else if (speed == 5){
    //     paddlePosition.x += 5 / deltaTime;
    // }else if (speed == 7){
    //     paddlePosition.x += 7 / deltaTime;
    // }else if (speed == 60){
    //     paddlePosition.x += 60 / deltaTime;
    // }

    // let secondPosition = paddlePosition.x;


    // console.log(secondPosition - firstPosition);
    
}

paddleDraw();



// Character
let charSize = { width: 48, height: 48 };
let charPosition = { x: 10, y: 10 };
let charSpeed = { x: 1, y: 1 };

let hunger = 0;

function charDraw(){
    ctx.drawImage(bender, charPosition.x, charPosition.y);
}

let randomX = 0;
let randomY = 0;

function charUpdate(deltaTime, move){
    //charPosition.x += charSpeed.x;
    //charPosition.y += charSpeed.y;
    console.log(needMove);
    // Do we need to go?
    if(needMove > 0){
        goFromTo(charPosition.x, charPosition.y, randomX, randomY);
    }

    if(hunger > 1){
        goFromTo(charPosition.x, charPosition.y, 400, 400);
    }

    if(charPosition.x >= 400 && charPosition.x < 500){
        if(charPosition.y >= 400 && charPosition.y < 500){
            hunger -= deltaTime / 10000;
        }
    }else{
        hunger += deltaTime / 10000;
    }
    console.log(hunger);

    if (charPosition.x + charSize.width > GAME_WIDTH || charPosition.x < 0){
        charSpeed.x = -charSpeed.x;
    }
    if (charPosition.y + charSize.height > GAME_HEIGHT || charPosition.y < 0){
        charSpeed.y = -charSpeed.y;
    }
}

function randomPath(){
    randomX = getRandom(GAME_WIDTH - charSize.width);
    randomY = getRandom(GAME_HEIGHT - charSize.height);
    needMove = 1;
}


// from 230,140 to 440,050
function goFromTo(x1, y1, x2, y2){

    let needMoveX = x2 - x1;
    let needMoveY = y2 - y1;

    if(needMoveX > 0){
        charPosition.x += charSpeed.x;
    }else if(needMoveX < 0){
        charPosition.x += -charSpeed.x;
    }

    if(needMoveY > 0){
        charPosition.y += charSpeed.y;
    }else if(needMoveY < 0){
        charPosition.y += -charSpeed.y;
    }

    if(needMoveX == 0  && needMoveY == 0) needMove = 0;

    console.log("randomX: " + randomX + "; randomY: " + randomY + "; X: " + charPosition.x + "; Y: " + charPosition.y);

}


function getRandom(max){
    return Math.floor(Math.random() * Math.floor(max));
}



// Inputs
document.addEventListener("keydown", event => {

    //alert(event.keyCode);
    switch(event.keyCode){
        case 37:
            moveLeft();
            break;

        case 39:
            moveRight();
            break;

        case 32:
            randomPath();
            break;
    }
});

document.addEventListener("keyup", event => {

    switch(event.keyCode){
        case 37:
            if (paddleCurrentSpeed < 0)
                padStop();
            break;

        case 39:
            if (paddleCurrentSpeed > 0)
                padStop();
            break;
    }
});








raf = requestAnimationFrame(mainLoop);