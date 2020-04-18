window.onload = function(){
	canvasWidth = 900;
	canvasHeight = 450;
	let blockSize = 30;
	let ctx;
	let delay = 100;
	let theSnake;
	let theApple;
	let widthInBlocks = canvasWidth/blockSize;
	let heightInBlocks = canvasHeight/blockSize;
	let score;
	let timeout;
	let buttonGame = document.getElementsByTagName('button')[0];
	
	init();
	
	buttonGame.onclick = function(){
		if( buttonGame.textContent == 'Jouer' ){
			start();
		}
		else {
			restart();
		}
	}
	
	
	function init(){
	let canvas = document.createElement("canvas");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	document.body.appendChild(canvas);
	ctx = canvas.getContext("2d");
	ctx.font = "bold 30px sans-serif";
	ctx.fillStyle = "#000";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.strokeStyle = "#eee";
	ctx.lineWidth = 5;
	let centreX = canvasWidth / 2;
	let centreY = canvasHeight / 2;
	ctx.strokeText("Peut se jouer avec les touches directionnelles ou les boutons", centreX, centreY);
	ctx.fillText("Peut se jouer avec les touches directionnelles ou les boutons", centreX, centreY);
	let buttonUp = document.createElement("button");
	buttonUp.id = 'arrowUp';
	buttonUp.innerHTML = '&uarr;';
	document.body.appendChild(buttonUp);
	let div = document.createElement("div");
	document.body.appendChild(div);
	let buttonLeft = document.createElement("button");
	buttonLeft.id = 'arrowLeft';
	buttonLeft.innerHTML = '&larr;';
	document.getElementsByTagName('div')[0].appendChild(buttonLeft);
	let buttonDown = document.createElement("button");
	buttonDown.id = 'arrowDown';
	buttonDown.innerHTML = '&darr;';
	document.getElementsByTagName('div')[0].appendChild(buttonDown);
	let buttonRight = document.createElement("button");
	buttonRight.id = 'arrowRight';
	buttonRight.innerHTML = '&rarr;';
	document.getElementsByTagName('div')[0].appendChild(buttonRight);
	score = 0;
	drawScore();
	}
	
	function start(){
		theSnake = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
		theApple = new Apple([10,10]);
		refreshCanvas();
	}
	
	function refreshCanvas(){
		theSnake.advance();
		if(theSnake.checkCollision()){
			//GAME OVER
			gameOver();
		}
		else{
			if(theSnake.isEatingApple(theApple)){
				//SERPENT A MANGER LA POMME
				score ++;
				theSnake.ateApple = true;
				do{
					theApple.setNewPosition();
				}
				while(theApple.isOnSnake(theSnake));
			}
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			theSnake.draw();
			theApple.draw();
			drawScore();
			timeout = setTimeout(refreshCanvas,delay);
		}

	}
	
	
	function gameOver (){
		buttonGame.textContent = 'Rejouer';
		ctx.save();
		ctx.font = "bold 70px sans-serif";
		ctx.fillStyle = "#000";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.strokeStyle = "#eee";
		ctx.lineWidth = 5;
		let centreX = canvasWidth / 2;
		let centreY = canvasHeight / 2;
		ctx.strokeText("Game Over", centreX, centreY);
		ctx.fillText("Game Over", centreX, centreY);
		ctx.font = "bold 30px sans-serif";
		ctx.strokeText("Appuyez sur la touche Espace ou le bouton 'Rejouer'", centreX, centreY - 100);
		ctx.fillText("Appuyez sur la touche Espace ou le bouton 'Rejouer'", centreX, centreY - 100);
		ctx.restore();
	}
	
	function restart(){
		if(theSnake.checkCollision()){
			theSnake = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]], "right");
			theApple = new Apple([10,10]);
			score = 0;
			clearTimeout(timeout);
			refreshCanvas();
		}
	}
	
	function drawScore(){
		document.getElementById('score').innerHTML = 'Score : ' + score;
	}
	
	function drawBlock(ctx, position){
		let x = position[0] * blockSize;
		let y = position[1] * blockSize;
		ctx.fillRect(x, y, blockSize, blockSize);
	}
	
	function Snake(body, direction){
		this.body = body;
		this.direction = direction;
		this.ateApple = false;
		this.draw = function(){
			ctx.save();
			ctx.fillStyle = "#F00";
			for(let i = 0; i < this.body.length; i++){
				drawBlock(ctx, this.body[i]);
			}
			ctx.restore();
		};
		this.advance = function(){
			let nextPosition = this.body[0].slice();
			switch(this.direction){
				case "left":
					nextPosition[0] -= 1;
					break;
				case "right":
					nextPosition[0] += 1;
					break;
				case "down":
					nextPosition[1] += 1;
					break;
				case "up":
					nextPosition[1] -= 1;
					break;
				default:
					throw("Invalid Direction");
			}
			this.body.unshift(nextPosition);
			if(this.ateApple)
				this.ateApple = false;
			else
				this.body.pop();
		};
		this.setDirection = function(newDirection){
			let allowedDirections;
			switch(this.direction){
				case "left":
				case "right":
					allowedDirections = ["up", "down"];
					break;
				case "down":
				case "up":
					allowedDirections = ["right", "left"];
					break;
				default:
					throw("Invalid Direction");
			}
			if(allowedDirections.indexOf(newDirection) > -1){
				this.direction = newDirection;
			}
		};
		this.checkCollision = function(){
			let wallCollision = false;
			let snakeCollision = false;
			let head = this.body[0];
			let rest = this.body.slice(1);
			let snakeX = head[0];
			let snakeY = head[1];
			let minX = 0;
			let minY = 0;
			let maxX = widthInBlocks - 1;
			let maxY = heightInBlocks - 1;
			let isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
			let isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
			
			if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
				wallCollision = true;
			}
			
			for(let i = 0; i < rest.length; i++){
				if(snakeX === rest[i][0] && snakeY === rest[i][1]){
					snakeCollision = true;
				}
			}
			
			return wallCollision || snakeCollision;
			
		};
		this.isEatingApple = function(appleToEat){
			let head = this.body[0];
			if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
				return true;
			else
				return false;
		};
		
	}
	
	function Apple(position){
		this.position = position;
		this.draw = function()
		{
			ctx.save();
			ctx.fillStyle = "#33cc33";
			ctx.beginPath();
			let radius = blockSize/2;
			let x = this.position[0]*blockSize + radius;
			let y = this.position[1]*blockSize + radius;
			ctx.arc(x,y, radius, 0, Math.PI*2, true);
			ctx.fill();
			ctx.restore();
		};
		this.setNewPosition = function(){
			let newX = Math.round(Math.random() * (widthInBlocks - 1));
			let newY = Math.round(Math.random() * (heightInBlocks - 1));
			this.position = [newX, newY];
		};
		this.isOnSnake = function(snakeToCheck){
			let isOnSnake = false;
			
			for(let i = 0; i < snakeToCheck.body.length; i++){
				if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
					isOnSnake = true;
				}
			}
			return isOnSnake;
		};
	}
	
	document.onkeydown = function handleKeyDown(e){
		let key = e.keyCode;
		let newDirection;
		switch(key){
			case 37:
				newDirection = "left";
				break;
			case 38:
				newDirection = "up";
				break;
			case 39:
				newDirection = "right";
				break;
			case 40:
				newDirection = "down";
				break;
			case 32:
				restart();
				return;
			default:
				return;
		}
		theSnake.setDirection(newDirection);
	}
	
	let arrowUp = document.getElementById('arrowUp');
	let arrowLeft = document.getElementById('arrowLeft');
	let arrowDown = document.getElementById('arrowDown');
	let arrowRight = document.getElementById('arrowRight');

	arrowUp.onclick = function(){
		theSnake.setDirection("up");
	}

	arrowLeft.onclick = function(){
		theSnake.setDirection("left");
	}

	arrowDown.onclick = function(){
		theSnake.setDirection("down");
	}

	arrowRight.onclick = function(){
		theSnake.setDirection("right");
	}
	
	
}