$(document).ready(function(){
	$(".select").hover(function() {
		$(this).css("filter", "opacity(80%)");
		$(this).css("transition","filter 0.4s");
	}, function() {
		$(this).css("filter", "none");
		$(this).css("transition","filter 0.4s");
	});
});