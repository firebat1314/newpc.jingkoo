
    <script type="text/javascript" src="/js/ajaxForm.js"></script>
<div class="glass-machining-main">
    <!--框完-->
    <div class="lj_process_box">
        <div class="process_box">
            <div class="process_top">
                <h2>来镜加工</h2>
                <img src="/img/ljjw_ico1.png">
            </div>
	    <form method="post" class="ajaxForm" action="{:U('cache_machining')}">
            <div class="process_cont">
                <div class="process_cont_t" style=" width: 900px; padding-right: 300px;">
                    <div class="picScroll-left">
                        <a class="next"></a>
                        <a class="prev"></a>
                        <div class="bd">
                            <ul id="ul_li">
			    <notempty name="machining">
				<volist name="machining" id="vo" key="key">
                                <li style="margin-top: 10px;" class="scope binding one <if condition="$key eq 1">con</if>" onclick="workOrder(this)">加工处方单{$vo.key}</li>
				</volist>
			    <else />
                                <li style="margin-top: 10px;" class="scope binding one con" onclick="workOrder(this)">加工处方单1</li>
			    </notempty>
                            </ul>
                        </div>
                    </div>
                    <div class="cont_t_abox">
                        <a href="javascript:;" class="cont_t_a1" onclick="delList()">删除</a>
                        <a href="javascript:;" onclick="addList()" class="cont_t_a2">新增一张加工单</a>
                    </div>
                </div>
		<div class="glasses">
                <include file="Machining:sel_html" />
		</div>
                <div style="height:70px;line-height: 70px;padding-left: 70%;text-align: right;">
                    <span class="cont_t_sp1"><!--加工费：--><em style="color:#FF3333;"><!-- 15元每付（ -->全自动进口磨边机切割</em></span>
                    <!-- <button class="submitbtn" style="width:100px;height:35px;border: 1px solid #FF3333;background: #fff;color:#FF3333;">暂存</button> -->
                </div>
                <div class="process_cont_b">
                    <div class="cont_b_box">
                        <p class="cont_b_p1">共 <span class="cont_b_sp1 int_count">{$count_machining}</span> 个来镜加工处方单，处方单货品金额总计（不包含运费)： <span class="cont_b_sp1 price">{$machining_price}</span><p></p>
                        <input type="button" class="cont_b_ip submitbtn" callback="submitbtn_sb" value="确认信息"/>
                    </div>
                </div>
            </div>
	    <input name="token" value="1" type="hidden" />
	    <input name="order_id" value="{$order_id}" type="hidden" />
	    <input name="price" value="{$price}" type="hidden" />
	    </form>
        </div>
    </div>
