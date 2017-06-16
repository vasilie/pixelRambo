/*========================*\
	#Canvas setup
\*========================*/

var canvas = document.getElementById("context");
canvas.width = 1000;
canvas.height = 500;
canvas.style.width = canvas.width + "px";
canvas.style.height = canvas.height + "px";
var context = canvas.getContext("2d"),
	width = 1000,
	height = 500;

/*========================*\
	#Global variables
\*========================*/

// Game settings

var used_ctrl = {
		used:false,
		shown:false,
		counter:130
	}

var keys = [],
	gameStatus = 0, //0 - loading screen, 1 - loading screen finished, 2 - chooseLevel, 3 - gameRuning, 4 - level passed, 5 - game over screen
	current_level = 1,
	choose_level_screen = false,
    counter = 30,
	speed = 6,
	frames = 30,
	bgpos = 0,
	gameRuning = false,
	paused = false,
	gameIsOver = false,
	highscore_screen = false,
	gameOver = false,
	splash = true,
	levelFinished =false,
	score = 0,
	arrow_direction_counter,
	red =  255,
	green = 255,
	blue = 255,
	loop;



// Init images	

	images = [],
	requiredImages = 0,
	doneImages = 0;


/*========================*\
	#Player 
\*========================*/

var player = {
	width: 37,
	height: 56,
	y: this.height - 150,
	x : 10,
	vy: 0,
	vx: 0,
	fullJumpTime: 10,
	driving:false,
	jumpTime: 0,
	lives: 3
}

/*========================*\
	#Vehicles
\*========================*/

var tank = {
	x: width + 180,
	y:100,
	width:90,
	height:40,
	presentTime: 1300,
	maxPresentTime:1300,
	image:18,
	bullets :[]
}
/*========================*\
	#Weapons
\*========================*/

var shotgun = {	ammo : 0 },
    minigun = { ammo : 0 },
    rocketa = { ammo : 0 },
    pistol =  { ammo : Infinity },
	collected_weapons = [pistol, minigun, shotgun, rocketa], 
	powerUps = [],
	rockets = [],
	shotguns = [],
	projectiles = [],
	enemy_bullets = [],
    active_weapon = 0;



/*========================*\
	#Music & Sound
\*========================*/

// Music Variables

var sound_explode = [],
	sound_shotgun = [],
	sound_shoot = [],
	sound_rocket = [],
	sound_hit = [],
	empty = [],
	sound_tank_bullet = [],
	shoot_counter = 5,
	hit_counter = 5,

// Adding sounds & music
	sound_tank_bullet_hit = new Audio("tank_bullet_hit.wav"),
	splash_music = new Audio("splash_screen_music.wav"),
	sound_gameover = new Audio("dying.wav");

// Volumes

sound_tank_bullet_hit.volume = 0.3;
var sound_hit_volume = 0.2
var sound_shoot_volume = 0.3;
var sound_explode_volume = 0.1;
var sound_rocket_volume = 0.3;
var sound_shotgun_volume = 0.5;
var sound_dying_volume = 0.9;
var sound_splash_music_volume = 1;
var sound_tank_bullet_volume = 0.2;
var muted = false;

/*========================*\
	#Enemies
\*========================*/

//Constructors 

var enemy = function(){
	this.x = width  + Math.random()*100;
	this.y= Math.random()*(height-80 - 20)+20;
	this.width= 24;
	this.height= 56;
	this.isMoving = false;
	this.movingTime= 20;
	this.movingSpeed= 4;
	this.health= 5;
	this.isDead = false;
	this.maxHealth = 5;
	this.name_id= "normal";
	this.score = 4;
}
var enemyShooting = function(){
	this.x = width  + Math.random()*100;
	this.y= Math.random()*(height-80 - 20)+20;
	this.width= 35;
	this.height= 58;
	this.isMoving = false;
	this.movingTime= 20;
	this.movingSpeed= 2;
	this.isDead = false;
	this.health= 10;
	this.maxHealth = 10;
	this.shooting_counter = 10;
	this.name_id = "shooting";
	this.score = 12;
}
var enemyMoving = function(){
	this.x = width  + Math.random()*100;
	this.y= Math.random()*(height-260)+95;
	this.width= 32;
	this.height= 50;
	this.isMoving = false;
	this.movingTime= 20;
	this.score = 8;
	this.movingSpeed= 4;
	this.health= 10;
	this.isDead = false;
	this.maxHealth = 10;
	this.shooting_counter = 10;
	this.name_id = "moving";
	this.upMoving = false;
	this.downMoving = false;
	this.upMovingTime = 20;
	this.downMovingTime = 20;
}
var boss = function(){
	this.x = width  + Math.random()*100;
	this.y= Math.random()*(height-80 - 20)+20;
	this.width= 35;
	this.height= 70;
	this.isMoving = false;
	this.movingTime= 20;
	this.movingSpeed= 2;
	this.health= 25;
	this.isDead = false;
	this.score = 16;
	this.maxHealth = 25;
	this.name_id = "boss";
} 
// Objects
var final_boss = {
	x:1200,
	y:250-75,
	width: 155,
	height:170,
	maxHealth:600,
	health: 600,
	isDead : false,
	present: false,
	movingTime: 300,
	shooting:false,
	bullets:[],
	bulletSpeed:15,
	bulletDirection:'up',
}
// Arrays 

