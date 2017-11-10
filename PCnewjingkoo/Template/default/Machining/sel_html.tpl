
    <notempty name="machining">
	<volist name="machining" id="vo" key="key">
                <div ng-repeat="li in liArr" class="process_cont_c ng-scope <if condition="$key eq 1">con</if>">
                    <div class="process_cont_u2">
                        <div class="u2">
                            <a href="javascript:;" onclick="showGoods(this)" rec_id="0" data-type="zuo" data-goods_type="pian">
				<input name="left[]" class="rec_id_val" value="{$vo.left}" type="hidden" />
                                <div class="u2_d1">
                                    <span style="background: url(<if condition="$vo['left_attr']['goods_thumb']">{$vo[left_attr]['goods_thumb']}<else />/img/Left.png</if>) no-repeat center" class="goods_img"></span>
                                    <p>镜片-左眼（L）</p>
                                </div>
                            </a>
                        </div>
                        <div class="u2">
                            <a href="javascript:;" onclick="showGoods(this)" rec_id="0" data-type="you" data-goods_type="pian">
				<input name="right[]" class="rec_id_val" value="{$vo.right}" type="hidden" />
                                <div class="u2_d1">
                                    <span style="background: url(<if condition="$vo['right_attr']['goods_thumb']">{$vo[right_attr]['goods_thumb']}<else />/img/Right.png</if>) no-repeat center" class="goods_img"></span>
                                    <p>镜片-右眼（R）</p>
                                </div>
                            </a>
                        </div>
                        <div class="u2">
                            <a href="javascript:;" onclick="showGoods(this)" rec_id="0" data-goods_type="jia">
				<input name="jia[]" class="rec_id_val" value="{$vo.jia}" type="hidden" />
				<input name="type[]" class="type_val" value="{$vo.frame_attr.mach_type}" type="hidden" />
                                <div class="u2_d1">
                                    <span class="goods_img" style="<if condition="$vo['jia_attr']['goods_thumb']">{$vo[jia_attr]['goods_thumb']}</if>"></span>
                                    <p>镜架</p>
                                </div>
                            </a>
                        </div>
                    </div>
		    <!-- 左眼 -->
                    <table class="process_cont_tb1 left_table" style="">
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
				<if condition="$vo[left_attr][qiujing]">
			            {$vo[left_attr][qiujing]}
				    <input name="lqiujing[]" value="{$vo[left_attr][qiujing]}" type="hidden" />
				<else />
				    <input name="lqiujing[]" value="{$vo.eyeglass_cfg.left.qiujing}" type="text" />
				</if>
			    </td>
                            <td>
				<if condition="$vo[left_attr][zhujing]">
			            {$vo[left_attr][zhujing]}
				    <input name="lzhujing[]" value="{$vo[left_attr][zhujing]}" type="hidden" />
				<else />
				    <input name="lzhujing[]" value="{$vo.eyeglass_cfg.left.zhujing}" type="text" />
				</if>
			    </td>
                            <td>
				<if condition="$vo[left_attr][zhouwei]">
			            {$vo[left_attr][zhouwei]}
				    <input name="lzhouxiang[]" value="{$vo[left_attr][zhouwei]}" type="hidden" />
				<else />
				    <input name="lzhouxiang[]" value="{$vo.eyeglass_cfg.left.zhouxiang}" type="text" />
				</if>
			    </td>
                            <td>
				<if condition="$vo[left_attr][ADD]">
			            {$vo[left_attr][ADD]}
				    <input name="ladd[]" value="{$vo[left_attr][ADD]}" type="hidden" />
				<else />
			            <input type="text" name="ladd[]" placeholder="请输入" value="{$vo.eyeglass_cfg.left.add}" />
				</if>
			    </td>
                            <td>
				<if condition="$vo[left_attr][tongju]">
			            {$vo[left_attr][tongju]}
				    <input name="ltongju[]" value="{$vo[left_attr][tongju]}" type="hidden" />
				<else />
			            <input type="text" name="ltongju[]" value="{$vo.eyeglass_cfg.left.tongju}" placeholder="请输入">
				</if>
			    </td>
                            <td>
				<if condition="$vo[left_attr][tonggao]">
			            {$vo[left_attr][tonggao]}
				    <input name="ltonggao[]" value="{$vo[left_attr][tonggao]}" type="hidden" />
				<else />
			            <input type="text" name="ltonggao[]" value="{$vo.eyeglass_cfg.left.tonggao}" placeholder="请输入">
				</if>
			    </td>
                            <td>
				<if condition="$vo[left_attr][jytj]">
			            {$vo[left_attr][jytj]}
				    <input name="ljytj[]" value="{$vo[left_attr][jytj]}" type="hidden" />
				<else />
			            <input type="text" name="ljytj[]" value="{$vo.eyeglass_cfg.left.jytj}" placeholder="请输入">
				</if>
			    </td>
                        </tr>
                    </table>
                    <div class="process_cover leftBox" id="goods_html">
                    </div>
		    <!-- 右眼 -->
                    <table class="process_cont_tb1 right_table" style="">
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
				<if condition="$vo[right_attr][qiujing]">
			            {$vo[right_attr][qiujing]}
				    <input name="rqiujing[]" value="{$vo[right_attr][qiujing]}" type="hidden" />
				<else />
				    <input name="rqiujing[]" value="{$vo.eyeglass_cfg.right.qiujing}" type="text" />
				</if>
			    </td>
                            <td>
				<if condition="$vo[right_attr][zhujing]">
			            {$vo[right_attr][zhujing]}
				    <input name="rzhujing[]" value="{$vo[right_attr][zhujing]}" type="hidden" />
				<else />
				    <input name="rzhujing[]" value="{$vo.eyeglass_cfg.right.zhujing}" type="text" />
				</if>
			    </td>
                            <td>
				<if condition="$vo[right_attr][zhouwei]">
			            {$vo[right_attr][zhouwei]}
				    <input name="rzhouxiang[]" value="{$vo[right_attr][zhouwei]}" type="hidden" />
				<else />
				    <input name="rzhouxiang[]" value="{$vo.eyeglass_cfg.right.zhouxiang}" type="text" />
				</if>
			    </td>
                            <td>
				<if condition="$vo[right_attr][ADD]">
			            {$vo[right_attr][ADD]}
				    <input name="radd[]" value="{$vo[right_attr][ADD]}" type="hidden" />
				<else />
			            <input type="text" name="radd[]" placeholder="请输入" value="{$vo.eyeglass_cfg.right.add}" />
				</if>
			    </td>
                            <td>
				<if condition="$vo[right_attr][tongju]">
			            {$vo[right_attr][tongju]}
				    <input name="rtongju[]" value="{$vo[right_attr][tongju]}" type="hidden" />
				<else />
			            <input type="text" name="rtongju[]" value="{$vo.eyeglass_cfg.right.tongju}" placeholder="请输入">
				</if>
			    </td>
                            <td>
				<if condition="$vo[right_attr][tonggao]">
			            {$vo[right_attr][tonggao]}
				    <input name="rtonggao[]" value="{$vo[right_attr][tonggao]}" type="hidden" />
				<else />
			            <input type="text" name="rtonggao[]" value="{$vo.eyeglass_cfg.right.tonggao}" placeholder="请输入">
				</if>
			    </td>
                            <td>
				<if condition="$vo[right_attr][jytj]">
			            {$vo[right_attr][jytj]}
				    <input name="rjytj[]" value="{$vo[right_attr][jytj]}" type="hidden" />
				<else />
			            <input type="text" name="rjytj[]" value="{$vo.eyeglass_cfg.right.jytj}" placeholder="请输入">
				</if>
			    </td>
                        </tr>
                    </table>
		    <!-- 镜架 -->
                    <table class="process_cont_tb2 jia_table" style="">
                        <tr>
                            <th width="12.5%"></th>
                            <th width="24%">名称</th>
                            <th width="12%">品牌</th>
                            <th width="12%">型号</th>
                            <th width="21%">加工类型</th>
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
                                </p>
                            </td>
                            <td>
                                <input type="text" name="pinpai[]" value="{$vo.frame_attr.pinpai}" placeholder="请输入">
                            </td>
                            <td>
                                <input type="text" name="xinghao[]" value="{$vo.frame_attr.xinghao}" placeholder="请输入">
                            </td>
                            <td>
                                {$vo.frame_attr.mach_type_name}
				<input name="mach_type[]" value="{$vo.frame_attr.mach_type}" type="hidden" >
                            </td>
                            <td>
                                <input type="text" name="beizhu[]" value="{$vo.frame_attr.beizhu}" placeholder="请输入">
                            </td>
                        </tr>
                    </table>
                </div>
	</volist>
    <else />
                <div ng-repeat="li in liArr" class="process_cont_c ng-scope con">
                    <div class="process_cont_u2">
                        <div class="u2">
                            <a href="javascript:;" onclick="showGoods(this)" rec_id="0" data-type="zuo" data-goods_type="pian">
				<input name="left[]" value="0" class="rec_id_val" type="hidden" />
                                <div class="u2_d1">
                                    <span style="background: url(/img/Left.png) no-repeat center" class="goods_img"></span>
                                    <p>镜片-左眼（L）</p>
                                </div>
                            </a>
                        </div>
                        <div class="u2">
                            <a href="javascript:;" onclick="showGoods(this)" rec_id="0" data-type="you" data-goods_type="pian">
				<input name="right[]" value="0" class="rec_id_val" type="hidden" />
                                <div class="u2_d1">
                                    <span style="background: url(/img/Right.png) no-repeat center" class="goods_img"></span>
                                    <p>镜片-右眼（R）</p>
                                </div>
                            </a>
                        </div>
                        <div class="u2">
                            <a href="javascript:;" onclick="showGoods(this)" rec_id="0" data-goods_type="jia">
				<input name="jia[]" value="0" class="rec_id_val" type="hidden" />
				<input name="type[]" value="0" class="type_val" type="hidden" />
                                <div class="u2_d1">
                                    <span class="goods_img"></span>
                                    <p>镜架</p>
                                </div>
                            </a>
                        </div>
                    </div>
		    <!-- 左眼 -->
                    <table class="process_cont_tb1 left_table" style="display:none;">
                    </table>
                    <div class="process_cover leftBox" id="goods_html">
                    </div>
		    <!-- 右眼 -->
                    <table class="process_cont_tb1 right_table" style="display:none;">
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
                            <td>{{li.right.spec_info.qiujing}}</td>
                            <td>{{li.right.spec_info.zhujing}}</td>
                            <td>{{li.right.spec_info.zhouwei}}</td>
                            <!--<td ng-repeat="value in li.right.spec_info.goods_attr">{{value.attr_value}}</td>-->
                            <td><input type="text" placeholder="请输入"></td>
                            <td><input type="text" placeholder="请输入"></td>
                            <td><input type="text" placeholder="请输入"></td>
                            <td><input type="text" placeholder="请输入"></td>
                        </tr>
                    </table>
		    <!-- 镜架 -->
                    <table class="process_cont_tb2 jia_table" ng-if="li.jia.spec_info.goods_name" style="display:none;">
                    </table>
                </div>
    </notempty>