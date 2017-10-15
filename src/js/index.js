var hash = window.location.hash.substr(1);
var username = '';
var password = '';
var script = '';
if(hash.split(':').length == 2 && hash.split('@').length == 2) {
	username = hash.split(':')[0].split('@')[1];
	password = hash.split(':')[1];
}
if(username !== '' && password !== '') {
	script = hash.split('@')[0];
} else {
	script = hash;
}
function fadeOn() {
	$('#body, #loader').addClass('fade');
}
function fadeOff() {
	$('#body, #loader').removeClass('fade');
}
$(document).ready(function() {
	function ready() {
		if(username !== '' && password !== '') {
			$('input[name=username]').val(username);
			$('input[name=password]').val(password);
			setInterval(function() {
				$('#li').click();
			}, 100);
		} else {
			fadeOff();
		}
	};
	$.getJSON('config/config.json', function(data) {
		if(script !== '' && $.inArray(script, data) !== -1) {
			$.get('config/scripts/'+script+'.js', ready);
			history.pushState({}, null, './');
		} else {
			$.get('config/scripts/default.js', ready);
		}
	});
	$('#li').click(function() {
		fadeOn();
	});
	$(document).keypress(function(e) {
		if(e.keyCode == 13) {
			$('#li').click();
		}
	});
});