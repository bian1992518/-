/**
 * author : bianlongting
 * email : bianlongting@myhexin.com
 * Date: 15-12-25
 * Time: 下午14:40
 * Script : 权限管理
 */
 $(function(){
	var loading    = $("#loading");
	var anthTable  = $("#management");
	var allocation = $("#allocation");
	var allCount   = $(".all_count");
	var oldObj     = {};
	var config     = {};
	var param      = {};
	var fundId   = [];
	var inst_id,authKey,operator_id;
	loading.show();

	//对获取的对象数组进行排序
    function operator_sort(obj){
        var o ={}
        var arr = [];
        for(var p in obj){
            arr.push(p);
        }
        arr.sort();
        function sort(a,b){
            return a>b;
        }
        for (var i = 0; i < arr.length; i++) {
            for(var p in obj){
                if(arr[i]==p){
                    o[arr[i]]= obj[p];
                }
            }
        };
        return  o;
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

	//权限界面加载
	function authManagement(){
		var data = {};
		data.institution_id = inst_id;
		data.operator_id = operator_id;
		data.authKey = authKey;
		$.ajax({
			url : "/privatelyfund/listOprMenu_operator",
			data : data,
			type : "GET",
			success : function(data){
				if (data.success == true) {
					var data = data.data;
					authRender(data);
					loading.hide();
				};
			}
		})
	};
	authManagement();

	function authRender(data){
		var html = "",
			theadHtml = '',
			tbodyHtml = '',
			allocation = data.allocation,
			head	   = data.head,
			list 	   = data.list,
			role	   = data.role,
			thead      = [],
			tbody      = [];
			config.d_list = data.list;
		if(allocation){
            for(var p in allocation){ 
                for (var i = 0; i < allocation[p].length; i++) {
                    paramsFunds = {
                        operator_id    : p,               
                        fund_id        : allocation[p][i]   
                    };
                    fundId.push(paramsFunds);
                }; 
            };
            
        };
		theadHtml += "<thead><tr>" +
					"<td></td>" + 
					"<td>" + head[2000] + "</td>" +
					"<td>" + head[2001] + "</td>" +
					"<td>" + head[2002] + "</td>" +
					"<td>" + head[2003] + "</td>" +
					"<td>" + head[2004] + "</td>" +
					"<td>" + head[2005] + "</td>" +
					"<td>" + head[2006] + "</td>" +
				"</tr></thead>";
		thead.push(theadHtml);
		anthTable.append("<tbody>");
		for (var i = 0; i < list.length; i++) {
			var operator = operator_sort(list[i].operator);
			tbody.push("<tr data-operator=" + list[i].operator_id + ">" +
							 "<td>" +list[i].operator_name + "</td>" +
						 "");
			for(var p in operator){
				if (p == 2001) {
					var selected = "";
					switch(operator[p]){
						case 1:
							selected = "1";
							break;
						case 2:
							selected = "2";
							break;
						case 3:
							selected = "3";
							break;
						case 4:
							selected = "4";
							break;
						case 5:
							selected = "5";
							break;
						case 6:
							selected = "6";
							break;
						case 7:
							selected = "7";
							break;
					}
					tbody.push("<td data-id=" + p +"><select class='dialog-item' id='select_au'>"+
                                    "<option value='1' data-id="+selected+">投资经理</option>"+
                                    "<option value='2' data-id="+selected+">交易主管</option>"+
                                    "<option value='3' data-id="+selected+">交易员</option>"+
                                    "<option value='4' class='relation-auth' data-id="+selected+">独立投顾</option>"+
                                    "<option value='5' data-id="+selected+">无权限</option>"+
                                    "<option value='6' data-id="+selected+">风控员</option>"+
                                    "<option value='7' data-id="+selected+">券商</option>"+
                                '</select><img src="../css/icons/resize_png_new.png"  class="edit"></td>');
				}else{
					tbody.push("<td data-id=" + p +" data-param = " + operator[p]  + ">" + 
								"<input type='checkbox' checked='checked'>" + 
							 "</td>");
				}
			};
			tbody.push("</tr>");
		};
		anthTable.append("</tbody>");
		html=thead.join('')+tbody.join('');
		anthTable.append(html);
		authDetail();
		//分配的账号
        oldObj = list;
        for(var i = 0;i<list.length;i++){
            delete oldObj[i].operator_name;
            delete oldObj[i].operator_role;
        };
        $("#confirm").on("click",function(){
        	var rows = anthTable.find("tbody tr");
        	config.operator = [];

			rows.each(function(index,val){
	            var m     = {};
	            var obj   = {};
	            var cells = $(this).find("td");
	            cells.each(function(){
	                var cell = $(this);
	                var mid  = cell.attr("data-id");
	                if(mid == 2001){
	                    obj[mid] = Number($(this).find('select').val());
	                }
	                var input=cell.find("input");
	                if(input.length){
	                    if(input.prop("checked")){
	                        obj[mid]=1;
	                    }else{
	                        obj[mid]=0;
	                    }
	                }
	            });
	            m.operator       = obj;
	            m.operator_id = config.d_list[index].operator_id;
	            config.operator[index] = m;
	        });
	        $("#conTip").dialog("open");
			$("#conTip").dialog({
				title:'提示',
				iconCls : 'icon-logo',
				modal : true,
				buttons : [{
					text : '确定',
					iconCls:'icon-ok',
					handler : function(){
						closeDialog($(".dialogCom"));
						loading.show();
						param = config.operator;
						var diffObjArr = [];
						for(var key in oldObj){
					        if(JSON.stringify(param[key])!=JSON.stringify(oldObj[key])){
					            diffObjArr.push(JSON.stringify(param[key]));
					        }
					    };
					    var operator_up_new = [];//数组对象
				        for (var i = 0; i < diffObjArr.length; i++) {
				           operator_up_new.push(JSON.parse(diffObjArr[i]));
				        };
					    var params = {};
					    params.operator_up = JSON.stringify(operator_up_new);
					    params.operator_right = JSON.stringify(fundId);
					    params.institution_id = inst_id;
					    params.authKey = authKey;
					    params.OffLineMsg = "权限变更";
					    $.ajax({
					    	url : '/privatelyfund/oprMenuUpdate_operator',
					    	data : params,
					    	success : function(data){
					    		if (data.success == true) {
					    			loading.hide();
								$.messager.alert("提示","修改成功","info");
					    			location.reload();
					    		}else if (data.data.repeat != null) {
					    			loading.hide();
					    			$("#conTip").dialog("close");
					    			var repeat = data.data.repeat;
					    			var msg = "";
					    			for(var p in repeat){
					    				msg += "账户:" + p + "被同时分配给";
					    				for (var i = 0; i < repeat[p].length; i++) {
					    					msg+=$('tr[data-operator="'+repeat[p][i]+'"] td').eq(0).html()+",";
					    				};
					    				msg+='<br/>';
					    			};
					    			msg+="单个帐号只能分配给一个人使用！";
					    			$("#warning").html(msg).show();
					    			$("#warning").dialog({
					    				title : '警告',
					    				width : 300,
					    				iconCls : 'icon-logo',
					    				buttons : [{
					    					iconCls : 'icon-ok',
					    					text : '确定',
					    					handler : function(){
					    						location.reload();
					    					}
					    				}]
					    			})
					    			
					    		};
					    	}
					    })

					}
				},{
					text : '取消',
					handler : function(){
						closeDialog($(".dialogCom"));
					}
				}]
			});
        })
	};

	function authDetail(){
		var td = anthTable.find('tbody td');
		td.each(function(index, el) {
			if ($(this).attr("data-param") == 0) {
				$(this).find("input").prop("checked",false);
			};
		});


		var option = $("#select_au option");
		option.each(function(index,el){
			var val = $(this).attr('value');
			if ( val == $(this).attr("data-id")) {
				if (val == 1 || $(this).attr('value') == 2) {
					$(this).parent().attr("disabled",true);
				}else{
					$(this).parent().find("option:lt(2)").remove();
				};
				$(this).attr('selected', 'selected');
			};
		});
		$(".dialog-item").each(function(index,el){
			if ($(this).val() == 4) {
				$(this).siblings().css("visibility","visible");
			};
		});
		$(".edit").on("click",function(){
			var data = {};
			data.institution_id = inst_id;
			data.operator_id = $(this).parents("tr").data("operator");
			data.authKey = authKey;
			$.ajax({
				url : '/privatelyfund/listInstProductInfoJury_product',
				data : data,
				success : function(data){
					allCount.html("");
					var count = [];
					if (data.success == true) {
						var list = data.data.list[0].products;
						var opId = data.data.list[0].operator_id;
						allocation.dialog("open");
						for (var i = 0; i < list.length; i++) {
							var funds = list[i].funds;
							count.push("<p>" + list[i].product_name);
							for(var p in funds){
								count.push("<p><input type='checkbox' value=" + funds[p].fund_id + " checked='checked' data-check = " +  funds[p].fund_right + ">" + funds[p].fund_code + "(" +funds[p].fund_name + ")</p>");
							}
							count.push("</p>");
						};
						allCount.append(count);
						var check = allCount.find('input');
						check.each(function(index, el) {
							if ($(this).data("check") == false) {
								$(this).prop("checked",false);
							};
						});
						allocation.dialog({
							title:'分配投资账号',
							iconCls : 'icon-logo',
							modal : true,
							height : 400,
							top : 0,
							buttons : [{
								text : '确定',
								iconCls:'icon-ok',
								handler : function(){
									var flag = true;
									checked(opId,flag);
									closeDialog($(".dialogCom"));
								}
							},{
								text : '取消',
								handler : function(){
									closeDialog($(".dialogCom"));
								}
							}]
						});
					};
				}
			})
		});

		function checked(opId,flag){
			var push_arr = [];
			if (flag) {
				allCount.find('input:checked').each(function(){
					var push_arr_o={};
			        push_arr_o[Number($(this).val())] = opId;
			        push_arr.push(push_arr_o);
				});
			}else{
				push_arr = [];
			};
			if (push_arr.length > 0) {
				var arr = [];
				 push_arr.forEach(function(item){
		            for(var key in item){
		                var value = item[key]
		                fundId.forEach(function(item2){
		                    if(value  != item2.operator_id){
		                        arr.push(item2);
		                    }
		                })
		                var newA = {fund_id:key, operator_id:parseInt(value)}
		                arr.push(newA);
		            }
		        });
				fundId = arr_unique(arr);
			}else{
				var fundObj = [];
		        for (var i = fundId.length - 1; i >= 0; i--) {
		            if(fundId[i].operator_id !=opId.toString()){
		                fundObj.push(fundId[i]);
		            }
		        };
		        fundId = fundObj;//数组对象去重
		    }
			
		}

		var item = $(".dialog-item");
		item.on("change",function(index,el){
			if ($(this).val() == 4) {
				$(this).siblings().css("visibility","visible");
				$(this).siblings().trigger("click");
			}else{
				$(this).siblings().css("visibility","hidden");
				var opId = $(this).parents("tr").data("operator");
				var flag = false;
				checked(opId,flag);
			}
		});
		
	};

	//保证数组对象唯一
	function arr_unique(arr){
	    var temp = [],
	    obj = {},
	    len = arr.length;
	    for(var i=0;i<len;i++){
	        var o=arr[i];
	        if(!obj[o.fund_id + o.operator_id] == 1){
	            obj[o.fund_id + o.operator_id] = 1;
	            temp.push(o);
	        }
	    }
	    return temp;
	} 

	$("body").trigger(closeDialog($(".dialogCom")))

	function closeDialog(param){
		param.dialog('close');
	};
});
