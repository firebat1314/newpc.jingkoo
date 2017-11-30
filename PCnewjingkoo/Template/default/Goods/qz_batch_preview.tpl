
<table>
	<tr>
		<th width="{$zhujkd}%" class="table-origen"><span>球镜</span><span>柱镜</span></th>
		<volist name="zhu" id="zhu_">
			<th width="{$zhujkd}%">{$zhu_}</th>
		</volist>
	</tr>
	<volist name="qiu" id="qiu_">
		<tr>
			<td width="{$zhujkd}%">{$qiu_}</td>
			<volist name="zhu" id="_zhu_">
				<td width="{$zhujkd}%">{$qiu_zhu[$qiu_][$_zhu_]}</td>
			</volist>
		</tr>
	</volist>
</table>