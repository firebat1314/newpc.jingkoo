
<div class="glass-machining-main">
		<div class="lj_process_box">
			<div class="process_box">
				<div class="process_top">
					<h2>来镜加工</h2>
					<img src="img/ljjw_ico3.png"/>
				</div>
				<div class="process_cont">
					<div class="process_cont_t">
						<div class="picScroll-left">
							<a class="next"></a>
							<a class="prev"></a>
							<div class="bd">
								<ul class="picList" id="ul_li">
									<volist name="machining" id="vo" key="key">
										<li onclick="workOrder(this)" class=" <if condition="$key eq 1">con</if>">加工处方单{$key}</li>
									</volist>
								</ul>
							</div>
						</div>
						<!--
						<div class="cont_t_abox">
							<a href="#" class="cont_t_a1">删除</a>
							<a href="#" class="cont_t_a2">新增一张加工单</a>
						</div>
						-->
					</div>
					<div class="glasses">
					<volist name="machining" id="vo" key="key">
						<div class="process_cont_c ng-scope <if condition="$key eq 1">con</if>" <if condition="$key neq 1"> style="display: none;"</if>>
							<div class="process-goods-box" style="padding: 20px 0;margin-bottom:30px;">
								<div class="process-goods-item" style="float:left;margin-right: 60px;">
									<img style="width:70px;height:70px;display: block;float:left;margin-right:15px;border:1px solid #ccc;" title="{$vo.right_attr.goods_name}" alt="{$vo.right_attr.goods_name}" src="{$vo.right_attr.goods_img}">
									<p style="width:185px;color:#666;overflow:hidden;text-overflow:ellipsis;display:-webkit-box; -webkit-box-orient:vertical;-webkit-line-clamp:2; ">
									{$vo.right_attr.goods_name}
									</p>
									<span style="color:#999;margin-top: 10px;display: block;">眼镜片 - 右眼</span>
								</div>
								<div class="process-goods-item" style="float:left;margin-right: 60px;">
									<img style="width:70px;height:70px;display: block;float:left;margin-right:15px;border:1px solid #ccc;" title="{$vo.left_attr.goods_name}" alt="{$vo.left_attr.goods_name}" src="{$vo.left_attr.goods_img}">
									<p style="width:185px;color:#666;overflow:hidden;text-overflow:ellipsis;display:-webkit-box; -webkit-box-orient:vertical;-webkit-line-clamp:2; ">{$vo.left_attr.goods_name}</p>
									<span style="color:#999;margin-top: 10px;display: block;">眼镜片 - 左眼</span>
								</div>
								<div class="process-goods-item">
									<if condition="$vo[jia_attr][goods_name]">
									<img style="width:70px;height:70px;display: block;float:left;margin-right:15px;border:1px solid #ccc;" title="{$vo.jia_attr.goods_name}" alt="{$vo.jia_attr.goods_name}" src="{$vo.jia_attr.goods_img}">
									</if>
									<p style="width:185px;color:#666;overflow:hidden;text-overflow:ellipsis;display:-webkit-box; -webkit-box-orient:vertical;-webkit-line-clamp:2; ">
									<if condition="$vo[jia_attr][goods_name]">
									{$vo.jia_attr.goods_name}
                                                                            <else />
                                                                                    客户自备
                                                                            </if>
									</p>
									<span style="color:#999;margin-top: 10px;display: block;">镜架</span>
								</div>
							</div>
							<table class="process_cont_tb1" style="margin-top: 15px;">
								<tr>
									<th></th>
									<th><i style="color: #ff3333;">*</i>球镜</th>
									<th><i style="color: #ff3333;">*</i>柱镜</th>
									<th><i style="color: #ff3333;">*</i>轴向</th>
									<th>ADD</th>
									<th><i style="color: #ff3333;">*</i>瞳距</th>
									<th><i style="color: #ff3333;">*</i>瞳高</th>
									<th>近用瞳距</th>
								</tr>
								<tr>
									<td><input type="button" class="cont_tb1_ip" value="右眼"/></td>
									<td>{$vo.rqiujing}</td>
									<td>{$vo.rzhujing}</td>
									<td>{$vo.rzhouxiang}</td>
									<td>{$vo.radd}</td>
									<td>{$vo.rtongju}</td>
									<td>{$vo.rtonggao}</td>
									<td>{$vo.rjytj}</td>
								</tr>
								<tr>
									<td><input type="button" class="cont_tb1_ip" value="左眼"/></td>
									<td>{$vo.lqiujing}</td>
									<td>{$vo.lzhujing}</td>
									<td>{$vo.lzhouxiang}</td>
									<td>{$vo.ladd}</td>
									<td>{$vo.ltongju}</td>
									<td>{$vo.ltonggao}</td>
									<td>{$vo.ljytj}</td>
								</tr>
							</table>
							<table class="process_cont_tb2">
								<tr>
									<th width="12.5%"></th>
									<th width="24%">来源</th>
									<!--<th width="12%">折射率</th>-->
									<th width="12%">品牌</th>
									<th width="12%">型号<!-- 膜层 --></th>
									<th width="21%">加工类型<!-- 染色描述 --></th>
									<th width="21.5%">备注</th>
								</tr>
								<tr>
									<td><input type="button" class="cont_tb2_ip" value="镜架"/></td>
									<td><p class="tb2_p1">
                                                                            <if condition="$vo[jia_attr][goods_name]">
                                                                                    {$vo[jia_attr][goods_name]}
                                                                            <else />
                                                                                    客户自备
                                                                            </if>
									{$vo.jia_attr.goods_name}
									</p></td>
									<td>{$vo.frame_attr.pinpai}</td>
									<td>{$vo.frame_attr.xinghao}</td>
									<td>{$vo.mach_type_name}</td>
									<td>{$vo.frame_attr.beizhu}</td>
								</tr>
							</table>
						</div>
					</volist>
					</div>
					<div class="process_cont_b">
						<span class="return_last" onclick="return_last()" style="cursor:pointer;" >返回上一页</span>
						<div class="cont_b_box">
							<p class="cont_b_p1">共 <span class="cont_b_sp1">{$count_machining}</span> 个来镜加工处方单，处方单货品金额总计（不包含运费)： <span class="cont_b_sp1">{$machining_price}</span><p></p>
							<input type="button" class="cont_b_ip " onclick="tijiao()" value="提交订单"/>
						</div>
					</div>
				</div>
			</div>
		</div>
</div>
<script type="text/javascript">
	function tijiao(){
		$(".submitMachining").trigger("click");
	}
	function return_last(){
		$(".returnLast").trigger("click");
	}
	//选择工单
	function workOrder(obj){
		var ind = $('#ul_li li').index(obj);
		console.log(ind);
		$('#ul_li li').removeClass("con");
		$(obj).addClass("con");
		$(".glasses .process_cont_c").hide();
		$(".glasses").children(".process_cont_c").eq(ind).show();
	}
    jQuery(".picScroll-left").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"left",vis:5,trigger:"click"});
    $('.process_cont_t	.picScroll-left .picList li').click(function () {
        $(this).addClass('con').siblings().removeClass('con');
    })
</script>