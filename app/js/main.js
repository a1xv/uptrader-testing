$(function(){
	var navLink = $('.options a').on('click', function(e) {
	    e.preventDefault();
	    navLink.not(this).removeClass('active');
	    $(this).addClass('active');
	});

	$( "#fade-link" ).click(function(e) {
		e.preventDefault();
		var body = $("html, body");
		var top = $(this.hash).offset().top;
		$(this.hash).hide();

		body.stop().animate({scrollTop:top}, 800, 'swing');

		$( "#header" ).fadeOut(1000);
		$( "#offer" ).fadeIn(400);
	});
});