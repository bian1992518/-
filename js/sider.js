/**
 * author : bianlongting
 * email : bianlongting@myhexin.com
 * Date: 15-12-23
 * Time: 下午14:20
 * Script : 侧边栏及登出
 */
(function(){
	//登出
	$(".signout").on("click",function(){
		window.location.href = "../logout";
	});

	

	/*var oLis = $(".risk-system").find("li").not($(".disable"));
	oLis.on("click",function(){
		var item = $(this);
		var href = item.data("href");
		$("iframe").attr("src",href);
		$(this).addClass("actived")
			   .siblings().removeClass("actived");
	})*/
})();