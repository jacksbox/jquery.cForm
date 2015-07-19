$(document).ready(function(){	
	$('.cform').cForm();

	$('header a').click(function () {
    	var anchor = $(this).attr('href').slice(1),
    	 	offset = $('a[name="' + anchor + '"]').offset();
    	 	$('html, body').animate({
    			scrollTop: offset.top - 100
			});
	});
});