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
var shotgun = {
	ammo : 0
}
var minigun = {
	ammo : 0
}
var rocketa = {
	ammo : 0
}
var pistol = {
	ammo : Infinity
}
var collected_weapons = [pistol,minigun,shotgun,rocketa];
var active_weapon = 0;
var paused = false;
var images = [];
var doneImages = 0;
var requiredImages = 0;
var gameIsOver = false; 
var powerUps = [];
var shoot_counter = 5;
var hit_counter = 5;
var sound_hit = [];
var empty = [];
/*Sound & Music volumes*/
var sound_hit_volume = 0.2
var sound_shoot_volume = 0.3;
var sound_explode_volume = 0.1;
var sound_rocket_volume = 0.3;
var sound_shotgun_volume = 0.5;
var sound_dying_volume = 0.9;
var sound_splash_music_volume = 1;

for (i=0;i<5;i++){
 sound_hit.push(new Audio("hit.wav"));
 sound_hit[i].volume = sound_hit_volume;
}
var sound_explode = new Audio("explode.wav");
sound_explode.volume = sound_explode_volume;
var sound_shotgun = [];
for (i=0;i<5;i++){
 sound_shotgun.push(new Audio("shotgun.wav"));
 sound_shotgun[i].volume = sound_shotgun_volume;
}
for (i=0;i<5;i++){
 empty.push(new Audio("empty.wav"));
}
var sound_shoot = [];
for (i=0;i<5;i++){
 sound_shoot.push(new Audio("shoot.wav"));
 sound_shoot[i].volume = sound_shoot_volume;
}
var sound_rocket = [];
for (i=0;i<5;i++){
 sound_rocket.push(new Audio("rocket.wav"));
 sound_rocket[i].volume = sound_rocket_volume;
}



