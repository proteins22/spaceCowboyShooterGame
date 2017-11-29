var width = window.innerWidth;
var height = window.innerHeight;

var counter = 0;

function getCookie(name) {
	var dc = document.cookie;
	var prefix = name + "=";
	var begin = dc.indexOf("; " + prefix);
	if (begin == -1) {
		begin = dc.indexOf(prefix);
		if (begin != 0) return null;
	}
	else
	{
		begin += 2;
		var end = document.cookie.indexOf(";", begin);
		if (end == -1) {
		end = dc.length;
		}
	}
	return unescape(dc.substring(begin + prefix.length, end));
}

var myCookie = getCookie("sk-oldDominion-cs");

var checkReady = setInterval(function(){

	if (myCookie == null) {
		if(counter >= 3){
			$('.pre').fadeOut();
			clearInterval(checkReady);
			$('body').addClass('start');
		}
		counter+=1;
		console.log(counter);
	}

	else{
		setTimeout(function(){
			$('.cs-datacapture').remove();
			$('.cookie').show();
			$('.pre').fadeOut();
			clearInterval(checkReady);
			$('body').addClass('start');
		},2000);
		$('.cookie span.hs').html(Cookies.get('highScore'));
	}

},1000);

$('#test, .btn-primary').click(function(){
	$('body').addClass('game');

	setTimeout(function(){
		$('html, body').animate({
        	scrollTop: $("#game").offset().top
    	}, 1500);
	},1500);

	game.state.start('title');
	//console.log(Phaser)
});

// $('#test2').click(function(){
// 	$('body').addClass('start');
// });

// Create IE + others compatible event handler
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
var counter = 0;

// Listen to message from child window
eventer(messageEvent,function(e) {
	jQuery('.cs-data').height(e.data.height);
	if (e.data.closeme === "close now") {
		$('body').addClass('game');
		game.state.start('title');
		//console.log(true);
		setTimeout(function(){
			$('html, body').animate({
				scrollTop: $("#game").offset().top
			}, 1500);
			$('.startPage').remove();
			$('body').focus();	
		},1500);
		setTimeout(function(){
			$('body').focus();
		},100);
		document.cookie ='sk-oldDominion-cs=data-oldDominion-true; expires=Fri, 1 Aug 2017 20:47:11 UTC; path=/'
	}
	return counter+=1;
});

function daysUntil(year, month, day) {
  var now = new Date(),
      dateEnd = new Date(year, month - 1, day+1), // months are zero-based
      days = (dateEnd - now) / 1000/60/60/24;   // convert milliseconds to days

  return Math.round(days);
}

var now = new Date();
var dd = now.getDate();
var mm = now.getMonth()+1; //January is 0!
var yyyy = now.getFullYear();

if(dd<10) {
    dd='0'+dd
} 

if(mm<10) {
    mm='0'+mm
} 

now = yyyy+','+mm+','+dd;
console.log(now)

var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

var firstDate = new Date();
var secondDate = new Date(2016,08-1,22);

console.log(firstDate +" + "+ secondDate);
	
var daysR = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));

//var daysR = parseInt(daysUntil(2016, 8, 22));

console.log(daysR);
if(daysR <= 1){
 	$('.header span').html('Tomorrow');
}
 else{
	$('.header span').html('in '+daysR+' days'); 
}

function clickScroll(){
	$('.next').click(function(){
		$(this).parent().parent().find('#helpvideo').get(0).pause();
		$(this).parent().parent().animate({
			left: '-100%'
		}, 500);
		$(this).parent().parent().next().find('#helpvideo').get(0).play();
		$(this).parent().parent().next().animate({
			left: '0%'
		}, 500);
	});
	$('.back').click(function(){
		$(this).parent().parent().find('#helpvideo').get(0).pause();
		//console.log("next clicked");
		$(this).parent().parent().animate({
			left: '100%'
		}, 500);
		$(this).parent().parent().prev().find('#helpvideo').get(0).play();
		$(this).parent().parent().prev().animate({
			left: '0%'
		}, 500);
	});
}

function clickScrollm(){
	$('.next').click(function(){
		$(this).parent().parent().animate({
			left: '-100%'
		}, 500);
		$(this).parent().parent().next().animate({
			left: '0%'
		}, 500);
	});
	$('.back').click(function(){
		//console.log("next clicked");
		$(this).parent().parent().animate({
			left: '100%'
		}, 500);
		$(this).parent().parent().prev().animate({
			left: '0%'
		}, 500);
	});
}

$('.showGuitar').click(function(){
	$('.guitarPic').fadeIn();
});

$('.howto').click(function(){
	$('#help').fadeIn();
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || width <= 860 ) {
		clickScrollm();
		$('#help video').attr('controls');
	}
	else{
		$('.page1 #helpvideo').get(0).play();
		clickScroll();
	}
});


$('.close').click(function(){
	$('.guitarPic').fadeOut();
	$('.reminder').fadeOut();
	$('#help').fadeOut();
	$('#helpvideo').get(0).pause();
});

function reminderText(){
	$('.reminder').fadeIn();	
}

//reminderText();