</div>
<script type="text/javascript">
    jQuery(".picScroll-left").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"left",vis:5,trigger:"click"});
    $('.process_cont_t	.picScroll-left .picList li').click(function () {
        $(this).addClass('con').siblings().removeClass('con');
    })
	var count_machining = "{$count_machining}";
	var order_id = "{$order_id}";
	var arr,reg=new RegExp("(^| )token=([^;]*)(;|$)");
	arr = document.cookie.match(reg);
	var token = arr[2];
	$("input[name=token]").val(token);
	var obj_sel = "";
	var rec_ids = new Array();
	$(".zancun").click(function(){
		//$(".submitbtn").trigger();
	});
	function submitbtn_sb(data){
		if (data.status == 0){
		//询问提示
			layer.msg(data.info);
		}else{
			$(".enterMessage").trigger("click");
		}
		
	}
	function statistics_rec(is_null){
		rec_ids = new Array();
		var is_true = 0;
		var index = 0;
		$(".rec_id_val").each(function(){
			var rec_id = $(this).val();
			if(rec_id > 0){
				rec_ids.push(rec_id);
			}else if(rec_id == 0 && is_null == 1 && $(this).attr("name") != 'jia[]'){
				is_true = 1;
				index = $(this).parents(".process_cont_c").index();
				return false;
			}
		});
		if(is_true == 1){
			layer.msg("请选择完加工处方单" + (index + 1) + "的商品");
			return false;
		}else{
			return rec_ids;
		}
	}
	//新加工单
	function addList(){
		var index = statistics_rec(1);
		if(!index){
			return false;
		}
		$.post("{:U('Machining/is_machining_goods')}", {order_id : order_id, rec_ids : rec_ids, token : token}, function(data){
			if(data.status == 1){
				count_machining++;
				$(".binding").removeClass("con");
				$("#ul_li").append('<li style="margin-top: 10px;" class="scope binding con one" onclick="workOrder(this)">加工处方单' + count_machining + '</li>');
				$(".process_cont_c").removeClass("con");
				$(".process_cont_c").hide();
				$(".glasses").append(data.info);
				$(".int_count").html(count_machining);
				jQuery(".picScroll-left").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"left",vis:5,trigger:"click"});
				    $('.process_cont_t	.picScroll-left .picList li').click(function () {
					$(this).addClass('con').siblings().removeClass('con');
				    })
			}else{
				layer.msg(data.info);
			}
		});
	}
	//选择工单
	function workOrder(obj){
		var ind = $('#ul_li li').index(obj);
		$('#ul_li li').removeClass("con");
		$(obj).addClass("con");
		$(".glasses .process_cont_c").hide();
		$(".glasses").children(".process_cont_c").eq(ind).show();
	}
	//删除当前工单
	function delList(){
		var len = $("#ul_li").children(".binding").length;
		if(len == 1){
			layer.msg("必须存在加工单");
			return false;
		}
		var ind = $('#ul_li li').index($('#ul_li li.con'));
		$('#ul_li li.con').remove();
		$(".glasses").children(".process_cont_c").eq(ind).remove();
		
		len = $("#ul_li").children(".binding").length - 1;
		var xuanz = 0;
		if(len >= ind){
			xuanz = ind;
		}else if(len < ind){
			xuanz = len;
		}
		count_machining--;
		$("#ul_li li").each(function(index){
			$(this).html("加工处方单" + (index + 1));
			if(index == xuanz){
				$(this).addClass("con");
				$(".glasses").children(".process_cont_c").eq(index).show();
				return false;
			}
		});
		$(".int_count").html(count_machining);
	}
	//选择商品
	function showGoods(obj){
		statistics_rec();
		var rec_id = $(obj).find(".rec_id_val").val();
		var rec_id_val = new Array();
		$(obj).parents(".process_cont_u2").find("input").each(function(){
			if($(this).val() > 0 && $(this).attr("name") != 'jia[]' && $(this).attr("name") != 'type[]'){
				rec_id_val.push($(this).val());
			}
		});
		//goods_html "rec_id"
		var type = $(obj).data("type");
		var goods_type = $(obj).data("goods_type");
		var mach_type = $(obj).find(".type_val").val();
		obj_sel = obj;
		$.post("{:U('Machining/machining_goods')}", {rec_ids : rec_ids, rec_id : rec_id, token : token, order_id : order_id, type : type, goods_type : goods_type, mach_type : mach_type, pian_rec : rec_id_val}, function(data){
			if(data.status == 1){
				$(obj).parents(".process_cont_c").find("#goods_html").html(data.info);
				$(obj).parents(".process_cont_c").find("#goods_html").show();
			}else{
				layer.msg(data.info);
			}
		});
	}
	//取消
	function hideCover(obj){
		$(obj).parents(".process_cover").hide();
	}
	//确认
	function getLeftEyeData(obj){
		var rec_id = $(obj).parents(".process_cover").find("input[name=html_rec_id]:checked").val();
		var type   = $(obj).parents(".process_cover").find("input[name=html_type]").val();
		var html_pian = $(obj).parents(".process_cover").find("input[name=html_pian]").val();
		var str_type = $(obj).parents(".process_cover").find("input[name=str_type]").val();
		 
		$.post("{:U('select_goods_type')}", {goods_rec: rec_id, type : type, token : token, pian_type : html_pian, str_type: str_type}, function(data){
			if(data.status == 1){
				$(obj_sel).find(".rec_id_val").val(rec_id);
				$(obj).parents(".process_cover").hide();
				if(data.url){
					$(obj_sel).find(".goods_img").css("background", "url(" + data.url + ")");
				}
				if(html_pian == 1){
					$(obj).parents(".process_cont_c").find(".left_table").html(data.info);
					$(obj).parents(".process_cont_c").find(".left_table").show();
				}else if(html_pian == 0){
					$(obj).parents(".process_cont_c").find(".right_table").html(data.info);
					$(obj).parents(".process_cont_c").find(".right_table").show();
				}else{
					$(obj).parents(".process_cont_c").find(".jia_table").html(data.info);
					$(obj).parents(".process_cont_c").find(".right_table").show();
				}
				serialize_form();
			}else{
				layer.msg(data.info);
			}
		});
	}
	//镜架
	function getJiaData(obj){
		var rec_id = $(obj).parents(".process_cover").find("input[name=html_rec_id]:checked").val();
		var type   = $(obj).parents(".process_cover").find("input[name=type]:checked").val();
		var html_pian = $(obj).parents(".process_cover").find("input[name=html_pian]").val();
		var str_type = $(obj).parents(".process_cover").find("input[name=str_type]").val();
		var html_type = $(obj).parents(".process_cover").find("input[name=html_type]").val();
		var is_zib = $(obj).parents(".process_cover").find("input[name=is_zib]:checked").length;
		if(is_zib > 0){
			rec_id = '';
			if(type > 0){
			}else{
				layer.msg("请选择加工类型");
				return false;
			}
		}
		$.post("{:U('select_goods_type')}", {rec_ids : rec_ids, frame_from: rec_id, goods_rec : rec_id, mach_type : type, token : token, type : html_type, str_type: str_type}, function(data){
			if(data.status == 1){
				if(data.url){
					$(obj_sel).find(".goods_img").css("background", "url(" + data.url + ")");
				}
				$(obj_sel).find(".rec_id_val").val(rec_id);
				$(obj_sel).find(".type_val").val(type);
				$(obj).parents(".process_cover").hide();
				$(obj).parents(".process_cont_c").find(".jia_table").html(data.info);
				$(obj).parents(".process_cont_c").find(".jia_table").show();
				serialize_form();
			}else{
				layer.msg(data.info);
			}
		});
	}

	//镜架点击订单
	function dingdan(obj){
		//var ind = $('#id span').index(obj);
		$(obj).addClass("con").siblings().removeClass("con");
		$(obj).parents(".cover_box_c").find(".goods").addClass("show");
		$(obj).parents(".cover_box_c").find(".int_type").removeClass("show");
	}

	//镜架点击自备
	function kehu(obj){
		$(obj).addClass("con").siblings().removeClass("con");
		$(obj).parents(".cover_box_c").find(".int_type").addClass("show");
		$(obj).parents(".cover_box_c").find(".goods").removeClass("show");
	}
	
	//计算价格
	function serialize_form(){
		$.post("{:U('machining_price_post')}", $("form.ajaxForm").serialize(), function(data){
			if(data.status == 1){
				$(".price").html("￥" + data.info);
				$("input[name=price]").val(data.info);
			}else{
				layer.msg(data.info);
			}
		});
	}

	//ajaxForm提交表单
	$(".submitbtn").click( function (e) {
		var index = statistics_rec(1);
		if(!index){
			return false;
		}
		e.preventDefault();
		var btn     = $(this),
			form    = btn.parents('form.ajaxForm');
			type    = btn.data('type') ? btn.attr('type') : 'json',
			//返回参数格式默认json
			urlType = btn.data('urlType') ? btn.attr('urlType') : 0,
			//返回参数格式默认json
			testType = btn.data('testType') ? btn.attr('testType') : 0,
			//返回参数格式默认json
		form.ajaxSubmit({
			url: btn.attr('action') ? btn.attr('action') : form.attr('action'), 
			//按钮上是否自定义提交地址(多按钮情况)
			dataType: type,
			beforeSubmit: function (arr, $form, options) {
				ajaxLoading = layer.load(2, {shade: false});
				if (btn.data('flag')){
				//1提交后不让在次提交
					if (btn.val()){
						var text = btn.val();
						btn.val(text + '...').prop('disabled', true).addClass('disabled');
					}else{
						var text = btn.text();
						btn.text(text + '...').prop('disabled', true).addClass('disabled');
					}
				}
			},
			success: btn.attr('callback') ? eval(btn.attr('callback')) : function (data, statusText, xhr, $form) {
				if (btn.data('flag') && data.status == 0){
					if (btn.val()){
						var text = btn.val();
						btn.val(text.replace('...', '')).prop('disabled', false).removeClass('disabled');
					}else{
						var text = btn.text();
						btn.text(text.replace('...', '')).prop('disabled', false).removeClass('disabled');
					}
				}
				if(data.status == 0){
					layer.msg(data.info);
				}else{
					layer.msg(data.info);
					if (data.url){
						if(urlType == 1){
							window.parent.location.href = data.url;
						}else{
							window.location.href = data.url;
						}
					}else{
						if (data.status == 1){
						//正确提示刷新当前页面
							if(urlType == 1){
								window.parent.location.reload();
							}else{
								window.location.reload();
							}
						}
					}
				}
			},
			error: function(){
				layer.close(ajaxLoading);
			},
			complete: function(){
				layer.close(ajaxLoading);
			}
		});
	});
</script>