var enemies = [];


/*========================*\
	#Global listeners
\*========================*/

//Music reload

splash_music.addEventListener("ended", function(){
	this.currentTime = 0;
	this.play();
},false);

// Add keys to array

window.addEventListener("keydown", function(e){
	keys[e.keyCode] = true;
}, false);

// Remove keys from array

window.addEventListener("keyup", function(e){
	delete keys[e.keyCode];
}, false);

// Splash Screen Enter

window.addEventListener("keydown", function(e){ // enter key
	if(e.keyCode==13){
		if(gameStatus == 1 ){ // loading screen finished
			gameOver = false;
			choose_level_screen =true;
			chooseLevel();
			splash = false;
			gameStatus = 2;
		} else if ( gameStatus == 2 ){
			if(current_level == 1) {	
				start(); // start
				gameStatus = 3;
			} else {
				context.fillStyle = "white";
				context.fillRect(595,95,310,310);
				context.fillStyle= "rgb(19, 139, 125)";
				context.fillRect(600,100,300,300);

				context.fillStyle="white";
				context.fillText("Not available yet",640,260);	
			}

		}

	}
}, false);

//Choose level enter
window.addEventListener("keydown", function(e){
	if(e.keyCode==37 || e.keyCode==39){
		if(choose_level_screen == true){
			context.fillStyle=" #121111";
			context.fillRect(0,0,width,height);

			context.fillStyle= "white";
			context.font = "30px helvetica";

			context.fillText("Choose Level",405,60);

			context.fillStyle= "rgb(19, 139, 125)";
			context.fillRect(100,100,300,300);
			context.fillRect(600,100,300,300);

			context.fillStyle="white";
			context.font = "30px helvetica";
			context.fillText("Level 1",200,260);
			context.fillText("Level 2",700,260);

			if (current_level == 1){
				current_level =2;
				context.fillStyle = "white";
				context.fillRect(595,95,310,310);
				context.fillStyle=" rgb(19, 139, 125)";
				context.fillRect(600,100,300,300);

				context.fillStyle="white";
				context.fillText("Level 2",700,260);
			} else {
				current_level = 1;
				context.fillStyle = "white";
				context.fillRect(95,95,310,310);
				context.fillStyle=" rgb(19, 139, 125)";
				context.fillRect(100,100,300,300);

				context.fillStyle="white";
				context.fillText("Level 1",200,260);

			}
		}
	}
}, false);

// Pause 

window.addEventListener("keydown", function(e){
	if(e.keyCode==80){
		if(paused && gameRuning){
			console.log(paused);
			start();
			paused = false;
			
		} else if (gameRuning){
			clearInterval(loop);
			console.log(paused);
			paused = true;
		}
	}
}, false);
window.addEventListener("keydown", function(e){
	if(e.keyCode==17 && !gameIsOver){
		if (collected_weapons.length > 1 ){
			used_ctrl.used = true;
		}
		switchWeapon();
		console.log("this is active weapon: "+active_weapon);
		console.log(typeof(collected_weapons[active_weapon]));
		console.log("active_weapon" + active_weapon);
	}
}, false);


var powerUp = function(ide,type){
	this.x= width + 35 *Math.random();
	this.y= Math.random()*(height - 35 - 32 -31) +31;
	this.height = 35;
	this.width = 35;
	this.image_no = ide;
	this.exists = true;
	this.z = type;
}


var fullShootTimer = 8;
var shootTimer = fullShootTimer;

function checkAudio(){
	if(splash_music.readyState >= 4){
		console.log("loaded music");
		doneImages++;
	} else {
		setTimeout(function(){
			checkAudio();
		},1)
	}
}
/*
up - 38
down - 40
left - 37
right - 39
*/
var projectile_speed = 15;

