$(document).ready(function() {
	if(document.location.hostname == 'api.belowaverage.org') {
		if(location.hash.length == 33) {
			function send_auth(AUTH) {
				localStorage.setItem('AUTH', AUTH);
				$.post('https://api.belowaverage.org/v1/message/', {
					id: hash.split('#')[0],
					message: AUTH
				});
			}
			if(typeof localStorage.AUTH == 'string' && localStorage.AUTH.length == 32) {
				fadeOn();
				$.post('https://api.belowaverage.org/v1/AUTH/', {AUTH: localStorage.AUTH}, function() {
					fadeOn();
					send_auth(localStorage.AUTH);
				}).fail(function() {
					localStorage.removeItem('AUTH');
					fadeOff();
				});
			}
			$('#li').click(function() {
				$.post('https://api.belowaverage.org/v1/AUTH/', {
					username: $('input[name=username]').val(),
					password: $('input[name=password]').val()
				}, function(AUTH) {
					send_auth(AUTH);
				}).fail(function(e) {
					$('#error').text(e.responseText);
					fadeOff();
				});
			});
		}
	}
});