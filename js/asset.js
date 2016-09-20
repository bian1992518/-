/**
 * author : bianlongting
 * email : bianlongting@myhexin.com
 * Date: 15-12-24
 * Time: 上午10:10
 * Script : 多层查看
 */
(function(){

	var institutionID = '',
		productID = '',
        fundID = '';
	var cache = {};
    var inst_id,authKey,operator_id;
	var accountLevel = $("#accountLevel");
	var treeDate;
	var loading      = $("#loading");
	var goods = $("#goods-panel");
	var table1Body=$("#gd-table-1").find("tbody"),
    	table2Body=$("#gd-table-2").find("tbody"),
    	table3Body=$("#gd-table-3").find("tbody"),
    	table4Body=$("#gd-table-4").find("tbody"),
    	table5Body=$("#gd-table-5").find("tbody");
    var selectInst = $("#select_inst");
	goods.hide();
	loading.show();
	var btn = $(".btn-even");
	btn.on("click",function(e){
		e.preventDefault();
		var id = $(this).data("id");
		var fn = config[id];
		if (!fn) return;
		fn.call(this,e);
	});
	var config = {
		'refresh' : function(){
			clickRow("1","2",treeDate);			//前两个参数必须要传
		},
		'riskExport' : function(){
			var str = $("#accountLevel").html();
			var merge = $(".merge");
	        //持仓合并拆分添加merge参数   默认为0 拆分   合并时为1
	        if (merge.hasClass("split")) {
	            if(fundID){
	                var url="/privatelyfund/multilayerExportReport_product?fund_id="+fundID+"&fund_name="+str+"&download_filename=report.xls&merge=1&authKey="+authKey;
	            }else if(undefined==fundID&&productID){
	                var url="/privatelyfund/multilayerExportReport_product?product_id="+productID+"&product_name="+str+"&download_filename=report.xls&merge=1&authKey="+authKey;
	            }else{
	                var url="/privatelyfund/multilayerExportReport_product?institution_id="+institutionID+"&institution_name="+str+"&download_filename=report.xls&merge=1&authKey="+authKey;
	            }
	        }else{
	            if(fundID){
	                var url="/privatelyfund/multilayerExportReport_product?fund_id="+fundID+"&fund_name="+str+"&download_filename=report.xls&merge=0&authKey="+authKey;
	            }else if(undefined==fundID&&productID){
	                var url="/privatelyfund/multilayerExportReport_product?product_id="+productID+"&product_name="+str+"&download_filename=report.xls&merge=0&authKey="+authKey;
	            }else{
	                var url="/privatelyfund/multilayerExportReport_product?institution_id="+institutionID+"&institution_name="+str+"&download_filename=report.xls&merge=0&authKey="+authKey;
	            }
	        }
            window.open(url);
		}
	};

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

	//格式化数字，超过4位则设置多少W
    function format_money (m) {
        var n = (m+"").split('.')[0];
        return (n+"").length>4?((m/10000).toFixed(1)+"万"):m.toFixed(1);
    };
    function formatNumber(num){
		var n=num+"";
		if(n.indexOf('%')!=-1){
			n=n.replace('%','');
		}
		n=parseFloat(n);
		if(isNaN(n)||n==0) return '<span style="color:#ccc">'+num+'</span>';
		if(n>0){
			return '<span style="color:#f00">'+num+'</span>';
		}else{
			return '<span style="color:#008000">'+num+'</span>';
		}
	}
	function formatData(item){
        if(item===undefined||item==null||item=="null") return "-";
        if(typeof(item)!="object") return item;
            var data={};
            for(var n in item){
                var val=item[n];
                if(val===""||val==="null"||val===null||val===undefined){
                    data[n]="-";
                }else{
                    data[n]=val;
                }
            }
            return data;
    }

    //机构列表

    function instList(){
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
    				instRender(list);
    			};
    		}
    	})
    }

	//账户列表
	function countList(inst){
		$.get("/privatelyfund/listInstProductInfo_product?institution_id="+inst+"&authKey="+authKey,function(data){
			var setting = {
				data : {
					key :{
						
					},
					simpleData : {
						enable : true
					}
				},
				callback : {
					onClick : clickRow			//回调函数
				}
			};

			var zNodes = [],
				data   = data.data.list[0],
				name   = data.institution_name,
				institution_id= data.institution_id,
				value  = data.products;

			//添加机构
			zNodes.push({
				id : 1,
				pId : 0,
				name : name,
				institution_id : inst,
				value : value,
				open : true
			});
			//添加产品
			for (var i = 0; i < data.products.length; i++) {
				var obj = {},
					funds = data.products[i].funds;
				obj.id = 1 + (i + 1 + "");
				obj.pId = 1;
				obj.name = data.products[i].product_name;
				obj['product_id'] = data.products[i].product_id;
				obj['inst_id'] = data.institution_id;
				obj.value = funds;
				if (funds.length > 0) {
					obj.open = true;
					zNodes.push(obj);

					//添加账户
					for (var j = 0; j < funds.length; j++) {
						var fundsObj = {};
						fundsObj.id = obj.id  + (i + 1 + "");
						fundsObj.pId = 1 + (i + 1 + "");
						fundsObj.name = funds[j].fund_code;
						fundsObj.inst_id = funds[j].institution_id;
						fundsObj.fund_id = funds[j].fund_id;
						fundsObj.fund_type = funds[j].fund_type;
						fundsObj['product_id'] = data.products[i].product_id;
						fundsObj.icon = "../css/icons/istock.png";
						zNodes.push(fundsObj);
					};
				};
				
			};

			$(document).ready(function(){
				$.fn.zTree.init($("#assetTree"), setting, zNodes);
				$("#assetTree>li a").eq(0).trigger('click');	
				loading.hide();
			});

		});
	}

	function instRender(param){
		var html = "";
		var firstInst = "";
		for(var p in param){
			html += "<option value = " + p + ">" + param[p] + "</option>";
		};
		selectInst.html(html);
		firstInst = selectInst.val();
		countList(firstInst);
		selectInst.on("change",function(){
			var index = $(this).val();
			countList(index);
		});
	}

	//判断登陆的是券商还是机构
	if (!Role_Qs && Role_Qs == undefined) {
		$(".select_institution").hide();
		countList(inst_id);
	}else{
		instList();
	}
	

	
	
	//树状图回调函数
	function clickRow(value,treeId,treeNode){
		loading.show();
		treeDate = treeNode;
		goods.hide();
		$(".account-container").show();
		if (treeNode.hasOwnProperty("institution_id")) {
			cache = {};
			cache.institution_id = treeNode.institution_id;
			accountLevel.html(treeNode.name);
			institutionID = treeNode.institution_id;
		}else if (treeNode.hasOwnProperty("product_id") && !treeNode.hasOwnProperty("fund_id")) {
			cache = {};
			accountLevel.html(treeNode.name);
			cache.institution_id = treeNode.inst_id;
			cache.product_id = treeNode.product_id;
			productID = treeNode.product_id;
		}else if (treeNode.hasOwnProperty("fund_id")){
			cache = {};
			accountLevel.html(treeNode.name);
			cache.institution_id = treeNode.inst_id;
			cache.product_id = treeNode.product_id;
			cache.fund_id = treeNode.fund_id;
			fundID = treeNode.fund_id;
		
		};
		if (treeNode.hasOwnProperty("fund_id") && treeNode.fund_type == "1") {
			goods.show();
			$(".account-container").hide();
			$("#J-goods-title").html(treeNode.name);
			stockGoodShow(cache);
			showTable1(cache);
			showTable2(cache);
			showTable3(cache);
			showTable4(cache);
			showTable5(cache);
		}else{
			loadView(cache);	//页面加载
			numView(cache);		//持仓总览
			profitView(cache);	//盈亏记录
			tradeView(cache);	//交易记录
			totalShowOrder(cache);
			numShowOrder(cache);
			tradeShowOrder(cache);
		}
		

	};
	setInterval(function(){
        clickRow("1","2",treeDate);
    },60000);//10分钟刷新一次

	function loadView(params){
		params.authKey = authKey;
		$.ajax({
			url : '/privatelyfund/analyseProductInfo_product',
			data : params,
			type : 'GET',
			success : function(data){
				if (data.success == true) {
					var data = data.data.list;
					var productQuery = [];
					for (var p in data) {
						productQuery.push(data[p]);
					};
					productRender(productQuery);	//产品信息查询
					loading.hide();
				}else{
					$.messager.show({
						title : '提示',
						msg   : '数据异常,请重新加载',
						timeout : 3000,
						iconCls :'icon-logo',
						style : {
							left : "50%",
							marginLeft : "-125px"
						}
					});
				}
			}
		})
	};

	function productRender(rows){
		$("#productQuery").datagrid({
			nowrap : false,
			fitColumus : true,
			singleSelect : true,
			remoteSort:false,
			multiSort:true,
			data : rows,
			columns : [[
				{
					field:'update_date',
	                title:'日期',
	                align: 'center',
	                width:120,
				},{
					field:'unit',
	                title:'加权单位净值',
	                align: 'center',
	                width:150,
	                formatter : function(value,row,index){
	                	var unit = "";
	                	unit = row.unit_net_value != null ? row.unit_net_value.toFixed(4) : "-";
	                	return unit;
	                }
	              
				},{
					field:'asset',
					title:'净资产',
					align:'center',
					width:100,
					formatter : function(value,row,index){
	                	var asset = "";
	                	asset = row.net_asset != null ? row.net_asset.toFixed(2) : "-";
	                	return asset;
	                }
				},{
					field:'asset_share',
					title:'份额',
					align:'center',
					width:100
				},{
					field:'rate',
					title:'股票市值/净资产',
					align:'center',
					width:100,
					formatter : function(value,row,index){
	                	var rate = "";
	                	rate = row.rate != null ? row.rate.toFixed(2) : "-";
	                	return rate;
	                }
				},{
					field:'account',
					title:'分类账户',
					align:'center',
					width:100,
					formatter : function(){
						var account = "股票";
						return account;
					}
				},{
					field:'remain',
					title:'证券现金余额',
					align:'center',
					width:100,
					formatter : function(value,row,index){
	                	var remain = "";
	                	remain = row.cash_remain != null ? row.cash_remain.toFixed(2) : "-";
	                	return remain;
	                }
				},{
					field:'value',
					title:'证券市值',
					align:'center',
					width:100,
					formatter : function(value,row,index){
	                	var value = "";
	                	value = row.stock_market_value != null ? row.stock_market_value.toFixed(2) : "-";
	                	return value;
	                }
				},{
					field:'balance',
					title:'银行余额',
					align:'center',
					width:100,
					formatter : function(value,row,index){
	                	var balance = "";
	                	balance = row.bank_balance != null ?  row.bank_balance.toFixed(2) : "-";
	                	return balance;
	                }
				}
			]]
		});
	};

	//持仓合并和拆分
    var merge = $(".merge");
    var flag = false;
    merge.on("click",function(){
        $(this).toggleClass('split');
        numView(cache);
        numShowOrder(cache);
    });

    //对象按照键值排序

    var flag = true;

    function sortObject(proptypeName){
        flag = !flag;
        return function(object1,object2){
            var value1 = object1[proptypeName];
            var value2 = object2[proptypeName];

            if (flag) {
                if (value1 > value2) {
                    return 1;
                }else if (value1 < value2) {
                    return -1;
                }else{
                    return 0;
                }
            }else{
                if (value1 > value2) {
                    return -1;
                }else if (value1 < value2) {
                    return 1;
                }else{
                    return 0;
                }
            }
        }
    }

	// 持仓总览
    function numView(data) {
        var totalTbody = $('#num-table').find('tbody');
        data.authKey = authKey;
        $('#cc-pages').thsPage({
            data: data,
            url: "/privatelyfund/analyseProductStock_product",
            succFunc: function(data) {
                var html = '';
                if (data.success == true) {
		  			var data = data.data;
                    var total = data.total;
		   			var mergerelen = data.mergeresult.length;
		    		var mergeresult = data.mergeresult;
                    var list = data.list;
              
                    var len = list.length;
                    $(".c_b").html(total.stock_remain_total);//多少支股票
                    $(".c_c").html(format_money(total.stock_market_value_total));//市值
                    $(".c_d").html((total.market_asset_rate_total*100).toFixed(0)+"%");//占净值比例
                    if (len > 0 || mergerelen > 0) {
                        if (!merge.hasClass('split')) {
                            var dataList = data.list;
                            merge.html("合并");
                            $(".c_a").html(total.stock_code_total);//股票数量
                           for (var i = 0; i < len; i++) {
                                html += "<tr>" +
	                                        "<td>" + list[i]['stock_code'] + "</td>" +
	                                        "<td>" + list[i]['stock_name'] + "</td>" +
	                                        "<td>" + list[i]['stock_remain'] + "</td>" +
	                                        "<td>" + formatNumber(list[i]['floating_profit']) + "</td>" +
	                                        "<td>" + formatNumber((list[i]['floating_profit_rate']).toFixed(2)) + "</td>" +
	                                        "<td>" + (list[i]['price_current'] != null ? (list[i]['price_current']).toFixed(2) : '-') + "</td>" +
	                                        "<td>" + (list[i]['stock_market_value']).toFixed(2) + "</td>" +
	                                        "<td>" + ((list[i]['market_asset_rate'])*100).toFixed(4) + "</td>" +
	                                        "<td>" + ((list[i]['market_asset_rate_t1'])*100).toFixed(4)+ "</td>" +
	                                        "<td>" + formatNumber((list[i]['up_down_current']!=null?(list[i]['up_down_current']).toFixed(2):'-')) + "</td>" +
	                                        "<td>" + ((list[i]['net_value_change'])*100).toFixed(4) + "</td>" +
	                                        "<td>" + list[i]['price_trans_in'] + "</td>" +
	                                        "<td>" + (list[i]['net_value']).toFixed(2) + "</td>" +
	                                     "</tr>"
                            } 
                        }else{
                            mergeresult = mergeresult.sort(sortObject(cache.sort_name));
                            merge.html("拆分");
                            flag = !flag;
                            var page = data.pageinfo.pages;  //获取页码
                            $(".c_a").html(data.mergepageinfo.count);//股票数量
                            for (var i = 15*(page - 1); i < Math.min(15*page,data.mergeresult.length); i++) {
                                html += "<tr>" +
                                            "<td>" + mergeresult[i]['stock_code'] + "</td>" +
                                            "<td>" + mergeresult[i]['stock_name'] + "</td>" +
                                            "<td>" + mergeresult[i]['stock_remain'] + "</td>" +
                                            "<td>" + formatNumber((mergeresult[i]['floating_profit']).toFixed(2)) + "</td>" +
                                            "<td>" + formatNumber((mergeresult[i]['floating_profit_rate']).toFixed(2)) + "</td>" +
                                            "<td>" + (mergeresult[i]['price_current'] != null ? (mergeresult[i]['price_current']).toFixed(2) :'-') + "</td>" +
                                            "<td>" + (mergeresult[i]['stock_market_value']).toFixed(2) + "</td>" +
                                            "<td>" + ((mergeresult[i]['market_asset_rate'])*100).toFixed(4) + "</td>" +
                                            "<td>" + ((mergeresult[i]['market_asset_rate_t1'])*100).toFixed(4)+ "</td>" +
                                            "<td>" + formatNumber((mergeresult[i]['up_down_current']!=null?(mergeresult[i]['up_down_current']).toFixed(2):'-')) + "</td>" +
                                            "<td>" + ((mergeresult[i]['net_value_change'])*100).toFixed(4) + "</td>" +
                                            "<td>" + (mergeresult[i]['price_trans_in']).toFixed(3) + "</td>" +
                                            "<td>" + (mergeresult[i]['net_value']).toFixed(2) + "</td>" +
                                         "</tr>"
                            }
                        }
                        
                    }else {
                    	 $(".c_a").html("0");//股票数量
                        html += "<tr><td colspan='13'>暂无数据</td></tr>"
                    }

                    totalTbody.html(html)
                } else {
                    alert(data.errMsg)
                }
            }
        })
    }

    //持仓总览排序
    function numShowOrder(data) {
        var _td = $('#num-table').find('thead td');
        _td.off('click')
        _td.on('click', function() {
            var sort_name = $(this).attr("data-type"),
                sort = $(this).attr("data-sort");
            data.sort_name = sort_name;

            var sortIcon = $(this).find("i");
            if (sortIcon.length > 0) {
                data.sort = sort == 1 ? -1 : 1;
                $(this).attr("data-sort", data.sort)
                if (sort == -1) {
                    sortIcon.removeClass('sort-0')
                } else {
                    sortIcon.addClass('sort-0')
                }
            } else {
                data.sort = 1
                $(this).siblings().find('i').remove();
                $('<i class="sort-1 sort"></i>').appendTo($(this))
            }
            if (sort_name) {
            	flag = !flag;
                numView(data);
            }

        })
    }

	//  盈亏记录
    function profitView(data) {
        var totalTbody = $('#yk-table').find('tbody');
        data.authKey = authKey;
        $("#yk-pages").thsPage({
            data: data,
            url: "/privatelyfund/analyseProductProfit_product",
            succFunc: function(data) {
                var html = '';
                if (data.success == true) {
                    var data = data.data
                    var _y_total = data.total;
                    $("._y_a").html(format_money(_y_total.floating_profit_total));//浮动盈亏
                    $("._y_b").html(format_money(_y_total.settlement_profit_loss_total));//已结盈亏
                    $("._y_c").html(format_money(_y_total.profit_loss_total));//总盈亏
                    $("._y_d").html('-');//相对昨日
                    var len = data.list.length;
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            html += "<tr>" +
                                        "<td>" + data.list[i]['establish_date'] + "</td>" +
                                        "<td>" + data.list[i]['close_date'] + "</td>" +
                                        "<td>" + data.list[i]['stock_name'] + "</td>" +
                                        "<td>" + data.list[i]['stock_code'] + "</td>" +
                                        "<td>" + data.list[i]['trans_count'] + "</td>" +
                                        "<td>" + data.list[i]['price_trans_in'] + "</td>" +
                                        "<td>" + (data.list[i]['price_trans_out']).toFixed(2) + "</td>" +
                                        "<td>" + formatNumber((data.list[i]['settlement_profit_loss']).toFixed(2)) + "</td>" +
                                        "<td>" + formatNumber((data.list[i]['settlement_profit_loss']*100/(Math.abs(data.list[i]['price_trans_in'])*data.list[i]['trans_count'])).toFixed(2))+ "</td>" +
                                     "</tr>"
                        }
                    } else {
                        html += "<tr><td colspan='9'>暂无数据</td></tr>"
                    }
                    totalTbody.html(html);
                } else {
                    alert(data.errMsg);
                }
            }
        })
    }

    // 盈亏记录排序
    function totalShowOrder(data) {
        var _td = $('#yk-table').find('thead td');
            _td.off('click')
            _td.on('click', function() {
                
                var sort_name = $(this).attr("data-type"),
                    sort = $(this).attr("data-sort");
                data.sort_name = sort_name;
                var sortIcon = $(this).find("i");
                if (sortIcon.length > 0) {
                    data.sort = sort == 1 ? -1 : 1;
                    $(this).attr("data-sort", data.sort)
                    if (sort == -1) {
                        sortIcon.removeClass('sort-0')
                    } else {
                        sortIcon.addClass('sort-0')
                    }
                } else {
                    data.sort = 1
                    $(this).siblings().find('i').remove();
                    $('<i class="sort-1 sort"></i>').appendTo($(this))
                }
                if (sort_name) {
                    profitView(data)
                }

            })
    }

    // 交易记录展现  
    function tradeView(data) {
        var totalTbody = $('#trade-table').find('tbody');
        data.authKey = authKey;
        $('#trade-pages').thsPage({
            data: data,
            url: 'privatelyfund/analyseProductBusiness_product',
            succFunc: function(data) {
	            var html = '';
                if (data.success == true) {
                    var total = data.data.total;
                    var data = data.data.list;
                    $(".j_a").html(total.count_total);//交易
                    $(".j_b").html(total.trans_count_total);//股
                    $(".j_c").html(format_money(total.money_transed_total));//钱

                    $(".j_d").html(total.count_total_in);//买入
                    $(".j_e").html(total.trans_count_total_in);//股
                    $(".j_f").html(format_money(total.money_transed_total_in));//钱

                    $(".j_g").html(total.count_total_out);//卖出
                    $(".j_h").html(total.trans_count_total_out);//股
                    $(".j_i").html(format_money(total.money_transed_total_out));//钱

                    var len = data.length;
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            html +="<tr>"+
                                        "<td>" + data[i]['trans_date'] + "</td>" +
                                        "<td>" + data[i]['op_name'] + "</td>" +
                                        "<td>" + formatData(data[i]['operator_name']) + "</td>" +
                                        "<td>" + data[i]['stock_code'] + "</td>" +
                                        "<td>" + data[i]['stock_name'] + "</td>" +
                                        "<td>" + data[i]['trans_count'] + "</td>" +
                                        "<td>" + data[i]['price_trans_in'] + "</td>" +
                                        "<td>" + data[i]['money_chg'] + "</td>" +
                                        "<td>" + (((data[i]['rate'])*100).toFixed(4)) + "</td>"+
                                    "</tr>"; 
                        }
                    } else {
                        html += "<tr><td colspan='9'>暂无数据</td></tr>"
                    }
                    totalTbody.html(html)
                } else {
                    alert(data.errMsg);
                }

            }
        })
    }

    //交易记录排序
    function tradeShowOrder(data) {
        var _td = $('#trade-table').find('thead td');
        _td.off('click')
        _td.on('click', function() {
            var sort_name = $(this).attr("data-type"),
                sort = $(this).attr("data-sort");
            data.sort_name = sort_name;
            var sortIcon = $(this).find("i");
            if (sortIcon.length > 0) {
                data.sort = sort == 1 ? -1 : 1;
                $(this).attr("data-sort", data.sort)
                if (sort == 0) {
                    sortIcon.removeClass('sort-0')
                } else {
                    sortIcon.addClass('sort-0')
                }
            } else {
                data.sort = 1
                $(this).siblings().find('i').remove();
                $('<i class="sort-1 sort"></i>').appendTo($(this))
            }
            if (sort_name) {
                tradeView(data);
            }

        })
    };

    function stockGoodShow(data){
        data.authKey = authKey;
        var tbody=$("#stock-table-1").find("tbody");
        $.ajax({
                type: 'get',
                data: data,
                dataType: "json",
                url: "privatelyfund/listFutureCashInfo_product",
                success: function(data) {
                    if (data.success == true) {
                        var data = data.data
                        var len = data.list&&data.list.length||0;
                        var buf=[];
                        if (len > 0) {
                            for (var i = 0; i < len; i++) {
                                var item=data.list[i];
                                item=formatData(item);
                                buf.push("<tr><td>"+item["futures_varieties"]+"</td>");
                                buf.push("<td>"+item["futures_contracts"]+"</td>");
                                buf.push("<td>"+item["buy_amount"]+"</td>");
                                buf.push("<td>"+item["buy_price"]+"</td>");
                                buf.push("<td>"+item["sale_amount"]+"</td>");
                                buf.push("<td>"+item["sale_price"]+"</td>");
                                buf.push("<td>"+item["yesterday_settlement"]+"</td>");
                                buf.push("<td>"+item["today_settlement"]+"</td>");
                                buf.push("<td>"+formatNumber(item["mark_to_market_profit"])+"</td>");
                                buf.push("<td>"+item["guaranteed_balance_used"]+"</td>");
                                buf.push("<td>"+item["t_B"]+"</td>");
                                buf.push("<td></td>");
                                buf.push("<td></td></tr>");
                            }
                        } else {
                            buf.push("<tr><td colspan='13'>暂无数据</td>");
                        }
                        tbody.html(buf.join(''));
                    }
                }
            });
    }
    //期货的表格汇总
    //资金状况
    function showTable1(data){
    	data.authKey = authKey;
        $.ajax({
            type: 'get',
            data: data,
            dataType: "json",
            url: "privatelyfund/listFutureCashInfo_product",
            success: function(data) {
                if (data.success == true) {
                    var data = data.data
                    var len = data.list.length;
                    var buf=[];
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            var item=data.list[i];
                            item=formatData(item);
                            buf.push("<tr><td>" + (i + 1) + "</td>");
                            buf.push("<td>"+item["fund_code"]+"</td>");
                            buf.push("<td>"+item["fund_name"]+"</td>");
                            buf.push("<td>"+item["busin_date"]+"</td>");
                            buf.push("<td>"+item["current_cash"]+"</td>");
                            buf.push("<td>"+item["begin_cash"]+"</td>");
                            buf.push("<td>"+formatNumber(item["total_profit"])+"</td>");
                            buf.push("<td>"+formatNumber(item["closeposition_profit"])+"</td>");
                            buf.push("<td>"+formatNumber(item["mark_to_market_profit"])+"</td>");
                            buf.push("<td>"+item["today_input_output_total"]+"</td>");
                            buf.push("<td>"+item["sxf_fee"]+"</td>");
                            buf.push("<td>"+item["guaranteed_balance_used"]+"</td>");
                            buf.push("<td>"+item["available_balance"]+"</td></tr>");
                        }
                    } else {
                        buf.push("<tr><td colspan='13'>暂无数据</td>");
                    }
                    table1Body.html(buf.join(''));
                }
                loading.hide();
            }
        });
    }
    //持仓明细表
    function showTable2(data){
    	data.authKey = authKey;
        $.ajax({
            type: 'get',
            data: data,
            dataType: "json",
            url: "privatelyfund/listFutureInfo_product",
            success: function(data) {
                if (data.success == true) {
                    var data = data.data
                    var len = data.list.length;
                    var buf=[];
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            var item=data.list[i];
                            item=formatData(item);
                            buf.push("<tr><td>"+item["market_code"]+"</td>");
                            buf.push("<td>"+item["futures_varieties"]+"</td>");
                            buf.push("<td>"+item["futures_contracts"]+"</td>");
                            buf.push("<td>"+item["openposition_date"]+"</td>");
                            buf.push("<td>"+item["t_B"]+"</td>");
                            buf.push("<td>"+item["entrustdirection_code"]+"</td>");
                            buf.push("<td>"+item["current_amount"]+"</td>");
                            buf.push("<td>"+item["openposition_price"]+"</td>");
                            buf.push("<td>"+item["yesterday_settlement"]+"</td>");
                            buf.push("<td>"+item["yesterday_price"]+"</td>");
                            buf.push("<td>"+formatNumber(item["float_profit"])+"</td>");
                            buf.push("<td>"+formatNumber(item["mark_to_market_profit"])+"</td>");
                            buf.push("<td>"+item["guaranteed_balance"]+"</td></tr>");
                        }
                    } else {
                        buf.push("<tr><td colspan='13'>暂无数据</td>");
                    }
                    table2Body.html(buf.join(''));
                }
            }
        });
    }
    //持仓汇总表
    function showTable3(data){
    	data.authKey = authKey;
        $.ajax({
            type: 'get',
            data: data,
            dataType: "json",
            url: "privatelyfund/listTotalFutureInfo_product",
            success: function(data) {
                if (data.success == true) {
                    var data = data.data;
                    var len = data.list&&data.list.length||0;
                    var buf=[];
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            var item=data.list[i];
                            item=formatData(item);
                            buf.push("<tr><td>"+item["futures_varieties"]+"</td>");
                            buf.push("<td>"+item["futures_contracts"]+"</td>");
                            buf.push("<td>"+item["buy_amount"]+"</td>");
                            buf.push("<td>"+item["buy_price"]+"</td>");
                            buf.push("<td>"+item["sale_amount"]+"</td>");
                            buf.push("<td>"+item["sale_price"]+"</td>");
                            buf.push("<td>"+item["yesterday_settlement"]+"</td>");
                            buf.push("<td>"+item["today_settlement"]+"</td>");
                            buf.push("<td>"+formatNumber(item["mark_to_market_profit"])+"</td>");
                            buf.push("<td>"+item["guaranteed_balance_used"]+"</td>");
                            buf.push("<td>"+item["t_B"]+"</td>");
                            buf.push("<td></td>");
                            buf.push("<td></td></tr>");
                        }
                    } else {
                        buf.push("<tr><td colspan='13'>暂无数据</td>");
                    }
                    table3Body.html(buf.join(''));
                }
            }
        });
    }
    //成交记录表
    function showTable4(data){
    	data.authKey = authKey;
        $.ajax({
            type: 'get',
            data: data,
            dataType: "json",
            url: "privatelyfund/listFutureBusiness_product",
            success: function(data) {
                if (data.success == true) {
                    var data = data.data
                    var len = data.list.length;
                    var buf=[];
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            var item=data.list[i];
                            item=formatData(item);
                            buf.push("<tr><td>"+item["busin_date"]+"</td>");
                            buf.push("<td>"+item["market_code"]+"</td>");
                            buf.push("<td>"+item["futures_varieties"]+"</td>");
                            buf.push("<td>"+item["futures_contracts"]+"</td>");
                            buf.push("<td>"+item["entrustdirection_code"]+"</td>");
                            buf.push("<td>"+item["t_B"]+"</td>");
                            buf.push("<td>"+item["business_price"]+"</td>");
                            buf.push("<td>"+item["business_amount"]+"</td>");
                            buf.push("<td>"+item["balance"]+"</td>");
                            buf.push("<td>"+item["open_close"]+"</td>");
                            buf.push("<td>"+item["sxf_fee"]+"</td>");
                            buf.push("<td>"+formatNumber(item["closeposition_profit"])+"</td>");
                            buf.push("<td>"+item["ext_business_id"]+"</td></tr>");
                        }
                    } else {
                        buf.push("<tr><td colspan='13'>暂无数据</td>");
                    }
                    table4Body.html(buf.join(''));
                }
            }
        });
    }
    //平仓明细表
    function showTable5(data){
    	data.authKey = authKey;
        $.ajax({
            type: 'get',
            data: data,
            dataType: "json",
            url: "privatelyfund/listFutureClosePosition_product",
            success: function(data) {
                if (data.success == true) {
                    var data = data.data
                    var len = data.list.length;
                    var buf=[];
                    if (len > 0) {
                        for (var i = 0; i < len; i++) {
                            var item=data.list[i];
                            item=formatData(item);
                            buf.push("<tr><td>"+item["closeposition_date"]+"</td>");
                            buf.push("<td>"+item["market_code"]+"</td>");
                            buf.push("<td>"+item["futures_varieties"]+"</td>");
                            buf.push("<td>"+item["futures_contracts"]+"</td>");
                            buf.push("<td>"+item["openposition_date"]+"</td>");
                            buf.push("<td>"+item["entrustdirection_code"]+"</td>");
                            buf.push("<td>"+item["business_amount"]+"</td>");
                            buf.push("<td>"+item["openposition_price"]+"</td>");
                            buf.push("<td>"+item["yesterday_settlement"]+"</td>");
                            buf.push("<td>"+item["business_price"]+"</td>");
                            buf.push("<td>"+formatNumber(item["closeposition_profit"])+"</td>");
                            buf.push("<td>"+item["royalty_payments"]+"</td>");
                            buf.push("<td></td></tr>");
                        }
                    } else {
                        buf.push("<tr><td colspan='13'>暂无数据</td>");
                    }
                    table5Body.html(buf.join(''));
                }
            }
        });
    }

})();