function init(){
	splash_music.play();
	context.clearRect(0,0,width,height);
	// context.fillStyle='rgb(190, 82, 82)';
	context.drawImage(images[1],0,0,width, height);
	context.fillStyle="black";
	context.fillRect(0,0, width/requiredImages * doneImages+1, height);
	context.font="16px helvetica"
	context.fillStyle="white";
	context.drawImage(images[0],0,0,width, height);
	context.fillText("Space to shoot, arrow keys to move", 100, 50);
	context.fillText("P for Pause", 100, 85);
	context.fillText("Press enter to start", 100, 120);
	context.fillStyle="indianred";
	context.fillText("New update", 100, 155);
	context.fillStyle="white";
	context.fillText(": Switch weapons with CTRL", 190, 155);



}
function chooseLevel(){
	context.fillStyle=" #121111";
	context.fillRect(0,0,width,height);
	context.fillStyle = "white";
	context.fillRect(95,95,310,310);
	context.fillStyle= "rgb(19, 139, 125)";
	context.fillRect(100,100,300,300);
	context.fillRect(600,100,300,300);

	context.fillStyle="white";
	context.font = "30px helvetica";
	context.fillText("Choose Level",405,60);
	context.fillText("Level 1",200,260);
	context.fillText("Level 2",700,260);
}
function start(){
	levelFinished = false;
	choose_level_screen = false;
	splash_music.pause();
	splash_music.currentTime = 0;
	gameRuning = true;
	loop = setInterval(function(){
		game();
	},1000/frames)
}

function switchWeapon(){
	
	active_weapon++;
	console.log(active_weapon+"and"+collected_weapons.length-1);
	if(active_weapon == collected_weapons.length){
		active_weapon = 0;
	}
	if(collected_weapons[active_weapon].ammo <= 0){
		switchWeapon();
	}
}
function game(){
	update();
	render();
}
function initImages(paths){
	// console.log(paths);
	requiredImages = paths.length+1;
	for (i in paths) {
		console.log(paths[i]);
		var img = new Image();
		img.src = 'img/'+paths[i];
		images[i] = img;
		images[i].onload = function(){
			doneImages++;
			console.log(doneImages);
		}
	}
}
// #Init Images
// #LAST IMAGE 19
initImages(["splash_front.png", "background.jpg", "player_r.png",
	"player_w.png","gun2.png","gun2_stat.png","gun3.png","gun3_stat.png",
	"player-dead.png","head.png","smajser-footer.png","player_normal.png","mumija.png","zombi.png","kiklop.png","alien.png","smajser-ikona.png","smajser.png","tank-empty.png","tenkista.png"]);
