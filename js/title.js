var titleState = {
	create: function(){

		var countdown;
		var anim;
		var loopText;

		starfield = game.add.tileSprite(0, 0, game.width, game.height, 'space');
		starfield.anchor.setTo(0, 0);

		setTimeout(function(){
			countdown = game.add.sprite(game.world.centerX, game.world.centerY, 'countdown', 1);
			countdown.scale.set(1);
			countdown.anchor.set(0.5, 0.5);
			countdown.smoothed = false;
			
			anim = countdown.animations.add('count');

			anim.onStart.add(animationStarted, this);
			//anim.onLoop.add(animationLooped, this);
			anim.onComplete.add(animationStopped, this);
			anim.play(1.5, true);
		},1000);
		

		function animationStarted(sprite, animation) {
			newtext = game.add.text(game.world.centerX, game.world.centerY-50, 'GET READY!', style);
			newtext.anchor.setTo(0.5, 0.5);
			animation.loop = false;
		}

		function animationLooped(sprite, animation) {
			if (animation.loopCount === 2){
				//loopText = game.add.text(32, 64, 'Animation looped', { fill: 'white' });
				animation.loop = false;
			}
			else{
				//loopText.text = 'Animation looped x2';
				animation.loop = false;
			}
		}

		function animationStopped(sprite, animation) {
			game.state.start('game');
			//game.add.text(32, 64+32, 'Animation stopped', { fill: 'white' });
		}

		//playButton = game.add.button(game.width/2 ,game.height/2, "play",this.playTheGame,this);
		//playButton.anchor.setTo(0.5,0.5);
		
	},
	playTheGame: function(){
		game.state.start('game');
		console.log("%cGame Start!", "color:green; background:none; padding:5px;");
	}
};