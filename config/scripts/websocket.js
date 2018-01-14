$(document).ready(function() {
	if(document.location.hostname == 'login.belowaverage.org' && parent == window) {
		var retryCount = 0;
		function connect() {
			fadeOn();
			$('#progress').text('Connecting...');
			var ws = new WebSocket('wss://api.belowaverage.org/v2/message');
			ws.onopen = function() {
				ws.send('join '+hash.split('#')[0]);
				fadeOff();
				$('#progress').text('');
			};
			ws.onmessage = function() {
				ws.close();
				$('#error').text('Session compromised... Connection closed.');
				$('#box *').attr('disabled', 'true');
				fadeOff();
			};
			ws.onclose = function(e) {
				if(e.code == 1008) {
					fadeOff();
					$('#error').text('No login session found. Please try again.');
					$('#box *').attr('disabled', 'true');
				} else {
					if(retryCount <= 10) {
						fadeOn();
						$('#progress').text('Attempt: '+retryCount);
						setTimeout(function() {
							retryCount++;
							connect();
						}, 100);
					} else {
						fadeOff();
						$('#error').text('Failed to connect to server.');
						$('#box *').attr('disabled', 'true');
					}
				}
			};
		};
		function send_auth(AUTH) {
			localStorage.setItem('AUTH', AUTH);
			$.post('https://api.belowaverage.org/v1/message/', {
				id: hash.split('#')[0],
				message: AUTH
			});
		};
		if(location.hash.length == 33) {
			connect();
		} else {
			if(document.location.href = document.location.origin) {
				document.location.href = 'https://belowaverage.org/';
			} else {
				document.location.href = document.location.origin;
			}
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
	} else if(document.location.hostname == 'login.belowaverage.org' && parent !== window) {
		$('#error').text('WARNING: This login may be compromised.');
		$('#box *').attr('disabled', 'true');
	} else {
		$('#error').text('WARNING: "'+document.location.hostname+'" domain not trusted!');
		$('#box *').attr('disabled', 'true');
	}
});
