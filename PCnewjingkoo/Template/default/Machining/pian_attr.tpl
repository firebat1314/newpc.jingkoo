<if condition="$str_type eq 'zuo'">
                        <tr>
                            <th></th>
                            <th><i style="color: #ff3333;">*</i>球镜</th>
                            <th><i style="color: #ff3333;">*</i>柱镜</th>
                            <th>轴位</th>
                            <th>ADD</th>
                            <th>瞳距</th>
                            <th>瞳高</th>
                            <th>近用瞳距</th>
                        </tr>
                        <tr>
                            <td><input type="button" class="cont_tb1_ip" value="左眼"/></td>
                            <td>
				<if condition="$spec_info[qiujing]">
			            {$spec_info.qiujing}
				    <input name="lqiujing[]" value="{$spec_info.qiujing}" type="hidden" />
				<else />
				    <input name="lqiujing[]" value="{$spec_info.qiujing}" type="text" placeholder="请输入" />
				</if>
			    </td>
                            <td>
				<if condition="$spec_info[zhujing]">
			            {$spec_info.zhujing}
				    <input name="lzhujing[]" value="{$spec_info.zhujing}" type="hidden" />
				<else />
				    <input name="lzhujing[]" value="{$spec_info.zhujing}" type="text" placeholder="请输入" />
				</if>
			    </td>
                            <td>
				<if condition="$spec_info[zhouwei]">
			            {$spec_info.zhouwei}
				    <input name="lzhouxiang[]" value="{$spec_info.zhouwei}" type="hidden" />
				<else />
				    <input name="lzhouxiang[]" value="{$spec_info.zhouwei}" type="text" placeholder="请输入" />
				</if>
			    </td>
                            <td>
				<if condition="$spec_info[ADD]">
			            {$spec_info.ADD}
				    <input name="ladd[]" value="{$spec_info.ADD}" type="hidden" />
				<else />
			            <input type="text" name="ladd[]" placeholder="请输入">
				</if>
			    </td>
                            <td>
				<if condition="$spec_info[tongju]">
			            {$spec_info.tongju}
				    <input name="ltongju[]" value="{$spec_info.tongju}" type="hidden" />
				<else />
			            <input type="text" name="ltongju[]" placeholder="请输入">
				</if>
			    </td>
                            <td>
				<if condition="$spec_info[tonggao]">
			            {$spec_info.tonggao}
				    <input name="ltonggao[]" value="{$spec_info.tonggao}" type="hidden" />
				<else />
			            <input type="text" name="ltonggao[]" placeholder="请输入">
				</if>
			    </td>
                            <td>
				<if condition="$spec_info[jytj]">
			            {$spec_info.jytj}
				    <input name="ljytj[]" value="{$spec_info.jytj}" type="hidden" />
				<else />
			            <input type="text" name="ljytj[]" placeholder="请输入">
				</if>
			    </td>
                        </tr>
<else />
                        <tr>
                            <th></th>
                            <th><i style="color: #ff3333;">*</i>球镜</th>
                            <th><i style="color: #ff3333;">*</i>柱镜</th>
                            <th>轴位</th>
                            <th>ADD</th>
                            <th>瞳距</th>
                            <th>瞳高</th>
                            <th>近用瞳距</th>
                        </tr>
                        <tr>
                            <td><input type="button" class="cont_tb1_ip" value="右眼"/></td>
                            <td>
				<if condition="$spec_info[qiujing]">
			            {$spec_info.qiujing}
				    <input name="rqiujing[]" value="{$spec_info.qiujing}" type="hidden" />
				<else />
				    <input name="rqiujing[]" value="{$spec_info.qiujing}" type="text"  placeholder="请输入"/>
				</if>
			    </td>
                            <td>
				<if condition="$spec_info[zhujing]">
			            {$spec_info.zhujing}
				    <input name="rzhujing[]" value="{$spec_info.zhujing}" type="hidden" />
				<else />
				    <input name="rzhujing[]" value="{$spec_info.zhujing}" type="text"  placeholder="请输入"/>
				</if>
			    </td>
                            <td>
				<if condition="$spec_info[zhouwei]">
			            {$spec_info.zhouwei}
				    <input name="rzhouxiang[]" value="{$spec_info.zhouwei}" type="hidden" />
				<else />
				    <input name="rzhouxiang[]" value="{$spec_info.zhouwei}" type="text"  placeholder="请输入"/>
				</if>
			    </td>
                            <td>
				<if condition="$spec_info[ADD]">
			            {$spec_info.ADD}
				    <input name="radd[]" value="{$spec_info.ADD}" type="hidden" />
				<else />
			            <input type="text" name="radd[]" placeholder="请输入">
				</if>
			    </td>
                            <td>
				<if condition="$spec_info[tongju]">
			            {$spec_info.tongju}
				    <input name="rtongju[]" value="{$spec_info.tongju}" type="hidden" />
				<else />
			            <input type="text" name="rtongju[]" placeholder="请输入">
				</if>
			    </td>
                            <td>
				<if condition="$spec_info[tonggao]">
			            {$spec_info.tonggao}
				    <input name="rtonggao[]" value="{$spec_info.tonggao}" type="hidden" />
				<else />
			            <input type="text" name="rtonggao[]" placeholder="请输入">
				</if>
			    </td>
                            <td>
				<if condition="$spec_info[jytj]">
			            {$spec_info.jytj}
				    <input name="rjytj[]" value="{$spec_info.jytj}" type="hidden" />
				<else />
			            <input type="text" name="rjytj[]" placeholder="请输入">
				</if>
			    </td>
                        </tr>
</if>