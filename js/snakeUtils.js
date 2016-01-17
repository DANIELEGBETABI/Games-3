/*global console, $, snakeProp, validateSnakePosition, updateSnakeBody, resetAll, checkIfFoodTakenandUpdateBody, canvasObj, canvasContext, food, SnakeObj, randomIntFromInterval, createSnakeAndFood*/
function clearAndDraw() {
	"use strict";
	canvasContext.clearRect(0, 0, canvasObj.width, canvasObj.height);
	canvasContext.fillRect(food.x, food.y, 8, 8);
	var i = 0, snake = null;
	while (i < snakeProp.snakeBody.length) {
		snake = snakeProp.snakeBody[i];
		canvasContext.fillRect(snake.xPosition, snake.yPosition, 8, 8);
		i = i + 1;
	}
}

function snakeMovement() {
	"use strict";
	var direction = snakeProp.snakeHead.direction;
	if (validateSnakePosition()) {
		if (direction === "moveUp") {
			snakeProp.snakeHead.yPosition = snakeProp.snakeHead.yPosition - 1;
		} else if (direction === "moveRight") {
			snakeProp.snakeHead.xPosition = snakeProp.snakeHead.xPosition + 1;
		} else if (direction === "moveDown") {
			snakeProp.snakeHead.yPosition = snakeProp.snakeHead.yPosition + 1;
		} else if (direction === "moveLeft") {
			snakeProp.snakeHead.xPosition = snakeProp.snakeHead.xPosition - 1;
		}
		checkIfFoodTakenandUpdateBody();
		clearAndDraw();
	} else {
		resetAll();
	}
}

var canvasUtil = {
    snakeTimer : null,
    drawRect : function () {
        "use strict";
        canvasUtil.snakeTimer = setInterval(snakeMovement, 10);
    },
    
    startSnake : function () {
        "use strict";
        $(document).keypress(function (event) {
            var code = event.keyCode || event.which;
            if (code === 37 && snakeProp.snakeHead.direction !== "moveRight") {
                snakeProp.snakeHead.direction = "moveLeft";
            } else if (code === 38 && snakeProp.snakeHead.direction !== "moveDown") {
                snakeProp.snakeHead.direction = "moveUp";
            } else if (code === 39 && snakeProp.snakeHead.direction !== "moveLeft") {
                snakeProp.snakeHead.direction = "moveRight";
            } else if (code === 40 && snakeProp.snakeHead.direction !== "moveUp") {
                snakeProp.snakeHead.direction = "moveDown";
            }
			if (code) {
				event.preventDefault();
			}
			clearInterval(canvasUtil.snakeTimer);
			snakeProp.snakeState = 1;
			canvasUtil.snakeTimer = setInterval(snakeMovement, 10);
        });
    },
    
    pauseSnake : function () {
        "use strict";
        if (snakeProp.snakeState === 1) {
            snakeProp.snakeState = 0;
            clearInterval(canvasUtil.snakeTimer);
        }
    }
};

function startSnake() {
    "use strict";
	if (snakeProp.snakeState === -1) {
		createSnakeAndFood();
		snakeProp.snakeState = 0;
		$('.snakeScore').text(snakeProp.snakeScore);
	}
	
    canvasUtil.startSnake();
    if (snakeProp.snakeState === 0) {
        snakeProp.snakeState = 1;
        canvasUtil.drawRect();
    }
}

function pauseSnake() {
    "use strict";
    canvasUtil.pauseSnake();
}
function resetSnake() {
    "use strict";
	createSnakeAndFood();
	$('.snakeScore').text(0);
	snakeProp.snakeScore = 0;
    pauseSnake();
    startSnake();
}

function validateSnakePosition() {
	"use strict";
	var snakeHead = snakeProp.snakeBody[snakeProp.snakeBody.length - 1], i = null, snake = null;
	if ((snakeHead.xPosition <= canvasObj.width) && (snakeHead.yPosition <= canvasObj.height) && (snakeHead.xPosition >= 0) && (snakeHead.yPosition >= 0)) {
		i = snakeProp.snakeBody.length - 2;
		snake = null;
		while (i > 0) {
			snake = snakeProp.snakeBody[i];
			if ((snake.xPosition <= canvasObj.width && snake.yPosition <= canvasObj.height && snake.xPosition >= 0 && snake.yPosition >= 0)) {
				if (snake.xPosition === snakeHead.xPosition && snake.yPosition === snakeHead.yPosition) {
					return false;
				}
				i = i - 1;
			}
		}
		return true;
	} else {
		return false;
	}
}

function resetAll() {
    "use strict";
    snakeProp.snakeState = -1;
	snakeProp.snakeScore = 0;
    snakeProp.snakeBody = [];
	snakeProp.snakeHead = null;
    clearInterval(canvasUtil.snakeTimer);
    canvasContext.clearRect(0, 0, canvasObj.width, canvasObj.height);
	canvasContext.fillText("GAME OVER !", (canvasObj.width - 65) / 2, (canvasObj.height) / 2);
}

function checkIfFoodTakenandUpdateBody() {
	"use strict";
	var i = 1, snakePrev = null, snakeCur = null, s = null, snakeTail = null;
	if (snakeProp.snakeHead.xPosition === food.x && snakeProp.snakeHead.yPosition === food.y) {
		s = new SnakeObj(food.x, food.y, snakeProp.snakeHead.direction);
		snakeProp.snakeBody.unshift(s);
		canvasContext.clearRect(food.x, food.y, 8, 8);
		food.x = randomIntFromInterval(1, canvasObj.width - 1);
		food.y = randomIntFromInterval(1, canvasObj.height - 1);
		canvasContext.fillRect(food.x, food.y, 8, 8);
		snakeProp.snakeScore += 1;
		$('.snakeScore').text(snakeProp.snakeScore);
	}
	
	/*while (i < snakeProp.snakeBody.length) {
		snakeProp.snakeBody[i - 1].xPosition = snakeProp.snakeBody[i].xPosition;
		snakeProp.snakeBody[i - 1].yPosition = snakeProp.snakeBody[i].yPosition;
		snakeProp.snakeBody[i - 1].direction = snakeProp.snakeBody[i].direction;
		i = i + 1;
	}*/
	snakeTail = snakeProp.snakeBody.shift();
	snakeTail.xPosition = snakeProp.snakeHead.xPosition;
	snakeTail.yPosition = snakeProp.snakeHead.yPosition;
	snakeTail.direction = snakeProp.snakeHead.direction;
	snakeProp.snakeBody.push(snakeTail);
}