const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanRightFrames = document.getElementById("animationright");
const pacmanLeftFrames = document.getElementById("animationleft");
const pacmanUpFrames = document.getElementById("animationup");
const pacmanDownFrames = document.getElementById("animationdown");
const pacmanStopFrames = document.getElementById("animationstop");


const ghostFrames = document.getElementById("enemy");

const walls = document.getElementById("walls");
const grounds = document.getElementById("ground");
const tunnel = document.getElementById("tunnel");
const speed = document.getElementById("speed");
const key = document.getElementById("key");
const finish = document.getElementById("finish");

const DIRECTION_IDLE = 0;
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Game variables
let fps = 30;
let pacman;
let oneBlockSize = 30;
let foodColor = "#FEB897";

let score = 0;
let keys = 3;
let lives = 1;

let ghosts = [];
let ghostCount = 1;
let ghostImageLocations = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 200, y: 0 },
  { x: 300, y: 0 },
];

let map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 4, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 6, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 2, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1],
  [1, 7, 1, 2, 1, 2, 1, 1, 1, 5, 2, 2, 2, 1, 1, 1, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1],
  [1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
  [1, 2, 2, 2, 1, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 6, 2, 2, 2, 5, 1, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 1],
  [1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const teleport_positions = [
  {
    origin: [-1, 10],
    target: [20, 10],
  },
  {
    origin: [1, 15],
    target: [20, 10],
  },
  {
    origin: [20, 10],
    target: [0, 10],
  },
];

let randomTargetsForGhosts = [
  { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
  { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
  { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
  {
    x: (map[0].length - 2) * oneBlockSize,
    y: (map.length - 2) * oneBlockSize,
  },
];

let createNewPacman = () => {
  pacman = new Pacman(
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize / 6
  );
};

let gameLoop = () => {
  update();
  if (lives == 0) {
    return;
  }
  draw();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let restartPacmanAndGhosts = () => {
  createNewPacman();
  createGhosts();
};

// for (let i = 0; i < map.length; i++) {
//     for (let j = 0; j < map[0].length; j++) {
//         map[i][j] = 2;
//     }
// }

let onGhostCollision = () => {
  lives--;
  restartPacmanAndGhosts();
  if (lives == 0) {
    clearInterval(gameInterval);
    gameOver();
  }
};

let update = () => {
  // todo
  pacman.moveProcess();
  pacman.eat();
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].moveProcess();
  }
  if (pacman.checkGhostCollision(ghosts)) {
    onGhostCollision();
  }
  checkKey();
};

let drawFoods = () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] == 2) {
        createRect(
          j * oneBlockSize + oneBlockSize / 3,
          i * oneBlockSize + oneBlockSize / 3,
          oneBlockSize / 3,
          oneBlockSize / 3,
          foodColor
        );
      }
    }
  }
};

let drawScore = () => {
  canvasContext.font = "20px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Score: " + score, 0, oneBlockSize * (map.length + 1));
};

let drawGhosts = () => {
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].draw();
  }
};

let draw = () => {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  createRect(0, 0, canvas.width, canvas.height, "black");
  drawWalls();
  drawGround();
  // drawFoods();
  drawGhosts();
  pacman.draw();
  drawScore();
  // drawRemainingLives();
};

let createRect = (x, y, width, height, img) => {
  canvasContext.fillStyle = img;
  canvasContext.fillRect(x, y, width, height);
};

let gameOver = () => {
  if(!checkGameOver){
    checkGameOver = true;
    drawGameOver();
    clearInterval(gameInterval);
  }
};

let checkGameOver = false;
let drawGameOver = () => {
    canvasContext.font = "40px Emulogic";
    canvasContext.fillStyle = "white";
    let text = "Game Over!";
    let metrics = canvasContext.measureText(text);
    let textWidth = metrics.width;
    let textHeight =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    console.log("Height", textHeight);
    canvasContext.fillText(
        text,
        canvasWidth / 2 - textWidth / 2,
        canvasWidth / 2 + textHeight / 2
    );
};

let drawRemainingLives = () => {
  canvasContext.font = "20px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Lives: ", 220, oneBlockSize * (map.length + 1));

  for (let i = 0; i < lives; i++) {
    canvasContext.drawImage(
      pacmanRightFrames,
      2 * oneBlockSize,
      0,
      oneBlockSize,
      oneBlockSize,
      350 + i * oneBlockSize,
      oneBlockSize * map.length + 2,
      oneBlockSize,
      oneBlockSize
    );
  }
};

