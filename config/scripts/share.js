$('#li').click(function() {
	window.location = 'https://'+$('input[name=username]').val()+':'+$('input[name=password]').val()+'@share.belowaverage.org/?b';
});