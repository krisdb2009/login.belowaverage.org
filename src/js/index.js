var hash = window.location.hash.substr(1);
var username = '';
var password = '';
var ran = false;
var url = location.origin + location.pathname;
var origin = null;
var trust = {}; 
if(hash.split(':').length == 2 && hash.split('@').length == 2) {
	username = hash.split(':')[0].split('@')[1];
	password = hash.split(':')[1];
}
function fadeOn() {
	$('#body, #loader, #footer').addClass('fade');
}
function fadeOff() {
	$('#body, #loader, #footer').removeClass('fade');
}
function encrypt(AUTH, credential, callback) {
	$.post('https://api.belowaverage.org/v1/sso/', {AUTH: AUTH}, function(data) {
		if(data.control !== 'encrypt') {
			encrypt(AUTH, credential, callback);
		} else if(data.control == 'encrypt') {
			localStorage.AUTH_Crypt = sjcl.encrypt(data.key, JSON.stringify(credential));
			callback.call();
		}
	}, 'json');
}
function decrypt(AUTH, callback) {
	$.post('https://api.belowaverage.org/v1/sso/', {AUTH: AUTH}, function(data) {
		if(data.control == 'decrypt') {
			callback.call(JSON.parse(sjcl.decrypt(data.key, localStorage.AUTH_Crypt)));
		} else {
			callback.call(false);
		}
	}, 'json');
}
function showForm(e) {
	fadeOff();
	$('#progress').text('');
	$('#li').click(function() {
		$('#progress').text('Authenticating...');
		var credential = {
			username: $('input[name=username]').val(),
			password: $('input[name=password]').val()
		};
		$.post('https://api.belowaverage.org/v1/AUTH/', credential, function(AUTH) {
			localStorage.AUTH_Token = AUTH;
			$('#progress').text('Encrypting credentials...');
			encrypt(AUTH, credential, function() {
				passCredOrToken();
			});
		}).fail(function(e) {
			$('#error').text(e.responseText);
			fadeOff();
		});
	});
}
function passCredOrToken() {
	$('#progress').text('Logging on...');
	if(trust[origin] == 'token') { //If credential type is token.
		parent.postMessage(localStorage.AUTH_Token, origin); //Pass token to parent.
	} else if(trust[origin] == 'crypt') { //If credential type is crypt.
		decrypt(localStorage.AUTH_Token, function() {
			var credential = this;
			encrypt(localStorage.AUTH_Token, credential, function() {
				parent.postMessage(credential, origin); //Pass credential to parent.
			});
		});
	}
}
$(document).ready(function() {
	$('#li').click(function() {
		fadeOn();
	});
	$(document).keypress(function(e) {
		if(e.keyCode == 13) {
			$('#li').click();
		}
	});
	$('#progress').text('Verifying login trust...');
	$.getJSON('config/login.json', function(trusted) {
		onmessage = function(e) {
			origin = e.origin;
			trust = trusted.trust;
			if(typeof trust[origin] !== 'undefined' && !ran) {
				ran = true;
				parent.postMessage('ready', origin);
				if(window.location.hash == '#logout') {
					$.post('https://api.belowaverage.org/v1/AUTH/', {AUTH: localStorage.AUTH_Token, logout: true});
					localStorage.AUTH_Token = '';
				}
				if(typeof localStorage.AUTH_Token == 'string' && localStorage.AUTH_Token.length == 32) { //If local token found.
					$('#progress').text('Authenticating...');
					$.post('https://api.belowaverage.org/v1/AUTH/', {AUTH: localStorage.AUTH_Token}, function() { //Validate token.
						passCredOrToken();
					}).fail(function() { //If token is invalid.
						showForm(e); //Prompt for new credentials.
					});
				} else { //If local token is not found.
					showForm(e); //Prompt for credentials.
				}
			} else if(!ran) {
				ran = true;
				$('#progress').text('');
				$('#error').html('<b>WARNING</b>: This origin ('+origin+') is not authorized to perform login requests.');
				$('input[name=username], input[name=password], #li').attr('disabled', true);
				fadeOff();
			}
		};
	});
});