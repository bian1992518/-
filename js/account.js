/**
 * author : bianlongting
 * email  : bianlongting@myhexin.com
 * Date   : 15-12-28
 * Time   : 下午13:40
 * Script : 账户管理
 */

 $(function(){

 	var edit = $(".account-edit");
 	var editInfo = $("#editInfo");
 	var addCount = $("#addCount");
 	var incommon = $(".incommon");
 	var productId;
 	var newAdd = $("#newAdd");
 	var obj = []; //缓存营业商
 	var objCom = []; //缓存期货公司
 	var containter = $(".containter");
 	var loading = $("#loading");
 	var inst_id,authKey,operator_id;
 	var selectInst = $("#select_inst");
 	window.cacheParent = null;
 	loading.show();


 	var btn = $(".btn");
 	btn.on("click",function(e){
 		e.preventDefault();
 		var id = $(this).data("id");
 		var fn = config[id];
 		if(!fn) return;
 		fn.call(this,e);
 	});

 	//截取字符串
 	function cutstr(str, len) {
		var temp,
		icount = 0,
		patrn = /[^\x00-\xff]/,
		strre = "";
		if (str.length > len) {
			for (var i = 0; i < str.length; i++) {
				if (icount < len - 1) {
					temp = str.substr(i, 1);
					if (patrn.exec(temp) == null) {
						icount = icount + 1;
					} else {
						icount = icount + 2;
					}
					strre += temp;
				} else {
					break;
				}
			}
			return strre + "..."
		}else{
			return str;
		}
	}

 	//获取cookie中的字段名字
	function getCookie(name) { 
	        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	        if(arr=document.cookie.match(reg))
	            return unescape(arr[2]); 
	        else 
	        return null; 
	}; 

	var inst_id = getCookie("institution_id");
	var operator_id = getCookie("operator_id");
	var authKey = getCookie("authKey");
	var username = getCookie("username");
	var Role_Qs = getCookie("Role_Qs");

	$(".comStock").val(inst_id);

 	var config = {
 		//股票增加
 		"stock-ok" : function(){
 			var psw = $(".stock-com");
 			psw.each(function(index, el) {
 				if ($(this).val() == "") {
	 				$(this).addClass("error");
	 			};
 			});
 			var error = $(".error");
			if (error.length > 0) {
				return false;
			};
 			var data = {};
 			var item = $(".comStock").data();
 			data.operator_id = operator_id;				
 			data.institution_id = inst_id;
 			data.product_id  = productId;
 			data.broker_id = $(".dialog-item").val();
 			data.office_id = $(".business-item option:selected").data("office");
 			if (data.broker_id == "56" || data.broker_id == "352" || data.broker_id == "799") {
 				data.isreal = 0;
 			}else{
 				data.isreal = 1;
 			};
 			data.fund_code = $(".business").val();
 			data.fund_name = $(".name").val();
 			data.trade_password  = $(".psw").val();
 			data.comm_password = $(".password").val();
 			data.dpwd = $(".command").val();
 			data.remark = $(".remark").val();
 			data.authKey = authKey;
 			$.ajax({
 				url : '/privatelyfund/addFundStock_product',
 				data : data,
 				success : function(data){
 					if (data.success == true) {
 						closeDialog($(".dialogCom"));
 						location.reload();
 					}else{
						alert(data.errMsg);
					}
 				}
 			})
 		},
 		"stock-cancle" : function(){
 			closeDialog($(".dialogCom"));
 		},
 		"stock-edit-ok" : function(){
 			var psw = $(".psw");
			if ($(psw).val() == "") {
				$(psw).addClass("error");
				return false;
			};
 			var data = {};
			data.institution_id = inst_id;
			data.fund_id = cacheParent.data("fund");
			data.broker_id = $(".dialog-item").val();
			data.office_id  = $(".business-item option:selected").data("office");
			if (data.broker_id == "56" || data.broker_id == "352" || data.broker_id == "799") {
 				data.isreal = 0;
 			}else{
 				data.isreal = 1;
 			};
			data.fund_code  = $(".business").val().trim();
			data.trade_password  = psw.val();
			data.comm_password = $(".password").val();
			data.fund_name = $(".name").val();
			data.operator_id = operator_id;
 			data.fund_name = $(".name").val();
 			data.dpwd = $(".command").val();
 			data.remark = $(".remark").val();
			data.authKey = authKey;
			$.ajax({
				url : '/privatelyfund/updateFundStock_product',
				data : data,
				success : function(data){
					if (data.success == true) {
						location.reload();
					}else{
					alert(data.errMsg);
				}
				}
			})
 		},
 		"stock-edit-cancle" : function(){
 			closeDialog($(".dialogCom"));
 		},
 		//期货增加
 		"futures-ok" : function(){
 			var psw = $(".futures-com");
 			psw.each(function(index, el) {
 				if ($(this).val() == "") {
	 				$(this).addClass("error");
	 			};
 			});
 			var error = $(".error");
			if (error.length > 0) {
				return false;
			};
 			var data = {};
 			data.operator_id = operator_id;				
 			data.institution_id = inst_id;
 			data.product_id  = productId;
 			data.broker_id = $(".futures-company").val();
 			data.office_id = $(".futures-business option:selected").data("office");
 			data.fund_code = $(".futures-account").val().trim();
 			data.trade_password  = $(".futures-psw").val();
 			data.authKey = authKey;
 			$.ajax({
 				url : '/privatelyfund/addFundFuture_product',
 				data : data,
 				success : function(data){
 					if (data.success == true) {
 						closeDialog($(".dialogCom"));
 						location.reload();
 					}else{
						alert(data.errMsg);
					}
 				}
 			})
 		},
 		"futures-cancle" : function(){
 			closeDialog($(".dialogCom"));
 		},
 		"futures-edit-ok" : function(){
 			var psw = $(".futures-psw");
			if ($(psw).val() == "") {
				$(psw).addClass("error");
				return false;
			};
 			var data = {};
 			data.institution_id = inst_id;
 			data.operator_id = operator_id;				
 			data.fund_id = cacheParent.data("fund");
 			data.broker_id = $(".futures-company").val();
 			data.office_id = $(".futures-business option:selected").data("office");
 			data.fund_name = $(".futures-name").val().trim();
 			data.fund_code = $(".futures-account").val().trim();
 			data.trade_password  = $(".futures-psw").val();
 			data.comm_password = $(".futures-password").val();
 			data.authKey = authKey;
 			$.ajax({
 				url : '/privatelyfund/updateFundFuture_product',
 				data : data,
 				success : function(data){
 					if (data.success == true) {
 						closeDialog($(".dialogCom"));
 						location.reload();
 					}else{
						alert(data.errMsg);
					}
 				}
 			})
 		},
 		"futures-edit-cancle" : function(){
 			closeDialog($(".dialogCom"));
 		}
 	}

 	//判断登陆的是券商还是机构
 	if (!Role_Qs && Role_Qs == undefined) {
		accountManagement(inst_id);
		$(".select_institution").hide();
	}else{
		//获取所有机构
		getAllInst();
	};

	function getAllInst(){
		var data = {};
    	data.loginName = username;
    	data.authKey = authKey;
    	$.ajax({
    		url : "/privatelyfund/listInstitution_operator",
    		data : data,
    		type : "GET",
    		success : function(data){
    			if (data.success == true) {
    				var list = data.data.list[0];
    				var html = "";
					var firstInst = "";
					for(var p in list){
						html += "<option value = " + p + ">" + list[p] + "</option>";
					};
					selectInst.html(html);
					firstInst = selectInst.val();
					accountManagement(firstInst);
					selectInst.on("change",function(){
						var index = $(this).val();
						accountManagement(index);
					});
    			};
    		}
    	})
	};

 	//账户管理
 	function accountManagement(inst_id){
 		var data = {};
 		data.institution_id = inst_id;
 		data.authKey = authKey;
 		$.ajax({
 			url : '/privatelyfund/listInstProductInfo_product',
 			data : data,
 			success : function(data){
 				if (data.success == true) {
 					var list = data.data.list[0];
 					accountRender(list);	//账户管理界面
 					loading.hide();
 				}else{
					alert(data.errMsg);
				}	
 			}
 		})
 	};

 	function accountRender(data){
 		containter.html("");
 		if (data == undefined) {
 			$.messager.show({
				title   : '提示',
				iconCls : 'icon-logo',
				msg     : '暂无数据',
				timeout : 1000,
				showSpeed : 100,
				showType : null,
				style : {
					left : "50%",
					marginLeft : "-125px"
				},
			});
			return false;
 		};
 		var inst_name = data.institution_name;
 		if (!inst_name) {
 			containter.html("");
 		};
 		$(".title h1").html(inst_name);
 		var products = data.products;
 		var html = "";
 		if (products.length > 0) {
	 		for (var i = 0; i < products.length; i++) {
	 			containter.append("<div class='conTitle' data-param =" + products[i].product_id + " data-day = " + products[i].create_date + " data-init = " + products[i].bank_balance + " data-asset = " + products[i].asset_share + ">"+ 
	 								"<span><i class='pencil'></i><i class='delete'></i>"  + products[i].product_name + "</span>" +
	 								"<span>显示名称</span>" +
	 								"<span>通道商</span>" +
	 								"<span>地区</span>" +
	 								"<span>营业部</span>" +
	 								"<span>账号</span>" +
	 								"<span>添加时间</span>" +
	 								"<span>最后修改时间</span>" +
	 								"<span>最后操作人</span>" +
	 							  "</div>");
	 			var funds = products[i].funds;
	 			for (var j = 0; j < funds.length; j++) {
	 				containter.append("<div class='conWrapper' data-param =" + products[i].product_id + "  data-day = " + funds[j].create_time + " data-fund = " + funds[j].fund_id + " data-remark = " + funds[j].remark + " data-type = " + funds[j].fund_type + ">" + 
	 									"<span> <i class='pencil'></i><i class='delete'></i>" + funds[j].fund_code + "</span>" + 
	 									"<span title = " + funds[j].brokeroffice_name + ">" + cutstr(funds[j].brokeroffice_name,10) + "</span>" + 
	 									"<span class='brokerId' value=" + funds[j].broker_id + ">" + funds[j].broker_name + "</span>" + 
	 									"<span>" + funds[j].area + "</span>" + 
	 									"<span title = " + funds[j].brokeroffice_name + ">" + cutstr(funds[j].brokeroffice_name,10) + "</span>" + 
	 									"<span class='fundName' title = " + funds[j].fund_name + ">" + cutstr(funds[j].fund_name,10) + "</span>" + 
	 									"<span>" + funds[j].create_time + "</span>" + 
	 									"<span>" + funds[j].modify_time + "</span>" + 
	 									"<span>" + funds[j].modify_operator + "</span>" + 
	 							      "</div>");

	 			};
	 			containter.append('<a class="add-product">添加账户</a>');
	 		};
 		}else{
 			containter.html("");
 		}
 	};

 	//券商
 	$.get("/privatelyfund/listBrokerOffice_fund?authKey=" + authKey,function(data){
 		var html = "";
 		var businessHtml = "";
 		if (data.success == true) {
 			var broker_list = data.data.broker_list;
 			for (var i = 0; i < broker_list.length; i++) {
 				html += "<option value=" + broker_list[i].broker_id + ">" + broker_list[i].broker_name + "</option>";
 				var office_list = broker_list[i].office_list;
 				obj.push(office_list);
 				for(var p in office_list){
 					if (i == 0) {
 						businessHtml += "<option value=" + office_list[p].broker_id + " data-office = " + office_list[p].office_id + ">" + office_list[p].office_name + "</option>";
 					};
 				}
 			};
 			$(".dialog-item").html(html);
 			$(".business-item").html(businessHtml);
 			//券商选择判断
 			traderJudge();
 		};
 	});

 	//开户期货公司
 	$.get("/privatelyfund/listFuturesBrokerOffice_fund?authKey=" + authKey,function(data){
 		var html = "";
 		var businessHtml = "";
 		if (data.success == true) {
 			var broker_list = data.data.broker_list;
 			for (var i = 0; i < broker_list.length; i++) {
 				html += "<option value=" + broker_list[i].broker_id + ">" + broker_list[i].broker_name + "</option>";
 				var office_list = broker_list[i].office_list;
 				objCom.push(office_list);
 				for(var p in office_list){
 					if (i == 0) {
 						businessHtml += "<option value=" + office_list[p].broker_id + " data-office = " + office_list[p].office_id + ">" + office_list[p].office_name + "</option>";
 					};
 				}
 			};
 			$(".futures-company").html(html);
 			$(".futures-business").html(businessHtml);
 			//期货公司选择判断
 			traderFutures();
 		};
 	});

 	function traderJudge(){
 		$(".dialog-item").on("change",function(){
	 		var val = $(this).val();
	 		var html = "";
	 		for (var i = 0; i < obj.length; i++) {
	 			for(var p in obj[i]){
	 				if (obj[i][p].broker_id == val) {
	 					html += "<option value=" + obj[i][p].broker_id + " data-office = " + obj[i][p].office_id + ">" + obj[i][p].office_name + "</option>";
	 				};
	 			}
	 		};
	 		$(".business-item").html(html);
	 	});
 	}

 	function traderFutures(){
 		$(".futures-company").on("change",function(){
	 		var val = $(this).val();
	 		var html = "";
	 		for (var i = 0; i < objCom.length; i++) {
	 			for(var p in objCom[i]){
	 				if (objCom[i][p].broker_id == val) {
	 					html += "<option value=" + objCom[i][p].broker_id + " data-office = " + objCom[i][p].office_id + ">" + objCom[i][p].office_name + "</option>";
	 				};
	 			}
	 		};
	 		$(".futures-business").html(html);
	 	});
 	}
 
 

 	edit.on('click', function() {
 		var val = $(this).html();
 		if (val == "编辑") {
 			$(this).html("结束编辑");
 		}else{
 			$(this).html("编辑");
 		};
 		$("#account i,.product-add,.add-product").toggleClass("show");

	 	//删除
	 	$(".delete").on("click",function(){
	 		var that = $(this);
	 		var parents = that.parent().parent();
	 		//删除产品
	 		if (parents.hasClass('conTitle')) {		
	 			$.messager.confirm("确定","确定删除该产品?",function(r){
		 			if (r) {
		 				var data = {};
				 		data.product_id = parents.data("param");
				 		data.authKey = authKey;
				 		$.ajax({
				 			url : '/privatelyfund/deleteProduct_product',
				 			data : data,
				 			success : function(data){
				 				if (data.success == true) {
									location.reload();
								}else{
									$.messager.alert({
                            			msg : data.errMsg,
                            			iconCls : 'icon-logo',
                            			title : '提示',
                            			fn : function(){		//执行回调
                            				location.reload();
                            			}
                            		});
								}
				 			}
				 		})
		 			};
		 		})
	 		}else if (parents.hasClass("conWrapper")) {			//删除账号
	 			$.messager.confirm("确定","确定删除该账号?",function(r){
		 			if (r) {
		 				var data = {};
				 		data.product_id = parents.data("param");
				 		data.fund_id = parents.data("fund");
				 		data.authKey = authKey;
				 		$.ajax({
				 			url : '/privatelyfund/deleteProductFund_product',
				 			data : data,
				 			success : function(data){
				 				if (data.success == true) {
									location.reload();
								}else{
									$.messager.alert({
                            			msg : data.errMsg,
                            			iconCls : 'icon-logo',
                            			title : '提示',
                            			fn : function(){		//执行回调
                            				location.reload();
                            			}
                            		});
								}
				 			}
				 		})
		 			};
		 		})
	 		}
	 	});

	 	//修改
	 	$(".pencil").on("click",function(){
	 		$(".psw,.futures-psw").on("focus",function(){
	 			$(this).removeClass("error");
	 		}).on("blur",function(){
	 			if ($(this).val() == "") {
	 				$(this).addClass('error');
	 			};
	 		})
	 		var that = $(this);
	 		cacheParent = that.parent().parent();
	 		if (cacheParent.hasClass('conTitle')) {
		 		var item = cacheParent.data();
		 		newAdd.dialog("open");
		 		$(".newName").val(that.parent().text());
		 		var day = item.day.toString().replace(/\-/g,'');
		 		var y = day.slice(0, 4);
		 		var m = day.slice(4, 6);
		 		var d = day.slice(6, 8);
		 		var upDate = y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d);
		 		$("#day").datebox({
		 			value : upDate
		 		})
		 		$(".bank-funds").val(item.init);
		 		$(".total-funds").val(item.asset);
		 		newAdd.dialog({
		 			title : '编辑产品信息',
		 			modal : true,
	 				width:300,
	 				iconCls : 'icon-logo',
		 			buttons : [{
		 				text : '确定',
		 				iconCls : 'icon-ok',
			 				handler : function(){
			 					var data = {};
			 					data.institution_id = inst_id;
			 					data.product_name = $(".newName").val();
			 					data.create_date  = $("input[name='day']").val();
			 					data.create_date  =data.create_date.replace(/\-/g,'');
			 					data.bank_balance  = $(".bank-funds").val();
			 					data.asset_share  = $(".total-funds").val();
			 					data.product_id = cacheParent.data("param");
			 					data.authKey = authKey;
			 					$.ajax({
			 						url : '/privatelyfund/updateProduct_product',
			 						data : data,
			 						success : function(data){
			 							if (data.success == true) {
			 								location.reload();
			 							}else{
											alert(data.errMsg);
										}
			 						}
			 					})
			 				}
			 			},{
			 				text : '取消',
			 				handler : function(){
						 		addCount.dialog("close");
			 				}
			 			}]
			 		})
			}else{
				addCount.dialog("open");
				$(".operate-edit").show();
				$(".operate").hide();
				addCount.find("*").removeClass("error");
				addCount.dialog({
		 			title : '修改账户信息',
		 			width : 300,
		 			modal : true,
		 			left : width,
		 			shadow:false,
		 			iconCls : 'icon-logo',
		 		});
				if (cacheParent.data("type") == 0) {
					$(".tabs-last").hide();			//如果是股票。隐藏期货
					$(".tabs-first").show().trigger("click");
					$(".dialog-item").val(cacheParent.find('.brokerId').attr("value"));
					$(".dialog-item").trigger("change");
					$(".business").val(that.parent().text()).attr('disabled', true);
					$(".name").val(cacheParent.find(".fundName").text()).attr('disabled', true);
					$(".remark").val(cacheParent.data('remark'));
				}else{
					$(".tabs-first").hide();		//如果是期货过，隐藏股票
					$(".tabs-last").show().trigger("click");	
					$(".futures-company").val(cacheParent.find('.brokerId').attr("value"));
					$(".futures-company").trigger("change");
					$(".futures-name").val(that.parent().text());
					$(".futures-account").val(cacheParent.find('.fundName').attr("title")).attr('disabled', true);
				}
			}
	 	})

		//添加账户
		var width = ($("body").width()-300)/2;
	 	$(".add-product").on("click",function(){
	 		$(".stock-com,.futures-com").on("focus",function(){
	 			$(this).removeClass("error");
	 		}).on("blur",function(){
	 			if ($(this).val() == "") {
	 				$(this).addClass('error');
	 			};
	 		});
	 		$(".tabs-first,.tabs-last").show();	//添加账户时股票和期货都要显示
	 		$(".tabs-first").trigger("click");
	 		productId = $(this).prev("div").data("param");
	 		addCount.dialog("open");
	 		$(".operate-edit").hide();
			$(".operate").show();
			$(".business,.name,.futures-account,.futures-name,.remark").val("").attr("disabled",false);
			addCount.find("*").removeClass("error");
	 		addCount.dialog({
	 			title : '新增账户信息',
	 			width : 300,
	 			modal : true,
	 			left : width,
	 			shadow:false,
	 			iconCls : 'icon-logo'
	 		});
	 	});
 	});

 	//添加产品
 	$(".product-add").on("click",function(){
 		incommon.on("focus",function(){
 			$(this).removeClass("error");
 		}).on("blur",function(){
 			if ($(this).val() == "") {
 				$(this).addClass('error');
 			};
 		})
 		newAdd.dialog("open");
 		newAdd.dialog({
 			title : '新增产品信息',
 			modal : true,
 			width:300,
 			iconCls : 'icon-logo',
 			buttons : [{
 				text : '确定',
 				iconCls : 'icon-ok',
 				handler : function(){
 					var datebox = $("input[name='day']");
 					incommon.each(function(index, el) {
 						if ($(this).val() == "") {
 							$(this).addClass("error");
 						};
 					});
 					
 					if (isNaN($(".bank-funds").val())) {
 						$(".bank-funds").addClass("error");
 					};

 					if (isNaN($(".total-funds").val())) {
 						$(".total-funds").addClass("error");
 					};

 					var error = $(".error");
 					if (error.length > 0) {
 						return false;
 					};
 					var data = {};
 					data.institution_id = 223;
 					data.product_name = $(".newName").val();
 					if (datebox.val() != "") {
 						data.create_date  = datebox.val();
 						data.create_date  =data.create_date.replace(/\-/g,'');
 					}else{
 						$("#day").datebox({
							required:true
						})
 					};
 					var validate = $(".validatebox-invalid");
 					if (validate.length > 0) {
 						return false;
 					};
 					data.bank_balance  = $(".bank-funds").val();
 					data.asset_share  = $(".total-funds").val();
					data.authKey = authKey;
 					$.ajax({
 						url : '/privatelyfund/addProduct_product',
 						data : data,
 						success : function(data){
 							if (data.success == true) {
 								location.reload();
 							}else{
								alert(data.errMsg);
							}
 						}
 					})
 				}
 			},{
 				text : '取消',
 				handler : function(){
 					closeDialog($(".dialogCom"));
 				}
 			}]
 		})
 	});

 	$("body").trigger(closeDialog($(".dialogCom")));

	function closeDialog(param){
		param.dialog('close');
	};

 })
