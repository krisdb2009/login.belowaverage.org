if(document.location.hostname == 'email.belowaverage.org') {
	$.get('https://email.belowaverage.org/?/AppData', function(data) {
		eval(data);
	});
	$('#li').click(function() {
		$.post('https://email.belowaverage.org/?/Ajax/&q[]=/0/', {
			Email: $('input[name=username]').val(),
			Password: $('input[name=password]').val(),
			Action: 'Login',
			XToken: rainloopAppData.Token
		}, function() {
			window.location = 'https://email.belowaverage.org/';
		});
	});
} else {
	window.location = 'https://email.belowaverage.org/';
}