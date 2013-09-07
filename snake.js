//A snake game

//create vars
var canvas;
var context;
var posX = 200;
var posY = 200;
var DELTA = 20;
var dx = 0;
var dy = 0;
var foodX;
var foodY;
var intervalId;
var WIDTH;
var HEIGHT;
var Interval = 5;
var tempInterval =5;
var count = 0;
var foodCount =0;
var foodCountCheck=1;
var score = 0;

//snake vars
var snake;
var head;
var SIZE = 20;

//variables for moving not used right now but might need them later
up = false;
down = false;
left = false;
right = false;

var isOver=false;

function init(){
	canvas = document.getElementById('myCanvas');
	context = canvas.getContext('2d');
	WIDTH = canvas.width;
	HEIGHT = canvas.height;


	head = new segment(posX, posY);
	snake = [head];
	drawFood();
	intervalId = setInterval(draw, 50);
}

//resets changed variables and creates new snake head to play another game
function reset(){
	score =0;
	dx =0;
	dy =0;
	Interval = 5;
	count = 0;
	foodCountCheck =1;
	foodCount = 0;
	isOver = false;
	head = new segment(posX, posY);
	snake = [head];
	drawFood();
	intervalId = setInterval(draw, 50);
}

function drawFood(){
	goodFood = false;
	
	while (!goodFood){
		goodFood = true;
		randX = Math.floor(Math.random() * (WIDTH));
		randY = Math.floor(Math.random() * (WIDTH));

		for(x =0; x< snake.length; x++){
			if(snake[x].curX == randX && snake[x].curY == randY)
				   goodFood = false;
		}
	}

	context.clearRect(foodX, foodY, SIZE, SIZE);
	
	foodX= randX - randX%SIZE;
	foodY= randY - randY%SIZE;
	
	context.beginPath();
	context.fillStyle = "red";
	context.rect(foodX, foodY, SIZE, SIZE);
	context.fill();
}

//This is the main loop calling other functions while game play
function draw(){
	if(!isOver){
		count++;
		if(count%Interval == 0){
			context.clearRect(WIDTH-25, 0, 25, 25);
			context.font = "14px Arial";
			context.fillStyle = 'white';
			context.fillText(score, WIDTH-25, 20);

			for( x=0; x<snake.length; x++){
				drawSegs(snake[x]);
			}
			//checks to see if snake ate food and increase speed!!!
			if(snake[0].curX == foodX && snake[0].curY == foodY){
				var newX = snake[snake.length - 1].pastX;
				var newY = snake[snake.length - 1].pastY;
				addSeg(newX, newY);
		
				drawFood();
				foodCount++;
				score++;
				if(Interval >2 && foodCount == foodCountCheck){
					Interval--;
					foodCount =0; //reset foodCount
					foodCountCheck = foodCountCheck*2;
				}
			}

			//checks to see if snake ate its tail
			if(snake.length>3){
				hX = snake[0].curX;
				hY = snake[0]. curY;
				for(x=2; x<snake.length; x++){
					if(hX == snake[x].curX && hY == snake[x].curY){
						   gameOver();
						   x=snake.lenght;
					}
				}
			}
			update();
		}
	}
}

//updates pos of the snake
function update(){	   
	for( x=0; x< snake.length; x++){
		snake[x].pastX = snake[x].curX;
		snake[x].pastY = snake[x].curY;
		
		//add new pos to head depending on where the head is
		if(x==0){
			if(snake[0].curX == WIDTH-SIZE && dx>0) 
				snake[x].curX = 0;
			else if(snake[0].curX == 0 && dx<0 )
				snake[x].curX = WIDTH-SIZE;
			else if(snake[0].curY == HEIGHT - SIZE && dy>0)
				snake[x].curY = 0;
			else if(snake[0].curY == 0 && dy<0)
				snake[x].curY = HEIGHT-SIZE ;
			else{
				snake[x].curX = snake[x].curX + dx;
				snake[x].curY = snake[x].curY + dy;
			}
		}
		//positions perculate to the tail
		else{
			snake[x].pastX= snake[x].curX;
			snake[x].pastY= snake[x].curY;
			snake[x].curX = snake[x-1].pastX;
			snake[x].curY = snake[x-1].pastY;
		}
	}
}

//segment obj
function segment(x, y){
	this.curX= x;
	this.curY= y;

	this.pastX= 0;
	this.pastY= 0;
}

function addSeg(x, y){
	seg = new segment(x, y);
	snake.push(seg);
}

//method for drawing segment object
function drawSegs(seg){
	context.clearRect(seg.pastX, seg.pastY, SIZE, SIZE);
	context.beginPath();
	context.fillStyle = "black";
	context.rect(seg.curX, seg.curY, SIZE, SIZE);
	context.closePath();
	context.fill();
}

// true means key down, false means key up and boost off
function boost(x){
	if(x){
		Interval --;
	}
	else
	   Interval ++;	   
}

document.onkeyup = function keyUp(evt){
	//space key
	if(evt.keyCode == 32)
		boost(false);
}

document.onkeydown = function keyDown(evt){
	//space key
	if(evt.keyCode == 32)
		boost(true);
	
	if(evt.keyCode == 83 ){
		 if(dy == 0){
		 	dy = DELTA;
			dx = 0;
		 }
	}
	else if (evt.keyCode == 87){
		 if(dy ==0){
		 	dy = -DELTA;
			dx = 0;	
		 }
	}
	else if (evt.keyCode == 65){
		 if(dx == 0){
		 	dx = -DELTA;
			dy = 0;
		 }
	}
	else if (evt.keyCode == 68){
		 if(dx == 0){
		 	dx = DELTA;
			dy = 0;
		 }
	}
}

function gameOver(){
	clearInterval(intervalId);
	isOver = true;
   	alert("its over");
	context.clearRect(0,0,WIDTH, HEIGHT);
	reset();	
}

init();