var splash_music = new Audio("splash_screen_music.wav");
splash_music.addEventListener("ended", function(){
	this.currentTime = 1;
	this.play();
},false);
var tank = {
	x:- 100,
	y: 300,
	width: 100,
	height:50,
	image: 18,
	visible:false
}
var sound_gameover = new Audio("dying.wav");
var gravity = 0.5;
var rockets = [];
var shotguns = [];
var powerUp = function(ide,type){
	this.x= Math.random()*(width - 35) ;
	this.y= Math.random()*(height - 35 - 32 -31) +31;
	this.height = 35;
	this.width = 35;
	this.image_no = ide;
	this.z = type;
}
var enemy = function(){
	this.x = width;
	this.y= Math.random()*(height-80 - 20)+20;
	this.width= 24;
	this.height= 56;
	this.isMoving = false;
	this.movingTime= 20;
	this.movingSpeed= 4;
	this.health= 5;
	this.maxHealth = 5;
	this.name_id= "normal";
}
var enemyShooting = function(){
	this.x = width - 20;
	this.y= Math.random()*(height-80 - 20)+20;
	this.width= 35;
	this.height= 58;
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
	this.y= Math.random()*(height-260)+95;
	this.width= 32;
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
	this.y= Math.random()*(height-80 - 20)+20;
	this.width= 35;
	this.height= 70;
	this.isMoving = false;
	this.movingTime= 20;
	this.movingSpeed= 2;
	this.health= 15;
	this.maxHealth = 15;
	this.name_id = "boss";
}
var enemies = [];
var used_ctrl = {
	used:false,
	shown:false,
	counter:130
}
var projectiles = [];
var enemy_bullets = [];
var score = 0;
window.addEventListener("keydown", function(e){
	keys[e.keyCode] = true;
}, false);
window.addEventListener("keyup", function(e){
	delete keys[e.keyCode];
}, false);
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
var gameOver = false;
var splash = true;
var loop;
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
// init();
function start(){
	splash_music.pause();
	splash_music.currentTime = 0;
	loop = setInterval(function(){
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
window.addEventListener("keydown", function(e){
	if(e.keyCode==17 && !gameIsOver){
		if (collected_weapons.length > 1 ){
			used_ctrl.used = true;
		}
		switchWeapon();
		console.log("this is active weapon: "+active_weapon);
		console.log(typeof(collected_weapons[active_weapon]));
		// for (i=0;i<=3;i++)
		// 	if (typeof(collected_weapons[active_weapon]) === "undefined"){
		// 		console.log("no weapon");
		// 		active_weapon++;
		// 	} else {
		// 		break;
		// 	}
		
		console.log("active_weapon" + active_weapon);
	}
}, false);
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
		img.src = paths[i];
		images[i] = img;
		images[i].onload = function(){
			doneImages++;
			console.log(doneImages);
		}
	}
}
initImages(["splash_front.png", "background.jpg", "player_r.png",
	"player_w.png","gun2.png","gun2_stat.png","gun3.png","gun3_stat.png",
	"player-dead.png","head.png","smajser-footer.png","player_normal.png","mumija.png","zombi.png","kiklop.png","alien.png","smajser-ikona.png","smajser.png","tank-empty.png"]);
//last image 18
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
	if(counter > 200 ){
		tank.visible = true;
		if(tank.x <300) {
			tank.x+=3;
		}
	}
	if(counter % 450 == 0){
		powerUps.push(new powerUp(6,"r"));
	}
	if(counter % 400 == 0){
		powerUps.push(new powerUp(16,"s"));
	}
	if(keys[13] && gameIsOver){
		gameover();
	}
	if(keys[32] && shootTimer <=0 && !gameIsOver) {
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
					shotgun.ammo+=10;
				console.log("Ammo"+shotgun.ammo);
			}
			powerUps.splice(i,1);
		}
	}
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
					if(enemies[j].name_id=='boss'){
					score+=5;
					} else {
						score++;
					}
					sound_explode.play();
					enemies.splice(j,1);
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
					if(enemies[j].name_id=='boss'){
					score+=5;
					} else {
						score++;
					}
					sound_explode.play();
					enemies.splice(j,1);
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
				}
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

	// if (collected_weapons[active_weapon].ammo<=0){
	// 	for (i in collected_weapons) {
	// 		if(collected_weapons[i].ammo > 0){
	// 			active_weapon = i;
	// 		}
	// 	}
	// }
	checkAmmo();
	moveEnemy();
	movingEnemy();
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
	context.drawImage(images[1],0,0,width,height);
	context.fillStyle="white";
	context.fillRect(65, height-25, 1, 18);
	context.fillRect(394, height-25, 1, 18);
	if (tank.visible){
		context.drawImage(images[tank.image],tank.x,tank.y,tank.width,tank.height);
	}
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
		if(active_weapon==3){
			context.drawImage(images[2],player.x, player.y,player.width, player.height);
		} else if(active_weapon==2) {
			context.drawImage(images[17],player.x, player.y,player.width, player.height);
		}else if(active_weapon==1) {
			context.drawImage(images[3],player.x, player.y,player.width, player.height);
		} else {
			context.drawImage(images[11],player.x, player.y,player.width, player.height);
		}
	} else {
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
		// context.fillStyle=powerUps[i].background;
		// context.fillStyle=powerUps[i].color;
		// context.fillText(powerUps[i].z ,powerUps[i].x+7, powerUps[i].y+26);
		context.drawImage(images[powerUps[i].image_no],powerUps[i].x,powerUps[i].y)
	}
	/* #Enemies Render */
	for (i in enemies){
		// Collision black cubes, uncomment next two lines to see
		// context.fillStyle="black";
		// context.fillRect(enemies[i].x, enemies[i].y,enemies[i].width,enemies[i].height);

		
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
		// context.fillRect(enemies[i].x, enemies[i].y+20,enemies[i].width,enemies[i].height/2-10);
		// context.fillRect(enemies[i].x, enemies[i].y+ enemies[i].height/2,enemies[i].width/3,enemies[i].height/2);
		// context.fillRect(enemies[i].x+ enemies[i].width/3*2, enemies[i].y+ enemies[i].height/2,enemies[i].width/3,enemies[i].height/2);
		//health bar
		context.fillStyle="red";
		context.fillRect(enemies[i].x - (enemies[i].maxHealth*6)/2 + enemies[i].width/2, enemies[i].y-20,enemies[i].maxHealth*6,5);
		context.fillStyle="green";
		context.fillRect(enemies[i].x - (enemies[i].maxHealth*6)/2 + enemies[i].width/2, enemies[i].y-20,enemies[i].health*6,5);
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
function hit(){
	if(!gameIsOver){
		sound_gameover.play();
	}
	if (player.lives != 0){
		player.lives--;
		enemies = [];
		powerUps = [];
		counter = 0;
		
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
		showNewHighscore();
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
	collected_weapons = [pistol];
	active_weapon = 0;
	minigun.ammo = 0;
	shotgun.ammo = 0;
	rocketa.ammo = 0;
	used_ctrl.used = false;
	used_ctrl.shown = false;
	used_ctrl.counter = 130;
	player.x = 10;
	projectiles = [];
	
	score = 0;
	
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
