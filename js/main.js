var oldWindowSize;

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
	
	// Logos
	loadLogo('');
	
	loadLogo('main_');
	
	oldWindowSize = $(window).width();
	$(window).resize(function(){
		if (($(window).width() >= 980 && oldWindowSize < 980) ||
			($(window).width() < 980 && oldWindowSize >= 980)) {
			loadLogo('main_');
		}
		oldWindowSize = $(window).width();
	});
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
	var offset;
	if (width > 1200) {
		offset = 40;
	} else if (width >= 980) {
		offset = 30;
	} else {
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

function loadPads() {
	var canvas = document.getElementById("pads");
	var ctx = canvas.getContext("2d");
	var img = new Image();
	img.src = "img/pad.png";
	
	img.onload = function() {	
		var padWidth = 60;
		var padHeight = 69;
	
		var row = 0;
		do {
			var column = 0;
			var verticalOffset = -padHeight * 3/4;
			var horizontalOffset = (row%2 == 0) ? -padWidth / 2 : 0;
			do {
				ctx.drawImage(	img,
								column * padWidth + horizontalOffset,
								row * padHeight * 3/4 + verticalOffset,
								padWidth,
								padHeight);
				column++;
			} while((column - 2) * padWidth + horizontalOffset < canvas.offsetWidth);
			row++;
		} while((row - 1) * padHeight * 3/4 + verticalOffset < canvas.offsetHeight);
	};
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
