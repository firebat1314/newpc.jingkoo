
<table>
	<tr>
		<th>数量</th>
		<th>球镜</th>
		<th>柱镜</th>
		<if condition="$goods_info['zhouwei']">
			<th ng-if="zhouwei" class="ng-scope">轴位</th>
		</if>
		<volist name="goods['spc_name']" id="vo">
			<th ng-if="zhouwei" class="ng-scope">{$vo}</th>
		</volist>
		<th>单价</th>
		<th>优惠价格</th>
		<th>价格</th>
	</tr>
	<volist name="goods_spc" id="lists">
		<tr>
			<td>{$lists.member}</td>
			<td>{$lists.qiujing}</td>
			<td>{$lists.zhujing}</td>
			<if condition="$goods_info['zhouwei']">
				<td>{$lists.zhouwei}</td>
			</if>
			<volist name="lists[spc]" id="vo">
				<td><input type="hidden" value="194355">{$vo}</td>
			</volist>
			<td>{$lists.shop_price}</td>
			<td>{$lists.pro_price}</td>
			<td>{$lists.price}</td>
		</tr>
	</volist>
</table>