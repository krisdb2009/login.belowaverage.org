$(document).ready(function() {
	$.getJSON('config/scripts/websocket/trusted.json', function(data) {
		$.each(data, function() {
			if(this+'' == document.referrer+'') {
				start();
				return false;
			}
		});
	});
	function start() {
		var retryCount = 0;
		var isError = true;
		var ws = null;
		function connect() {
			retryCount++;
			fadeOn();
			$('#progress').text('Connecting...');
			ws = new WebSocket('wss://api.belowaverage.org/v2/message');
			ws.onopen = function() {
				ws.send('join '+hash.split('#')[0]);
				fadeOff();
				$('#progress').text('');
			};
			ws.onmessage = function() {
				retryCount = 10;
				ws.close();
				isError = false;
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
					if(retryCount < 10) {
						fadeOn();
						$('#progress').text('Attempt: '+retryCount);
						setTimeout(function() {
							connect();
						}, 100);
					} else {
						fadeOff();
						if(isError) {
							$('#error').text('Failed to connect to server.');
						}
						$('#box *').attr('disabled', 'true');
					}
				}
			};
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
				if(ws.OPEN) {
					isError = false;
					retryCount = 10;
					ws.send(AUTH);
					ws.close();
					$('#error').text('');
				}
			}).fail(function(e) {
				$('#error').text(e.responseText);
				fadeOff();
			});
		});
	}
});
