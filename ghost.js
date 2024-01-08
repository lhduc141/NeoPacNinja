class Ghost {
  constructor(
    x,
    y,
    width,
    height,
    speed,
    imageX,
    imageY,
    imageWidth,
    imageHeight,
    range
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = DIRECTION_RIGHT;
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageHeight = imageHeight;
    this.imageWidth = imageWidth;
    this.range = range;
    this.randomTargetIndex = parseInt(Math.random() * 4);
    this.target = randomTargetsForGhosts[this.randomTargetIndex];
    setInterval(() => {
      this.changeRandomDirection();
    }, 10000);
  }

  isInRange() {
    let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
    let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
    if (
      Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range
    ) {
      return true;
    }
    return false;
  }

  changeRandomDirection() {
    let addition = 1;
    this.randomTargetIndex += addition;
    this.randomTargetIndex = this.randomTargetIndex % 4;
  }

  moveProcess() {
    if (this.isInRange()) {
      this.target = pacman;
    } else {
      this.target = randomTargetsForGhosts[this.randomTargetIndex];
    }
    this.changeDirectionIfPossible();
    if (this.direction !== undefined) {
      this.moveForwards();
      if (this.checkCollisions()) {
        this.moveBackwards();
      }
    }
  }

  moveBackwards() {
    switch (this.direction) {
      case 4: // Right
        this.x -= this.speed;
        break;
      case 3: // Up
        this.y += this.speed;
        break;
      case 2: // Left
        this.x += this.speed;
        break;
      case 1: // Bottom
        this.y -= this.speed;
        break;
    }
  }

  moveForwards() {
    switch (this.direction) {
      case 4: // Right
        this.x += this.speed;
        break;
      case 3: // Up
        this.y -= this.speed;
        break;
      case 2: // Left
        this.x -= this.speed;
        break;
      case 1: // Bottom
        this.y += this.speed;
        break;
    }
  }

  checkCollisions() {
    let isCollided = false;
    if (
      map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize)] ==
        1 ||
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

    if (this.x < 0 || this.x > map[0].length * oneBlockSize) {
      isCollided = true;
    }
    return isCollided;
  }

  changeDirectionIfPossible() {
    let tempDirection = this.direction;
    this.direction = this.calculateNewDirection(
      map,
      parseInt(this.target.x / oneBlockSize),
      parseInt(this.target.y / oneBlockSize)
    );
    if (typeof this.direction === "undefined") {
      this.direction = tempDirection;
      return;
    }
    if (
      this.getMapY() !== this.getMapYRightSide() &&
      (this.direction === DIRECTION_LEFT || this.direction === DIRECTION_RIGHT)
    ) {
      this.direction = DIRECTION_UP;
    }
    if (
      this.getMapX() !== this.getMapXRightSide() &&
      this.direction === DIRECTION_UP
    ) {
      this.direction = DIRECTION_LEFT;
    }

    // Only move forwards
    this.moveForwards();

    if (this.checkCollisions()) {
      // If there is a collision, move backwards
      this.moveBackwards();
      this.direction = tempDirection;
    }
    console.log(this.direction);
  }

  calculateNewDirection(map, destX, destY) {
    const heuristic = (x, y) => {
      // A heuristic function estimating the distance from (x, y) to (destX, destY)
      return Math.abs(x - destX) + Math.abs(y - destY);
    };

    let openSet = [
      { x: this.getMapX(), y: this.getMapY(), moves: [], cost: 0 },
    ];
    let closedSet = [];

    while (openSet.length > 0) {
      let currentNode = openSet[0];
      let currentIndex = 0;

      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].cost < currentNode.cost) {
          currentNode = openSet[i];
          currentIndex = i;
        }
      }

      openSet.splice(currentIndex, 1);
      closedSet.push(currentNode);

      if (currentNode.x === destX && currentNode.y === destY) {
        return currentNode.moves[0];
      }

      let neighborList = this.addNeighbors(currentNode, map);
      for (let i = 0; i < neighborList.length; i++) {
        let neighbor = neighborList[i];

        if (
          closedSet.find(
            (node) => node.x === neighbor.x && node.y === neighbor.y
          )
        ) {
          continue;
        }

        let tentativeCost = currentNode.cost + 1; // Assuming uniform cost for now

        if (
          !openSet.find(
            (node) => node.x === neighbor.x && node.y === neighbor.y
          ) ||
          tentativeCost < neighbor.cost
        ) {
          neighbor.cost = tentativeCost;
          neighbor.moves = currentNode.moves.concat([neighbor.direction]);

          if (
            !openSet.find(
              (node) => node.x === neighbor.x && node.y === neighbor.y
            )
          ) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return 1; // default direction if no path is found
  }

  addNeighbors(poped, mp) {
    let queue = [];
    let numOfRows = mp.length;
    let numOfColumns = mp[0].length;

    if (
      poped.x - 1 >= 0 &&
      poped.x - 1 < numOfRows &&
      mp[poped.y][poped.x - 1] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_LEFT);
      queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
    }
    if (
      poped.x + 1 >= 0 &&
      poped.x + 1 < numOfRows &&
      mp[poped.y][poped.x + 1] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_RIGHT);
      queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
    }
    if (
      poped.y - 1 >= 0 &&
      poped.y - 1 < numOfColumns &&
      mp[poped.y - 1][poped.x] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_UP);
      queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
    }
    if (
      poped.y + 1 >= 0 &&
      poped.y + 1 < numOfColumns &&
      mp[poped.y + 1][poped.x] != 1
    ) {
      let tempMoves = poped.moves.slice();
      tempMoves.push(DIRECTION_BOTTOM);
      queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
    }
    return queue;
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
    canvasContext.drawImage(
      ghostFrames,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

let updateGhosts = () => {
  for (let i = 0; i < ghosts.length; i++) {
    ghosts[i].moveProcess();
  }
};