let drawGround = () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      switch (map[i][j]) {
        case 2:
          canvasContext.drawImage(
            grounds,
            j * oneBlockSize,
            i * oneBlockSize,
            oneBlockSize,
            oneBlockSize
          );
          break;
        case 3:
          canvasContext.drawImage(
            grounds,
            j * oneBlockSize,
            i * oneBlockSize,
            oneBlockSize,
            oneBlockSize
          );
          break;
        case 4:
          canvasContext.drawImage(
            speed,
            j * oneBlockSize,
            i * oneBlockSize,
            oneBlockSize,
            oneBlockSize
          );
          break;
        case 5:
          canvasContext.drawImage(
            tunnel,
            j * oneBlockSize,
            i * oneBlockSize,
            oneBlockSize,
            oneBlockSize
          );
          break;
        case 6:
          canvasContext.drawImage(
            key,
            j * oneBlockSize,
            i * oneBlockSize,
            oneBlockSize,
            oneBlockSize
          );
          break;
        case 7:
          canvasContext.drawImage(
            finish,
            j * oneBlockSize,
            i * oneBlockSize,
            oneBlockSize,
            oneBlockSize
          );
          break;
      }
    }
  }
};

let drawWalls = () => {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] == 1) {
        canvasContext.drawImage(
          walls,
          j * oneBlockSize,
          i * oneBlockSize,
          oneBlockSize,
          oneBlockSize
        );
      }
    }
  }
};

let createGhosts = () => {
    ghosts = [];
    // for (let i = 0; i < ghostCount; i++) {
        let newGhost1 = new Ghost(
            9 * oneBlockSize,
            1 * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            oneBlockSize / 6,
            ghostImageLocations[0].x,
            ghostImageLocations[0].y,
            100,
            100,
            3,
            [
                {
                    x: 6 * oneBlockSize,
                    y: 1 * oneBlockSize
                },
                {
                    x: 9 * oneBlockSize,
                    y: 1 * oneBlockSize
                }
            ]
        );
        let newGhost2 = new Ghost(
            9 * oneBlockSize,
            10 * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            oneBlockSize / 6,
            ghostImageLocations[1].x,
            ghostImageLocations[1].y,
            100,
            100,
            3,

            [
                {
                    x: 7 * oneBlockSize,
                    y: 10 * oneBlockSize
                },
                {
                    x: 15 * oneBlockSize,
                    y: 10 * oneBlockSize
                },
                {
                    x: 15 * oneBlockSize,
                    y: 15 * oneBlockSize
                },
                {
                    x: 7 * oneBlockSize,
                    y: 15 * oneBlockSize
                }

            ]
        );
        let newGhost3 = new Ghost(
            13 * oneBlockSize,
            21 * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            3,
            ghostImageLocations[2].x,
            ghostImageLocations[2].y,
            100,
            100,
            oneBlockSize / 6,
            [
                {
                    x: 10 * oneBlockSize,
                    y: 21 * oneBlockSize
                },
                {
                    x: 13 * oneBlockSize,
                    y: 21 * oneBlockSize
                }
            ]

        );
        ghosts.push(newGhost1, newGhost2, newGhost3);
    // }
};

let checkKey = () => {
  if (keys == 0) {
    map[1][1] = 7;
  }
};

createNewPacman();
createGhosts();
gameLoop();

window.addEventListener("keydown", (event) => {
  let k = event.keyCode;

  setTimeout(() => {
    if (k == 37 || k == 65) {
      //left
      pacman.nextDirection = DIRECTION_LEFT;
    } else if (k == 39 || k == 68) {
      //right
      pacman.nextDirection = DIRECTION_RIGHT;
    } else if (k == 38 || k == 87) {
      //up
      pacman.nextDirection = DIRECTION_UP;
    } else if (k == 40 || k == 83) {
      //bottom
      pacman.nextDirection = DIRECTION_BOTTOM;
    }
  }, 1);
});

let gamePaused = false;

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    gamePause();
  } 
});


let gameContinue = () => {
  if (gamePaused) {
    gamePaused = false;
    gameInterval = setInterval(gameLoop,1000 / fps);
  }
};

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    gameContinue();
  }
});


let gamePause = () => {
  if (!gamePaused && !checkGameOver ) {
    gamePaused = true;
    drawGamePaused();
    clearInterval(gameInterval);
  }
};

let drawGamePaused = () => {
  canvasContext.font = "40px Emulogic";
    canvasContext.fillStyle = "white";
    let text1 = "Paused!";
    let metrics1 = canvasContext.measureText(text1);
    let textWidth1 = metrics1.width;
    let textHeight1 =
        metrics1.actualBoundingBoxAscent + metrics1.actualBoundingBoxDescent;
    console.log("Height", textHeight1);
    canvasContext.fillText(
        text1,
        canvasWidth / 2 - textWidth1 / 2,
        canvasWidth / 2 + textHeight1 / 2 - textHeight1 * 1.1
    );
    canvasContext.font = "30px Emulogic";
    canvasContext.fillStyle = "white";
    let text2 = "Press ENTER to continue";
    let metrics2 = canvasContext.measureText(text2);
    let textWidth2 = metrics2.width;
    let textHeight2 =
        metrics2.actualBoundingBoxAscent + metrics2.actualBoundingBoxDescent;
    console.log("Height", textHeight2);
    canvasContext.fillText(
        text2,
        canvasWidth / 2 - textWidth2 / 2,
        canvasWidth / 2 + textHeight2 / 2
    );
};
