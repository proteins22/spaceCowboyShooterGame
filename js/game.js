var initalPosX;
var initalPosY;

var bulletTime;
var bullets;
var lives;
var score;
var highScore;

var maxVelocity = 860;
var ACCLERATION = 600;
var DRAG = 400;
var MAXSPEED = 400;

var player;
var shipTrail;
var bank;

var level;
var winner;

var restartBtn;
var shareFBButton;
var shareTWButton;

var style = { font: "16px eightbit", fill: "#fff", align: "center"};
var boldStyle = { font: "32px eightbit", fill: "#ffffff", align: "center" };

var gameState = {
	create: function(){
		console.log(device);

		//background
		starfield = game.add.tileSprite(0, 0, game.width, game.height, 'space');
		starfield.anchor.setTo(0, 0);

		// Initialize player
		initalPosX = game.width/2;
		initalPosY = game.height - 120;
	
		initilize()

		// Initialize aliens
		createAliens();
		animateAliens();

		// Setup controls
		cursors = game.input.keyboard.createCursorKeys();
		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		restartButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
		game.input.keyboard.removeKey(37);
		game.input.keyboard.removeKey(39);
	},
	update: function() {
		update();
	}
};

function initilize(){


	player = game.add.sprite(initalPosX, initalPosY, 'ship');
	player.animations.add('left', [0], 1, true);
    player.animations.add('right', [1], 1, true);
	player.anchor.setTo(0, 0);
	game.physics.enable(player, Phaser.Physics.ARCADE);

	player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
	player.body.drag.setTo(DRAG, DRAG);
	player.body.bounce.x = 0.5;
	player.body.collideWorldBounds = true;
	player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
	player.body.drag.setTo(DRAG, DRAG);

	// Initialize bullets
	bulletTime = 0;
	createBullets();

	//  Add an emitter for the ship's trail
	shipTrail = game.add.emitter(player.x, player.y + 40, 400);
	shipTrail.width = 10;
	shipTrail.makeParticles('bullet');
	
	shipTrail.setYSpeed(30, -30);
	shipTrail.setRotation(50, -50);
	shipTrail.setAlpha(1, 0.01, 800);
	shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
	shipTrail.start(false, 5000, 10);

	//console.log(shipTrail);

	// Initialize bombs
	createBombs();

	// Initialize explosions
	explosions = game.add.group();
	explosions.createMultiple(10, 'explosion');
	explosions.setAll('anchor.x', 0.5);
	explosions.setAll('anchor.y', 0.5);
	explosions.forEach(setupExplosion, this);

	// Text bits
	//lives = 3;
	level = 1;
	score = 0;
	highScore = 0;
	createText();
	createLives();
	getHighScore();
	updateScore();

	// Initialize sounds
	shootSound = game.add.audio('shoot', 1, false);
	explodeSound = game.add.audio('explode', 1, false);
	bombSound = game.add.audio('bomb', 1, false);

	soundButton = game.add.button(30, 30,"sound", toggleMute ,this, 1, 0, 1);
	soundButton.anchor.setTo(0,0);
	soundButton.alpha = 0.8;
}

function update(){
	starfield.tilePosition.y += 2;
	playerMovement();

	// Handle aliens dropping bombs
	handleBombs();

	game.physics.arcade.overlap(bullets, aliens, bulletHitsAlien, null, this);
	game.physics.arcade.overlap(bombs, player, bombHitsPlayer, null, this);
	game.physics.arcade.overlap(aliens, player, alienHitsPlayer, null, this);

	//console.log(aliens.position.y +' + '+ player.position.y);
	descend();
}

function createLives(){
	lives = game.add.group();
	livesText = game.add.text(game.world.bounds.width - 100, initalPosY+80, "LIVES: ", style);
	livesText.anchor.set(1, 0);

	for (var i = 0; i < 3; i++)
    {
        var ship = lives.create(game.world.width - 90 + (30 * i), initalPosY+90, 'hat');
        ship.anchor.setTo(0.5, 0.5);
        ship.scale.setTo(0.7, 0.7);
        ship.angle = 0;
        ship.alpha = 1;
    }
}

function createBullets(){
	bullets = game.add.group();
	bullets.enableBody = true;
	bullets.physicsBodyType = Phaser.Physics.ARCADE;
	bullets.createMultiple(5, 'bullet');
	bullets.setAll('anchor.x', 0.5);
	bullets.setAll('anchor.y', 1);
	bullets.setAll('checkWorldBounds', true);
	bullets.setAll('outOfBoundsKill', true);
}

