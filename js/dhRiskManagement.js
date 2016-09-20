/**
 * author : bianlongting
 * email : bianlongting@myhexin.com
 * Date: 15-12-14
 * Time: 上午9:44
 * Script : 风控系统
 */
$(function(){

	var loading = $("#loading");
	var inst_id,authKey,operator_id;
	window.configEffective = {};	//缓存对象
	loading.show();

	function isNum(val){
		var reg = /^[0-9]+$/;
		return reg.test(val);
	}

	//截取字符串
 	function cutstr(str, len) {
		var temp,
		icount = 0,
		patrn = /[^\x00-\xff]/,
		strre = "";
		if (str) {
			if (str.length > len ) {
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
		};
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
	var role_type = getCookie("role_type");
	var authKey = getCookie("authKey");

	//登出
	$(".signout").on("click",function(){
		window.location.href = "../logout";
	});

	//面板切换禁止修改和删除按钮
	$("#tabs").tabs({
		onSelect : function(row,index,value){
			$(".disabled").addClass("l-btn-disabled");
		}
	})

	//获取生效范围
	effectiveRange();
	function effectiveRange(){
		var data = {};
		data.inst_id = inst_id;
		data.authKey = authKey;
		$.ajax({
			url : '/privatelyfund/seachEffectiveRange_risk',
			data : data,
			type: 'POST',
			dataType : 'JSON',
			success : function(data){
				if (data.success == true) {
					var effective_range = data.data.effective_range;
					configEffective = effective_range;
					configEffective.inst_id = 1;
					configEffective.is_chosen = 1;
				};
			}
		})
	};

	//风控事件
	function RiskController(){
		var data = {};
		data.inst_id= inst_id == null ? "1" : inst_id;
		data.authKey = authKey;
		$.ajax({
			url: '/privatelyfund/listRisk_risk',
			type: 'GET',
			data : data,
			success : function(data) {
				if (data.success == true) {
					var data = data.data.list;
					var dbRisk	    = [],			//单笔交易风控
						bondRisk	= [];			//证券买卖控制
					for (var i = 0; i < data.length; i++) {
						var riskType = data[i].risk_type;
	    				//单笔交易金额风控规则是1,数量风控规则是2
	    				if (riskType == 1 || riskType == 2) {
	    					for (var j = 0; j < data[i].effectiveRangeList.length; j++) {
								data[i].effective = "";		//账户编号
							    for (var p in data[i].effectiveRangeList[j]) {
							    	if (data[i].effectiveRangeList[j] != undefined) {
							    		data[i].effective += data[i].effectiveRangeList[j][p] + " ";
							    	};
							    };
							};
	        				dbRisk.push(data[i]);
	    				};
	    				//证券买卖风控规则是4
	    				if (riskType == 4) {
	    					for (var j = 0; j < data[i].effectiveRangeList.length; j++) {
								data[i].effective = "";		//账户编号
							    for (var p in data[i].effectiveRangeList[j]) {
							    	if (data[i].effectiveRangeList[j] != undefined) {
							    		data[i].effective += data[i].effectiveRangeList[j][p] + " ";
							    	};
							    };
							};
	        				bondRisk.push(data[i]);
	    				};
	  				};
					
					dbRender(dbRisk);
					bondRender(bondRisk);
					loading.hide();
				};
			}
		})
	};
	RiskController();
	//单笔交易风控
	function dbRender(rows){
		$('#dbRisk').datagrid({
			title : '单笔交易设置',
	        singleSelect : true,
	        nowrap : false,
	        method : 'GET',
	        fitColumus : true,
	        autoRowHeight : false,
	        onClickRow : onClickRow,
	        data : rows,
	        columns:[[
	        	{
	                field:'index',
	                title:'编号',
	                align: 'center',
	                width:"6%",
	                formatter : function(value,row,index){
	                	var index = index + 1;
	                	return index;
	                }
	            },{
	                field:'v_type',
	                title:'比较维度',
	                align:'center',
	                width:"8%",
	                formatter : function(value,row,index){
	                	var v_type = "";
	                	if (row.risk_type == 1) {
	                		v_type = "金额(万元)";
	                	}else{
	                		v_type = "数量(股)";
	                	}
	                	return v_type;
	                }
	            },{
	                field:'riskParam',
	                title:'阀值设定',
	                align:'center',
	                width:"8%",
	                formatter : function(value,row,index){
	                	var riskParam = "";
	                	for (var i = 1; i < 4; i++) {
	                		var param = "param" + i;
	                		if (row.risk_param[param] != null) {
	                			riskParam += row.risk_param[param] + ",";
	                		};
	                	};
	                	riskParam = riskParam.slice(0, riskParam.length - 1);	//去掉字符串最后的逗号
	                	return riskParam;
	                }
	            },{
	                field:'trigger',
	                title:'风控方式',
	                align:'center',
	                width:"8%",
	                formatter : function(value,row,index){
	                	var trigger = "";
	                	for (var i = 1; i < 4; i++) {
	                		var triggerParam = "trigger" + i;
	                		if (row.risk_param[triggerParam] != null) {
	                			row.risk_param[triggerParam] = row.risk_param[triggerParam] == 1 ? "警告" : "禁止";
	                			trigger += row.risk_param[triggerParam] + ",";
	                		};
	                	};
	                	trigger = trigger.slice(0, trigger.length - 1);
	                	return trigger;
	                }
	            },{
	            	field:'status',
	            	title:'状态',
	            	align:'center',
	            	width:"5%",
	            	formatter : function(value,row,index){
	            		var status = "";
	            		status = row.isvalid == false ? "关闭" : "生效";
	            		return status;
	            	},
	            	styler : function(value,row,index){
	            		if (row.isvalid == false) {
	            			return {
	            				class : "isvalid",
	            				style : 'color:#f00',
	            			}
	            		}else{
	            			return {
	            				class : "isvalid",
	            				style : 'color:#0f0',
	            			}
	            		}
	            	}
	            },{
	            	field:'remark',
	            	title:'备注说明',
	            	align:'center',
	            	width:"25%",
	            },{
	            	field:'createtime',
	            	title:'创建时间',
	            	align:'center',
	            	width:"15%"
	            }
	            ,{
	            	field:'createtime',
	            	title:'更新时间',
	            	align:'center',
	            	width:"15%"
	            }
	        ]],
	        onClickRow  : function(rowIndex,filed,value){
	        	if (dbfield == "status") {
	        		var row = $("#dbRisk").datagrid("getSelected");
	        		loading.show();
	        		var data = {};
	        		data.risk_id = row.risk_id;
	        		if (row.isvalid == false) {
	        			//开启生效范围
	        			data.isvalid = 1;
	        		}else{
	        			//关闭生效范围
	        			data.isvalid = 0;
	        		};
	        		data.authKey = authKey;
	        		$.ajax({
		        		url : '/privatelyfund/isvalidSet_risk',
		        		data : data,
		        		type : 'GET',
		        		success : function(data){
		        			if (data.success == true) {
		        				RiskController();			//重新加载风控内容
		        			};
		        		}
	        		})
	        	}else{
	        		onClickRow();
	        	}
	        	
	        },
	        onClickCell : function(rowIndex,field,value){
	        	window.dbfield = field;
	        },

	    });
	}

	//证券买卖风控
	function bondRender(rows){
		$('#bondRisk').datagrid({
			title : '证券买卖设置',
	        singleSelect : true,
	        nowrap : false,
	        method : 'GET',
	        fitColumus : true,
	        onClickRow : onClickRow,
	        data : rows,			//不分页
	        columns:[[  
	             {
	                field:'index',
	                title:'编号',
	                align: 'center',
	                width:"5%",
	                formatter : function(value,row,index){
	                	var index = index + 1;
	                	return index;
	                }
	            },{
	                field:'subdivide',
	                title:'细分对象',
	                align:'center',
	                width:"9%",
	                formatter : function(value,row,index){
	                	var subdivide = "个股";
	                	return subdivide;
	                }
	            },{
	                field:'bw_list',
	                title:'证券列表',
	                align:'center',
	                width:"10%",
	                formatter : function(value,row,index){
	                	var bw_list = row.bw_list.join(" ");
	                	return bw_list;
	                }
	            },{
	                field:'bw_type',
	                title:'风控方式',
	                align:'center',
	                width:"9%",
	                formatter : function(value,row,index){
	                	var bw_type = "";
	                	if (row.bw_type == 0) {
	                		bw_type = "禁止买入";
	                	}else{
	                		bw_type = "禁止卖出";
	                	};
	                	return bw_type;
	                }
	            },{
	            	field:'status',
	            	title:'状态',
	            	align:'center',
	            	width:"5%",
	            	formatter : function(value,row,index){
	            		var status = "";
	            		status = row.isvalid == false ? "关闭" : "生效";
	            		return status;
	            	},
	            	styler : function(value,row,index){
	            		if (row.isvalid == false) {
	            			return {
	            				class : "isvalid",
	            				style : 'color:#f00',
	            			}
	            		}else{
	            			return {
	            				class : "isvalid",
	            				style : 'color:#0f0',
	            			}
	            		}
	            	}
	            },{
	            	field:'remark',
	            	title:'备注说明',
	            	align:'center',
	            	width:"25%",
	            },{
	            	field:'createtime',
	            	title:'创建时间',
	            	align:'center',
	            	width:"15%"
	            }
	            ,{
	            	field:'createtime',
	            	title:'更新时间',
	            	align:'center',
	            	width:"15%"
	            }
	        ]],
	        onClickRow  : function(rowIndex,filed,value){
	        	if (bondfield == "status") {
	        		var row = $("#bondRisk").datagrid("getSelected");
	        		loading.show();
	        		var data = {};
	        		data.risk_id = row.risk_id;
	        		if (row.isvalid == false) {
	        			//开启生效范围
	        			data.isvalid = 1;
	        		}else{
	        			//关闭生效范围
	        			data.isvalid = 0;
	        		};
					data.authKey = authKey;
	        		$.ajax({
		        		url : '/privatelyfund/isvalidSet_risk',
		        		data : data,
		        		type : 'GET',
		        		success : function(data){
		        			if (data.success == true) {
		        				RiskController();			//重新加载风控内容
		        			};
		        		}
	        		})
	        	}else{
	        		onClickRow();
	        	}
	        	
	        },
	        onClickCell : function(rowIndex,field,value){
	        	window.bondfield = field;
	        },

	    });
	}

	var buttons=$(".btn-even");
    buttons.on("click",function(e){
        e.preventDefault();
        var id=$(this).attr("data-id");
        var fn=configButtons[id];
        if(!fn) return;
        fn.call(this,e);
    });

    $(".disabled").linkbutton("disable");

    function riskSelect(){
    	$(".risk-select").hide();
    }
	var configButtons = {
		//单笔交易增加
		"dbAdd" : function () {
			riskSelect();
			$('#dbAdd').dialog('open');
			$(".mask").show();
			$(".switch-risk").prop("checked",true);
			$("#dbAdd").dialog({
				title:'单笔交易增加',
				iconCls : 'icon-logo',
				buttons : [{
					text : '确定',
					iconCls:'icon-ok',
					handler : function(){
						closeDialog($(".dialogCom"));
						var data = {};
						loading.show();
						data.isvalid   = $(".switch-risk").attr("checked") ? 1 : 0;
						data.remark    = $(".db-remark").val();
						data.v_type  = $(".dbdim").val();
						data.risk_type = "2";
						for (var i = 1; i < 4; i++) {
							var param = 'param' + i;
							data[param] = $(".db-form input").eq(i - 1).val();
							if(data[param]&&(isNaN(data[param])||data[param]<=0)){
                        		$.messager.alert({
                        			msg : '阈值请输入正整数',
                        			iconCls : 'icon-logo',
                        			title : '提示'
                        		});
                        		loading.hide();
                       			return false;
                   			}
							data['trigger' + i] = $(".db-form .dbCtl").eq(i - 1).val();
						};
						data.stock_type = 0;
						data.effective_range = JSON.stringify(configEffective);
						data.authKey = authKey;
						effectiveRange();		//重新获取生效范围缓存
						$.ajax({
	                        type: 'GET',
	                        dataType: "json",
	                        data:data,
	                        url: "/privatelyfund/addRiskRule_risk",
	                        success: function(data) {
	                        	if (data.success == true) {
	                           		RiskController();			//重新加载风控内容
	                        	};
	                        }
	                    });
					}
				},{
					text : '取消',
					handler : function(){
						closeDialog($(".dialogCom"));
						$(".mask,.overlay").hide();
					}
				}],
				onClose : function() {
					$(".mask,.overlay").hide();
				}
			});
			$(".select-unit").val("1");
			$(".db-remark").val("");
			$(".dbCtl").val("1");
			$(".risk-select").find('input').prop("checked",false);
			$(".list-item").val("");
			$(".overlay").on("click",function(){
				$(this).hide();
				riskSelect();
			})
		},
		//单笔交易修改
		"dbEdit" : function () {
			riskSelect();
			var row = $("#dbRisk").datagrid("getSelected");
			if (row.isvalid) {
				$(".db-risk").prop('checked', true);
			}else{
				$(".db-risk").prop('checked',false);
			}
			if ($(this).hasClass('l-btn-disabled')) {
				return false;
			};
			$('#dbAdd').dialog('open');
			$(".mask").show();
			var effective = row.effective.split(" ");	//账户编号数据
			effective.pop();							//去除最后一个空格
			$(".db-remark").val(row.remark);
			for (var i = 0; i < 3; i++) {
				$(".db-item").eq(i).val(row.risk_param["param" + (i + 1)]);
				if (row.risk_param["trigger" + (i + 1)] != undefined) {
					var options = $(".db-form .dbCtl").eq(i).find("option");
					options.each(function(index,el){
						if ($(this).html() == row.risk_param["trigger" + (i + 1)]) {
							$(this).attr('selected', true);
						};
					});
				};
			};
			$("#dbAdd").dialog({
				title:'单笔交易修改',
				iconCls : 'icon-logo',
				buttons : [{
					text : '确定',
					iconCls:'icon-ok',
					handler : function(){
	                    closeDialog($(".dialogCom"));
						var row = $("#dbRisk").datagrid("getSelected");
						loading.show();
						var data = {};
						if ($(".db-risk").prop("checked")) {
							data.isvalid = 1;
						}else{
							data.isvalid = 0;
						}
						data.remark    = $(".db-remark").val();
						data.v_type  = $(".dbdim").val();
						//单笔交易金额对应的风控类别为1,数量对应的风控类别是2
						data.risk_type = "2";
						for (var i = 1; i < 4; i++) {
							var param = 'param' + i;
							data[param] = $(".db-form input").eq(i - 1).val();
							if(data[param]&&(isNaN(data[param])||data[param]<=0)){
                        		$.messager.alert({
                        			msg : '阈值请输入正整数',
                        			iconCls : 'icon-logo',
                        			title : '提示'
                        		});
                        		loading.hide();
                       			return false;
                   			}
							data['trigger' + i] = parseInt($(".db-form .dbCtl").eq(i - 1).val());
						};
						
						data.risk_id = row.risk_id;
						data.stock_type = 0;
						data.effective_range = JSON.stringify(configEffective);
						data.authKey = authKey;
						effectiveRange();		//重新获取生效范围缓存
						$.ajax({
	                        type: 'post',
	                        dataType: "json",
	                        data:data,
	                        url: "/privatelyfund/updateRiskRule_risk",
	                        success: function(data) {
	                        	if (data.success == true) {
	                           		RiskController();			//重新加载风控内容
	                        	};
	                        }
	                    });
					}
				},{
					text : '取消',
					handler : function(){
						closeDialog($(".dialogCom"));
						$(".mask").hide();
					}
				}],
				onClose : function() {
					$(".mask,.overlay").hide();
				}
			})
		},
		//单笔交易删除
		"dbDelete" : function () {
			if ($(this).hasClass('l-btn-disabled')) {
				return false;
			};
			$.messager.confirm('提示','确认删除?',function(data){
				if (data) {
					loading.show();
					var row = $("#dbRisk").datagrid("getSelected");
					var index = $("#dbRisk").datagrid("getRowIndex",row);
					data = row.risk_id;
					$.ajax({
						url : "/privatelyfund/deleteRisk_risk?risk_id="+data+"&authKey="+authKey,
						type : 'GET',
						success : function(data){
							if (data.success == true) {
								RiskController();
								//ajax删除当前行后，直接在本页面
								$("#dbRisk").datagrid("deleteRow",index);	
							};
						}
					})
					closeDialog($(".dialogCom"));
					$(".mask").hide();
				}else{
					$(".mask").hide();
				}
			})
		},
		//证券买卖增加
		"bondAdd" : function () {
			riskSelect();
			$('#bondAdd').dialog('open');
			$(".mask").show();
			$(".switch-risk").prop("checked",true);
			//个股添加
			$("#linkbutton").click(function() {
				$("#stockAdd").dialog('open');
				$(".addItem").html("");
				var addInput = $(".inputStock");
				addInput.val("");
				var optionsOne = {
					serviceUrl : "/privatelyfund/blurSearchStock_risk",
                    minChars:2,
                    params:{
                        authKey : authKey,
                        stock_part : function(){
                        	return addInput.val();
                        }
                    },
                    dataType : 'JSON',
                    maxHeight:200,
                    width:212,
                    zIndex:1000000,
                    delimiter:/(,|;)\s*/,
                  
                };
                addInput.autocomplete(optionsOne);
				$("#stockAdd").dialog({
					title : '手动添加证券',
					iconCls : 'icon-logo',
					modal : true,
					buttons :[{
						text : '确定',
						handler : function(){
							var val = $(".inputStock").val();
							var html = "";
							if(val == "" || val.split(" ").length != 4){
								$.messager.show({
									title : '提示',
									msg   : '请输入正确的证券代码',
									timeout : 3000,
									iconCls :'icon-logo',
									style : {
									left : "50%",
									marginLeft : "-125px"
									},
								});
							}else{
								html = "<div class='bond-item'><span class='bond-item-name'>" + 
									    val +"</span><span class='remove-item'></span></div>";
								$(".addItem").append(html);
								$(".inputStock").val("");
							};
							$(".bond-item").hover(function() {
								$(this).find('.remove-item').show();
							}, function() {
								$(this).find('.remove-item').hide();
							});
							$('.bond-item').on('click', '.remove-item', function() {
								var parent = $(this).parent();
								parent.remove();
							});
							
						}
					},{
						text : '取消',
						handler : function(){
							closeDialog($("#stockAdd"));
						}
					}]
				})
			});

			$("#bondAdd").dialog({
				title:'证券买卖增加',
				iconCls : 'icon-logo',
				buttons : [{
					text : '确定',
					iconCls:'icon-ok',
					handler : function(){
						var data = {};
						loading.show();
						data.isvalid   = $(".switch-risk").attr("checked") ? 1 : 0;
						data.remark    = $(".bond-remark").val();
						data.bw_type   = parseInt($(".bondCtl").val());
						var arr = [];
						var bondName   = $(".bond-item-name");
						if (bondName.length >= 1) {
							bondName.each(function(index, el) {
								var html = $(this).html().split(" ");
								if (!isNaN(html) && html.length != 4) {
									return false; 
								};
								arr.push(html[0]);
							});
							data.bw_list = arr.join(',');
						}else{
							data.bw_list = "";
						}
						data.extended_id = parseInt($(".bond-object").val() + $(".bond-controller").val());
						//证券买卖对应的风控规则是4
						data.risk_type = "4";
						data.stock_type = 0;
						data.effective_range = JSON.stringify(configEffective);
						data.authKey = authKey;
						effectiveRange();		//重新获取生效范围缓存
						$.ajax({
	                        type: 'GET',
	                        dataType: "json",
	                        data:data,
	                        url: "/privatelyfund/addRiskRule_risk",
	                        success: function(data) {
	                        	if (data.success == true) {
	                        		closeDialog($(".dialogCom"));
	                           		RiskController();			//重新加载风控内容
	                        	};
	                        }
	                    });
					}
				},{
					text : '取消',
					handler : function(){
						closeDialog($(".dialogCom"));
						$(".mask,.overlay").hide();
					}
				}],
				onClose : function() {
					$(".mask,.overlay").hide();
				}
			});
			$(".select-unit").val("1");
			$(".bond-object").val("1");
			$(".bond-controller").html("<option value='1'>个股</option>");
			$(".bond-remark").val("");
			$(".risk-select").find('input').prop("checked",false);
			$(".list-item").val("");
			$(".overlay").on("click",function(){
				$(this).hide();
				riskSelect();
			});
		},
		//证券买卖修改
		"bondEdit" : function () {
			riskSelect();
			var row = $("#bondRisk").datagrid("getSelected");
			if (row.isvalid) {
				$(".bond-risk").prop('checked', true);
			}else{
				$(".bond-risk").prop('checked',false);
			}
			if ($(this).hasClass('l-btn-disabled')) {
				return false;
			};
			$('#bondAdd').dialog('open');

			var effective = row.effective.split(" ");	//账户编号数据
			effective.pop();							//去除最后一个空格
			
			$(".bond-remark").val(row.remark);
			
            var extend   = row.extended_id.toString(),
                firstNum = extend.slice(0, 1),
                endNum   = extend.slice(1, extend.length);

            $(".bond-object option").each(function() {
                if ($(this).attr('value') == firstNum) {
                    $(this).attr('selected', true);
                };
            }); 
            $(".bond-controller option").each(function() {
                if ($(this).attr('value') == endNum) {
                    $(this).attr('selected', true);
                };
            });

			//个股添加
			$("#linkbutton").click(function() {
				$("#stockAdd").dialog('open');
				var row = $("#bondRisk").datagrid("getSelected");
				var bondHtml = "";
				$(".addItem").html("");
				if (row.bw_list.length >= 1) {
					if (row.bw_list[0] != "") {
						for (var i = 0; i < row.bw_list.length; i++) {
							html = "<div class='bond-item'><span class='bond-item-name'>" + 
									row.bw_list[i] +"</span><span class='remove-item'></span></div>";
							$(".addItem").append(html);
						};
					};
				}else{
					$(".addItem").html("");
				};
				var addInput = $(".inputStock");
				var optionsOne = {
					serviceUrl : "/privatelyfund/blurSearchStock_risk",
                    minChars:2,
                    params:{
                        authKey : authKey,
                        stock_part : function(){
                        	return addInput.val();
                        }
                    },
                    dataType : 'JSON',
                    maxHeight:200,
                    width:212,
                    zIndex:1000000,
                    delimiter:/(,|;)\s*/,
                  
                };
                addInput.autocomplete(optionsOne);
				$(".bond-item").hover(function() {
					$(this).find('.remove-item').show();
				}, function() {
					$(this).find('.remove-item').hide();
				});
				$('.bond-item').on('click', '.remove-item', function() {
					var parent = $(this).parent();
					parent.remove();
				});
				$("#stockAdd").dialog({
					title : '手动添加证券',
					iconCls : 'icon-logo',
					modal : true,
					buttons :[{
						text : '确定',
						handler : function(){
							var val = $(".inputStock").val();
							var html = "";
							var addItem = $(".addItem");
							if(val == "" || val.split(" ").length != 4){
								$.messager.show({
									title : '提示',
									msg   : '请输入正确的证券代码',
									timeout : 3000,
									iconCls :'icon-logo',
									style : {
									left : "50%",
									marginLeft : "-125px"
									},
								});
							}else{
								html = "<div class='bond-item'><span class='bond-item-name'>" + 
									    val +"</span><span class='remove-item'></span></div>";
								addItem.append(html);
								$(".inputStock").val("");
							};
							$(".bond-item").hover(function() {
								$(this).find('.remove-item').show();
							}, function() {
								$(this).find('.remove-item').hide();
							});
							$('.bond-item').on('click', '.remove-item', function() {
								var parent = $(this).parent();
								parent.remove();
							});
							
						}
					},{
						text : '取消',
						handler : function(){
							closeDialog($("#stockAdd"));
						}
					}]
				})
			});
			$("#bondAdd").dialog({
				title:'证券买卖修改',
				iconCls : 'icon-logo',
				buttons : [{
					text : '确定',
					iconCls:'icon-ok',
					handler : function(){
						closeDialog($(".dialogCom"));
						var row = $("#bondRisk").datagrid("getSelected");
						loading.show();
						var data = {};
						if ($(".bond-risk").prop("checked")) {
							data.isvalid = 1;
						}else{
							data.isvalid = 0;
						}
						data.remark    = $(".bond-remark").val();
						data.bw_type   = parseInt($(".bondCtl").val());
						var arr = [];
						var bondName   = $(".bond-item-name");
						if (bondName.length >= 1) {
							bondName.each(function(index, el) {
								var html = $(this).html().split(" ");
								if (!html) {
									return false; 
								};
								arr.push(html[0]);
							});
							data.bw_list = arr.join(',');
						}else{
							data.bw_list = row.bw_list.join(',');
						}
						//证券买卖对应的风控类型是4
						data.risk_type = "4";
						data.extended_id = parseInt($(".bond-object").val() + $(".bond-controller").val());
						data.risk_id = row.risk_id;
						data.stock_type = 0;
						data.effective_range = JSON.stringify(configEffective);
						data.authKey = authKey;
						effectiveRange();		//重新获取生效范围缓存
						$.ajax({
	                        type: 'post',
	                        dataType: "json",
	                        data:data,
	                        url: "/privatelyfund/updateRiskRule_risk",
	                        success: function(data) {
	                        	if (data.success == true) {
	                           		RiskController();			//重新加载风控内容
	                        	};
	                        }
	                    });
					}
				},{
					text : '取消',
					handler : function(){
						closeDialog($(".dialogCom"));
						$(".mask").hide();
					}
				}],
				onClose : function() {
					$(".mask,.overlay").hide();
				}
			})
		},
		//证券买卖删除
		"bondDelete" : function () {
			if ($(this).hasClass('l-btn-disabled')) {
				return false;
			};
			$.messager.confirm('提示','确认删除?',function(data){
				if (data) {
					loading.show();
					var row = $("#bondRisk").datagrid("getSelected");
					var index = $("#bondRisk").datagrid("getRowIndex",row);
					data = row.risk_id;
					$.ajax({
						url : "/privatelyfund/deleteRisk_risk?risk_id="+data+"&authKey="+authKey,
						type : 'GET',
						success : function(data){
							if (data.success == true) {
								RiskController();
								//ajax删除当前行后，直接在本页面
								$("#bondRisk").datagrid("deleteRow",index);	
							};
						}
					})
					closeDialog($(".dialogCom"));
					$(".mask").hide();
				}else{
					$(".mask").hide();
				}
			})
		},
	}
	$(".select-value").on("click",function(){
		$(this).siblings().toggle();
		$(".overlay").show();
	})
	$("body").trigger(closeDialog($(".dialogCom")))
	function closeDialog(param){
		param.dialog('close');
	};
	function onClickRow () {
		$(".btn-even").removeClass("l-btn-disabled");
	};
})
