const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animation");
const ghostFrames = document.getElementById("ghosts");

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

canvas.style.margin = 0;

//Check status to run game or not
let startLvlStatus = false;
let canvasLvlStatus = false;
let failLvlStatus = false;
let completLvlStatus = false;

let startLvl = document.getElementById("start");
let canvasLvl = document.getElementById("canvas");
let failLvl = document.getElementById("game-over");
let completLvl = document.getElementById("game-pass");

// Game variables
let fps = 30;
let pacman;
let oneBlockSize = 30;
let foodColor = "#FEB897";

let teleStatus = true;
let teleCountDownTime = 3000;
let speedBoostDuration;

let score = 0;
let keys = 3;
let lives = 1;

let ghosts = [];
let ghostCount = 1;
let ghostImageLocations = [
  { x: 1, y: 0 },
  { x: 176, y: 0 },
  { x: 1, y: 121 },
  { x: 176, y: 121 },
];

const map = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //00
  [1, 2, 6, 6, 6, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 4, 2, 1], //01
  [1, 2, 1, 1, 1, 1, 1, 4, 1, 1, 5, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1], //02
  [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 6, 2, 2, 2, 2, 2, 1], //03
  [1, 2, 1, 2, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1], //04
  [1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1], //05
  [1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1], //06
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1], //07
  [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 4, 1], //08
  [1, 2, 1, 2, 1, 2, 1, 1, 1, 5, 2, 2, 2, 1, 1, 1, 1, 2, 1, 2, 1], //09
  [1, 4, 1, 2, 1, 2, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1], //10
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1], //11
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1], //12
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1], //13
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1], //14
  [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 1, 2, 1], //15
  [1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1], //16
  [1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1], //17
  [1, 2, 2, 2, 1, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1], //18
  [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 6, 2, 2, 2, 5, 1, 2, 1], //19
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 1], //20
  [1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 4, 2, 2, 1], //21
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //22
];

const baseMap = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //00
  [1, 2, 6, 6, 6, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 4, 2, 1], //01
  [1, 2, 1, 1, 1, 1, 1, 4, 1, 1, 5, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1], //02
  [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 6, 2, 2, 2, 2, 2, 1], //03
  [1, 2, 1, 2, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1], //04
  [1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1], //05
  [1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1], //06
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1], //07
  [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 4, 1], //08
  [1, 2, 1, 2, 1, 2, 1, 1, 1, 5, 2, 2, 2, 1, 1, 1, 1, 2, 1, 2, 1], //09
  [1, 4, 1, 2, 1, 2, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1], //10
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1], //11
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1], //12
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1], //13
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1], //14
  [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 1, 2, 1], //15
  [1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1], //16
  [1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1], //17
  [1, 2, 2, 2, 1, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1], //18
  [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 6, 2, 2, 2, 5, 1, 2, 1], //19
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 1], //20
  [1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 4, 2, 2, 1], //21
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //22
];

//start game status
let startGame = () => {
  startLvl.style.display = "none";
  canvasLvl.style.display = "block";
  failLvl.style.display = "none";
  completLvl.style.display = "none";

  canvasLvlStatus = true;
  failLvlStatus = false;

  score = 0;
  keys = 3;
  lives = 1;

  if (failLvlStatus) {
    start();
  } else {
    start();
  }
};
let start = () => {
  createNewPacman();
  createGhosts();
  gameLoop();
};

//game over status
let gameOver = () => {
  canvasLvlStatus = false;
  failLvlStatus = true;

  drawGameOver();
  clearInterval(gameInterval);

  setTimeout(() => {
    startLvl.style.display = "none";
    canvasLvl.style.display = "none";
    failLvl.style.display = "block";
    completLvl.style.display = "none";
  }, 3000);
};
let resetGame = () => {
  addMap();
  deleteGhost();
  deletePacman();

  startGame();
};
let returnMenu = () => {
  startLvl.style.display = "block";
  canvasLvl.style.display = "none";
  failLvl.style.display = "none";
  completLvl.style.display = "none";
};

let gamePass = () => {};

const teleport_positions = [];

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
    oneBlockSize * 1.5,
    oneBlockSize * 1.5,
    oneBlockSize / 2
  );
};
let deletePacman = () => {
  canvasContext.clearRect(
    pacman.x - pacman.radius,
    pacman.y - pacman.radius,
    pacman.radius * 2,
    pacman.radius * 2
  );
};

let gameLoop = () => {
  if (canvasLvlStatus) {
    update();
    if (lives == 0) {
      return;
    }
    draw();
  }
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let restartPacmanAndGhosts = () => {
  createNewPacman();
  createGhosts();
};

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
  console.log("ghostCount: " + ghostCount);
  pacman.moveProcess();
  pacman.eat();
  pacman.teleport();
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].moveProcess();
  }
  if (pacman.checkGhostCollision(ghosts)) {
    onGhostCollision();
    gameOver();
  }
  checkKey();
  if (pacman.isPass()) {
    missionSuccess();
  }
  //   checkSpeedUpTime();
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
  drawFoods();
  drawGhosts();
  pacman.draw();
  drawScore();
  // drawRemainingLives();
};

let createRect = (x, y, width, height, img) => {
  canvasContext.fillStyle = img;
  canvasContext.fillRect(x, y, width, height);
};

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

  // document.getElementById("game-over").addEventListener("click", resetGame);
};
let drawGamePass = () => {
  canvasContext.font = "40px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("NGU!", 110, 240);
};

let drawRemainingLives = () => {
  canvasContext.font = "20px Emulogic";
  canvasContext.fillStyle = "white";
  canvasContext.fillText("Lives: ", 220, oneBlockSize * (map.length + 1));

  for (let i = 0; i < lives; i++) {
    canvasContext.drawImage(
      pacmanFrames,
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
  for (let i = 0; i < ghostCount; i++) {
    let newGhost1 = new Ghost(
      9 * oneBlockSize,
      1 * oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      pacman.speed / 2,
      ghostImageLocations[0].x,
      ghostImageLocations[0].y,
      124,
      116,
      6 + i
    );
    let newGhost2 = new Ghost(
      9 * oneBlockSize,
      10 * oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      pacman.speed / 2,
      ghostImageLocations[1].x,
      ghostImageLocations[1].y,
      124,
      116,
      6 + i
    );
    let newGhost3 = new Ghost(
      13 * oneBlockSize,
      21 * oneBlockSize,
      oneBlockSize,
      oneBlockSize,
      pacman.speed / 2,
      ghostImageLocations[2].x,
      ghostImageLocations[2].y,
      124,
      116,
      6 + i
    );
    ghosts.push(newGhost1, newGhost2, newGhost3);
  }
};
let deleteGhost = () => {
  ghosts.length = 0;
};

let checkKey = () => {
  if (keys == 0) {
    map[1][1] = 7;
  }
};

let missionSuccess = () => {
  var completed = document.getElementById("game-pass");
  lives--;
  restartPacmanAndGhosts();
  if (lives == 0) {
    clearInterval(gameInterval);
    gamePass();
  }
};

let addMap = () => {
  map.length = 0;
  for (let i = 0; i < baseMap.length; i++) {
    map.push([...baseMap[i]]);
  }
};

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
