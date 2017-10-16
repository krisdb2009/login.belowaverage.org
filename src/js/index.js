var hash = window.location.hash.substr(1);
var username = '';
var password = '';
var url = location.origin + location.pathname;
if(hash.split(':').length == 2 && hash.split('@').length == 2) {
	username = hash.split(':')[0].split('@')[1];
	password = hash.split(':')[1];
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
		if(typeof data[url] == 'string') {
			$.get('config/scripts/'+data[url]+'.js', ready);
		} else {
			ready();
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