function createBombs(){
	bombs = game.add.group();
	bombs.enableBody = true;
	bombs.physicsBodyType = Phaser.Physics.ARCADE;
	bombs.createMultiple(10, 'bomb');
	bombs.setAll('anchor.x', 0.5);
	bombs.setAll('anchor.y', 0.5);
	bombs.setAll('checkWorldBounds', true);
	bombs.setAll('outOfBoundsKill', true);
}

function setupExplosion(explosion) {
	explosion.animations.add('explode');
}

function playerMovement() {
	//  Reset the player, then check for movement keys
    player.body.acceleration.x = 0;
    
    if (cursors.left.isDown)
    {
        player.body.acceleration.x = -ACCLERATION;
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.acceleration.x = ACCLERATION;
        player.animations.play('right');
    }

    //  Stop at screen edges
    if (player.x > game.width) {
        player.x = game.width;
        player.body.acceleration.x = 0;
    }
    
    if (player.x) {
        player.x;
        player.body.acceleration.x = 0;
    }

    //  Fire bullet
    if (fireButton.isDown || game.input.activePointer.isDown) {
        fireBullet();
    }

    //  Move ship towards mouse pointer
    if (game.input.x < game.width - 20 &&
        game.input.x > 20 &&
        game.input.y > 20 &&
        game.input.y < game.height - 20) {
        var minDist = 200;
        var dist = game.input.x - player.x;
        player.body.velocity.x = MAXSPEED * game.math.clamp(dist / minDist, -1, 1);

       	//console.log(game.input.x +" + "+ player.x);       
    }

    if(game.input.x < player.x){
    	player.animations.play('left');
    	shipTrail.setXSpeed(200, 180);
    	shipTrail.x = player.x + 50;
    }
    else{
    	player.animations.play('right');
    	shipTrail.setXSpeed(-200, -180);
    	shipTrail.x = player.x;
    }

    //  Squish and rotate ship for illusion of "banking"
    bank = player.body.velocity.x / MAXSPEED;
    //player.scale.x = 1 - Math.abs(bank) / 2;
    player.rotation = -bank/2;

	if (cursors.left.isDown && player.body.x > -maxVelocity) {
	// Move to the left
		player.body.x -= 5;	
	}

	else if (cursors.right.isDown && player.body.x < maxVelocity) {
	// Move to the right
		player.body.x += 5;	
	}

	//  Keep the shipTrail lined up with the ship
    
}

function fireBullet() {
	if (game.time.now > bulletTime) {
		bullet = bullets.getFirstExists(false);

		if (bullet) {
			// And fire it
			shootSound.play();
			if(game.input.x < player.x){
				bullet.reset(player.x + 22, player.y + 10);
			}
			else{
				bullet.reset(player.x + 32, player.y + 10);
			}
			bullet.body.velocity.y = -400;
			bullet.body.velocity.x = player.body.velocity.x / 1;
			bulletTime = game.time.now + 400;
		}
	}
}

function bulletHitsAlien (bullet, alien) {
	bullet.kill();
	explode(alien);

	if(alien.key=="meat1"){
		score += 10;
	}

	if(alien.key=="meat2"){
		score += 20;
	}

	if(alien.key=="candy1"){
		score += 30;
	}

	if(alien.key=="candy2"){
		score += 40;
	}

	updateScore();

	if (aliens.countLiving() == 0) {
		newWave();
	}
}

function alienHitsPlayer () {
	removeElements();
	explode(player);
	testScore();
}

function bombHitsPlayer (bomb) {
	removeElements();
	explode(player);
	updateLivesText();
	// When the player dies
    if (lives.countLiving() < 1)
    {
    	testScore();   
    }
    else{
    	setTimeout(function () {
    		respawnPlayer();
    	}, 1500);
    }
}

function explode(entity) {
	entity.kill();
	// And create an explosion :)
	explodeSound.play();
	var explosion = explosions.getFirstExists(false);
	explosion.reset(entity.body.x + (entity.width / 2), entity.body.y + (entity.height / 2));
	explosion.play('explode', 30, false, true);
}

function createText() {
	if(device === 'desktop'){
	}
	else{
		style = { font: "1em eightbit", fill: "#fff", align: "center" };	
	}

	levelText = game.add.text(game.world.centerX, game.world.centerY, 'Level: ' + pad(level, 0), style);
	levelText.anchor.set(0.5, 0.5);

	scoreText = game.add.text(16, initalPosY+80, '', style);
	scoreText.anchor.set(0, 0);

	highScoreText = game.add.text(game.world.centerX, 16, '', style);
	highScoreText.anchor.set(0.5, 0.5);
	highScoreText.alpha = 0;
}

