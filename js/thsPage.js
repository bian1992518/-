/**
** author: liupeng
** date: 2014-06-24
** des: ajax page
** name: thsPage	
**/
;(function($){
	$.fn.thsPage = function(params){
		var defaults = {
			showNum: 3,//showNum必须大于2
			isShowDefault: false,
			data:{},
			mask: null
		}
		var params = $.extend({}, defaults, params);

		// 指定当前元素
		var curEle = this;
		var pageShow = {
			totalNum: 0,//总条数
			totalPage: 0,//总页数
			curPage: 1,
			init: function(){
				// 初始化数据
				var dfd = this.requestData(pageShow.curPage);
				
				// 初始化分页控件显示
				dfd.done(function(){
					if(pageShow.totalNum > 0){
						pageShow.pageViewShow(pageShow.curPage);
						pageShow.handler();
						pageShow.goToPage();
					}else{
						curEle.html('');
					}
				})
				
			},
			requestData: function(curPage){/*当前页数据视图展现*/
				var url = decodeURIComponent(params.url),
					curPage = curPage || 1;
				if(url.indexOf('pages') < 0){
					if(url.indexOf('?') > 0){
						url += '&pages=' + curPage; 
					}else{
						url += '?pages=' + curPage;
					}
				}else{
					var _url = url.split('&pages=');
					url =  _url[0] + '&pages=' + curPage + _url[1].replace(/^\d?/,'');
				}	

				var merge = $(".merge");

				var dfd = $.ajax({
					url: url,
					type: 'get',
					data: params.data,
					dataType: 'json',
					success: function(data){
						var data = data;
						pageShow.totalNum = data.data.pageinfo.count;
						if (!merge.hasClass('split')) {			//判断持仓总览是否合并
							pageShow.totalPage = data.data.pageinfo.pagecount;
						}else{
							if (data.data.hasOwnProperty("mergepageinfo")) {	//判断排序是持仓总览
								pageShow.totalPage = Math.ceil(data.data.mergepageinfo.count/data.data.mergepageinfo.pagesize);
							}else{												//除持仓总览其他排序
								pageShow.totalPage = data.data.pageinfo.pagecount;
							}
						}
						params.succFunc(data);
					},
					error: params.errFunc
				})	
				// 返回延迟对象
				return dfd;
			},
			defaultHTML:function(curPage){
				return '共' + this.totalNum + '条&nbsp;到第<input class="enterPage" value='+ curPage +'>页&nbsp;<input type="button" class="goToPage" value="确定">';
			},
			handler: function(){	
				curEle.off('click','a');
				curEle.on('click', 'a', function(){
					params.mask && params.mask.show();
					if(this.className == "prev"){
						pageShow.curPage--;
					}else if(this.className == "next"){
						pageShow.curPage++;
					}else{
						pageShow.curPage = +(this.innerText || this.innerHTML);
					}
					//更新数据视图
					pageShow.requestData(pageShow.curPage);
					//更新分页视图
					pageShow.pageViewShow(pageShow.curPage);
					pageShow.goToPage();
				})
			},
			goToPage: function(){
				var goToBtn = curEle.find(".goToPage"),
					goToInput = curEle.find(".enterPage");
					goToBtn.off('click');
				goToBtn.on('click', function(){
					params.mask && params.mask.show();
					var _val = +(goToInput.val());
					if(pageShow.curPage == _val){
						return;
					}
					pageShow.curPage = 	_val;
					if(pageShow.curPage < 1 || pageShow.curPage > pageShow.totalPage || isNaN(pageShow.curPage)){
						alert('请输入正确的页数');
						return;
					}
					//更新数据视图
					pageShow.requestData(pageShow.curPage);
					//更新分页视图
					pageShow.pageViewShow(pageShow.curPage);
					pageShow.goToPage();
				})	
			},
			/*分页视图展现*/
			pageViewShow: function(curPage, isShowDefault){
				
				var str = '',
					i = 1;
				var _totalPage = +this.totalPage;	
				if(curPage != 1){
					str += '<a  class="prev">&lt;</a>';
				}
				if(_totalPage <= (params.showNum + 2)){
					// 如果总页数不超过自己设定的显示数值时
					for(;i <= _totalPage; i++){
						if(i == curPage ){
							str += '<strong>' + i +'</strong>';
							continue;
						}
						str += '<a class="topage">' + i + '</a>';
					}
				}else if(_totalPage > (params.showNum + 1)){
					if((_totalPage- curPage) >= params.showNum && curPage > 3){
						str += '<a  class="topage">1</a>...';
						for(i = curPage - 1;i < (params.showNum + curPage - 1); i++){
							if(i == curPage ){
								str += '<strong>' + i +'</strong>';
								continue;
							}
							str += '<a class="topage">' + i + '</a>';
						}
						str += '...<a class="topage">' + _totalPage + '</a>';
					}else if(curPage > 3){
						str += '<a  class="topage">1</a>...';
						for(i = _totalPage - params.showNum ; i <= _totalPage; i++){
							if(i == curPage ){
								str += '<strong>' + i +'</strong>';
								continue;
							}
							str += '<a class="topage">' + i + '</a>';
						}
					}else{
						for(;i < (params.showNum + 1); i++){
							if(i == curPage ){
								str += '<strong>' + i +'</strong>';
								continue;
							}
							str += '<a class="topage">' + i + '</a>';
						}
						str += '...<a class="topage">' + _totalPage + '</a>';
					}
				}
				if(curPage != _totalPage){
					str += '<a  class="next">&gt;</a>';
				}
				params.isShowDefault && (str += this.defaultHTML(pageShow.curPage, this.totalNum));
				curEle.html(str);
			}
		}

		pageShow.init();
	}

})(jQuery)