var PAD_WIDTH = 64;
var PAD_HEIGHT = 80;
var GLOBAL_I = -1;
var GLOBAL_J = -1;

var oldLogoSize, oldMainLogoSize, oldWaveformButtonSize;

function load() {
	$('.waveform_button').hover(
	    function() {
			if (!$(this).data('animating'))
				animate($(this));
			$(this).data('hover', true);
		},
	    function() {
			$(this).data('hover', false);
		}
	).data('hover', false);

	// Load pads
	loadPads();

	// $('#pads').hover(
	// 	function(e) {
	// 		selectedPad(e);
	// 	},
	// 	function() {
	// 		clearSelectedPad();
	// 	}
	// );
	
	// $('#pads').mousemove(function(e) {
	// 	selectedPad(e);
	// });
	
	// Logos
	loadLogo('');
	loadLogo('main_');
	
	oldLogoSize = $('#logo').height();
	oldMainLogoSize = $('#main_logo').height();
	oldWaveformButtonSize = $('#square_button').width();

	$(window).resize(function(){
		if ($('#logo').height() != oldLogoSize) {
			loadLogo('');
			oldLogoSize = $('#logo').height();
		}

		if ($('#main_logo').height() != oldMainLogoSize) {
			loadLogo('main_');
			oldMainLogoSize = $('#main_logo').height();
		}

		if ($('#square_button').width() != oldWaveformButtonSize) {
			loadWaves();
			oldWaveformButtonSize = $('#square_button').width();
		}
	});

	loadWaves();
}

function scroll() {
	var scrollTop = document.body.scrollTop;
	var maxWidth = document.body.offsetWidth;

	if (scrollTop == 0) {
		if (window.pageYOffset)
		scrollTop = window.pageYOffset;
		else
		scrollTop = (document.body.parentElement) ? document.body.parentElement.scrollTop : 0;
	}

	var navBar = document.getElementById("navigation_bar");
	var title = document.getElementById("main_title");
	var appStore = document.getElementById("overview_app_store");

	if ((scrollTop < 340 && maxWidth > 979) || (scrollTop < 220 && maxWidth <= 979)) {
		if (navBar.style.top != "-60px")
			navBar.style.top = "-60px";
		if (title.style.opacity != "1")
			title.style.opacity = "1";
		if (appStore.style.opacity != "1")
			appStore.style.opacity = "1";
	} else if ((scrollTop >= 340 && maxWidth > 979) || (scrollTop >= 220 && maxWidth <= 979)) {
		if (navBar.style.top != "0px")
			navBar.style.top = "0px";
		if (title.style.opacity != "0")
			title.style.opacity = "0";
		if (appStore.style.opacity != "0")
			appStore.style.opacity = "0";
	}
}

function animate(e) {
	var width = document.body.offsetWidth;
	var offset = 40;
	if (width < 1200 && width >= 980) {
		offset = 30;
	} else if (width < 980 && width >= 767) {
		offset = 26;
	}

	$(e).data('animating', true);
	$(e).animate({
		left: '-=' + offset
	}, 1000, 'linear', function() {
		$(e).css('left', '0');
		if ($(e).data('hover')) {
			animate(e);
		} else {
			$(e).data('animating', false);
		}
	});
}

function loadWaves() {
	var waveforms = ['square', 'sinus', 'sawtooth', 'triangle'];
	for (var i in waveforms) {
		waveform(waveforms[i]);
	}
}

function loadPads() {
	var canvas = document.getElementById("pads");
	var ctx = canvas.getContext("2d");
	var img = new Image();
	img.src = "img/pad.png";
	
	img.onload = function() {	
		var row = 0;
		do {
			var column = 0;
			var verticalOffset = -PAD_HEIGHT * 3/4;
			var horizontalOffset = (row%2 == 0) ? -PAD_WIDTH / 2 : 0;
			do {
				ctx.drawImage(	img,
								column * PAD_WIDTH + horizontalOffset,
								row * PAD_HEIGHT * 3/4 + verticalOffset,
								PAD_WIDTH,
								PAD_HEIGHT);
				column++;
			} while((column - 2) * PAD_WIDTH + horizontalOffset < canvas.offsetWidth);
			row++;
		} while((row - 1) * PAD_HEIGHT * 3/4 + verticalOffset < canvas.offsetHeight);
	};
}

function selectedPad(e) {
	var canvas = document.getElementById("selected_pad");
	var ctx = canvas.getContext("2d");
	var img = new Image();
	img.src = "img/selected_pad.png";
	var p = $('#pads').parent().position();
	
	var xOffsets = [0, PAD_WIDTH / 2];

	var j = Math.floor((e.pageY - p.top) / (PAD_HEIGHT * .75 * .9));
	var i = Math.floor((e.pageX - p.left + xOffsets[j%2]) / (PAD_WIDTH * .9));

    var xRelative = (e.pageX - p.left - (i * PAD_WIDTH - xOffsets[j%2])) * PAD_HEIGHT / (PAD_WIDTH / 2) * .5 * .9;
    var yRelative = e.pageY - p.top - (j - 1) * .25 * PAD_HEIGHT;

    var coef = 1;
    if (yRelative < .5 * PAD_HEIGHT - xRelative) {
        j--;
        i -= (j+3)%2;
    } else if (yRelative < xRelative - 0.5 * PAD_HEIGHT) {
        j--;
        i += 1 - (j+3)%2;
    }
	
	if (GLOBAL_I != i || GLOBAL_J != j) {
		GLOBAL_I = i;
		GLOBAL_J = j;
		clearSelectedPad();
	}
	
	img.onload = function() {
		ctx.drawImage(	img,
						i * PAD_WIDTH - xOffsets[(j + 2)%2],
						j * PAD_HEIGHT * .75,
						PAD_WIDTH,
						PAD_HEIGHT);
	}
}

