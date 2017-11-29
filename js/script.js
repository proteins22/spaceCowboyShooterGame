var width = window.innerWidth;
var height = window.innerHeight;
var device;

//var game = new Phaser.Game(width, height, Phaser.AUTO, 'game');

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || width <= 860 ) {
	var device = 'mobile';
	var game = new Phaser.Game(width, height, Phaser.AUTO, 'game');
}

else{
	var device = 'desktop';
	var game = new Phaser.Game(860, 500, Phaser.AUTO, 'game');

}
	game.state.add('boot', bootState);
	game.state.add('preload', loadState);
	game.state.add('title', titleState);
	game.state.add('game', gameState);
	game.state.add('gameOver', overState);
	game.state.start('boot');