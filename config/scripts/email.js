if(document.location.hostname == 'email.belowaverage.org') {
	setTimeout(function() {
		fadeOn();
		$.get('/admin/logout.php', function() {
			fadeOff();
		});
	});
	$.get('https://email.belowaverage.org/?/AppData', function(data) {
		eval(data);
		$('#li').click(function() {
			$.post('https://email.belowaverage.org/?/Ajax/&q[]=/0/', {
				Email: $('input[name=username]').val(),
				Password: $('input[name=password]').val(),
				Action: 'Login',
				XToken: rainloopAppData.Token
			}, function() {
				$.post('/admin/', {
					page: 'background_login',
					username: $('input[name=username]').val(),
					password: $('input[name=password]').val()
				}, function() {
					window.location = 'https://email.belowaverage.org/';
				});
			});
		});
	});
} else {
	window.location = 'https://email.belowaverage.org/login/#'+hash;
}