function clearSelectedPad() {
	var canvas = document.getElementById("selected_pad");
	canvas.getContext("2d").clearRect(	0,
										0,
										$('#selected_pad').width() + 30,
										$('#selected_pad').height() + 30);
										
	GLOBAL_I = -1;
	GLOBAL_J = -1;
}

function loadLogo(prefix) {
	var logoPath = "M 0 60 \
					A 60 60 0 0 0 120 60 \
					A 60 60 0 1 0 0 60 \
					M 60 20 \
					L 94.6 40 \
					L 94.6 80 \
					L 60 100 \
					L 25.4 80 \
					L 25.4 40 \
					Z";
	
	var height = $('#' + prefix + 'logo').height();
	var margin = prefix === '' ? 8 : 20;
	var scaleRatio = (height - margin) / 120;
	var offset = (height - 120) / 2;
	var shadowOffset = prefix === '' ? 2 : 4;
	
	// Shadow
	$('#' + prefix + 'logo_shadow').empty();
	var shadowPaper = Raphael(prefix + "logo_shadow", height, height);
	var shadow = shadowPaper.path(logoPath);
	shadow.attr({stroke: "none", fill: "#000", opacity: ".5"});
	shadow.attr({transform: "t" + (offset + shadowOffset) + "," + (offset + shadowOffset) + "s" + scaleRatio + "," + scaleRatio});
		
	// Logo
	$('#' + prefix + 'logo').empty();
	var logoPaper = Raphael(prefix + "logo", height, height);
	var logo = logoPaper.path(logoPath);
	logo.attr({stroke: "none", fill: "90-#184166-#368FE3"});
	logo.attr({transform: "t" + offset + "," + offset + "s" + scaleRatio + "," + scaleRatio});
}

function waveform(waveform) {
	var path, offsetW;
	var button = waveform + "_button";
	var p = $('#' + button).position();
	var width = $('#' + button).width();
	var height = $('#' + button).height();
	var waveH = (height * .5).toFixed(0);
	var waveW = (width / 8).toFixed(0);

	switch(waveform) {
		case 'square':
		path = "M 0 " + waveH;
		var waveNumber = 8;
		for (var i = 0; i < waveNumber; i+=2) {
			path += "L " + (i * waveW) + " " + waveH;
			path += "L " + ((i + 1) * waveW) + " " + waveH;
			path += "L " + ((i + 1) * waveW) + " 0";
			path += "L " + ((i + 2) * waveW) + " 0";
		};
		path += "L " + (waveNumber * waveW) + " " + waveH;
		path += "L " + ((waveNumber + 1) * waveW) + " " + waveH;
		offsetW = -(waveW * .5).toFixed(0);

		break;

		case 'sinus':
		path = "M 0 " + (waveH * .5).toFixed(0);
		var offsetH = parseInt((waveH / 4)).toFixed(0);
		var offsetV = parseInt((waveH / 4).toFixed(0)) - 2;
		var curveH = parseInt(waveH) + parseInt(offsetV);
		var waveNumber = 8;
		for (var i = 0; i < waveNumber; i+=2) {
			path += "C " + (parseInt(i * waveW) + parseInt(offsetH)) + ",-" + offsetV + " " +
						   (parseInt((i + 1) * waveW) - parseInt(offsetH)) + ",-" + offsetV + " " +
						   ((i + 1) * waveW) + "," + (waveH * .5).toFixed(0);
			path += "C " + (parseInt((i + 1) * waveW) + parseInt(offsetH)) + "," + curveH + " " +
						   (parseInt((i + 2) * waveW) - parseInt(offsetH)) + "," + curveH + " " +
						   ((i + 2) * waveW) + "," + (waveH * .5).toFixed(0);
		};
		offsetW = 0;

		break;

		case 'sawtooth':
		path = "M -" + (waveW * .5).toFixed(0) + " " + waveH;
		var waveNumber = 8;
		for (var i = 0; i < waveNumber; i+=2) {
			path += "L " + ((i + 1.5) * waveW) + " 0";
			path += "L " + ((i + 1.5) * waveW) + " " + waveH;
		};
		path += "L " + ((waveNumber + 1.5) * waveW) + " " + 0;
		offsetW = -(waveW * .5).toFixed(0);

		break;

		case 'triangle':
		path = "M 0 " + waveH;
		var waveNumber = 8;
		for (var i = 0; i < waveNumber; i+=2) {
			path += "L " + (i * waveW) + " " + waveH;
			path += "L " + ((i + 1) * waveW) + " 0";
		};
		path += "L " + (waveNumber * waveW) + " " + waveH;
		offsetW = -(waveW * .5).toFixed(0);

		break;
	}

	var wavePaper = Raphael(button, width, height);
	var wave = wavePaper.path(path);
	wave.attr({	stroke: "#FFF",
				fill: "none",
				transform: "t" + offsetW + "," + ((height - waveH) * .5).toFixed(0) });
}

