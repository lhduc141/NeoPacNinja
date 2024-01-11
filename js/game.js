//DOM variable
const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");

//Image DOM
const ninjaRightFrames = document.getElementById("animationright");
const ninjaLeftFrames = document.getElementById("animationleft");
const ninjaUpFrames = document.getElementById("animationup");
const ninjaDownFrames = document.getElementById("animationdown");
const ninjaStopFrames = document.getElementById("animationstop");
const enemyFrames = document.getElementById("enemy");

//MAP DOM
const walls = document.getElementById("walls");
const grounds = document.getElementById("ground");
const tunnel = document.getElementById("tunnel");
const speed = document.getElementById("speed");
const key = document.getElementById("key");
const finish = document.getElementById("finish");
const hidden = document.getElementById("hidden");

//Game status DOM
let startLvl = document.getElementById("start");
let tutorial = document.getElementById("tutorial");
let backToMenu = document.getElementById("back");
let canvasLvl = document.getElementById("canvas");
let failLvl = document.getElementById("game-over");
let completLvl = document.getElementById("game-pass");
let leaderboardLvl = document.getElementById("leaderboard");
let time = document.getElementById("timer");

const DIRECTION_IDLE = 0;
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

canvas.style.margin = 0;

let checkGamePlay = false;
let checkGameOver = false;
let checkGamePass = false;
let gameWin = false;
let gamePaused = false;

// Game variables
let fps = 30;
let ninja;
let oneBlockSize = 30;
let foodColor = "#FEB897";

let teleStatus = true;
let teleCountDownTime = 3000;
let speedBoostDuration;

let score = 0;
let keys = 3;
let lives = 1;

let enemies = [];
let enemyCount = 1;
let enemyImageLocations = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 200, y: 0 },
  { x: 300, y: 0 },
];

let playerList = [];
let playerName = document.getElementById("player-name");

let timerVar;
let totalSeconds = 0;

const map = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //00
  [1, 2, 2, 2, 6, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 4, 2, 1], //01
  [1, 2, 1, 1, 1, 1, 1, 4, 1, 1, 5, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1], //02
  [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 6, 2, 2, 2, 2, 2, 1], //03
  [1, 2, 1, 2, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1], //04
  [1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1], //05
  [1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1], //06
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1], //07
  [1, 2, 2, 2, 2, 2, 8, 1, 5, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 4, 1], //08
  [1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 1, 2, 1], //09
  [1, 4, 1, 2, 1, 2, 1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1], //10
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1], //11
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1], //12
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 2, 1], //13
  [1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1], //14
  [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 1, 2, 1], //15
  [1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1], //16
  [1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1], //17
  [1, 2, 2, 2, 1, 2, 1, 1, 1, 1, 2, 2, 8, 1, 1, 1, 1, 1, 1, 2, 1], //18
  [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 6, 2, 2, 2, 5, 1, 2, 1], //19
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 2, 1], //20
  [1, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 4, 2, 2, 1], //21
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], //22
];

//start -> game
let startGame = () => {
  startLvl.style.display = "none";
  canvasLvl.style.display = "block";
  failLvl.style.display = "none";
  completLvl.style.display = "none";
  time.style.display = "block";

  checkGamePlay = true;
  // addPlayer(playerName, score);

  if (checkGameOver) {
    setInterval(gameLoop, 1000 / fps);
    start();
    checkGameOver = false;
  } else {
    start();
  }
  let audio = new Audio("/music/start.mp3");
  audio.play();

  timerVar = setInterval(countTimer, 1000);
};
let start = () => {
  createNewNinja();
  createEnemies();
  gameLoop();
};
function countTimer() {
  ++totalSeconds;
  var hour = Math.floor(totalSeconds / 3600);
  var minute = Math.floor((totalSeconds - hour * 3600) / 60);
  var seconds = totalSeconds - (hour * 3600 + minute * 60);
  if (hour < 10) hour = "0" + hour;
  if (minute < 10) minute = "0" + minute;
  if (seconds < 10) seconds = "0" + seconds;
  document.getElementById(
    "timer"
  ).innerHTML = `Your time: ${hour}:${minute}:${seconds}`;
}

//Tutorial
let tutorialRule = () => {
  tutorial.style.display = "block";
  startLvl.style.display = "none";
};

//back button
let back = () => {
  tutorial.style.display = "none";
  startLvl.style.display = "block";
  leaderboardLvl.style.display = "none";
  time.style.display = "none";
};

