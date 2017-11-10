


<div class="dy_zt">
		<h1 class="dy_bt">配镜加工单</h1>
        <div class="dy_txm">
        		<div class="txm"><img src="{:U('make_bar_code', array('text' => $info[sn], 'ceshi' => 1))}"  style="width: 164px;    margin-top: 30px;"/>	</div>
                <div class="wen_bqu">打印时间 ：<span class="machining_info_print_time"></span>
				<script type="text/javascript">
				var myDate = new Date();
        var str = myDate.getFullYear() + "-" + "{$Month}" + "-" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
        document.getElementsByClassName("machining_info_print_time")[0].innerHTML = str;
					/*
					var myDate = new Date();
					document.getElementsByClassName("machining_info_print_time")[0].appendChild(myDate.getFullYear());
					document.getElementsByClassName("machining_info_print_time")[0].appendChild("-"+"{$Month}"); 
					document.getElementsByClassName("machining_info_print_time")[0].appendChild("-"+myDate.getDate());
					document.getElementsByClassName("machining_info_print_time")[0].appendChild(" "+myDate.getHours());
					document.getElementsByClassName("machining_info_print_time")[0].appendChild(":"+myDate.getMinutes());
					document.getElementsByClassName("machining_info_print_time")[0].appendChild(":"+myDate.getSeconds());
					*/
				</script>
				</div>
        </div>
        <div class="dy_table">
        		<table width="100%" border="0" cellspacing="1" cellpadding="0">
                  <tr>
                    <td width="108" align="center">配镜单号</td>
                    <td width="243"><i></i>{$info.sn}<i></i></td>
                    <td align="center">用户名</td>
                    <td><i></i>{$user.user_name}</td>
                    <td align="center">来镜物流</td>
                    <td><i></i>{$info.lj_shipping}</td>
                  </tr>
                  <tr>
                    <td align="center">更新时间</td>
                    <td><i></i>{$info.add_time}</td>
                    <td align="center">联系人</td>
                    <td><i></i>{$info.consignee}</td>
                    <td align="center">来镜物流单号</td>
                    <td><i></i>{$info.lj_shipping_sn}</td>
                  </tr>
                  <tr>
                    <td width="108" align="center">状态</td>
                    <td><i></i>{$info.status_info}</td>
                    <td align="center">联系电话</td>
                    <td><i></i>{$info.mobile}</td>
                    <td align="center">寄回物流</td>
                    <td><i></i>{$info.jh_shipping}</td>
                  </tr>
                  <tr>
                    <td align="center">地址</td>
                    <td><i></i>{$info.address}</td>
                    <td width="108" align="center">加工费用<!-- 类型 --></td>
                    <td width="243"><i></i>{$info.amount_format}<!-- 加工单 --></td>
                    <td align="center">寄回物流单号</td>
                    <td><i></i>{$info.jh_shipping_sn}</td>
                  </tr>
          </table>
  </div>
  <volist name="goods_list" id="goods">
	<div>
		<h2 class="dy_xbt">加工处方{$goods.key}</h2>
        <div class="dy_table-2">
        		<table width="100%" border="0" cellspacing="1" cellpadding="0">
                  <tr>
                    <td rowspan="3" width="108">镜片</td>
                    <td width="78">&nbsp;</td>
                    <td width="124">球镜</td>
                    <td width="124">柱镜</td>
                    <td width="124">轴位</td>
                    <td width="124">ADD</td>
                    <td width="124">瞳距</td>
                    <td width="124">瞳高</td>
                    <td>近用瞳距</td>
                  </tr>

                  <tr>
                    <td>R</td>
                    <td align="center">{$goods.eyeglass_cfg.right.qiujing}</td>
                     <td align="center">{$goods.eyeglass_cfg.right.zhujing}</td>
                     <td align="center">{$goods.eyeglass_cfg.right.zhouxiang}</td>
                     <td align="center">{$goods.eyeglass_cfg.right.add}</td>
                     <td align="center">{$goods.eyeglass_cfg.right.tongju}</td>
                     <td align="center">{$goods.eyeglass_cfg.right.tonggao}</td>
                     <td align="center">{$goods.eyeglass_cfg.right.jytj}</td>
                  </tr>
                  <tr>
                    <td>L</td>
                     <td align="center">{$goods.eyeglass_cfg.left.qiujing}</td>
                     <td align="center">{$goods.eyeglass_cfg.left.zhujing}</td>
                     <td align="center">{$goods.eyeglass_cfg.left.zhouxiang}</td>
                     <td align="center">{$goods.eyeglass_cfg.left.add}</td>
                     <td align="center">{$goods.eyeglass_cfg.left.tongju}</td>
                     <td align="center">{$goods.eyeglass_cfg.left.tonggao}</td>
                     <td align="center">{$goods.eyeglass_cfg.left.jytj}</td>
                  </tr>
                  <tr>
                    <td>备注</td>
                    <td colspan="8">&nbsp;{$goods.eyeglass_attr.note}</td>
                  </tr>
                </table>
		<!--
                <table width="100%" border="0" cellspacing="1" cellpadding="0">
                  <tr>
                    <td rowspan="2" width="108">镜片</td>
                    <td width="135">来源</td>

                    <td width="135">折射率</td>
                    <td width="135">膜层</td>
                    <td>染色描述</td>
                  </tr>
                  <tr>
			<td align="center"><if condition="$goods[eyeglass_from] eq '0'">客户自备<else /> {$goods.eyeglass_from}订单</if></td>
			<td align="center">{$goods.eyeglass_attr.zheshe}</td>
			<td align="center">{$goods.eyeglass_attr.moceng}</td>
			<td align="center">{$goods.eyeglass_attr.ranse}</td>
                  </tr>
                  <tr>
                    <td>备注</td>
                    <td colspan="4">&nbsp;{$goods.eyeglass_attr.note}</td>
                  </tr>
                </table>
		-->
                <table width="100%" border="0" cellspacing="1" cellpadding="0">
                  <tr>
                    <td rowspan="2" width="108">镜架</td>
                    <td width="135">来源</td>
                    <td width="135">品牌</td>
                    <td width="135">型号</td>
                    <td width="136">加工类型</td>
                    <!-- <td width="135">备注</td> -->
		    <!--
                    <td width="271">材质</td>
                    <td width="135">车边</td>
		    -->
                  </tr>
                  <tr>
                   <td align="center"><if condition="$goods[frame_from] eq '0'">客户自备<else />{$goods.frame_from}</if></td>
			<td align="center">{$goods.frame_attr.pinpai}</td>
			<td align="center">{$goods.frame_attr.xinghao}</td>
			<td align="center">{$goods.frame_attr.mach_type_name}</td>
			<!-- <td align="center">{$goods.frame_attr.beizhu}</td> -->
			<!--
			<td align="center">{$goods.frame_attr.caizhi}</td>
			<td align="center">{$goods.frame_attr.chebiao}</td>
			-->

                  </tr>
                  <tr>
                    <td>备注</td>
                    <td colspan="4">&nbsp;{$goods.frame_attr.beizhu}</td>
                  </tr>
                </table>
        </div>
	</div>
   </volist>
</div>