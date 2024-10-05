var players;
var currentPlayers;
var currentPlayerTimes;

var initTime;

var timeBox;

var turn;

var turnStartAt;
var elimStartTime;
var transitionStartTime;

var scene;

var boxes;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    textFont('Roboto');

    players = [];
    currentPlayers = [];

    initTime = 15 * 1000;
    turnStartAt = millis();
    currentPlayerTimes = [];
    for(let i = 0; i < currentPlayers.length; i++) currentPlayerTimes.push(initTime); 

    turn = 0;

    transitionStartTime = millis();

    scene = "title";

    timeBox = createInput("15");
    timeBox.position(width/2 - 54, height/4 - 113);
    timeBox.size(30);
    timeBox.addClass("s-textbox");

    boxes = [];
}

function drawClock(TIME, currPlayer, upNext, hideUpNext) {
    textAlign(CENTER, BOTTOM);
    textSize(100);
    text(currPlayer, width/2, height/2 - 120);

    if(!hideUpNext) {
        textSize(40);
        textAlign(CENTER, TOP);
        text("up next: " + upNext, width/2, height/2 + 120);
    }


    //lines
    strokeWeight(5);
    line(width/2 + 197.1484375, height/2 - 110, width/2 - 197.1484375 - 20, height/2 - 110);
    line(width/2 + 197.1484375, height/2 + 100, width/2 - 197.1484375 - 20, height/2 + 100);
    strokeWeight(1);

    //timer
    let roundedDisplayTime = round(TIME/1000 * 100) / 100;
    
    //timer, seconds; has width 269.53125
    textAlign(LEFT, TOP);
    textSize(240);
    if(floor(roundedDisplayTime) < 10) {
        text("0" + floor(roundedDisplayTime), width/2 - 197.1484375 - 30, height/2 - 100);
    } else {
        text(floor(roundedDisplayTime), width/2 - 197.1484375 - 30, height/2 - 100);
    }

    //timer, centiseconds; has width 124.765625
    textAlign(LEFT, TOP);
    textSize(120);
    if(roundedDisplayTime * 100 % 100 < 10) {
        text("0" + floor(roundedDisplayTime * 100) % 100, width/2 - 197.1484375 + 269.53125 - 30, height/2 - 60);
    } else {
        text(floor(roundedDisplayTime * 100) % 100, width/2 - 197.1484375 + 269.53125 - 30, height/2 - 60);
    }
}

function drawGame() {
    background(255);
    background(0, 255, 255, 150);
    
    let turnTime = millis() - turnStartAt;

    if(currentPlayerTimes[turn] - turnTime <= 0) {
        elimStartTime = millis();
        scene = "elimination";
    } else {
        drawClock(currentPlayerTimes[turn] - turnTime, currentPlayers[turn], currentPlayers[(turn+1) % currentPlayers.length]);
    }
}

function drawElimination() {
    background(255);
    background(255, 0, 0, 150);

    drawClock(0, currentPlayers[turn], currentPlayers[(turn + 1) % currentPlayers.length]);

    if(millis() - elimStartTime > 500) {
        //eliminate last player
        if(currentPlayers.length == 2) {
            currentPlayers.splice(turn, 1);
            currentPlayerTimes.splice(turn, 1);
            scene = "win";
        }
        
        //otherwise, reduce player, keep going
        else {
            currentPlayers.splice(turn, 1);
            currentPlayerTimes.splice(turn, 1);

            turnStartAt = millis();
            if(turn == currentPlayers.length) turn = 0;
            scene = "game";
        }
    }
}

function drawTransition() {

    background(255);
    background(0, 255, 255, 150);

    textAlign(CENTER, CENTER);
    textSize(120, 120);
    text(3 - floor((millis() - transitionStartTime)/1000), width/2, height/2);

    if(3 - floor((millis() - transitionStartTime)/1000) <= 0) {

        currentPlayers = [];
        currentPlayerTimes = [];
        turnStartAt = millis();
        for(let i = 0; i < players.length; i++) {
            currentPlayers.push(players[i]);
            currentPlayerTimes.push(initTime);
        }
        turn = 0;
        scene = "game";
    } 
}

