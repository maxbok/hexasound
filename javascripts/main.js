function resize() {
	// Logo
	var logo = document.getElementById('logo');
	var title = document.getElementById('project_title');
	
	if (document.body.offsetWidth > 660 + 2 * 200) {
		var content = document.getElementById('main_content');
		var value = content.offsetLeft - logo.offsetWidth;

		logo.style.opacity = 1;
		logo.style.left = -logo.offsetWidth + "px";
	} else {
		logo.style.opacity = 0;
	}
}
