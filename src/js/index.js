$(document).ready(function() {
	if(window.location.hash.substr(1) !== '') {
		$.get('config/scripts/'+window.location.hash.substr(1)+'.js');
		history.pushState({}, null, './');
	} else {
		$.get('config/scripts/default.js');
	}
	$('#li').click(function() {
		$('#body, #loader').addClass('fade');
		setTimeout(function() {
			window.location = '/';
		}, 5000);
	});
	$(document).keypress(function(e) {
		if(e.keyCode == 13) {
			$('#li').click();
		}
	});
});