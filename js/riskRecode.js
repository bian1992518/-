/**
 * author : bianlongting
 * email : bianlongting@myhexin.com
 * Date: 15-12-23
 * Time: 下午15:10
 * Script : 风控记录
 */
(function(){
	//刷新时间
	var date = new Date();
	var lasttime = $("#updatetime");
	var loading  = $("#loading");
	lasttime.html("最后更新时间: " + date.toLocaleString());
	var inst_id,authKey,operator_id;
	var refreshFlag;
	var btn = $(".btn-even");
	loading.show();
	btn.on("click",function(e){
		e.preventDefault();
		var id = $(this).data("id");
		var fn = config[id];
		if(!fn) return;
        fn.call(this,e);
	});

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

	var config = {
		'refresh' : function(){
			riskRecode();
		},
		'riskExport' : function(){
			var url = "/privatelyfund/riskLogExportReport_risk?inst_id="+inst_id+"&download_filename=riskRecode.xls&authKey="+authKey;
			window.open(url);
		}
	}

	function riskRecode(){
		var date = new Date();
		lasttime.html("最后更新时间: " + date.toLocaleString());
		var data = {};
		data.inst_id = inst_id;
		data.authKey = authKey;
		$.ajax({
			url : "/privatelyfund/searchAllRiskLog_risk",
			data : data,
			type : 'POST',
			success : function(data){
				if (data.success == true) {
					var riskRecode = [];	//整个风控记录
					var list = data.data.list;
					if (list.length > 0) {
						for (var p in list) {
							riskRecode.push(list[p]);
						};
						recodeRender(riskRecode);	//界面拼装
						loading.hide();
					}else{
						loading.hide();
						$(".risk-tip").show();
					}
					
				}else{
					$.messager.alert({
						title : '提示',
						iconCls : 'icon-logo',
						msg   : '数据出错,请重新加载'
					})
				}
			}
		})
	};

	riskRecode();		//获取当天的风控记录
	//每隔1分钟获取一次当天的风控记录
	setInterval(function(){
		riskRecode();
	},60000);

	function recodeRender(rows){
		$("#riskRecode").datagrid({
			title : '风控记录',
			nowrap : false,
			fitColumus : true,
			singleSelect : true,
			remoteSort:false,
			multiSort:true,
			data : rows,
			columns : [[
				{
					field:'index',
	                title:'编号',
	                align: 'center',
	                width:"3%",
	                formatter : function(value,row,index){
	                	var index = index + 1;
	                	return index;
	                }
				},{
					field:'logtime',
	                title:'触警时间',
	                align: 'center',
	                sortable:true,
	                width:"15%",
	              
				},{
					field:'risk_type',
					title:'风控类型',
					align:'center',
					width:"10%",
					formatter : function(value,row,index){
						var riskType = "";
						switch(row.risk_type){
							case 1:
								riskType = "交易金额控制";
								break;
							case 2:
								riskType = "交易数量控制";
								break;
							case 3:
								riskType = "交易价格控制";
								break;
							case 4:
								riskType = "证券买卖控制";
								break;
							case 10:
								riskType = "持仓数量控制";
								break;
							case 11:
								riskType = "持仓市值控制";
								break;
							case 12:
								riskType = "持仓成本控制";
								break;
							case 13:
								riskType = "品种持仓市值控制";
								break;
							case 14:
								riskType = "交易额度控制";
								break;
							case 15:
								riskType = "执行价格控制";
								break;
							case 16:
								riskType = "盈亏额度控制";
								break;
							case 18:
								riskType = "同向反向控制";
								break;
						};
						return riskType;
					}
				},{
					field:'layer',
					title:'控制层次',
					align:'center',
					width:"5%",
					formatter : function(value,row,index){
						var layer = "";
						switch(row.layer){
							case 1:
								layer = "机构";
								break;
							case 2:
								layer = "产品";
								break;
							case 3:
								layer = "账户";
								break;
						};
						return layer;
					}
				},{
					field:'assetUnit',
					title:'资产单元',
					align:'center',
					width:"10%",
				},{
					field:'trigger',
					title:'触警操作',
					align:'center',
					width:"7%",
					formatter : function(value,row,index){
						var trigger = "";
						var risk_trigger = row.risk_trigger,
						    risk_type    = row.risk_type;
						if (risk_type == 16) {
							trigger = (risk_trigger == 0) ? "卖出" : "警告";
						}else if (risk_type == 4) {
							trigger = (risk_trigger == 0) ? "禁止买入" : "禁止卖出";
						}else{
							trigger = (risk_trigger == 0) ? "禁止" : "警告";
						};
						return trigger;
					}
				},{
					field:'remark',
					title:'风控说明',
					align:'center',
					width:"15%"
				},{
					field:'description',
					title:'详细记录',
					align:'center',
					width:"35%"
				}
			]]
		});
	};

	

})();
