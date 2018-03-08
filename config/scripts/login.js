if(window.location.hash == '#logout') {
	localStorage.AUTH = '';
}
var ran = false;
function showForm(e) {
	fadeOff();
	$('#progress').text('');
	$('#li').click(function() {
		$('#progress').text('Authenticating...');
		$.post('https://api.belowaverage.org/v1/AUTH/', {
			username: $('input[name=username]').val(),
			password: $('input[name=password]').val()
		}, function(AUTH) {
			localStorage.AUTH = AUTH;
			$('#progress').text('');
			fadeOn();
			parent.postMessage(AUTH, e.origin);
		}).fail(function(e) {
			$('#error').text(e.responseText);
			fadeOff();
		});
	});
}
$(document).ready(function() {
	fadeOn();
	$('#progress').text('Verifying login trust...');
	$.getJSON('config/scripts/login/trusted.json', function(trusted) {
		onmessage = function(e) {
			if($.inArray(e.origin, trusted) !== -1 && !ran) {
				ran = true;
				parent.postMessage('ready', e.origin);
				if(typeof localStorage.AUTH == 'string' && localStorage.AUTH.length == 32) {
					$('#progress').text('Authenticating...');
					$.post('https://api.belowaverage.org/v1/AUTH/', {AUTH: localStorage.AUTH}, function() {
						$('#progress').text('');
						parent.postMessage(localStorage.AUTH, e.origin);
					}).fail(function() {
						showForm(e);
					});
				} else {
					showForm(e);
				}
			} else if(!ran) {
				ran = true;
				$('#progress').text('');
				$('#error').html('<b>WARNING</b>: This page is not authorized to perform login requests.');
				$('input[name=username], input[name=password], #li').attr('disabled', true);
				fadeOff();
			}
		};
	});
});