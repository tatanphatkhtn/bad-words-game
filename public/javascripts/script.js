$('.confess-btn').on('click', function addConfession(e) { 
	e.preventDefault();
	 var payload = {
	     type: $('select[name = "type"]').eq(0).val(),
	 	 rule: $('select[name = "rule"]').eq(0).val(),
	 	 location: $('input[name = "location"]').eq(0).val(),
	 	 username: $('input[type = "hidden"]').eq(0).val(),
 	}
 	$(this).attr('disabled', true);
	$.ajax({
		method: 'POST',
		url: '/add-confession',
		data: payload,
		success: function(template, status, request) {
			$('#' + payload.username + '-score').text('Điểm đạt được: ' + request.getResponseHeader("score"));
			$('.confess-btn').attr('disabled', false);
			$('#' + payload.username).html(template);
		},
		error: function(err) {
			$('.confess-btn').attr('disabled', false);
			alert('Failed to confess, maybe you forgot to fill location field');
			console.log('err');
		}
	})	
})