function checkImages(){
	if (doneImages >= requiredImages){
		init();
	} else {
		
		context.clearRect(0,0,width,height);
		// context.drawImage(images[1],0,0,width, height); // after converting to png add background
		context.fillStyle="black";
		context.fillRect(0,0, width/requiredImages * doneImages+1, height);
		context.font="20px helvetica"
		context.fillStyle="white";
		context.drawImage(images[0],0,0,width, height);
		context.fillText("Loading, please wait", 70, 80);
		gameStatus = 1;
		setTimeout(function(){
			checkImages();
		}, 1);
	}
}
// insert images
checkAudio();
checkImages();
function update(){
	counter++;
	// console.log(counter);
	if(!gameIsOver){
		player.x-=2; // Player moving with background
	}
/* ---------------*\
   #Controls
\* ---------------*/

	if(keys[37]  && counter % 1 == 0 && gameIsOver== false){player.x-=player.height/4;} // Left
	if(keys[39]  && counter % 1 == 0 && gameIsOver== false){player.x+=player.height/4;} // Right
	if(keys[38] && counter % 1 == 0 && gameIsOver== false){player.y-=player.height/3; } // Up
	if(keys[40] && counter % 1 == 0 && gameIsOver== false){player.y+=player.height/3; } // Down
	if(keys[13] && gameIsOver){ chooseLevel(); } // Start new game

/* ---------------*\
   #Boudaries 
\* ---------------*/

	if(player.x < 10){player.x=10} // Left margin
	if(player.y <= 31){player.y=31} // Top margin
	if(player.x >= width - player.width){player.x=width - player.width}  // Right margin
	if(player.y >= height-player.height-32){player.y=height-player.height-32; } // Left margin

/* ---------------------------*\
   #Object moving functionality
\* ---------------------------*/

//Projectiles

	for (i in tank.bullets){
		tank.bullets[i].x+= tank.bullets[i].speed;
	}
	for (i in enemy_bullets){
		enemy_bullets[i].x-=projectile_speed; // Change to enemy_bullets[i].shooting_speed
	}
	for (i in final_boss.bullets){
		if (counter % 22 <= 10){
			final_boss.bulletDirection ="up";
		} else {
			final_boss.bulletDirection ="down";
		}
		final_boss.bullets[i].x-=final_boss.bulletSpeed;
		if (final_boss.bulletDirection == "up"){

			final_boss.bullets[i].y-=20;
		} else {
			final_boss.bullets[i].y+=20;
		}
	}

//Player driving

	if (player.driving){
		player.width = tank.width;
		player.height = tank.height;
		tank.x = player.x;
		tank.y = player.y;
		tank.presentTime--;
	}
	if (tank.presentTime<=0){
		player.driving = false;
		tank.x = width + 180;
		player.height = 56;
		player.width = 37;
	} 
//Background
	if (!gameIsOver){
		bgpos-=2;
		if (bgpos <= - width ){
			bgpos= 0;
		}
	}
//Final boss
    if (final_boss.present && final_boss.x > 800){
    	final_boss.x-=2;
    }
	

/* ---------------------------*\
   #Player shooting functionality
\* ---------------------------*/

	if(keys[32] && shootTimer <=0 && !gameIsOver && !player.driving) {
		if (active_weapon == 0 ){
		fullShootTimer = 8;
		addBullets();
		} else if (active_weapon == 1 && collected_weapons[active_weapon].ammo > 0){
			addBullets();
			fullShootTimer = 2;
		} else if (active_weapon == 2 && collected_weapons[active_weapon].ammo > 0) {
			addShotgun();
			fullShootTimer = 8;
		} else if (active_weapon == 3 && collected_weapons[active_weapon].ammo > 0) {
			addRockets();
			fullShootTimer = 8;
		} else {
			fullShootTimer = 8;
			console.log(shoot_counter);
			empty[shoot_counter].play();
			shoot_counter--;
			if (shoot_counter <= 0){
				shoot_counter = 5;
			}
		}
		shootTimer = fullShootTimer; 
	}
	if(keys[32] && shootTimer <=0 && !gameIsOver && player.driving) {
		addTenkBullets();
		fullShootTimer = 10;
		shootTimer = fullShootTimer;
	}


/* ---------------------------*\
   #Enemy shooting functionality
\* ---------------------------*/

// Alien

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

/* ---------------------------*\
   #Collisions
\* ---------------------------*/

// Player, powerUps

	for (i in powerUps) {
		if(collision(powerUps[i], player)){
			
			if (powerUps[i].z=='w'){
				if(typeof(collected_weapons[1]) === "undefined"){
					collected_weapons[1] = minigun;
				}
				minigun.ammo+=30;
				console.log("Ammo"+minigun.ammo);
			} else if (powerUps[i].z=='r'){
				if(typeof(collected_weapons[3]) === "undefined"){
					collected_weapons[3] = rocketa;
				}
				rocketa.ammo+=10;
				console.log("Ammo"+rocketa.ammo);
			}
			else if (powerUps[i].z=='s'){
					if(typeof(collected_weapons[2]) === "undefined"){
						collected_weapons[2] = shotgun;
					}
					shotgun.ammo+=13;
				console.log("Ammo"+shotgun.ammo);
			}
			powerUps[i].exists = false;

		}
	}
	for (i in powerUps){
		powerUps[i].x-=2;
		if (!powerUps[i].exists) {
			powerUps.splice(i,1);
		};
	}
	if (collision(tank,player) && !player.driving ){
		player.driving = true;
		tank.height = 60;
		player.x = tank.x;
		player.y = tank.y-20;
	}

// Projectiles, Enemies
	
	if (shootTimer > 0){shootTimer--;}
	for (i in projectiles){	
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
					score += enemies[j].score;
					sound_explode[Math.floor(Math.random()*25)].play();
					enemies[j].isDead = true;
				}
			} else if(projectiles[i].x >= width){
				projectiles.splice(i,1);
			}    
		}
		projectiles[i].x+=projectile_speed;
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
					score += enemies[j].score;
					sound_explode[Math.floor(Math.random()*25)].play();
					enemies[j].isDead = true;
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
					score += enemies[j].score;
					sound_explode[Math.floor(Math.random()*25)].play();
					enemies[j].isDead = true;
				}
			} else if(rockets[i].x >= width){
				rockets.splice(i,1);
			}    
		}
	}
	if (final_boss.present){
		for (i in projectiles){
			if (collision(projectiles[i],final_boss)){
				projectiles.splice(i,1);
				final_boss.health--;
				sound_hit[hit_counter-1].play();
				hit_counter--; 
				if (hit_counter<= 0){
					hit_counter = 5;
				}
			}
		}
		for (i in rockets){
			if (collision(rockets[i],final_boss)){
				rockets.splice(i,1);
				final_boss.health-=5;
				sound_hit[hit_counter-1].play();
				hit_counter--; 
				if (hit_counter<= 0){
					hit_counter = 5;
				}
			}
		}
		for (i in shotguns){
			if (collision(shotguns[i],final_boss)){
				shotguns.splice(i,1);
				final_boss.health--;
				sound_hit[hit_counter-1].play();
				hit_counter--; 
				if (hit_counter<= 0){
					hit_counter = 5;
				}
			}
		}
		for (i in tank.bullets){
			if (collision(tank.bullets[i],final_boss)){
				tank.bullets.splice(i,1);
				final_boss.health-= tank.bullets[i].damage;
				sound_hit[hit_counter-1].play();
				hit_counter--;
				if (hit_counter<= 0){
					hit_counter = 5;
				} 
			}
		}
		if (levelFinished){
			final_boss.present = false;
		}
		if (final_boss.health<=0 && !levelFinished) {
			final_boss.present = false;
			levelFinished = true;
			score += 500;
			sound_explode[3].play();
			showNewHighscore();
		}
	}
	for (i in enemies){
		for (j in tank.bullets){
			if(collision(enemies[i],tank.bullets[j])){
				enemies[i].health-=tank.bullets[j].damage;
				score+= enemies[i].score;
				tank.bullets.splice(j,1);
				if (enemies[i].health>=0){
				sound_tank_bullet_hit.play();
				} else {
					enemies[i].isDead=true;
				}
			}

		}

	}

