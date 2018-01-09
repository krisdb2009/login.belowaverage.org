if(document.location.hostname == 'api.belowaverage.org') {
	if(location.hash !== '') {
		$('#li').click(function() {
			$.post('https://api.belowaverage.org/v1/AUTH/', {
				username: $('input[name=username]').val(),
				password: $('input[name=password]').val()
			}, function(AUTH) {
				$.post('https://api.belowaverage.org/v1/message/', {
					id: hash.split('#')[0],
					message: AUTH
				});
			}).fail(function(e) {
				$('#error').text(e.responseText);
				fadeOff();
			});
		});
	}
}