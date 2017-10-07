$('#li').click(function() {
	window.location = 'https://'+$('input[name=username]').val()+':'+$('input[name=password]').val()+'@personal.belowaverage.org/'+$('input[name=username]').val()+'/?b';
});