// Enemy Bullets, player 

	for (i in enemy_bullets){
		if (collision(player,enemy_bullets[i])) {
			if (!player.driving){
				hit();
			} else {
				empty[Math.floor(Math.random()*4)].play()
			}
		}
	}
	for (i in final_boss.bullets){
		if(collision(player,final_boss.bullets[i])){
			final_boss.bullets.splice(i,1);
			hit();
		}
	}

// Player, Enemies 
	
	if (collision(player,final_boss)){
		hit();
	}
	for (i in enemies){
		if (collision(player,enemies[i]) && !player.driving) {
			hit();
		} else if (player.driving && collision(tank,enemies[i])){
			if(enemies[i].name_id =="boss"){
				if (player.x < enemies[i].x){
					player.x = enemies[i].x - tank.width;
					if (player.x <= 15){
						// player.x ==12;
						enemies[i].x=player.width+13			}
				} else if (player.x > enemies[i].x) {
					player.x = enemies[i].x + enemies[i].width;
				}
			} else {
				score+=enemies[i].score;
				enemies[i].isDead =true;
			}
		}
	}
if(current_level == 1){
	level1();
} else {
	// level2();
}
// Cleaning arrays
	
	for (i in enemies){
	if (enemies[i].x <= - 50) {
		enemies.splice(i,1);
	}
	if (enemies[i].isDead == true) {
			enemies.splice(i,1);
			sound_explode[Math.floor(Math.random()*25)].play();
		}
	}
	checkAmmo();
	moveEnemy();
	movingEnemy();
}
function level1(){
/* ---------------*\

   #Level 1

\* ---------------*/

/* Enemy adding */

// Phase one
if(counter<1000){
	if (counter % 300 == 0){
		enemies.push(new enemyShooting());
	} else if(counter % 240 == 0){
		enemies.push(new boss());
	} else if (counter % 200 == 0){
		enemies.push(new enemyMoving());
	} else if (counter % 60 == 0){
		enemies.push(new enemy());
	} 
//Phase two
} else if (counter>1000 && counter <2000){
	if (counter % 280 == 0){
		enemies.push(new enemyShooting());
	} else if(counter % 220 == 0){
		enemies.push(new boss());
	} else if (counter % 180 == 0){
		enemies.push(new enemyMoving());
	} else if (counter % 50 == 0){
		enemies.push(new enemy());
	} 
//Phase three
} else if (counter>2000 && counter <3000){
	if (counter % 260 == 0){
		enemies.push(new enemyShooting());
	} else if(counter % 200 == 0){
		enemies.push(new boss());
	} else if (counter % 160 == 0){
		enemies.push(new enemyMoving());
	} else if (counter % 70 == 0){
		enemies.push(new enemy());
		enemies.push(new enemy());
	} 
//Phase four
} else if (counter>3000 && counter < 4000){
	if (counter % 230 == 0){
		enemies.push(new enemyShooting());
	} else if(counter % 200 == 0){
		enemies.push(new boss());
	} else if (counter % 150 == 0){
		enemies.push(new enemyMoving());
		enemies.push(new enemyMoving());
	} else if (counter % 60 == 0){
		enemies.push(new enemy());
		enemies.push(new enemy());
		enemies.push(new enemy());

	} 
//Phase five
} else if (counter>4000 && counter < 5000){
	if (counter % 230 == 0){
		enemies.push(new enemyShooting());
	} else if(counter % 190 == 0){
		enemies.push(new boss());
	} else if (counter % 140 == 0){
		enemies.push(new enemyMoving());
		enemies.push(new enemyMoving());
	} else if (counter % 50 == 0){
		enemies.push(new enemy());
		enemies.push(new enemy());
		enemies.push(new enemy());

	} 
} else if (counter>5000 && counter < 8000){
	if (counter % 230 == 0){
		enemies.push(new enemyShooting());
		enemies.push(new enemyShooting());

	} else if(counter % 190 == 0){
		enemies.push(new boss());
	} else if (counter % 140 == 0){
		enemies.push(new enemyMoving());
		enemies.push(new enemyMoving());
	} else if (counter % 50 == 0){
		enemies.push(new enemy());
		enemies.push(new enemy());
		enemies.push(new enemy());

	} 
}
// Tank appearing 

	if (counter >= 2500 && tank.x >= 180) {
		tank.x-=2;
	}

// Final boss 
	if (counter > 8000 && !levelFinished) {
		final_boss.present = true;
    }
    if(final_boss.present){
		if (counter % 200 < 50) {
			final_boss.y-=3;
		} else if (counter % 300 > 150){
			final_boss.y+=3;
		}
		if (final_boss.y <= 30){
			final_boss.y = 30;
		} else if (final_boss.y + final_boss.height >= height -40){
			final_boss.y =height - final_boss.height -40;
		}
	}
// Adding powerUps    

	if(counter % 100 == 0){
		powerUps.push(new powerUp(4,"w"));
	}
	if(counter % 350 == 0){
		powerUps.push(new powerUp(6,"r"));
	}
	if(counter % 300 == 0){
		powerUps.push(new powerUp(16,"s"));
	}
}

