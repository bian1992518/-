/* 
 * Ahthor bianlongting
 * Email  bianlongting@myhexin.com
 * Date   16-01-08
 * Time   下午 15：00
 * Script 风控记录(券商)
 */

$(function(){

	var loading = $("#loading"),
		updatetime = $("#updatetime"),
		riskFilter = $("#riskFilter"),
		refresh    = $("#refresh"),
		riskExport = $("#riskExport"),
		firsttime,lasttime;

	var flag = false;	//判断表格是否显示

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
	var role_type = getCookie("role_type");
	var authKey = getCookie("authKey");

	if (role_type) {
		$(".inst_content").remove();
		flag = !flag;
	};

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
			operateHtml1 = "",
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
               					  <option value='2'>盈利或亏损</option>";
               	operateHtml1 += "<option value=''>全部</option>\
						    <option value='1'>卖出(风控员确定)</option>\
                       			 <option value='0'>警告</option>";
				config.price.html(nullHtml);
				config.object.html(nullHtml);
				config.subObject.html(nullHtml);
				config.dimesion.html(dimesionHtml);
				config.operate.html(operateHtml1);
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
					if (!role_type) { 			
						instRenderDom(list);	//写入机构
						instMatch();			//获取机构和产品账户的对应关系
					}else{ 
						triggerClick();
					}
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
											fundssHtml += "<option value=''>全部</option>";
											for(var p in fundArr[index]){
												fundssHtml += "<option value = " + fundArr[index][p].fund_id + ">" + fundArr[index][p].fund_name + "</option>";
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
		firsttime = data.start_time_new = $("input[name='firsttime']").val();		//起始时间
		lasttime = data.end_time_new   = $("input[name='endtime']").val();		//结束时间
		firsttime = firsttime.replace(/\-/g,"");
		lasttime = lasttime.replace(/\-/g,"");
		if( lasttime < firsttime ){ 
			$.messager.alert({
				title : '提示',
				iconCls : 'icon-logo',
				msg   : '结束时间要大于等于起始时间',
				fn : function(){ 
					loading.hide();
				},
				onClose : function(){ 
					loading.hide();
				}
			})
			return false;
		}
		data.control_type   = config.com.val();					//风控类别
		if (role_type == "2") { 
			data.inst_id = "100";
			data.product_id = "";
			data.fund_key = "";
		}else{ 
			data.inst_id		= config.inst.val();				//机构id
			data.product_id     = config.product.find(":selected").attr("title");//产品id
			data.fund_key 		= config.account.find(":selected").attr("title");//账号id
		}
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
			url : '/privatelyfund/listRiskLogsInfo_risk',
			data : data,
			type : "GET",
			success : function(data){
				if(data.success == true){
					var riskRecode = [];	//整个风控记录
					var list = data.data.list;
					if (list.length > 0) {
						for (var p in list) {
							riskRecode.push(list[p]);
						};
						recodeRender(riskRecode);	//界面拼装
						loading.hide();
					}else{
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
						loading.hide();
						$('#riskAllRecode').datagrid('loadData', { total: 0, rows: [] });
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

	//导出报表
	riskExport.on("click",function(){ 
		configDate.product_id = configDate.product_id == undefined ? "" : configDate.product_id;
		configDate.fund_key = configDate.fund_key == undefined ? "" : configDate.fund_key;
		configDate.inst_id = configDate.inst_id == undefined ? "" : configDate.inst_id;
		if (role_type == "2") { 
			configDate.inst_id = "100";
		};
		var url = "/privatelyfund/riskLogsExportReport_risk?start_time_new=" + configDate.start_time_new + "&end_time_new=" + configDate.end_time_new + "&control_type=" + configDate.control_type +  
				  "&inst_id=" + configDate.inst_id + "&product_id=" + configDate.product_id + "&fund_key=" + configDate.fund_key + "&standard_price=" + configDate.standard_price + "&control_object=" + configDate.control_object +  
				  "&subdivision_object=" + configDate.subdivision_object + "&control_dimension=" + configDate.control_dimension + "&trigger_operation=" + configDate.trigger_operation + "&control_direction=" + configDate.control_direction +  
				  "&profit_type=" + configDate.profit_type + "&authKey=" + authKey ;
		window.open(url);
	})

	//每隔1分钟获取一次当天的风控记录
	setInterval(function(){
		triggerClick();
	},60000);

	function triggerClick(){ 
		riskFilter.trigger("click");
	};

	//根据不同的券商或者机构来控制宽度
	var init = {
		width1 : 3,
		width2 : 11,
		width3 : 9,
		width4 : 10,
		width5 : 6,
		width6 : 8
	};
	if (role_type) {
		for(var p in init){
			init[p] ++;
		}
	};

	function recodeRender(rows){
		$("#riskAllRecode").datagrid({
			title : '风控记录',
			nowrap : false,
			fitColumus : true,
			singleSelect : true,
			remoteSort : false,
			autoRowHeight : false,
			/*multiSort : true,	多行排序*/
			data : rows,
			columns : [[
				{
					field:'index',
	                title:'编号',
	                align: 'center',
	                width: init.width1 + "%",
	                formatter : function(value,row,index){
	                	var index = index + 1;
	                	return index;
	                }
				},{
					field:'logtime',
	                title:'时间',
	                align: 'center',
	                sortable:true,
	                width:init.width2 + "%",
				},{
					field : 'instName',
					title : '机构',
					align : 'center',
					sortable:true,
					hidden : flag ,
					width : init.width3 + "%",
					formatter : function(value,row,index){ 
						var instName = "";
						instName = row.inst_name == null ? "-" : row.inst_name;
						return instName;
					}
				},{
					field : 'productName',
					title : '产品',
					align : 'center',
					sortable:true,
					hidden : flag ,
					width : init.width3 + "%",
					formatter : function(value,row,index){ 
						var productName = "";
						productName = row.product_name == null ? "-" : row.product_name;
						return productName;
					}
				},{
					field : 'fund_name',
					title : '账号',
					align : 'center',
					sortable:true,
					hidden : flag ,
					width : init.width4 + "%",
					formatter : function(value,row,index){ 
						var fund_name = "";
						fund_name = row.fund_name == null ? "-" : row.fund_name;
						return fund_name;
					},
	            	sorter:function(a,b){
						if (parseFloat(a) > parseFloat(b)) { 
							return 1;
						}else if(parseFloat(a) < parseFloat(b)){ 
							return -1;
						}else{ 
							return 0;
						}
					}
				},{
					field : 'standard_price',
					title : '标准价格',
					align : 'center',
					sortable:true,
					width : init.width5 + "%",
					formatter : function(value,row,index){ 
						var price = "";
						var standard_price = (row.standard_price * 1).toString();
						if (row.standard_price == -1) {
							price = "-";
						}else{
							if (row.control_type == 15) {
								price  = row.standard_price + "(元)";
							}else{
								price  = row.standard_price + "(万元)";
							}
						}
						return price;
					}
				},{
					field : 'conDirection',
					title : '控制方向',
					align : 'center',
					sortable:true,
					width : init.width5 + "%",
					formatter : function(value,row,index){ 
						var conDirection = "";
						if(row.control_direction){ 
							switch(row.control_direction){ 
								case "-1":
									conDirection = "-";
									break;
								case "0":
									conDirection = "买";
									break;
								case "1":
									conDirection = "卖";
									break;
								case "2":
									conDirection = "买+卖";
									break;
							}
						}else{ 
							conDirection = "-";
						};
						return conDirection;
					}
				},{ 
					field : 'conObject',
					title : '控制对象',
					align : 'center',
					sortable:true,
					width : init.width5 + "%",
					formatter : function(value,row,index){ 
						var conObject = "";
						if(row.control_object){ 
							switch(row.control_object){ 
								case "-1":
									conObject = "-";
									break;
								case "1":
									conObject = "个股";
									break;
								case "2":
									conObject = "板块";
									break;
								case "3":
									conObject = "ST";
									break;
								case "4":
									conObject = "行业";
									break;
							}
						}else{ 
							conObject = "-"
						};
						return conObject;
					}
				},{ 
					field : 'subdivide',
					title : '细分对象',
					align : 'center',
					sortable:true,
					width : init.width5 + "%",
					formatter : function(value,row,index){
	                	var subdivide = "";
	                	if (row.subdivision_object == "-1") {
	                		subdivide = "-";
	                	};
	                	var subdivision_object = row.control_object + row.subdivision_object;
	                	var obj = [
	                		{"11" : '个股'},
	                		{"21" : '沪深主板'},
	                		{"22" : '中小板'},
	                		{"23" : '创业板'},
	                		{"31" : 'ST和*ST'},
	                		{"32" : '上市当天股票'},
	                		{"41" : '农、林、牧、渔业'},
	                		{"42" : '采掘业'},
	                		{"43" : '制造业'},
	                		{"44" : '电力、煤气及水的生产和供应业'},
	                		{"45" : '建筑业'},
	                		{"46" : '交通运输、仓储业'},
	                		{"47" : '信息技术业'},
	                		{"48" : '批发和零售交易'},
	                		{"49" : '金融、保险业'},
	                		{"410" : '房地产业'},
	                		{"411" : '社会服务业'},
	                		{"412" : '传播与文化产业'},
	                		{"413" : '综合类'},
	                	];
	                	if(row.subdivision_object){ 
	                		for(var p in obj){
		                		for(var n in obj[p]){
		                			if (n == subdivision_object) {
		                				subdivide = obj[p][n];
		                			};
		                		}
		                		
		                	};
	                	}else{ 
	                		subdivide = "-";
	                	}
	                	
	                	return subdivide;
	                }
				},{ 
					field : 'threshold_value',
					title : '阀值',
					align : 'center',
					sortable:true,
					width : init.width6 + "%",
					formatter : function(value,row,index){ 
						var threshold = "";
						threshold = row.threshold_value == "-1" ? "-" : row.threshold_value;
						if (row.control_dimension == "0"){
							if (row.control_type == "1") {
								threshold += "(%)";
							}else if (row.control_type == "2") {
								threshold += "(股)";
							}else if (row.control_type == "15") {
								threshold += "(元)";
							}else{
								threshold += "(万元)";
							}
						}else if(row.control_type == "4"){
							threshold = "-";
						}else{
							threshold += "(%)";
						}
						return threshold;
					},
					sorter:function(a,b){
						a = a.split('(');
						b = b.split('(');
						if (parseFloat(a[0]) > parseFloat(b[0])) { 
							return 1;
						}else if(parseFloat(a[0]) < parseFloat(b[0])){ 
							return -1;
						}else{ 
							return 0;
						}
					}
				},{ 
					field : 'actual_value',
					title : '实际值',
					align : 'center',
					sortable:true,
					width : init.width6 + "%",
					formatter : function(value,row,index){ 
						var actual_value = "";
						var controlType = row.control_type;
						if(controlType != "16"){ 
							actual_value = row.actual_value == "-1" ? "-" : row.actual_value;
						}else{ 
							actual_value = row.actual_value;
						}
						if (row.control_dimension == "0") {
							if (controlType == "1") {
								actual_value += "(%)";
							}else if (controlType == "2") {
								actual_value += "(股)";
							}else if (controlType == "15") {
								actual_value += "(元)";
							}else{
								actual_value += "(万元)";
							}
						}else if(controlType == "4"){
							actual_value = "-";
						}else{
							actual_value += "(%)";
						}

						return actual_value;
					},
					styler : function(value,row,index){
						if (row.control_type != "4") {
		            		if (row.trigger_operation == 0) {
		            			return {
		            				style : 'color:#f00',
		            			}
		            		}else{
		            			return {
		            				style : 'color:#f0ad4e',
		            			}
		            		}
						};
	            	},
	            	sorter:function(a,b){
						a = a.split('(');
						b = b.split('(');
						if (parseFloat(a[0]) > parseFloat(b[0])) { 
							return 1;
						}else if(parseFloat(a[0]) < parseFloat(b[0])){ 
							return -1;
						}else{ 
							return 0;
						}
					}
				},{ 
					field : 'trigger_operation',
					title : '触警操作',
					align : 'center',
					sortable:true,
					width : init.width5 + "%",
					formatter : function(value,row,index){ 
						var trigger_operation = "";
						if(row.control_type == 4){ 
							trigger_operation = row.trigger_operation == "0" ? "禁止买入" : "禁止卖出";
						}else{ 
							trigger_operation = row.trigger_operation == "0" ? "禁止" : "预警";
						};
						return trigger_operation;
					}
				},{ 
					field : 'profit_type',
					title : '盈亏类别',
					align : 'center',
					sortable:true,
					width : init.width5 + "%",
					formatter : function(value,row,index){ 
						var profit_type = "";
						if(row.profit_type){ 
							switch(row.profit_type){
								case "-1":
									profit_type = "-";
									break; 
								case "0":
									profit_type = "盈利";
									break;
								case "1":
									profit_type = "亏损";
									break;
								case "2":
									profit_type = "盈利或亏损";
									break;
							}
						}else{ 
							profit_type = "-";
						};
						return profit_type;
					}
				},{
					field:'risk_type',
					title:'风控类型',
					align:'center',
					sortable:true,
					width:init.width6 + "%",
					formatter : function(value,row,index){
						var riskType = "";
						switch(row.control_type){
							case "1":
								riskType = "交易金额控制";
								break;
							case "2":
								riskType = "交易数量控制";
								break;
							case "3":
								riskType = "交易价格控制";
								break;
							case "4":
								riskType = "证券买卖控制";
								break;
							case "10":
								riskType = "持仓数量控制";
								break;
							case "11":
								riskType = "持仓市值控制";
								break;
							case "12":
								riskType = "持仓成本控制";
								break;
							case "13":
								riskType = "品种持仓市值控制";
								break;
							case "14":
								riskType = "交易额度控制";
								break;
							case "15":
								riskType = "执行价格控制";
								break;
							case "16":
								riskType = "盈亏额度控制";
								break;
							case "18":
								riskType = "同向反向控制";
								break;
						};
						return riskType;
					}
				}
			]]
		});
	};

})