	<table class="batch_table" style="float:left;/*position: absolute;*/right:0;bottom:0;">
		<tr>
			<foreachs name="specification" item="spec" key="key" keys="keys">
				<td class="attr_val" data-ids="{$key}" style="padding-left:10px;    min-width: 50px;">{$spec.name}：</td>
				<td>
					<select class="br_7 spec_{$key}" name="spec_{$key}" id="{$keys}" data-id="{$key}">
					<foreach name="spec[values]" item="value">
						<option labels="{$key}" value="{$value.id}">{$value.label}</option>
					</foreach>
					</select>
				</td>
			</foreachs>
		</tr>
	</table>
	<!--
	<table  class="fist" style="left:50%;margin-left:-600px;top: 230px;" width="1200" border="0" cellspacing="0" cellpadding="0" class="table_111" cellspacing="1">
		<tr>
			<th width="86" class="fist_td table-origen"><span>球镜</span><span>柱镜</span></th>
			
			<foreach name="zhujing" item="vo" key="key">
			    <th class="f5"  width="10%">{$key}</th>
			</foreach>
		</tr>
	</table>
	-->
        <table class="bulk-table table_111" id="table_111" width="100%" border="0" cellpadding="0" cellspacing="1">
            <tbody>
                <tr>
                    <th class="f5 table-origen fist_td" width="{$zhujkd}%"><span>球镜</span><span>柱镜</span></th>
		    <foreach name="zhujing" item="vo" key="key">
                    <th class="f5 fist_td" width="{$zhujkd}%">{$key}</th>
		    </foreach>
                </tr>
		<foreachs name="qzjing" item="zhus" key="key" keys="keys">
			<tr class="td_inp">
			    <td class="f5 hs_bg" width="{$zhujkd}%" align="center" data-val="{$key}">{$key}</td>
			    <foreachs name="zhus" item="zhu" key="k" keys="ks">
			    <td align="center" width="{$zhujkd}%" class="bs_bg" data-id="tr{$keys}_{$ks}" data-zhu="{$zhu}" style="<if condition="$zhu eq null">background:#ccc;</if>"  <if condition="$zhu eq null">name="desa"<else /> name="tr{$keys}_{$ks}"</if>>&nbsp;</td>
			    </foreachs>
			</tr>
		</foreachs>
            </tbody>
        </table>