function render(){
	context.clearRect(0, 0,width,height);
	context.drawImage(images[1],bgpos,0,width,height);
	context.drawImage(images[1],bgpos+width,0,width,height);
	context.fillStyle="white";
	context.fillRect(65, height-25, 1, 18);
	context.fillRect(394, height-25, 1, 18);



	if (!player.driving){
		context.drawImage(images[tank.image],tank.x,tank.y,tank.width,tank.height);
		context.fillStyle= "#333";
		arrow_direction_counter = counter % 12;
		if (arrow_direction_counter <= 6){
			var dy = -arrow_direction_counter;
		} else {
			var dy = arrow_direction_counter;
		}
		context.fillRect(tank.x+27,tank.y-60 + dy,14,31);
		context.fillRect(tank.x+22,tank.y-40 + dy,24,6);
		context.fillRect(tank.x+32,tank.y-30 + dy,4,5);
		// context.fillRect(tank.x+24,tank.y-34,20,6);

	} else {
		// context.fillRect(tank.x,tank.y,tank.width,tank.height);
	}
	for(i in projectiles) {
		var proj = projectiles[i];
		context.fillStyle="#333";
		context.fillRect(proj.x, proj.y,proj.width,proj.height);
	}
	for (i in shotguns){
		var proj = shotguns[i];
		context.fillStyle="#333";
		context.fillRect(proj.x, proj.y,proj.width,proj.height);
	}
	for(i in tank.bullets) {
		var proj = tank.bullets[i];
		context.fillStyle = "red";
		context.fillRect(proj.x + 3, proj.y,10,proj.height);
		context.fillStyle = "#333";
		context.fillRect(proj.x, proj.y,proj.width,proj.height);

	}
	for(i in enemy_bullets) {
		var proj = enemy_bullets[i];
		context.fillStyle="#333";
		context.fillRect(proj.x, proj.y,proj.width,proj.height);
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
	if (player.driving){
		context.drawImage(images[19],player.x,player.y,tank.width,tank.height)
	}
	if(!gameIsOver && !player.driving){
		if(active_weapon==3){
			context.drawImage(images[2],player.x, player.y,player.width, player.height);
		} else if(active_weapon==2) {
			context.drawImage(images[17],player.x, player.y,player.width, player.height);
		}else if(active_weapon==1) {
			context.drawImage(images[3],player.x, player.y,player.width, player.height);
		} else {
			context.drawImage(images[11],player.x, player.y,player.width, player.height);
		}
	} else if (!player.driving){
		context.drawImage(images[8],player.x, player.y);
	}
	context.font="12px helvetica";
	
	context.globalAlpha = 0.5;
	context.drawImage(images[5],80,height-26);
	context.drawImage(images[5],160,height-26);
	context.drawImage(images[10],240,height-26);
	context.drawImage(images[7],320,height-26);	
	context.globalAlpha = 1;

	if(active_weapon==0){
		context.drawImage(images[5],80,height-26);
	}
	if(active_weapon==1){
		context.drawImage(images[5],160,height-26);
	}
	if(active_weapon==2){
		context.drawImage(images[10],240,height-26);
	}
	if(active_weapon==3){
		context.drawImage(images[7],320,height-26);	
	}
	context.font="18px helvetica";
	context.fillText("∞", 137, height-8);
	context.font="12px helvetica";

	if (minigun.ammo > 0){
		context.fillStyle = "white";
	} else {
		context.fillStyle = "red";
	}
	context.fillText(minigun.ammo, 213, height-12);

	if (rocketa.ammo > 0){
		context.fillStyle = "white";
	} else {
		context.fillStyle = "red";
	}
	context.fillText(rocketa.ammo, 373, height-12);
	
	if (shotgun.ammo > 0){
		context.fillStyle = "white";
	} else {
		context.fillStyle = "red";
	}
	context.fillText(shotgun.ammo, 293, height-12);

	for (i in powerUps){
		context.drawImage(images[powerUps[i].image_no],powerUps[i].x,powerUps[i].y)
	}
	/* #Enemies Render */
	for (i in enemies){
		
		if (enemies[i].name_id == "boss"){
		context.drawImage(images[14],enemies[i].x,enemies[i].y);
		} else if (enemies[i].name_id == "moving"){
		context.drawImage(images[13],enemies[i].x,enemies[i].y);
		} else if (enemies[i].name_id == "shooting"){
		context.drawImage(images[15],enemies[i].x,enemies[i].y);
		}
		else if (enemies[i].name_id == "normal"){
		context.drawImage(images[12],enemies[i].x-6,enemies[i].y);
		}
		//health bar
		context.fillStyle="red";
		context.fillRect(enemies[i].x - (enemies[i].maxHealth*4)/2 + enemies[i].width/2, enemies[i].y-20,enemies[i].maxHealth*4,5);
		context.fillStyle="green";
		context.fillRect(enemies[i].x - (enemies[i].maxHealth*4)/2 + enemies[i].width/2, enemies[i].y-20,enemies[i].health*4,5);
	}
    if (final_boss.present){	
		// Final boss drawing 
		context.fillStyle='indianred';
		context.fillRect(final_boss.x,final_boss.y,final_boss.width,final_boss.height-20);
		//legs 
		context.fillRect(final_boss.x,final_boss.y+final_boss.height-20,18,20);
		context.fillRect(final_boss.x+34,final_boss.y+final_boss.height-20,18,20);
		context.fillRect(final_boss.x+68,final_boss.y+final_boss.height-20,18,20);
		context.fillRect(final_boss.x+103,final_boss.y+final_boss.height-20,18,20);
		context.fillRect(final_boss.x+137,final_boss.y+final_boss.height-20,18,20);

		// eyes 
		if (counter > 8350){
			final_boss.shooting = true;
		}
		if (final_boss.shooting){
			green-=2;
			blue-=2;
		}
		if (green<=0) {
			green = 255;
			blue = 255;
			final_boss.bullets.push({
				x:final_boss.x+10,
				y:final_boss.y+30,
				width:50,
				height:50,
				firstX:final_boss.x+10
			});
		}
		context.fillStyle='rgb('+red+','+green+','+blue+')';
		context.fillRect(final_boss.x+10,final_boss.y+30,50,50);
		

		context.fillStyle='black';
		context.fillRect(final_boss.x+20,final_boss.y+40,20,20);
		// band 
		context.fillRect(final_boss.x,final_boss.y+10, final_boss.width,20);
		context.fillRect(final_boss.x+final_boss.width,final_boss.y+20, 20,20);
		context.fillRect(final_boss.x+final_boss.width+20,final_boss.y+10, 20,20);
		// health bar
		context.fillStyle="red";
		context.fillRect(400, height - 52,final_boss.maxHealth/3,15);
		context.fillStyle="green";
		context.fillRect(400, height - 52,final_boss.health/3,15);
		// eye bullet 
		for (i in final_boss.bullets) {
			context.fillStyle = "red";
			var proj = final_boss.bullets[i];
			context.fillRect(proj.x,proj.y,proj.width,proj.height);
			context.fillStyle = "black";
			context.fillRect(proj.x+10,proj.y+10,20,20);
		}
	}
	if (levelFinished) {
		context.fillStyle="#fff";
		context.font="48px helvetica";
		context.fillText("LEVEL 1 FINISHED", 370, 240);
		context.font="20px helvetica";
		context.fillText("Thanks for playing Pixel Rambo", 400,  280);

	}
	if(gameIsOver){
		context.fillStyle="#fff";
		context.font="48px helvetica";
		context.fillText("GAME OVER", 370, 240);
		context.font="20px helvetica";
		context.fillText("Press enter for new game", 400,  280);

	}
	context.fillStyle="white";
	context.font="16px helvetica"
	context.fillText("Score:", (width-100),height-10);
	context.fillText(score, (width-40),height-10);
	if (counter  > 400 && counter % 20 > 4 && !used_ctrl.used && collected_weapons.length>1) {

		context.fillStyle ="white";
		context.font="16px helvetica";
		used_ctrl.shown = true;
		context.fillText("Switch some weapons Rambo! Use CTRL", 410, height - 11);
	}
	if (used_ctrl.used){
		used_ctrl.counter--;
	}
	if (used_ctrl.counter > 0 && used_ctrl.used && used_ctrl.shown == true) {
		context.fillText("That's it, rock on!", 410 , height - 11);
	}

	
}
function checkAmmo(){
	if (collected_weapons[active_weapon].ammo == 0){
		active_weapon--;
		if (active_weapon < 0){
			active_weapon = collected_weapons.length-1;
		}
		console.log("äctive weapon" + active_weapon);
		checkAmmo();
	}
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
	enemies[i].x-=3;
	}
}
function hit(){
	if(!gameIsOver){
		sound_gameover.play();
	}
	if (player.lives != 0){
		player.lives--;
		enemies = [];
		powerUps = [];		
		projectiles = [];
		enemy_bullets=[];
		player.x = 10;
	} else {
		death();
		gameStatus = 5;
		splash =true;
	} 
}
function death(){
	if(!gameIsOver){
		sound_gameover.play();
		showNewHighscore();
	}
	setTimeout(function(){
		gameIsOver = true;
		// resetScores();
	},10)
}
function resetScores(){
	splash = true;
	clearInterval(loop);
	gameRuning = false;
	console.log("gameOver");
	gameOver = true;
	if (!levelFinished){
	context.fillStyle="#fff";
	context.font="48px helvetica";
	context.fillText("GAME OVER", 370, 240);
	context.font="20px helvetica";
	context.fillText("Press enter for new game", 400,  280);
	}
	enemies = [];
	powerUps = [];
	counter = 0;
	tank.x = width + 180;
	enemy_bullets=[];
	collected_weapons = [pistol,minigun,shotgun,rocketa];
	active_weapon = 0;
	minigun.ammo = 0;
	player.driving = false;
	shotgun.ammo = 0;
	tank.presentTime = tank.maxPresentTime;
	final_boss.health = final_boss.maxHealth;
	final_boss.x = 1200;
	rocketa.ammo = 0;
	used_ctrl.used = false;
	used_ctrl.shown = false;
	used_ctrl.counter = 130;
	player.x = 10;
	projectiles = [];
	
	score = 0;
	
	gameIsOver = false;
	player.lives=3;
	
}
function collision(first, second){
	return !(first.x > second.x + second.width || 
		first.x+first.width<second.x ||
		first.y > second.y + second.height || 
		first.y+first.height<second.y);
}