function updateLivesText() {
	//lives = 3;
	live = lives.getFirstAlive();
	if (live) { live.kill(); }
}

function getHighScore() {
	savedHighScore = Cookies.get('highScore');
	if (savedHighScore != undefined) {
		highScore = savedHighScore;
	}
}

function updateScore() {
	if (score > highScore) {
		highScore = score;
	}
	scoreText.text = "SCORE: " + pad(score, 6);
	highScoreText.text = "HIGH SCORE: " + pad(highScore, 6);
}

function respawnPlayer() {
	player.body.x = initalPosX;
	player.revive();
	createBullets();
	shipTrail.start(false, 5000, 10);
	createBombs();
}

function newWave() {
	level+=1;
	levelText.text = 'Level: ' + pad(level, 0);
	levelText.visible = true;
	setTimeout(function () {
		aliens.removeAll();
		createAliens();
		animateAliens();
		levelText.visible = false;
		//console.log(level);
	}, 1000);
}

function restartGame() {
	livesText.destroy();
	gameOverText.destroy();
	gameOverExtraText.destroy();
	restartBtn.destroy();
	shareFBButton.destroy();
	shareTWButton.destroy();

	//lives = 3;
	level = 0;
	score = 0;
	createText();
	updateScore();
	createLives();
	createBullets()

	respawnPlayer();
	newWave();
}

function gameOver() {
	aliens.removeAll();
	bullets.removeAll();
	levelText.destroy();
	scoreText.destroy();
	lives.destroy();
	livesText.destroy();

	setTimeout(function() {
		gameOverText = game.add.text(game.world.centerX, game.world.centerY-120, "GAME OVER", boldStyle);	
		gameOverText.anchor.set(0.5, 0.5);

		if(daysR <= 1){
			gameOverExtraText = game.add.text(game.world.centerX, gameOverText.y+80, "You reached level "+level+" with the score of: "+score+"! Why not see if you can get an even higher score cowboy? Don't forget, announcement coming tomorrow!", { font: "16px Dos", fill: "#fff", align: "center", wordWrap: true, wordWrapWidth: game.world.width-100});
		}
		 else{
			gameOverExtraText = game.add.text(game.world.centerX, gameOverText.y+80, "You reached level "+level+" with the score of: "+score+"! Why not see if you can get an even higher score cowboy? Don't forget, announcement coming in "+daysR+" days!", { font: "16px Dos", fill: "#fff", align: "center", wordWrap: true, wordWrapWidth: game.world.width-100});
		}

		gameOverExtraText.anchor.set(0.5, 0.5);

		restartBtn = game.add.button(game.world.centerX, gameOverExtraText.y+100,"restart", restartGame,this,1,0);
		restartBtn.anchor.setTo(0.5,0.5);

		shareFBButton = game.add.button(game.world.centerX, restartBtn.y+50,"fb", shareFB,this,1,0);
		shareFBButton.anchor.setTo(0.5,0.5);

		shareTWButton = game.add.button(game.world.centerX, shareFBButton.y+50,"tw", shareTW,this,1,0);
		shareTWButton.anchor.setTo(0.5,0.5);

		Cookies.set('highScore', highScore, { expires: '2078-12-31' });
		
		reminderText();
	}, 1000);

	//the "click to restart" handler
    //game.input.onTap.addOnce(restartGame,this);
}


	//facebook share
window.fbAsyncInit = function() {
	FB.init({
		appId : '503334493206829',
		xfbml : true,
		version : 'v2.0',
		status  : true
	});
};

function shareFB() {
	FB.ui({
		method: 'feed',
		name: 'Old Dominion Meat & Candy',
		caption: 'Play ’Meat and Candy: The Game’ for your chance to win a limited edition Meat and Candy guitar BIG NEWS COMING SOON http://bit.ly/fPlayMC',
		description: ('I just scored '+ score + ' points!'),
		link: 'http://www.olddominion.com',
		picture: 'http://assets.crowdsurge.com/store/olddominion/images/meta2.png'
	},
	function(response) {});
}

