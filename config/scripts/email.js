$('#li').click(function() {
	$('#error').text('');
	$('#progress').text('Authenticating...');
	setTimeout(function() {
		$('#progress').text('Receiving response...');
	}, 1000);
	$.post('/owa/auth.owa', {
		destination: 'https://email.belowaverage.org/owa',
		flags: 4,
		forcedownlevel: 0,
		username: $('input[name=username]').val(),
		password: $('input[name=password]').val(),
		passwordText: '',
		isUtf8: 1
	}, function(data, status, xhr) {
		if(xhr.getResponseHeader('x-calculatedbetarget') !== null) {
			window.location = '/';
		} else {
			fadeOff();
			$('#error').text('Authentication failed. Please check your username or password.');
		}
	}).fail(function(data) {
		fadeOff();
		if($(data.responseText).find('div.errorDetails').text() !== '') {
			$('#error').text($(data.responseText).find('div.errorDetails').text());
		} else {
			$('#error').text('Unspecified Error.');
		}
	});
});