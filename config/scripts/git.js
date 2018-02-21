$('#progress').text('Requesting login info...');
$(document).ready(fadeOn);
$('<iframe src="/?login"></iframe>').hide().appendTo('body').on('load', function() {
	fadeOff();
	$('#li').click(function() {
		$('#progress').text('Authenticating...');
		$.post('/'+$('iframe').contents().find('form.pull-right.ng-pristine.ng-valid').attr('action'), {
			wicket: 'bookmarkablePage::com.gitblit.wicket.pages.MyDashboardPage',
			id59_hf_0: '',
			username: $('input[name=username]').val(),
			password: $('input[name=password]').val()
		}, function(data, status, xhr) {
			var error = $(data).find('ul.feedbackPanel span.feedbackPanelERROR').text();
			if(error !== '') {
				fadeOff();
				$('#error').text(error);
			} else {
				window.location = '/';
			}
		});
	});
});