function addBullets(){
	if (active_weapon == 1){
		minigun.ammo--;
		if (minigun.ammo <= 0){
			minigun.ammo = 0;
		}
	}
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
	shotgun.ammo--;
	if (shotgun.ammo <= 0){
		shotgun.ammo = 0;
	}
	console.log("Ammo"+shotgun.ammo);

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
	sound_shoot[shoot_counter-1].play(); 
	shoot_counter--;
	enemy_bullets.push({
		x: enemies[id].x,
		y: enemies[id].y + (enemies[id].height-12)/2,
		height: 4,
		width: 4,
		speed: 5
	});
}
function addRockets(){
	rocketa.ammo--;
	console.log("Ammo"+rocketa.ammo);

	if (rocketa.ammo <= 0){
		rocketa.ammo = 0;
	}
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
function addTenkBullets(){
	if (shoot_counter == 0){
		shoot_counter = 5
	}
	sound_tank_bullet[shoot_counter-1].play();
	shoot_counter--;
	tank.bullets.push({
		x: player.x+91,
		y: player.y + 22,
		height: 4,
		width: 10,
		speed: 30,
		damage:7
	});
}
function mute(){
	if (!muted){
	for (i=0;i<5;i++){
		sound_hit[i].volume = 0;
		sound_shoot[i].volume = 0;
		sound_shotgun[i].volume = 0;
		sound_rocket[i].volume = 0;
		sound_tank_bullet[i].volume = 0;
	}
	for (i=0;i<25;i++){
		sound_explode[i].volume = 0;
	}
	sound_gameover.volume = 0;
	splash_music.volume = 0;
	muted = true;
	$(".mute").toggleClass("muted");

	} else {
		for (i=0;i<5;i++){
			sound_hit[i].volume = 0.2;
		}
		for (i=0;i<5;i++){
			sound_tank_bullet[i].volume = 0.2;
		}
		for (i=0;i<5;i++){
			sound_shoot[i].volume = 0.3;
		}
		for (i=0;i<5;i++){
			sound_rocket[i].volume = 0.3;
		}
		for (i=0;i<5;i++){
			sound_shotgun[i].volume = 0.5;
		}
		for (i=0;i<5;i++){
			sound_tank_bullet[i].volume = 0.5;
		}
		for (i=0;i<25;i++){
			sound_explode[i].volume = 0.3;
		}
		sound_gameover.volume = 1;
		splash_music.volume = 1;
		muted = false;
	$(".mute").toggleClass("muted");

	}
}
for (i=0;i<5;i++){
 sound_hit.push(new Audio("hit.wav"));
 sound_hit[i].volume = sound_hit_volume;
}
for (i=0;i<5;i++){
 sound_tank_bullet.push(new Audio("tank_rocket.wav"));
 sound_tank_bullet[i].volume = sound_tank_bullet_volume;
}
for (i=0;i<25;i++){
	sound_explode.push(new Audio("explode.wav"));
	sound_explode[i].volume = 0.3;
}
for (i=0;i<5;i++){
 sound_shotgun.push(new Audio("shotgun.wav"));
 sound_shotgun[i].volume = sound_shotgun_volume;
}
for (i=0;i<5;i++){
 empty.push(new Audio("empty.wav"));
}
for (i=0;i<5;i++){
 sound_shoot.push(new Audio("shoot.wav"));
 sound_shoot[i].volume = sound_shoot_volume;
}
for (i=0;i<5;i++){
 sound_rocket.push(new Audio("rocket.wav"));
 sound_rocket[i].volume = sound_rocket_volume;
}