//game over status
let gameOver = () => {
  checkGamePlay = false;
  checkGameOver = true;

  playerName = document.getElementById("player-name").value;

  if (!checkGameOver) {
    checkGameOver = true;
    drawGameOver();
    clearInterval(gameInterval);
  }

  clearInterval(timerVar);
  //   addPlayer(playerName, totalSeconds);

  setTimeout(() => {
    startLvl.style.display = "none";
    canvasLvl.style.display = "none";
    failLvl.style.display = "block";
    completLvl.style.display = "none";
    time.style.display = "none";
  }, 500);
};

//leaderBoard
let addPlayer = (name, score) => {
  let newPlayer = new Player();
  newPlayer.name = name;
  newPlayer.score = score;

  playerList.push(newPlayer);

  playerOnLocalStorage("playerList", playerList);
};
let playerOnLocalStorage = (key, value) => {
  var stringValue = JSON.stringify(value);
  localStorage.setItem(key, stringValue);
};
let inputLocalStorage = (key) => {
  var dataLocal = localStorage.getItem("playerList");
  // kiểm tra xem dữ liệu lấy về có hay không
  if (dataLocal) {
    // xử lí hành động khi lấy được dữ liệu
    var convertData = JSON.parse(dataLocal);
    playerList = convertData;
  } else {
    // xử lí hành động khi không có dữ liệu để lấy
  }
};
inputLocalStorage();

//leaderboard
let leaderboard = () => {
  startLvl.style.display = "none";
  canvasLvl.style.display = "none";
  failLvl.style.display = "none";
  completLvl.style.display = "none";
  leaderboardLvl.style.display = "block";

  // console.log(playerList);

  playerList.sort((a, b) => a.score - b.score);
  var content = "";

  for (var i = 1; i < 11; i++) {
    try {
      var playerCur = playerList[i - 1];

      if (playerCur) {
        content += `
          <tr>
            <td>${i}</td>
            <td>${playerCur.name}</td>
            <td>${playerCur.score} s</td>
          </tr>
        `;
      } else {
        content += `
          <tr>
            <td>${i}</td>
            <td></td>
            <td></td>
          </tr>
        `;
      }
    } catch (error) {
      console.error("Error while processing player", i, error);
    }

    document.getElementById("tbodyPlayer").innerHTML = content;
  }
};

//return menu button
let returnMenu = () => {
  startLvl.style.display = "block";
  canvasLvl.style.display = "none";
  failLvl.style.display = "none";
  completLvl.style.display = "none";
  time.style.display = "none";

  setTimeout(() => {
    document.location.reload();
  }, 0);
};

const teleport_positions = [];

