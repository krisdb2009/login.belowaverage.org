$('#progress').text('Retrieving authenticity token...');
$(document).ready(fadeOn);
$.get('/users/sign_in/', function(response) {
	fadeOff();
	$('#li').click(function() {
		fadeOn();
		$('#progress').text('Trying logon...');
		$.post('/users/auth/ldapmain/callback', {
			authenticity_token: $(response).find('input[name=authenticity_token]').val(),
			username: $('input[name=username]').val(),
			password: $('input[name=password]').val()
		}, function() {
			$('#progress').text('Redirecting...');
			window.location.href = '/';
		});
	});
});
