var canvas = document.getElementById("context");
canvas.width = 1000;
canvas.height = 500;
canvas.style.width = canvas.width + "px";
canvas.style.height = canvas.height + "px";

var context = canvas.getContext("2d");

var counter = 30;

var keys = [];
var width = 1000, height = 500, speed = 6;
var player = {
	width: 37,
	height: 56,
	y: this.height - 150,
	x : 10,
	vy: 0,
	vx: 0,
	fullJumpTime: 10,
	jumpTime: 0,
	lives: 3
}
var paused = false;
var images = [];
var doneImages = 0;
var requiredImages = 0;
var gameIsOver = false;
var powered_counter_w = 0;
var powered_counter_s = 0;
var powered_counter_r = 0;
var powerUps = [];
var shoot_counter = 5;
var hit_counter = 5;
var sound_hit = [];
for (i=5;i>0;i--){
 sound_hit.push(new Audio("hit.wav"));
}
var sound_explode = new Audio("explode.wav");
var sound_shotgun = [];
for (i=5;i>0;i--){
 sound_shotgun.push(new Audio("shotgun.wav"));
}
var sound_shoot = [];
for (i=5;i>0;i--){
 sound_shoot.push(new Audio("shoot.wav"));
}
var sound_rocket = [];
for (i=5;i>0;i--){
 sound_rocket.push(new Audio("rocket.wav"));
}
var sound_gameover = new Audio("dying.wav");
var gravity = 0.5;
var rockets = [];
var shotguns = [];
var powerUp = function(ide,type){
	this.x= Math.random()*(width - 35) ;
	this.y= Math.random()*(height - 35);
	this.height = 35;
	this.width = 35;
	this.image_no = ide;
	this.z = type;
}
var enemy = function(){
	this.x = width;
	this.y= Math.random()*(height-80 - 20)+20;
	this.width= 15;
	this.height= 50;
	this.isMoving = false;
	this.movingTime= 20;
	this.movingSpeed= 4;
	this.health= 5;
	this.maxHealth = 5;
	this.name_id= "normal";
}
var enemyShooting = function(){
	this.x = width - 20;
	this.y= Math.random()*(height-50 - 20)+20;
	this.width= 15;
	this.height= 50;
	this.isMoving = false;
	this.movingTime= 20;
	this.movingSpeed= 2;
	this.health= 10;
	this.maxHealth = 10;
	this.shooting_counter = 10;
	this.name_id = "shooting";
}
var enemyMoving = function(){
	this.x = width - 20;
	this.y= Math.random()*(height-100 - 50)+50;
	this.width= 15;
	this.height= 50;
	this.isMoving = false;
	this.movingTime= 20;
	this.movingSpeed= 4;
	this.health= 10;
	this.maxHealth = 10;
	this.shooting_counter = 10;
	this.name_id = "moving";
	this.upMoving = false;
	this.downMoving = false;
	this.upMovingTime = 20;
	this.downMovingTime = 20;
}
var boss = function(){
	this.x = width - 20;
	this.y= Math.random()*(height-70 - 20)+20;
	this.width= 30;
	this.height= 70;
	this.isMoving = false;
	this.movingTime= 20;
	this.movingSpeed= 2;
	this.health= 15;
	this.maxHealth = 15;
	this.name_id = "boss";
}
var enemies = [];
var projectiles = [];
var enemy_bullets = [];
var rocket = function(){

}
var score = 0;
window.addEventListener("keydown", function(e){
	keys[e.keyCode] = true;
}, false);
window.addEventListener("keyup", function(e){
	delete keys[e.keyCode];
}, false);
var fullShootTimer = 8;
var shootTimer = fullShootTimer;

 
/*
up - 38
down - 40
left - 37
right - 39
*/
var projectile_speed = 15;
var gameOver = false;
var splash = true;
var loop;
function init(){
	context.clearRect(0,0,width,height);
	context.font = "20px helvetica";
	context.fillStyle="black";
	context.fillText("Space to shoot, arrow keys to move", 70, 80);
	context.fillText("Enter to begin, P to pause", 70, 120);

}
// init();
function start(){
	loop = setInterval(function(){
		console.log("looping");
		game();
	},1000/30)
}
window.addEventListener("keydown", function(e){
	if(e.keyCode==13){
		if(splash == true){
			gameOver = false;
			start();
			splash = false;
		}
	}
}, false);
window.addEventListener("keydown", function(e){
	if(e.keyCode==80){
		if(paused){
			console.log(paused);
			start();
			paused = false;
			
		} else {
			clearInterval(loop);
			console.log(paused);
			paused = true;
		}
	}
}, false);
function game(){
	update();
	render();
}
function initImages(paths){
	// console.log(paths);
	requiredImages = paths.length;
	for (i in paths) {
		console.log(paths[i]);
		var img = new Image();
		img.src = paths[i];
		images[i] = img;
		images[i].onload = function(){
			doneImages++;
			console.log(doneImages);
		}
	}
}
initImages(["player_normal.png", "player_w.png", "player_r.png","background.jpg","gun2.png","gun2_stat.png","gun3.png","gun3_stat.png","player-dead.png","head.png","shotgun.png"]);
function checkImages(){
	if (doneImages >= requiredImages){
		init();
	} else {
		
		context.clearRect(0,0,width,height);
		context.fillStyle='rgb(190, 82, 82)';
		context.fillRect(0,0,width, height);
		context.fillStyle='rgb(68, 28, 49)';
		context.fillRect(0,0, width/requiredImages * doneImages+1, height);
		context.font="30px helvetica"
		context.fillStyle="white";
		context.fillText("Loading, please wait", 70, 80);

		setTimeout(function(){
			checkImages();
		}, 1);
	}
}
// insert images
checkImages();
function update(){
	counter++;
	if(keys[37]  && counter % 1 == 0 && gameIsOver== false){player.x-=player.height/4;}
	if(keys[39]  && counter % 1 == 0 && gameIsOver== false){player.x+=player.height/4;}
	
	if(keys[38] && counter % 1 == 0 && gameIsOver== false){
		player.y-=player.height/3;
	}
	if(keys[40] && counter % 1 == 0 && gameIsOver== false){
		player.y+=player.height/3;
	}
	if(player.x < 10){player.x=10}
	if(player.y <= 31){player.y=31}
	if(player.x >= width - player.width){player.x=200 - player.width}
	if(player.y >= height-player.height-32){
		player.y=height-player.height-32;
		// player.vy = 0;
	}
	

	if (counter % 300 == 0){
		enemies.push(new enemyShooting());
	} else if(counter % 240 == 0){
		enemies.push(new boss());
	} else if (counter % 200 == 0){
		enemies.push(new enemyMoving());
	} else if (counter % 60 == 0){
		enemies.push(new enemy());
	} 
	if(counter % 200 == 0){
		for (i in enemies) {
			if (enemies[i].name_id == "shooting"){
				addEnemyBullets(i);
			}
		}
	}
	if(counter % 200 == 5){
		for (i in enemies) {
			if (enemies[i].name_id == "shooting"){
			addEnemyBullets(i);
			}
		}
	}
	if(counter % 200 == 10){
		for (i in enemies) {
			if (enemies[i].name_id == "shooting"){
			addEnemyBullets(i);
			}
		}
	}
	for (i in enemy_bullets){
		enemy_bullets[i].x-=projectile_speed;
	}
	if(counter % 200 == 0){
		powerUps.push(new powerUp(4,"w"));
	}
	if(counter % 450 == 0){
		powerUps.push(new powerUp(6,"r"));
	}
	if(counter % 400 == 0){
		powerUps.push(new powerUp(10,"s"));
	}
	if(keys[13] && gameIsOver){
		gameover();
	}
	if(keys[32] && shootTimer <=0 && !gameIsOver) {
		if (powered_counter_r>0){
		addRockets();
	} else if (powered_counter_s>0){
		addShotgun();
	} else {
		addBullets();
	}

		shootTimer = fullShootTimer; 
	}
	for (i in powerUps) {
		if(collision(powerUps[i], player)){
			
			if (powerUps[i].z=='w'){
				powered_counter_w = 100;
				console.log("Started powerup w:"+powered_counter_w)
			} else if (powerUps[i].z=='r'){
				powered_counter_r = 100;
				console.log("Started powerup d:"+powered_counter_w)
			}
			else if (powerUps[i].z=='s'){
							powered_counter_s = 100;
							console.log("Started powerup d:"+powered_counter_s)
						}
			powerUps.splice(i,1);
		}
	}
	powered_counter_r--;
	powered_counter_s--;
	if (powered_counter_r<=0){
		powered_counter_w--;
	}
	if (powered_counter_w>0 && powered_counter_r <=0){
		fullShootTimer = 2;
	} else {
		fullShootTimer = 8;
	}


	if (shootTimer > 0){shootTimer--;}
	for (i in projectiles){	
		projectiles[i].x+=projectile_speed;
		for (j in enemies){
			if(collision(projectiles[i], enemies[j])){ 
				enemies[j].health--;
				sound_hit[hit_counter-1].play();
				hit_counter--;
				if (hit_counter==0){
					hit_counter=5;
				}
				projectiles.splice(i,1);
				if (enemies[j].health == 0) {
					if(enemies[j].name_id=='boss'){
					score+=5;
					} else {
						score++;
					}
					sound_explode.play();
					enemies.splice(j,1);
					console.log(enemies[j]);
				}
				console.log(enemies[j].health);
			} else if(projectiles[i].x >= width){
				projectiles.splice(i,1);
			}    
		}
	}
	for (i in shotguns){
		shotguns[i].x+=projectile_speed;
		if (shotguns[i].id == 1){
			shotguns[i].y--;
		} else if (shotguns[i].id == 2){
			shotguns[i].y++;
		}
		 else if (shotguns[i].id == 3){
			shotguns[i].y+=2;
		}
		 else if (shotguns[i].id == 4){
			shotguns[i].y-=2;
		}
		for(j in enemies){
			if (collision(shotguns[i], enemies[j])){
				enemies[j].health--;
				sound_hit[hit_counter-1].play();
				hit_counter--;   
				if (hit_counter==0){
					hit_counter=5;
				}
				shotguns.splice(i,1);
				if (enemies[j].health <= 0) {
					if(enemies[j].name_id=='boss'){
					score+=5;
					} else {
						score++;
					}
					sound_explode.play();
					enemies.splice(j,1);
					console.log(enemies[j]);
				}
			}
		}
	}

	for (i in rockets){	
		rockets[i].x+=projectile_speed;
		for (j in enemies){
			if(collision(rockets[i], enemies[j])){ 
				enemies[j].health-=5;
				sound_hit[hit_counter-1].play();
				hit_counter--;
				if (hit_counter==0){
					hit_counter=5;
				}
				rockets.splice(i,1);
				if (enemies[j].health <= 0) {
					if(enemies[j].name_id=='boss'){
					score+=5;
					} else {
						score++;
					}
					sound_explode.play();
					enemies.splice(j,1);
					console.log(enemies[j]);
				}
				console.log(enemies[j].health);
			} else if(rockets[i].x >= width){
				rockets.splice(i,1);
			}    
		}
	}
	for (i in enemies){
		if (collision(player,enemies[i])) {
			hit();
		}
		
	}
	for (i in enemy_bullets){
		if (collision(player,enemy_bullets[i])) {
			hit();}
		
	}
	moveEnemy();
	movingEnemy();
}
function movingEnemy(){ 
	for (i in enemies){
		if (enemies[i].name_id == 'moving'){
			if(counter % 120 == 0){
				enemies[i].upMoving = true;
			}
			if (enemies[i].upMoving == true){
				enemies[i].upMovingTime--;
				if (enemies[i].upMovingTime >=0){
					enemies[i].y-=enemies[i].movingSpeed;
				} else {
					enemies[i].upMovingTime = 20;
					enemies[i].upMoving = false;
				}
			}
			if(counter % 120 == 60){
				enemies[i].downMoving = true;
			}
			if (enemies[i].downMoving == true){
				enemies[i].downMovingTime--;
				if (enemies[i].downMovingTime >=0){
					enemies[i].y+=enemies[i].movingSpeed;
				} else {
					enemies[i].downMovingTime = 20;
					enemies[i].downMoving = false;
				}
			}
		}
	}
}
function moveEnemy(){ 
	for (i in enemies){
		if(counter % 60 == 0){
			enemies[i].isMoving = true;
		}
		if (enemies[i].isMoving == true){
			enemies[i].movingTime--;
			if (enemies[i].movingTime >=0){
				enemies[i].x-=enemies[i].movingSpeed;
			} else {
				enemies[i].movingTime = 20;
				enemies[i].isMoving = false;
			}
		}
		if (enemies[i].x <=0){
			enemies[i].x=width-30;
		}

	}
}

