    <div class="bulk-order-ano-table" id="batch_preview" style="background-color: #fff;">
        <table width="100%">
                <tbody><tr>
                    <th>数量</th>
                    <th>球镜</th>
                    <th>柱镜</th>
                    <if condition="$goods_info['zhouwei']">
                        <th ng-if="zhouwei" class="ng-scope">轴位</th>
                    </if>
		    <volist name="goods['spc_name']" id="vo">
		        <th ng-if="zhouwei" class="ng-scope">{$vo}</th>
		    </volist>
                    <th width="250">价格</th>
                </tr>
            </tbody>
            <tbody id="order">
                <volist name="goods_spc" id="lists">
                <tr id="trtr0_0" class="attr_lists">
                    <td align="center" id="tr0_0" class="nums">{$lists.member}</td>
                    <td align="center" class="qiujing">{$lists.qiujing}</td>
                    <td align="center" class="zhujing">{$lists.zhujing}</td>
                    <if condition="$goods_info['zhouwei']">
                        <td align="center">{$lists.zhouwei}</td>
                    </if>
                    <volist name="lists[spc]" id="vo">
                        <td align="center" class="str_attr"><input type="hidden" value="194355"><span>{$vo}</span></td>
                    </volist>
                    <td align="center" class="price">{$lists.price}</td>
                </tr>
                </volist>
            </tbody>
        </table>
    </div>