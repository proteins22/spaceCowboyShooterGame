var bootState = {
	create: function(){


		game.physics.startSystem(Phaser.Physics.ARCADE);
		console.log("%cloading...", "color:#000; background:yellow; padding:5px;");
		
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		game.scale.minWidth = 240;
 		game.scale.minHeight = 350;
 		game.scale.maxWidth = 860;
 		game.scale.maxHeight = 500;

 		game.scale.pageAlignHorizontally = true;
 		game.scale.pageAlignVertically = true;

		
		game.scale.updateLayout(true);
	

	game.state.start('preload');	
	}
};