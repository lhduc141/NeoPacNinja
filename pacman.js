class Pacman {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = DIRECTION_IDLE;
    this.nextDirection = DIRECTION_IDLE;
    this.frameCount = 4;
    this.currentFrame = 1;
    setInterval(() => {
      this.changeAnimation();
    }, 100);
  }

  moveProcess() {
    let cellX = Math.floor(this.x / oneBlockSize);
    let cellY = Math.floor(this.y / oneBlockSize);
    for (let i = 0; i < teleport_positions.length; i++) {
      if (
        cellX == teleport_positions[i].origin[0] &&
        cellY == teleport_positions[i].origin[1]
      ) {
        this.x = teleport_positions[i].target[0] * oneBlockSize;
        this.y = teleport_positions[i].target[1] * oneBlockSize;
        break;
      }
    }
    this.changeDirectionIfPossible();
    this.moveForwards();
    if (this.checkCollisions()) {
      this.moveBackwards();
      return;
    }
  }

  eat() {
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
        //eat point
        if (map[i][j] == 2 && this.getMapX() == j && this.getMapY() == i) {
          map[i][j] = 3;
          score++;
        }
        //speed
        if (map[i][j] == 4 && this.getMapX() == j && this.getMapY() == i) {
          map[i][j] = 2;
          this.speed = oneBlockSize / 5;
          speedBoostDuration = 500;
        }
        //key
        if (map[i][j] == 6 && this.getMapX() == j && this.getMapY() == i) {
          map[i][j] = 2;
          keys--;
        }
      }

      if (speedBoostDuration > 0) {
        speedBoostDuration -= 1;
      } else {
        this.speed = oneBlockSize / 10;
      }
    }
  }

  teleport() {
    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
        if (map[i][j] == 5 && this.getMapX() == j && this.getMapY() == i) {
          if (teleStatus == true) {
            switch (true) {
              case i == 4 && j == 4:
                this.x = 17 * oneBlockSize;
                this.y = 19 * oneBlockSize;
                break;
              case i == 19 && j == 17:
                this.x = 4 * oneBlockSize;
                this.y = 4 * oneBlockSize;
                break;
              case i == 2 && j == 10:
                this.x = 8 * oneBlockSize;
                this.y = 8 * oneBlockSize;
                break;
              case i == 8 && j == 8:
                this.x = 10 * oneBlockSize;
                this.y = 2 * oneBlockSize;
                break;
            }
            this.countDownTele();
          }
        }
      }
    }
  }
  countDownTele() {
    teleStatus = false;
    setTimeout(() => {
      teleStatus = true;
    }, 1500);
    // this.countDownTele();
  }

  moveBackwards() {
    switch (this.direction) {
      case DIRECTION_RIGHT: // Right
        this.x -= this.speed;
        break;
      case DIRECTION_UP: // Up
        this.y += this.speed;
        break;
      case DIRECTION_LEFT: // Left
        this.x += this.speed;
        break;
      case DIRECTION_BOTTOM: // Bottom
        this.y -= this.speed;
        break;
    }
  }

  moveForwards() {
    switch (this.direction) {
      case DIRECTION_RIGHT: // Right
        this.x += this.speed;
        break;
      case DIRECTION_UP: // Up
        this.y -= this.speed;
        break;
      case DIRECTION_LEFT: // Left
        this.x -= this.speed;
        break;
      case DIRECTION_BOTTOM: // Bottom
        this.y += this.speed;
        break;
    }
  }

  checkCollisions() {
    let isCollided = false;
    if (
      map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize)] 
        == 1 ||
      map[parseInt(this.y / oneBlockSize + 0.9999)][
        parseInt(this.x / oneBlockSize)
      ] == 1 ||
      map[parseInt(this.y / oneBlockSize)][
        parseInt(this.x / oneBlockSize + 0.9999)
      ] == 1 ||
      map[parseInt(this.y / oneBlockSize + 0.9999)][
        parseInt(this.x / oneBlockSize + 0.9999)
      ] == 1
    ) {
      isCollided = true;
    }
    return isCollided;
  }

  checkGhostCollision(ghosts) {
    for (let i = 0; i < ghosts.length; i++) {
      let ghost = ghosts[i];
      if (
        ghost.getMapX() == this.getMapX() &&
        ghost.getMapY() == this.getMapY()
      ) {
        return true;
      }
    }
    return false;
  }

  changeDirectionIfPossible() {
    if (this.direction == this.nextDirection) return;
    let tempDirection = this.direction;
    this.direction = this.nextDirection;
    this.moveForwards();
    if (this.checkCollisions()) {
      this.moveBackwards();
      this.direction = tempDirection;
    } else {
      this.moveBackwards();
    }
  }

  getMapX() {
    let mapX = parseInt(this.x / oneBlockSize);
    return mapX;
  }

  getMapY() {
    let mapY = parseInt(this.y / oneBlockSize);

    return mapY;
  }

  getMapXRightSide() {
    let mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
    return mapX;
  }

  getMapYRightSide() {
    let mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
    return mapY;
  }

  changeAnimation() {
    this.currentFrame =
      this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
  }

  draw() {
    canvasContext.save();
    canvasContext.translate(
      this.x + oneBlockSize / 2,
      this.y + oneBlockSize / 2
    );
    // canvasContext.rotate((this.direction * 90 * Math.PI) / 180);
    canvasContext.translate(
      -this.x - oneBlockSize / 2,
      -this.y - oneBlockSize / 2
    );

    let spriteSheet;
    switch (this.direction) {
      case DIRECTION_RIGHT:
        spriteSheet = pacmanRightFrames;
        break;
      case DIRECTION_UP:
        spriteSheet = pacmanUpFrames;
        break;
      case DIRECTION_LEFT:
        spriteSheet = pacmanLeftFrames;
        break;
      case DIRECTION_BOTTOM:
        spriteSheet = pacmanDownFrames;
        break;
      default:
        spriteSheet = pacmanStopFrames; // Default to right direction
        break;
    }

    canvasContext.drawImage(
      spriteSheet,
      (this.currentFrame - 1) * 18,
      0,
      16,
      26,
      this.x,
      this.y,
      this.width,
      this.height
    );
    canvasContext.restore();
  }

  onDoor() {
    if (map[1][1] == 7 && this.x == 30 && this.y == 30) {
      return true;

    }
    return false;
  }
  isHidden(){
    let x1 = this.x;
    let y1 = this.y;
    let x2 = this.x + this.width;
    let y2 = this.y + this.height;
    for(let i = 0; i < hiddenRoom.length; i++){
      let roomX1 = oneBlockSize * hiddenRoom[i].x;
      let roomY1 = oneBlockSize * hiddenRoom[i].y;
      let roomX2 = roomX1 + oneBlockSize;
      let roomY2 = roomY1 + oneBlockSize;
      if(Math.min(x2, roomX2) > (Math.max(x1, roomX1) + oneBlockSize / 2) &&
          Math.min(y2,roomY2) > (Math.max(x1, roomX1) + oneBlockSize / 2)
        ){
          return true;
        }
    }
    return false;
  }

}