let randomTargetsForEnemy = [
  { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
  { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
  { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
  {
    x: (map[0].length - 2) * oneBlockSize,
    y: (map.length - 2) * oneBlockSize,
  },
];

let hiddenRoom = [
  {
    x: 6,
    y: 8,
  },
  {
    x: 12,
    y: 18,
  },
];

let gameLoop = () => {
  if (lives == 0) return;
  if (checkGamePlay) {
    update();
    if (lives == 0) {
      return;
    }
    draw();
  }
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let restartNinjaAndEnemies = () => {
  createNewNinja();
  createEnemies();
};

let onEnemyCollision = () => {
  lives--;
  restartNinjaAndEnemies();
  if (lives == 0) {
    clearInterval(gameInterval);
    gameOver();
  }
};

let update = () => {
  // todo
  ninja.moveProcess();
  ninja.eat();
  ninja.teleport();
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].moveProcess();
  }
  if (ninja.checkEnemiesCollision(enemies)) {
    onEnemyCollision();
  }
  checkKey();

  if (ninja.onDoor()) {
    gamePass();
  }
};

//Hidden door
let checkKey = () => {
  if (keys == 0) {
    map[13][11] = 7;
  }
};

//Game Pass
let gamePass = () => {
  if (!gameWin) {
    gameWin = true;
    clearInterval(gameInterval);
  }
  playerName = document.getElementById("player-name").value;

  clearInterval(timerVar);
  addPlayer(playerName, totalSeconds);
  setTimeout(() => {
    startLvl.style.display = "none";
    canvasLvl.style.display = "none";
    failLvl.style.display = "none";
    completLvl.style.display = "block";
    time.style.display = "none";
  }, 1500);
};

//Game pause
let gameContinue = () => {
  if (gamePaused) {
    gamePaused = false;
    gameInterval = setInterval(gameLoop, 1000 / fps);
    timerVar = setInterval(countTimer, 1000);
  }
};

let gamePause = () => {
  if (!gamePaused && !checkGameOver) {
    gamePaused = true;
    drawGamePaused();
    clearInterval(timerVar);
    clearInterval(gameInterval);
  }
};

//draw
let draw = () => {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  createRect(0, 0, canvas.width, canvas.height, "black");
  drawWalls();
  drawGround();
  drawEnemies();
  ninja.draw();
  if (gameWin) {
    drawGamePass();
  }
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
let drawEnemies = () => {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].draw();
  }
};

let createRect = (x, y, width, height, img) => {
  canvasContext.fillStyle = img;
  canvasContext.fillRect(x, y, width, height);
};

let drawGameOver = () => {
  canvasContext.font = "40px Pixelify Sans";
  canvasContext.fillStyle = "white";
  let text = "Game Over!";
  let metrics = canvasContext.measureText(text);
  let textWidth = metrics.width;
  let textHeight =
    metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  canvasContext.fillText(
    text,
    canvasWidth / 2 - textWidth / 2,
    canvasWidth / 2 + textHeight / 2
  );
};
let drawGamePass = () => {
  canvasContext.font = "40px Pixelify Sans";
  canvasContext.fillStyle = "white";
  let text = "Congratulation!";
  let metrics = canvasContext.measureText(text);
  let textWidth = metrics.width;
  let textHeight =
    metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
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
      ninjaRightFrames,
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
        case 8:
          canvasContext.drawImage(
            hidden,
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
      if (map[i][j] == 1 || map[i][j] == 8) {
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

//Create Entities
let createNewNinja = () => {
  ninja = new Ninja(
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize / 10
  );
};
let createEnemies = () => {
  enemies = [];
  let newEnemy1 = new Enemy(
    9 * oneBlockSize,
    1 * oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize / 10,
    enemyImageLocations[0].x,
    enemyImageLocations[0].y,
    100,
    100,
    4,
    [
      {
        x: 6 * oneBlockSize,
        y: 1 * oneBlockSize,
      },
      {
        x: 9 * oneBlockSize,
        y: 1 * oneBlockSize,
      },
    ]
  );
  let newEnemy2 = new Enemy(
    9 * oneBlockSize,
    10 * oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize / 10,
    enemyImageLocations[1].x,
    enemyImageLocations[1].y,
    100,
    100,
    4,

    [
      {
        x: 7 * oneBlockSize,
        y: 10 * oneBlockSize,
      },
      {
        x: 15 * oneBlockSize,
        y: 10 * oneBlockSize,
      },
      {
        x: 15 * oneBlockSize,
        y: 15 * oneBlockSize,
      },
      {
        x: 7 * oneBlockSize,
        y: 15 * oneBlockSize,
      },
    ]
  );
  let newEnemy3 = new Enemy(
    13 * oneBlockSize,
    21 * oneBlockSize,
    oneBlockSize,
    oneBlockSize,
    oneBlockSize / 10,
    enemyImageLocations[2].x,
    enemyImageLocations[2].y,
    100,
    100,
    4,
    [
      {
        x: 10 * oneBlockSize,
        y: 21 * oneBlockSize,
      },
      {
        x: 13 * oneBlockSize,
        y: 21 * oneBlockSize,
      },
    ]
  );
  enemies.push(newEnemy1, newEnemy2, newEnemy3);
  // }
};

let drawGamePaused = () => {
  canvasContext.font = "40px Pixelify Sans";
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
    canvasWidth / 2 + textHeight1 / 2 + textHeight1 * 0.2
  );
  canvasContext.font = "20px Pixelify Sans";
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
    canvasWidth / 2 + textHeight2 / 2 + textHeight2 * 2.5
  );
};

//Keyboard Input
window.addEventListener("keydown", (event) => {
  let k = event.keyCode;
  setTimeout(() => {
    if (k == 37 || k == 65) {
      //left
      ninja.nextDirection = DIRECTION_LEFT;
    } else if (k == 39 || k == 68) {
      //right
      ninja.nextDirection = DIRECTION_RIGHT;
    } else if (k == 38 || k == 87) {
      //up
      ninja.nextDirection = DIRECTION_UP;
    } else if (k == 40 || k == 83) {
      //bottom
      ninja.nextDirection = DIRECTION_BOTTOM;
    }
  }, 1);
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    gamePause();
  } else if (e.key === "Enter") {
    gameContinue();
  }
});