function render(){
	context.clearRect(0, 0,width,height);
	context.drawImage(images[3],0,0,width,height);
	
	for(i in projectiles) {
		var proj = projectiles[i];
		context.fillStyle="#333";
		context.fillRect(proj.x, proj.y,proj.width,proj.height);
		// context.fillStyle="orange";
		// context.fillRect(proj.x+proj.width/2-1, proj.y+proj.height/2-1,2,2);
	}
	for (i in shotguns){
		var proj = shotguns[i];
		context.fillStyle="#333";
		context.fillRect(proj.x, proj.y,proj.width,proj.height);
	}
	for(i in enemy_bullets) {
		var proj = enemy_bullets[i];
		context.fillStyle="#333";
		context.fillRect(proj.x, proj.y,proj.width,proj.height);
		// context.fillStyle="orange";
		// context.fillRect(proj.x+proj.width/2-1, proj.y+proj.height/2-1,2,2);
	}
	for(i in rockets) {
		var proj = rockets[i];
		context.fillStyle="#333";
		context.fillRect(proj.x, proj.y,proj.width,proj.height);
		context.fillStyle="red";
		context.fillRect(proj.x+proj.width, proj.y+proj.height/2-2,2,4);
	}
	context.drawImage(images[9],10,height-23);
	context.fillStyle="#fff";
	context.fillText("x", 32, height-11);
	context.fillText(player.lives, 45, height-10);

	// context.fillStyle="black";   
	// context.fillRect(player.x, player.y+30,5, player.width);
	// context.fillRect(player.x+10, player.y+30,5, player.width);
	// context.fillStyle="cyan"; 
	// context.fillRect(player.x, player.y + (player.height-5)/2,25,5);
	if(!gameIsOver){
		if(powered_counter_r>0){
			context.drawImage(images[2],player.x, player.y,player.width, player.height);
		} else if(powered_counter_w>0) {
			context.drawImage(images[1],player.x, player.y,player.width, player.height);
		} else {
			context.drawImage(images[0],player.x, player.y,player.width, player.height);
		}
	} else {
		context.drawImage(images[8],player.x, player.y);
	}

	if(powered_counter_w>0){
		// context.fillStyle="#fff";
		// context.fillRect(8, 8 , 39, 39);
		// context.fillStyle="#333";
		// context.fillRect(10, 10 , 35, 35);
		// context.fillText('w',10+7, 10+26);
		context.fillStyle="cyan";
		context.fillRect(135, height-19 ,100/2, 8);
		context.drawImage(images[5],78,height-26);
		context.fillStyle="white";
		context.fillRect(135, height-19 , powered_counter_w/2, 8);
	}
	if(powered_counter_s>0){
		// context.fillStyle="#fff";
		// context.fillRect(8, 8 , 39, 39);
		// context.fillStyle="#333";
		// context.fillRect(10, 10 , 35, 35);
		// context.fillText('w',10+7, 10+26);
		context.fillStyle="cyan";
		context.fillRect(335, height-19 ,100/2, 8);
		context.drawImage(images[10],278,height-32);
		context.fillStyle="white";
		context.fillRect(335, height-19 , powered_counter_s/2, 8);
	}
	if(powered_counter_r>0){
		// context.fillStyle="#fff";
		// context.fillRect(8, 58 , 39, 39);
		// context.fillStyle="#333";
		// context.fillRect(10, 60 , 35, 35);
		// context.fillStyle="cyan";
		// context.fillText('r',15+7, 60+26);
		// context.fillRect(55, 58 ,100/2, 5);
		// context.fillStyle="#333";
		// context.fillRect(55, 58 , powered_counter_r/2, 5);
		context.fillStyle="cyan";
		context.fillRect(265, height-19 ,100/2, 8);
		context.drawImage(images[7],208,height-26);
		context.fillStyle="white";
		context.fillRect(265, height-19 , powered_counter_r/2, 8);
	}

	for (i in powerUps){
		// context.fillStyle=powerUps[i].background;
		// context.fillStyle=powerUps[i].color;
		// context.fillText(powerUps[i].z ,powerUps[i].x+7, powerUps[i].y+26);
		context.drawImage(images[powerUps[i].image_no],powerUps[i].x,powerUps[i].y)
	}

	for (i in enemies){
		context.fillStyle="black";
		context.fillRect(enemies[i].x, enemies[i].y,enemies[i].width,enemies[i].height/2-10);
		if (enemies[i].name_id == "boss"){
		context.fillStyle="brown";		
		} else if (enemies[i].name_id == "moving"){
		context.fillStyle="green";		
		} else if (enemies[i].name_id == "shooting"){
		context.fillStyle="#333";
		context.fillRect(enemies[i].x - 10, enemies[i].y+20,enemies[i].width,5);
		context.fillStyle="rgb(59, 116, 140)";
		}
		else if (enemies[i].name_id == "normal"){
		context.fillStyle="purple";
		}
		context.fillRect(enemies[i].x, enemies[i].y+20,enemies[i].width,enemies[i].height/2-10);
		context.fillRect(enemies[i].x, enemies[i].y+ enemies[i].height/2,enemies[i].width/3,enemies[i].height/2);
		context.fillRect(enemies[i].x+ enemies[i].width/3*2, enemies[i].y+ enemies[i].height/2,enemies[i].width/3,enemies[i].height/2);
		context.fillStyle="red";
		context.fillRect(enemies[i].x - (enemies[i].maxHealth*6)/2 + enemies[i].width/2, enemies[i].y-20,enemies[i].maxHealth*6,5);
		context.fillStyle="green";
		context.fillRect(enemies[i].x - (enemies[i].maxHealth*6)/2 + enemies[i].width/2, enemies[i].y-20,enemies[i].health*6,5);
	}
	
	if(gameIsOver){
		context.fillStyle="#fff";
		context.font="30px helvetica";
		context.fillText("Game over", 220, 210);
		context.fillText("Press enter for new game", 180, 250);

	}
	
	context.fillStyle="white";
	context.font="16px helvetica"
	context.fillText("Score:", (width-100),height-10);
	context.fillText(score, (width-40),height-10);


	
}
function hit(){
	if(!gameIsOver){
		sound_gameover.play();
	}
	if (player.lives != 0){
		player.lives--;
		enemies = [];
		powerUps = [];
		counter = 0;
		powered_counter_w = 0;
		powered_counter_r = 0;
		projectiles = [];
		enemy_bullets=[];
		player.x = 10;
	} else {
		death();
	} 
}
function death(){
	if(!gameIsOver){
		sound_gameover.play();
	}
	setTimeout(function(){
		gameIsOver = true;

	},10)
}
function gameover(){

	clearInterval(loop);
	console.log("gameOver");
	gameOver = true;
	context.clearRect(0, 0,width,height);
	context.fillStyle="black";  
	context.font="30px helvetica"
	context.fillText("GAME OVER", 60, 40);
	context.font="20px helvetica"
	context.fillText("Press space", 60, 80);
	enemies = [];
	powerUps = [];
	counter = 0;
	enemy_bullets=[];
	player.x = 10;
	projectiles = [];
	powered_counter_w = 0;
	score = 0;
	powered_counter_w = 0;
	powered_counter_r = 0;
	gameIsOver = false;
	player.lives=3;
	start();
}
function collision(first, second){
	return !(first.x > second.x + second.width || 
		first.x+first.width<second.x ||
		first.y > second.y + second.height || 
		first.y+first.height<second.y);
}

