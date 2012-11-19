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
	$(e).data('animating', true);
	$(e).animate({
		left: '-=42'
	}, 1000, 'linear', function() {
		$(e).css('left', '0');
		if ($(e).data('hover')) {
			animate(e);
		} else {
			$(e).data('animating', false);
		}
	});
}