(function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


function shareTW() {
    var w = 626;
    var h = 436;
    var url = 'http://twitter.com/intent/tweet?text=I%20just%20scored%20'+ score + '%20points!%20Play%20for%20your%20chance%20to%20win%20a%20limited%20edition%20#Meat%20and%20Candy%20guitar%20http://bit.ly/tPlayMC';
    var title = 'Old Dominion Meat & Candy';

    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
}

function createAliens() {
	aliens = game.add.group();
	aliens.enableBody = true;
	aliens.physicsBodyType = Phaser.Physics.ARCADE;

	var alien;
	//console.log(game.world.height/4);

	if(device === 'desktop' || width >= 640){
		//console.log('desktop enemies');
		for (var y = 0; y < 4; y++) {
			for (var x = 0; x < 10; x++) {
				if(y==0){
					alien = aliens.create(x * 72, y * game.world.height/12, 'candy2');
				}
				if(y==1){
					alien = aliens.create(x * 72, y * game.world.height/12, 'candy1');
				}
				if(y==2){
					alien = aliens.create(x * 72, y * game.world.height/12, 'meat2');
				}
				if(y==3){
					alien = aliens.create(x * 72, y * game.world.height/12, 'meat1');
				}
				alien.anchor.setTo(0, 0);
				alien.body.moves = false;
			}
		}
		aliens.x = 60;
		aliens.y = game.world.height/8;
	}
	else{
		//console.log('mobile enemies');
		for (var y = 0; y < 4; y++) {
			for (var x = 0; x < 6; x++) {
				if(y==0){
					alien = aliens.create(x * 50, y * 30, 'candy2');
				}
				if(y==1){
					alien = aliens.create(x * 50, y * 30, 'candy1');
				}
				if(y==2){
					alien = aliens.create(x * 50, y * 30, 'meat2');
				}
				if(y==3){
					alien = aliens.create(x * 50, y * 30, 'meat1');
				}
				alien.anchor.setTo(0.5, 0.5);
				alien.body.moves = false;
			}
		}
	aliens.x = 60;
	aliens.y = game.world.height/12;
	}

	aliens.forEach(function (alien, i) {
    	game.add.tween(alien).to( { y: alien.body.y + 5 }, 500, Phaser.Easing.Sinusoidal.InOut, true, game.rnd.integerInRange(0, 500), 1000, true);
  	});
}

function animateAliens(alien) {
  	// All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
  		setTimeout(function(){
  			levelText.visible = false;
  		},1000);

 		var diff = game.world.width - aliens.width;

  		var tween = game.add.tween(aliens).to( { x: diff-30}, 2500 / (level/2), Phaser.Easing.Sinusoidal.InOut, true, 0, 1000, true);

  	// When the tween loops it calls descend
  	//console.log(tween);
  	//tween.onLoop.add(descend, this);
}

function handleBombs() {
	aliens.forEachAlive(function (alien) {
		chanceOfDroppingBomb = game.rnd.integerInRange(0, 150 * (aliens.countLiving() / level ) );
		if (chanceOfDroppingBomb == 0) {
			dropBomb(alien);
		}
	}, this);
}

function dropBomb(alien) {
	bomb = bombs.getFirstExists(false);

	if (bomb && player.alive) {
		bombSound.play();
		// And drop it
		bomb.reset(alien.x + aliens.x, alien.y + aliens.y + 16);
		bomb.body.velocity.y = +50 * level;
		bomb.body.gravity.y = 250
	}
}

function descend() {
	var alienPosition = parseInt(aliens.position.y + 100);
	var playerPosition = parseInt(player.position.y);

	if (player.alive) {
		if (device == 'desktop'){
			aliens.y += 0.05 + (level/2000);
		}
		else{
			aliens.y += 0.10 + (level/2000);
		}

		if(alienPosition === playerPosition + 200){
			removeElements();
			explode(player);
			testScore();
		}
	//game.add.tween(aliens).to( { y: aliens.y + 5 * level }, 2500, Phaser.Easing.Linear.None, true, 0, 0, false);
	}
}

function testScore() {
	if(score >= 3000){
		//console.log('winner');
		winner = true;
		gameOver();
	}
	else{
		//console.log('close');
		winner = false;
		gameOver();
	}
}

function removeElements(){
	bombs.removeAll();
	bullets.removeAll();
	shipTrail.kill();
}

function pad(number, length) {
	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
}

function toggleMute() {
	if (!game.sound.mute) {
		game.sound.mute = true;
		soundButton.setFrames(0,1);
	} else {
		game.sound.mute = false;
		soundButton.setFrames(1,0);
	}
}