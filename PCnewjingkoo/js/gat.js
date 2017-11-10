(function($){
	// 滑动滚动条
	$(window).scroll(function(){
		var top_nav = $("#carousel").height()-50;
		var scrollTop = $(document).scrollTop();
		// 滚动条距离顶部的距离 大于 200px时
		if($(window).scrollTop() >= top_nav){
			$("#header").addClass("tgole");
		} else{
			$("#header").removeClass("tgole");
		}
	});
	
})(jQuery)