var loadState = {
	preload: function(){
		game.load.crossOrigin = 'anonymous';

		var style = { font: "16px eightbit", fill: "#fff", align: "center" };
		var boldStyle = { font: "32px eightbit", fill: "#ffffff", align: "center" };

		game.load.spritesheet('countdown', 'images/countdown.png?v4', 45, 45);
		game.load.spritesheet('ship', 'images/cowboy.png', 50, 50);
		game.load.spritesheet('sound', 'images/sound.png?v3', 20, 17);
		game.load.spritesheet('explosion', 'images/explosion.png', 80, 80);
		game.load.spritesheet('restart', 'images/btn-restart.png?v2',149,21);
		game.load.spritesheet('fb', 'images/share-fb.png?v2', 234, 15);
		game.load.spritesheet('tw', 'images/share-tw.png?v2', 220, 15);
		game.load.image('space', 'images/space.jpg');
		game.load.image('hat', 'images/hat.png');
		game.load.image('bullet', 'images/bullet.png');
		game.load.image('meat1', 'images/meat-flank.png');
		game.load.image('meat2', 'images/meat-steak.png');
		game.load.image('candy1', 'images/candy-corn.png');
		game.load.image('candy2', 'images/candy-ball.png');
		game.load.image('bomb', 'images/bomb.png');
		game.load.audio('shoot', 'sounds/laser.wav');
		game.load.audio('explode', 'sounds/explosion.mp3');
		game.load.audio('bomb', 'sounds/bomb.mp3');
		//console.log(style);

		var loadingLabel = game.add.text(game.width/2 ,game.height/2, 'loading...', {font:'30px eightbit', fill: '#fff'});
			loadingLabel.anchor.setTo(0.5,0.5);
	},

	create: function(){
		console.log("%cstarting game...", "color:#000; background:yellow; padding:5px;");
		//game.state.start('game');
		//game.state.start('title');
	}
};