function drawTitle() {
    background(255);
    background(0, 255, 255, 150);


    textAlign(CENTER, BOTTOM);
    textSize(30);
    text("second", width/2 + 30, height/4 - 80);

    textSize(75);
    textAlign(CENTER, BOTTOM);
    text("word game", width/2, height/4);

    strokeWeight(5);
    line(width/2 - 200, height/4 + 10, width/2 + 200, height/4 + 10);
    strokeWeight(1);

    //remove player boxes
    strokeWeight(2);
    for(let i = 0; i < boxes.length; i++) {
        let shift = height/4 + 3 + 60 * (i+1);

        let distX = mouseX - (width/2 - 185 + 5);
        let distY = mouseY - (-5 + shift);
        
        if(distX * distX + distY * distY < 13 * 12) {
            fill(180);
            strokeWeight(0);
            ellipse(width/2 - 185 + 5, -5 + shift, 25, 25);
            strokeWeight(2);
        }

        line(width/2 - 185, shift, width/2 - 185 + 10, - 10 + shift);
        line(width/2 - 185, -10 + shift, width/2 - 185 + 10, shift);
    }
    strokeWeight(1);

    //draw buttons
    if(mouseX > width/2 - 200 + 10 && mouseX < width/2 - 200 + 10 + 180
        && mouseY > height/4 + 40 + 60 * boxes.length && mouseY < height/4 + 40 + 50 + 60 * boxes.length) {
        
        fill(180);
    } else fill(255);
    rect(width/2 - 200 + 10, height/4 + 40 + 60 * boxes.length, 180, 50, 5);

    if(boxes.length < 2 || (mouseX > width/2 + 10 && mouseX < width/2 + 10 + 180
        && mouseY > height/4 + 40 + 60 * boxes.length && mouseY < height/4 + 40 + 50 + 60 * boxes.length)) {
        
        fill(180);
    } else fill(255);
    rect(width/2 + 10, height/4 + 40 + 60 * boxes.length, 180, 50, 5);

    //button text
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(0);
    text("add player", width/2 - 200 + 10 + 90, height/4 + 40 + 25 + 60 * boxes.length);
    text("play", width/2 + 10 + 90, height/4 + 40 + 25 + 60 * boxes.length);
}

function draw() {

    switch(scene) {
        case "title":
            drawTitle();
        break;

        case "transition":
            drawTransition();
        break;

        case "game":
            drawGame();
        break;

        case "elimination":
            drawElimination();
        break;

        case "win":
            background(255);
            background(0, 255, 0, 100);

            drawClock(currentPlayerTimes[0], currentPlayers[0], currentPlayers[0], true);

            if(mouseX > width/2 - 210 && mouseX < width/2 - 210 + 190
                && mouseY > height/4 + 270 && mouseY < height/4 + 270 + 50) {
                fill(180);
            } else fill (255);
            rect(width/2 - 210, height/4 + 270, 190, 50, 5);

            if(mouseX > width/2 && mouseX < width/2 + 190
                && mouseY > height/4 + 270 && mouseY < height/4 + 270 + 50) {
                fill(180);
            } else fill (255);
            rect(width/2, height/4 + 270, 190, 50, 5);
            
            textSize(32);
            fill(0);
            textAlign(CENTER, CENTER);
            text("play again", width/2 - 210 + 95, height/4 + 270 + 25);
            text("title", width/2 + 95, height/4 + 270 + 25);
        break;
    }
}

function keyPressed() {
    if(scene == "game") {

        if(key == 'e') {
            currentPlayerTimes[turn] = 0;
        } else {
            currentPlayerTimes[turn] -= millis() - turnStartAt;

            turnStartAt = millis();
            turn = ++turn % currentPlayers.length;
        }
    }
}

function mouseClicked() {

    if(scene == "title") {
        if(mouseX > width/2 - 200 + 10 && mouseX < width/2 - 200 + 10 + 180
            && mouseY > height/4 + 40 + 60 * boxes.length && mouseY < height/4 + 40 + 50 + 60 * boxes.length) {
            
            let newBox = createInput("");
            newBox.size(340);
            newBox.position(width/2 - 160, height/4 + 35 + boxes.length * 60);
            newBox.addClass("textbox");
            
            boxes.push(newBox);
        }

        else if(boxes.length >= 2 && mouseX > width/2 + 10 && mouseX < width/2 + 10 + 180
            && mouseY > height/4 + 40 + 60 * boxes.length && mouseY < height/4 + 40 + 50 + 60 * boxes.length) {
            
            players = [];
            for(let i = 0; i < boxes.length; i++) {
                players.push(boxes[i].value());
                boxes[i].hide();
            }
            timeBox.hide();
            
            initTime = Number.parseInt(timeBox.value()) * 1000;

            transitionStartTime = millis();

            scene = "transition";
        } else {

            for(let i = 0; i < boxes.length; i++) {
                let shift = height/4 + 3 + 60 * (i+1);

                let distX = mouseX - (width/2 - 185 + 5);
                let distY = mouseY - (-5 + shift);
                
                if(distX * distX + distY * distY < 13 * 12) {
                    boxes[i].remove();
                    boxes.splice(i, 1);

                    for(let j = 0; j < boxes.length; j++) {
                        boxes[j].position(width/2 - 160, height/4 + 35 + j * 60);
                    }

                    break;
                }
            }
        }
    } else if(scene == "win") {
        if(mouseX > width/2 - 210 && mouseX < width/2 - 210 + 190
            && mouseY > height/4 + 270 && mouseY < height/4 + 270 + 50) { 
            scene = "transition";
            transitionStartTime = millis();
        }
        
        else if(mouseX > width/2 && mouseX < width/2 + 190
            && mouseY > height/4 + 270 && mouseY < height/4 + 270 + 50) {
            scene = "title";

            for(let i = 0; i < boxes.length; i++) boxes[i].show();
            timeBox.show();
        }
    }
}