function addBullets(){
	if (shoot_counter == 0){
		shoot_counter = 5
	}
	sound_shoot[shoot_counter-1].play();
	shoot_counter--;
	projectiles.push({
		x: player.x,
		y: player.y + 22,
		height: 5,
		width: 5,
		speed: 5
	});
}
function addShotgun(){
	if (shoot_counter == 0){
		shoot_counter = 5
	}
	sound_shotgun[shoot_counter-1].play();
	shoot_counter--;
	shotguns.push({
		x: player.x+25,
		y: player.y + 22,
		height: 3,
		width: 3,
		speed: 5,
		id : 1
	});
	shotguns.push({
		x: player.x+25,
		y: player.y + 22,
		height: 3,
		width: 3,
		speed: 6,
		id : 2
	});
	shotguns.push({
		x: player.x+25,
		y: player.y + 22,
		height: 3,
		width: 3,
		speed: 5,
		id : 3
	});
	shotguns.push({
		x: player.x+25,
		y: player.y + 22,
		height: 3,
		width: 3,
		speed: 6,
		id : 4
	});
	shotguns.push({
		x: player.x+25,
		y: player.y + 22,
		height: 3,
		width: 3,
		speed: 5,
		id : 5
	});

}
function addEnemyBullets(id){
	if (shoot_counter == 0){
		shoot_counter = 5
	}
	console.log("ovo je id" + id);
	sound_shoot[shoot_counter-1].play(); 
	shoot_counter--;
	enemy_bullets.push({
		x: enemies[id].x,
		y: enemies[id].y + (enemies[id].height-5)/2,
		height: 5,
		width: 5,
		speed: 5
	});
}
function addRockets(){
	if (shoot_counter == 0){
		shoot_counter = 5
	}
	sound_rocket[shoot_counter-1].play();
	shoot_counter--;
	rockets.push({
		x: player.x,
		y: player.y + 19,
		height: 7,
		width: 10,
		speed: 7
	});
}
