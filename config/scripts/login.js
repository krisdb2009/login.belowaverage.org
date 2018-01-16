var ran = false;
$(document).ready(function() {
	fadeOn();
	$('#progress').text('Verifying origin...');
	$.getJSON('config/scripts/login/trusted.json', function(trusted) {
		onmessage = function(e) {
			if($.inArray(e.origin, trusted) !== -1 && !ran) {
				ran = true;
				parent.postMessage('ready', e.origin);
				fadeOff();
				$('#progress').text('Performing login...');
				$('#li').click(function() {
					$.post('https://api.belowaverage.org/v1/AUTH/', {
						username: $('input[name=username]').val(),
						password: $('input[name=password]').val()
					}, function(AUTH) {
						$('#progress').text('Communicating with origin...');
						fadeOn();
						parent.postMessage(AUTH, e.origin);
					}).fail(function(e) {
						$('#error').text(e.responseText);
						fadeOff();
					});
				});
			}
		};
	});
});