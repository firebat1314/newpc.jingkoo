	<table class="batch_table" style="float:left;/*position: absolute;*/right:0;bottom:0;">
		<tr>
			<foreachs name="specification" item="spec" key="key" keys="keys">
				<td class="attr_val" data-ids="{$key}" style="padding-left:10px;    min-width: 50px;background-color:#fff;">{$spec.name}：</td>
				<td style="background-color:#fff;">
					<select class="br_7 spec_{$key}" name="spec_{$key}" id="{$keys}" data-id="{$key}" style="min-width:80px;height:25px;padding-left:5px;margin-left:10px;">
					<foreach name="spec[values]" item="value">
						<option labels="{$key}" value="{$value.id}">{$value.label}</option>
					</foreach>
					</select>
				</td>
			</foreachs>
		</tr>
	</table>
	<table  class="fist tttb table_111 bulk-table" style="left:50%;margin-left:-600px;top: 0;position:fixed;z-index:900;display:none;" width="1200" border="0" cellspacing="0" cellpadding="0" cellspacing="1">
		<tr>
			<th width="{$zhujkd}%" class="fist_td table-origen" style="z-index:9999;"><span>球镜</span><span>柱镜</span></th>
			
			<foreach name="zhujing" item="vo" key="key">
			    <th class="f5"  width="{$zhujkd}%">{$key}</th>
			</foreach>
		</tr>
	</table>
        <table class="bulk-table table_111" id="table_111" width="100%" border="0" cellpadding="0" cellspacing="1" style="cursor: cell;">
            <tbody>
                <tr>
                    <th class=" table-origen fist_td" width="{$zhujkd}%" style="overflow: hidden;background:none !important;"><div style="background:#f5f5f5 url('/img/tableOrigenLine.png') no-repeat;background-size: 100% 100%; width: 100%; height: 100%; position: relative;"><span>球镜</span><span>柱镜</span></div></th>
		    <foreach name="zhujing" item="vo" key="key">
                    <th class="f5 fist_td" width="{$zhujkd}%">{$key}</th>
		    </foreach>
                </tr>
		<foreachs name="qzjing" item="zhus" key="key" keys="keys">
			<tr class="td_inp">
			    <td class="f5 hs_bg" width="{$zhujkd}%" align="center" data-val="{$key}">{$key}</td>
			    <foreachs name="zhus" item="zhu" key="k" keys="ks">
			    <td align="center" width="{$zhujkd}%" class="bs_bg" data-id="tr{$keys}_{$ks}" data-zhu="{$zhu}" style="<if condition="$zhu eq null">background:#ccc;<elseif condition="$cache_goods_number[$key][$zhu] gt 0"/>background: #ebf3fe;</if>"  <if condition="$zhu eq null">name="desa"<else /> name="tr{$keys}_{$ks}"</if>><if condition="$cache_goods_number[$key][$zhu] gt 0">{$cache_goods_number[$key][$zhu]}<else />&nbsp;</if></td>
			    </foreachs>
			</tr>
		</foreachs>
            </tbody>
        </table>