<style type="text/css">
body,td { font-size:13px; }
</style>
<p>
<style type="text/css">
	body,td { font-size:13px; }
</style> 
</p>
<h1 align="center">订单信息</h1>
<table width="100%" cellpadding="1">
    <tbody>
        <tr>
            <td width="8%">购 货 人：</td>
            <td><if condition="$order['user_id']">{$user_name}<else />匿名用户</if><!-- 购货人姓名 --></td>
            <td align="right">下单时间：</td>
            <td>{$order.formated_add_time}<!-- 下订单时间 --></td>
            <td align="right">支付方式：</td>
            <td>{$order.pay_name}<!-- 支付方式 --></td>
            <td align="right">订单编号：</td>
            <td>{$order.order_sn}<!-- 订单号 --></td>
        </tr>
        <tr>
            <td>付款时间：</td>
            <td>{$order.pay_time}</td>
            <!-- 付款时间 -->
            <td align="right">发货时间：</td>
            <td>{$order.shipping_time}<!-- 发货时间 --></td>
            <td align="right">配送方式：</td>
            <td>{$order.shipping_name}<!-- 配送方式 --></td>
            <td align="right">发货单号：</td>
            <td>{$order.invoice_no} <!-- 发货单号 --></td>
        </tr>
        <tr>
            <td>收货地址：</td>
            <td colspan="7">[{$order.region}]&nbsp;{$order.address}<!-- 收货人地址 --></td>
        </tr>
        <tr>
            <td>收货人信息：</td>
            <td colspan="7">{$order.consignee}&nbsp;<!-- 收货人姓名 -->         <if condition="$order['zipcode']">邮编：{$order.zipcode}&nbsp;</if><!-- 邮政编码 -->         <if condition="$order['tel']">电话：{$order.tel}&nbsp; </if><!-- 联系电话 -->         <if condition="$order['mobile']">手机：{$order.mobile}</if><!-- 手机号码 --></td>
        </tr>
    </tbody>
</table>
<table width="100%" border="1" style="border-collapse:collapse;border-color:#000;">
    <tbody>
        <tr align="center">
            <td bgcolor="#cccccc">商品名称  <!-- 商品名称 --></td>
            <td bgcolor="#cccccc">货号    <!-- 商品货号 --></td>
            <td bgcolor="#cccccc">属性  <!-- 商品属性 --></td>
            <td bgcolor="#cccccc">价格 <!-- 商品单价 --></td>
            <td bgcolor="#cccccc">数量<!-- 商品数量 --></td>
            <!-- <td bgcolor="#cccccc">镜库补贴</td> -->
            <td bgcolor="#cccccc">小计    <!-- 价格小计 --></td>
        </tr>
		<volist name="goods_list" id="goods" key="key">
			<tr>
				<td>&nbsp;{$goods.goods_name}<!-- 商品名称 -->         <if condition="$goods['is_gift']"><if condition="$goods['goods_price'] gt 0">（特惠品）<else />（赠品）</if></if>         <if condition="$goods['parent_id'] gt 0">（配件）</if></td>
				<td>&nbsp;{$goods.goods_sn} <!-- 商品货号 --></td>
				<td>
					<!-- 商品属性 --> 		
					<if condition="$goods['qj_is_show'] eq 1 OR $order[is_custom] eq 1"> 			球镜：{$goods.qiujing} 柱镜：{$goods.zhujing} 		</if>
					<if condition="$goods['is_zhouwei'] eq 1"> 			轴位：{$goods.zhouwei} 		</if>         
					{$goods.goods_attr}
				</td>
				<td align="right">{$goods.shop_price}&nbsp;<!-- 商品单价 --></td>
				<td align="right">{$goods.goods_number}&nbsp;<!-- 商品数量 --></td>
				<!-- <td align="right">{$goods.subsidy_price}&nbsp;</td> --><!-- 补贴价格 -->
				<td align="right">{$goods.formated_subtotal}&nbsp;<!-- 商品金额小计 --></td>
			</tr>
		</volist>
        <tr>
            <!-- 发票抬头和发票内容 -->
            <td colspan="5"><if condition="$order['inv_payee']">         发票抬头：{$order.inv_payee}&nbsp;&nbsp;&nbsp;         发票内容：{$order.inv_content}         </if></td>
            <!-- 商品总金额 -->
            <td colspan="2" align="right">商品总金额：¥{$order.formated_goods_amount}</td>
        </tr>
    </tbody>
</table>
<table width="100%" border="0">
    <tbody>
        <tr align="right">
            <td>商品总价：¥{$order.formated_goods_amount} + 配送费用：¥{$order.formated_shipping_fee}元  - 使用余额：¥{$order.surplus}元 - 优惠券：¥{$order.bonus}元 - 优惠金额：¥{$order.formated_reduce_amount}元 = 订单总金额：¥{$order.formated_order_amount}</td>
        </tr>
    </tbody>
</table>
<p><if condition="$order['to_buyer']">          </if>     <if condition="$order['invoice_note']">          </if>     <if condition="$order['pay_note']">          </if></p>
<table width="100%" border="0">
    <tbody>
        <tr>
            <!-- 给购货人看的备注信息 -->
            <td>客户留言：{$order.postscript}</td>
        </tr>
        <tr>
            <!-- 网店名称, 网店地址, 网店URL以及联系电话 -->
            <td>{$shop_name}（{$shop_url}）         地址：{$shop_address}&nbsp;&nbsp;电话：{$service_phone}</td>
        </tr>
        <tr align="right">
            <!-- 订单操作员以及订单打印的日期 -->
            <td>打印时间：{$print_time}&nbsp;&nbsp;&nbsp;</td>
        </tr>
    </tbody>
</table>