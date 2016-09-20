/* 
 * Ahthor bianlongting
 * Email  bianlongting@myhexin.com
 * Date   16-01-18
 * Time   上午 10：18
 * Script 机构设置总览(券商)
 */

$(function(){

	var loading = $("#loading"),
		updatetime = $("#updatetime"),
		riskFilter = $("#riskFilter"),
		refresh    = $("#refresh"),
		riskExport = $("#riskExport");
	var configDate = {};	//缓存对象
	var date = new Date();
	updatetime.html("最后更新时间: " + date.toLocaleString());
	//获取cookie中的字段名字
	function getCookie(name) { 
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]); 
        else 
        return null; 
	}; 

	//截取字符串
 	function cutstr(str, len) {
		var temp,
		icount = 0,
		patrn = /[^\x00-\xff]/,
		strre = "";
		if (str && str.length > len) {
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

	var operator_id = getCookie("operator_id");
	var username = getCookie("username");
	var authKey = getCookie("authKey");

	//缓存节点
	var config = {
		com    		: $("#com"),				//控制类别
		inst   		: $(".select_inst"),		//机构
		product		: $(".select_product"),		//产品
		account		: $(".select_account"),		//账户
		price		: $(".select_price"),		//标准价格
		object		: $(".select_object"),		//控制对象
		subObject	: $(".select_sub_object"),	//细分对象
		dimesion	: $(".select_dimesion"),	//控制维度
		operate		: $(".select_operate"),		//触警操作
		direction	: $(".select_direction"),	//控制方向
		profit		: $(".select_profit"),		//盈亏类别
	};
	config.com.on("change",function(){
		var index = $(this).val();
		var html = "",
			nullHtml = "",
			priceHtml = "",
			objectHtml = "",
			subObjectHtml = "",
			dimesionHtml = "",
			operateHtml = "",
			bondHtml = "",
			directionHtml = "",
			profitHtml = "";

		html += "<option value=''>全部</option>";
		nullHtml += "<option value=''>无</option>";
		operateHtml += "<option value=''>全部</option>\
						    <option value='1'>预警</option>\
                       			 <option value='0'>禁止</option>";
		switch(index){
			case "":
				config.price.html(html);
				config.object.html(html);
				config.subObject.html(html);
				config.dimesion.html(html);
				config.operate.html(html);
				config.direction.html(html);
				config.profit.html(html);
				break;
			case "11": 								//持仓市值
				objectHtml += "<option value=''>全部</option>\
						       <option value='1'>个股</option>\
				               <option value='2'>板块</option>\
				               <option value='3'>概念</option>\
				               <option value='4'>行业(证监会标准)</option>";
				subObjectHtml += "<option value=''>全部</option>";
				dimesionHtml += " <option value=''>全部</option>\
								  <option value='0'>绝对值</option>\
               					  <option value='1'>资产占比</option>";
               	
				config.price.html(nullHtml);
				config.object.html(objectHtml);
				config.subObject.html(subObjectHtml);
				config.dimesion.html(dimesionHtml);
				config.operate.html(operateHtml);
				config.direction.html(nullHtml);
				config.profit.html(nullHtml);
				matchObject(config.object,config.subObject);	//匹配对应的值
				break;
			case "10": 								//持仓数量
				dimesionHtml += " <option value=''>全部</option>\
								  <option value='0'>绝对值</option>\
               					  <option value='1'>占流通比例</option>";
				config.price.html(nullHtml);
				config.object.html(nullHtml);
				config.subObject.html(nullHtml);
				config.dimesion.html(dimesionHtml);
				config.operate.html(operateHtml);
				config.direction.html(nullHtml);
				config.profit.html(nullHtml);
				break;
			case "1": 								//单笔交易
				dimesionHtml += " <option value=''>全部</option>\
								  <option value='0'>金额</option>\
               					  <option value='1'>数量</option>";
				config.price.html(nullHtml);
				config.object.html(nullHtml);
				config.subObject.html(nullHtml);
				config.dimesion.html(dimesionHtml);
				config.operate.html(operateHtml);
				config.direction.html(nullHtml);
				config.profit.html(nullHtml);
				break;
			case "12": 								//持仓成本
				dimesionHtml += " <option value=''>全部</option>\
								  <option value='0'>绝对值</option>\
               					  <option value='1'>资产占比</option>";
				config.price.html(nullHtml);
				config.object.html(nullHtml);
				config.subObject.html(nullHtml);
				config.dimesion.html(dimesionHtml);
				config.operate.html(operateHtml);
				config.direction.html(nullHtml);
				config.profit.html(nullHtml);
				break;
			case "13": 								//资产类别市值
				dimesionHtml += " <option value=''>全部</option>\
								  <option value='0'>绝对值</option>\
               					  <option value='1'>资产占比</option>";
				config.price.html(nullHtml);
				config.object.html(nullHtml);
				config.subObject.html(nullHtml);
				config.dimesion.html(dimesionHtml);
				config.operate.html(operateHtml);
				config.direction.html(nullHtml);
				config.profit.html(nullHtml);
				break;
			case "14": 								//交易额度
				dimesionHtml += " <option value=''>全部</option>\
								  <option value='0'>绝对值</option>\
               					  <option value='1'>资产占比</option>";
               	directionHtml += "<option value=''>全部</option>\
               					  <option value='0'>买</option>\
               					  <option value='1'>卖</option>\
               					  <option value='2'>买+卖</option>"
				config.price.html(nullHtml);
				config.object.html(nullHtml);
				config.subObject.html(nullHtml);
				config.dimesion.html(dimesionHtml);
				config.operate.html(operateHtml);
				config.direction.html(directionHtml);
				config.profit.html(nullHtml);
				break;
			case "15": 								//执行价格
				dimesionHtml += " <option value=''>全部</option>\
								  <option value='0'>绝对值</option>\
               					  <option value='1'>比例</option>";
               	priceHtml += "<option value=''>全部</option>\
               					<option value='0'>昨收</option>\
               					  <option value='1'>市均</option>\
               					  <option value='2'>最新</option>"
				config.price.html(priceHtml);
				config.object.html(nullHtml);
				config.subObject.html(nullHtml);
				config.dimesion.html(dimesionHtml);
				config.operate.html(operateHtml);
				config.direction.html(nullHtml);
				config.profit.html(nullHtml);
				break;
			case "16": 								//盈亏额度
				dimesionHtml += " <option value=''>全部</option>\
								  <option value='0'>绝对值</option>\
               					  <option value='1'>比例</option>";
               	profitHtml += "<option value=''>全部</option>\
               					<option value='0'>盈利</option>\
               					  <option value='1'>亏损</option>\
               					  <option value='2'>盈利或亏损</option>"
				config.price.html(nullHtml);
				config.object.html(nullHtml);
				config.subObject.html(nullHtml);
				config.dimesion.html(dimesionHtml);
				config.operate.html(nullHtml);
				config.direction.html(nullHtml);
				config.profit.html(profitHtml);
				break;
			case "18": 								//同向反向
				config.price.html(nullHtml);
				config.object.html(nullHtml);
				config.subObject.html(nullHtml);
				config.dimesion.html(nullHtml);
				config.operate.html(nullHtml);
				config.direction.html(nullHtml);
				config.profit.html(nullHtml);
				break;
			case "4": 								//证券买卖
				objectHtml += "<option value=''>全部</option>\
							   <option value='1'>个股</option>\
				               <option value='2'>板块</option>\
				               <option value='3'>概念</option>\
				               <option value='4'>行业(证监会标准)</option>";
				subObjectHtml += "<option value=''>全部</option>";
				bondHtml += "<option value=''>全部</option>\
							  <option value='1'>禁止买入</option>\
                       			 <option value='2'>禁止卖出</option>";
				config.price.html(nullHtml);
				config.object.html(objectHtml);
				config.subObject.html(subObjectHtml);
				config.dimesion.html(nullHtml);
				config.operate.html(bondHtml);
				config.direction.html(nullHtml);
				config.profit.html(nullHtml);
				matchObject(config.object,config.subObject);	//匹配对应的值
				break;
		}
	});

	function matchObject(param1,param2){
		var controlls = {
				conall:[{ 
					value : "",
                    name  : '全部'
				}],
                stock : [{
                    value : 1,
                    name  : '个股'
                }],
                plate : [{
                    value : 1,
                    name  : '沪深主板'
                },{
                    value : 2,
                    name  : '中小板'
                },{
                    value : 3,
                    name  : '创业板'
                }],
                concept : [{
                    value : 1,
                    name  : 'ST和*ST'
                },{
                    value : 2,
                    name  : '上市当天股票'
                }],
                industy : [{
                    value : 1,
                    name  : '农、林、牧、渔业'
                },{
                    value : 2,
                    name  : '采掘业'
                },{
                    value : 3,
                    name  : '制造业'
                },{
                    value : 4,
                    name  : '电力、煤气及水的生产和供应业'
                },{
                    value : 5,
                    name  : '建筑业'
                },{
                    value : 6,
                    name  : '交通运输、仓储业'
                },{
                    value : 7,
                    name  : '信息技术业'
                },{
                    value : 8,
                    name  : '批发和零售交易'
                },{
                    value : 9,
                    name  : '金融、保险业'
                },{
                    value : 10,
                    name  : '房地产业'
                },{
                    value : 11,
                    name  : '社会服务业'
                },{
                    value : 12,
                    name  : '传播与文化产业'
                },{
                    value : 13,
                    name  : '综合类'
                }]
            };

       param1.on("change",function(){
            var val = $(this).val();
            var html = "";
            switch(val){
            	case "":
                    for (var i = 0; i < controlls.conall.length; i++) {
                        html += "<option value="+ controlls.conall[i].value +">"+ controlls.conall[i].name +"</option>"
                    };
                    break;
                case "1":
                    for (var i = 0; i < controlls.stock.length; i++) {
                        html += "<option value="+ controlls.stock[i].value +">"+ controlls.stock[i].name +"</option>"
                    };
                    break;
                case "2":
                    for (var i = 0; i < controlls.plate.length; i++) {
                        html += "<option value="+ controlls.plate[i].value +">"+ controlls.plate[i].name +"</option>"
                    };
                    break;
                case "3":
                    for (var i = 0; i < controlls.concept.length; i++) {
                        html += "<option value="+ controlls.concept[i].value +">"+ controlls.concept[i].name +"</option>"
                    };
                    break;
                case "4":
                    for (var i = 0; i < controlls.industy.length; i++) {
                        html += "<option value="+ controlls.industy[i].value +">"+ controlls.industy[i].name +"</option>"
                    };
                    break;
            };
            param2.html(html);
        })
	};


	//获取所有机构
	(function instDom(){
		var data = {};
		data.loginName = username;
		data.authKey = authKey;
		$.ajax({
			url : "/privatelyfund/listInstitution_operator",
			data : data,
			dateType : "GET",
			success : function(data){
				if (data.success = true) {
					var list = data.data.list[0];
					instRenderDom(list);	//写入机构
					instMatch();			//获取机构和产品账户的对应关系
				};
			}
		})
	})();

	function instRenderDom(param){
		var html = "<option value=''>全部</option>";
		for(var p in param){
			html += "<option value = " + p + ">" + param[p] + "</option>";
		};
		config.inst.html(html);
		var selected = config.inst.find("option").eq(1);
		selected.attr("selected",true);
		triggerClick();
	}

	function instMatch(){
		config.inst.on("change",function(){
			var nullHtml = "<option value=''>无</option>";
			var defaultHtml = "<option value=''>全部</option>";
			var val = $(this).val();
			if (val == "") {
				config.product.html(defaultHtml);
				config.account.html(defaultHtml);
			}else{
				var data = {};
				data.institution_id = val;
				data.authKey = authKey;
				$.ajax({
					url : "/privatelyfund/listInstProductInfo_product",
					data : data,
					type : "GET",
					success : function(data){
						if (data.success == true) {
							var list = data.data.list[0];
							if (list == undefined) {
								config.product.html(nullHtml);
								config.account.html(nullHtml);
							}else{
								var product = list.products;
								var len = list.products.length,
									productLen;
								if (len == 0 || list.length == 0) {
									config.product.html(nullHtml);
									config.account.html(nullHtml);
								}else{
									var accountHtml = "<option value = ''>全部</option>";
									var fundHtml = "<option value = ''>全部</option>";
									var fundArr = [];
									var accountArr = [];
									for (var i = 0; i < product.length; i++) {
										var fund = product[i].funds;
										fundArr.push(product[i].funds);
										accountArr.push(product[i].product_name);
										accountHtml += "<option title = " + product[i].product_id + ">" + product[i].product_name + "</option>";
									};
									config.product.html(accountHtml);
									config.product.on("change",function(){
										config.account.html("");
										var val = $(this).val();
										var index = $.inArray(val,accountArr);
										var fundssHtml = "";
										fundHtml = "";
										if ( index == -1 || fundArr[index].length == 0) {
											if($(this).val() == ""){ 
												fundssHtml += "<option value=''>全部</option>";
											}else{ 
												fundssHtml += "<option value=''>无</option>";
											}
										}else{
											for(var p in fundArr[index]){
												fundssHtml += "<option>" + fundArr[index][p].fund_name + "</option>";
											};
										}
										config.account.html(fundssHtml);
									})
									config.account.html(fundHtml);
								}
							}
						};
					}
				})
			}
		})
	}

	//筛选
	riskFilter.on("click",function(){
		loading.show();
		var date = new Date();
		updatetime.html("最后更新时间: " + date.toLocaleString());
		var data = {};
		data.control_type   = config.com.val();					//风控类别
		data.inst_id		= config.inst.val();;				//机构id
		var productValue	= config.product.find(":selected").attr("title");
		var fundtValue		= config.account.find(":selected").attr("title");
		data.product_id     = productValue == undefined ? "" : productValue ;//产品id
		data.fund_key 		= fundtValue == undefined ? "" : fundtValue;	//账号id
		data.standard_price = config.price.val();				//标准价格
		data.control_object = config.object.val();				//控制对象
		data.subdivision_object = config.subObject.val();		//细分对象
		data.control_dimension  = config.dimesion.val();		//控制维度
		data.trigger_operation  = config.operate.val();			//触警操作	
		data.control_direction  = config.direction.val();		//控制方向
		data.profit_type 		= config.profit.val();			//盈亏类别
		data.authKey = authKey;		
		configDate = data;
		$.ajax({
			url : '/privatelyfund/listRiskForBroker_risk',
			data : data,
			type : "GET",
			success : function(data){
				if(data.success == true){
					var riskAllRecode = [];	//整个风控记录
					var list = data.data.list;
					if (list.length > 0) {
						for (var p in list) {
							riskAllRecode.push(list[p]);
						};
						recodeAllRender(riskAllRecode);	//界面拼装
						loading.hide();
					}else{
						loading.hide();
					}
				}else{
					$.messager.show({
						title : '提示',
						iconCls : 'icon-logo',
						msg   : '数据出错,请重新加载',
						timeout : 1000,
						showSpeed : 100,
						style : {
							left : "50%",
							marginLeft : "-125px"
						},
					})
				}
			}
		})
	});
	
	//刷新
	refresh.on("click",function(){ 
		triggerClick();
	});

	//每隔1分钟获取一次当天的风控记录
	setInterval(function(){
		triggerClick();
	},60000);

	//导出报表
	riskExport.on("click",function(){ 
		configDate.product_id = configDate.product_id == undefined ? "" : configDate.product_id;
		configDate.fund_key = configDate.fund_key == undefined ? "" : configDate.fund_key;
		var url = "/privatelyfund/riskRuleExportReport_risk?control_type=" + configDate.control_type +  
				  "&inst_id=" + configDate.inst_id + "&product_id=" + configDate.product_id + "&fund_key=" + configDate.fund_key + "&standard_price=" + configDate.standard_price + "&control_object=" + configDate.control_object +  
				  "&subdivision_object=" + configDate.subdivision_object + "&control_dimension=" + configDate.control_dimension + "&trigger_operation=" + configDate.trigger_operation + "&control_direction=" + configDate.control_direction +  
				  "&profit_type=" + configDate.profit_type + "&authKey=" + authKey ;
		window.open(url);
	})

	function triggerClick(){ 
		riskFilter.trigger("click");
	};

	/*var flag = false;*/			//通过hidden来控制表格的隐藏和显示

	function recodeAllRender(rows){
		$("#riskAllRecode").datagrid({
			title : '风控记录',
			nowrap : false,
			fitColumus : true,
			singleSelect : true,
			remoteSort : false,
			/*multiSort : true,	多行排序*/
			data : rows,
			columns : [[
				{
					field:'index',
	                title:'编号',
	                align: 'center',
	                /*hidden : flag,*/
	                width:"3%",
	                formatter : function(value,row,index){
	                	var index = index + 1;
	                	return index;
	                }
				},{
					field:'risk_type',
	                title:'控制类别',
	                align: 'center',
	                sortable:true,
	                width:"7%",
				},{
					field : 'instName',
					title : '相关机构',
					align : 'center',
					sortable:true,
					width : '8%',
					formatter : function(value,row,index){ 
						var instName = "";
						instName = row.inst_name == null ? "-" : row.inst_name;
						return instName;
					}
				},{
					field : 'layer',
					title : '层级',
					align : 'center',
					sortable : true,
					width : '4%',
					formatter : function(value,row,index){ 
						var layer = "";
						layer = row.layer == null ? "-" : row.layer;
						return layer;
					}
				},{ 
					field : 'accountNum',
					title : '账户编号',
					align : 'center',
					sortable:true,
					width : '7%',
					formatter : function(value,row,index){ 
						var accountNum = "";
						accountNum = row.effectiveRangeList;
						if (!$.isEmptyObject(accountNum)) { 
							accountNum = accountNum.join(",");
						}else{ 
							accountNum = "-";
						}
						return accountNum;
					}
				},{ 
					field : 'subdivision_object',
					title : '细分对象',
					align : 'center',
					sortable:true,
					width : '8%',
					formatter : function(value,row,index){ 
						var sub_object = "";
						sub_object = row.subdivision_object;
						sub_object = sub_object == null ? "-" : sub_object;
						return sub_object;
					}
				},{ 
					field : 'control_dim',
					title : '比较维度',
					align : 'center',
					width : '5%',
					formatter : function(value,row,index){ 
						var control_dim = "";
						control_dim = row.control_dimension;
						control_dim = control_dim == null ? "-" : control_dim;
						return control_dim;
					}
				},{
					field : 'trigger',
					title : '阀值设定',
					align : 'center',
					width : '6%',
					formatter : function(value,row,index){ 
						var trigger = "";
						trigger = row.param_trigger;
						var arr = [];		//存放阈值
						if (!$.isEmptyObject(trigger)) { 
							for(var p in trigger){ 
								arr.push(trigger[p]);
							};
							trigger = arr.join(",");
						}else{ 
							trigger = "无";
						}
						return trigger;
					},
					styler : function(){
						return 'word-wrap: break-word;word-break:break-all;';
					}
				},{
					field : 'param_trigger',
					title : '风控方式',
					align : 'center',
					sortable:true,
					width : '8%',
					formatter : function(value,row,index){ 
						var param_trigger = "";
						param_trigger = row.param_trigger;
						var arr = [];	
						var styleArr = [];	
						if (!$.isEmptyObject(param_trigger)) { 
							for(var p in param_trigger){ 
								arr.push(p);
							};
							var len = arr.length;
							for (var i = 0; i < len; i++) {
								styleArr.push(arr[i].substr(1,arr[i].length));
							};
							param_trigger = styleArr.join(",");
						}else{ 
							param_trigger = "无";
						}
						return param_trigger;
					},
					sorter:function(a,b){
						var arrA = [];
						var arrA1 = [];
						var arrB = [];
						var arrB1 = [];
						if (!$.isEmptyObject(a)) {
							for(var p in a){ 
								arrA.push(p);
							};
							var len = arrA.length;
							for (var i = 0; i < len; i++) {
								arrA1.push(arrA[i].substr(1,arrA[i].length));
							};
						}else{
							arrA1.push("无");
						}
						if (!$.isEmptyObject(b)) {
							for(var p in b){ 
								arrB.push(p);
							};
							var len = arrB.length;
							for (var i = 0; i < len; i++) {
								arrB1.push(arrB[i].substr(1,arrB[i].length));
							};
						}else{
							arrB1.push("无");
						}

						if (arrA1[0] > arrB1[0]) { 
							return 1;
						}else if(arrA1[0] < arrB1[0]){ 
							return -1;
						}else{ 
							return 0;
						}
					}
				},{ 
					field : 'status',
					title : '状态',
					align : 'center',
					sortable:true,
					width : '4%',
					styler : function(value,row,index){
	            		if (row.status == "开启") {
	            			return {
	            				style : 'color:green',
	            			}
	            		}else{
	            			return {
	            				style : 'color:#f00',
	            			}
	            		}
	            	},
				},{ 
					field : 'remark',
					title : '备注说明',
					align : 'center',
					sortable:true,
					width : '6%',
				},{ 
					field : 'asset_type',
					title : '资产类别',
					align : 'center',
					width : '5%',
				},{
					field : 'standard_price',
					title : '标准价格',
					align : 'center',
					width : '5%',
					formatter : function(value,row,index){ 
						var standard_price = "";
						standard_price = row.standard_price == null ? "-" : row.standard_price;
						return standard_price;
					},
	            	sorter:function(a,b){
						if (a > b) { 
							return 1;
						}else if(a < b){ 
							return -1;
						}else{ 
							return 0;
						}
					}
				},{ 
					field : 'control_direction',
					title : '控制方向',
					align : 'center',
					width : '5%',
					formatter : function(value,row,index){ 
						var control_direction = "";
						control_direction = row.control_direction == null ? "-" : row.control_direction;
						return control_direction;
					}
				},{ 
					field : 'profit_type',
					title : '盈亏类别',
					align : 'center',
					width : '5%',
					formatter : function(value,row,index){ 
						var profit_type = "";
						profit_type = row.profit_type == null ? "-" : row.profit_type;
						return profit_type;
					}
				},{ 
					field : 'create_time',
					title : '创建时间',
					align : 'center',
					sortable:true,
					width : '8%',
				},{ 
					field : 'update_time',
					title : '更新时间',
					align : 'center',
					sortable:true,
					width : '8%',
				}
			]]
		});
	};
})