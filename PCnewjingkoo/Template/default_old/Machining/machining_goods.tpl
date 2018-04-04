<if condition="$goods_type eq 'pian'">
                        <div class="process_cover_box">
                            <h2 class="cover_box_h2">选择镜片 —— <if condition="$type eq 'zuo'">左眼<else />右眼</if><span onclick="hideCover(this)" class="box_h2_dh"></span></h2>
                            <div class="cover_box_c">
                                <ul class="box_c_u1">
                                    <li class="con">订单选择</li>
                                    <!--<li>客户自备</li>-->
                                </ul>
                                <div class="need_showdiv">
                                    <div class="neShow show">
					<volist name="order_goods" id="vo">
                                        <div class="showdiv">
                                            <div class="showdiv_l" style="z-index: -1;">
						<input style="z-index: 999;" type="radio" value="{$vo.rec_id}" name="html_rec_id" class="showdiv_linp" <if condition="$vo['selected'] eq 1">selected checked</if> <if condition="$vo['disabled'] eq 1">disabled</if>>
                                            </div>
                                            <div class="showdiv_c"><img src="{$vo.original_img}" alt="{$vo.goods_name}" title="{$vo.goods_name}"></div>
                                            <div class="showdiv_r">
                                                <p class="showdiv_rp1">{$vo.goods_name}</p>
                                                <p class="showdiv_rp2"><span class="showdiv_rsp1">球镜：{$vo.qiujing}</span><span class="showdiv_rsp1">柱镜：{$vo.zhujing}</span><span class="showdiv_rsp1">轴位：{$vo.zhouwei}</span></p>
						<volist name="vo[goods_attrs]" id="goods_attr">
	                                                <p class="showdiv_rp2"><em>{$goods_attr}</em></p>
						</volist>
                                            </div>
                                        </div>
					</volist>
                                    </div>
                                </div>
                                <div class="showdiv_btn">
                                    <input name="html_type" value="1" type="hidden" />
                                    <input name="str_type" value="{$type}" type="hidden" />
                                    <if condition="$type eq 'zuo'">
                                        <input name="html_pian" value="1" type="hidden" />
                                    <else />
                                        <input name="html_pian" value="0" type="hidden" />
                                    </if>
                                    <input type="button" class="qd_btn1 queren" onclick="getLeftEyeData(this)" value="确定"/>
                                    <input type="button" class="qd_btn2" onclick="hideCover(this)" value="取消"/>
                                </div>
                            </div>
                        </div>
<else />
                        <div class="process_cover_box">
                            <h2 class="cover_box_h2">选择镜架<span onclick="hideCover(this)" class="box_h2_dh"></span></h2>
                            <div class="cover_box_c">
                                <ul class="box_c_u1">
				    <notempty name="order_goods">
                                    <li class="con" onclick="dingdan(this)">订单选择</li>
				    </notempty>
                                    <li class="<empty name="order_goods"> con</empty>" onclick="kehu(this)">加工类型</li>
                                </ul>
                                <div class="need_showdiv">
				    <notempty name="order_goods">
                                    <div class="neShow show goods">
					<volist name="order_goods" id="vo">
                                        <div class="showdiv">
                                            <div class="showdiv_l" style="z-index: -1;">
						<input style="z-index: 999;" type="radio" value="{$vo.rec_id}" name="html_rec_id" class="showdiv_linp" <if condition="$vo['selected'] eq 1">selected checked</if> <if condition="$vo['disabled'] eq 1">disabled</if>>
                                            </div>
                                            <div class="showdiv_c"><img src="{$vo.original_img}" alt="{$vo.goods_name}" title="{$vo.goods_name}"></div>
                                            <div class="showdiv_r">
                                                <p class="showdiv_rp1">{$vo.goods_name}</p>
						<volist name="vo[goods_attrs]" id="goods_attr">
	                                                <p class="showdiv_rp2"><em>{$goods_attr}</em></p>
						</volist>
                                            </div>
                                        </div>
					</volist>
                                    </div>
				    </notempty>
                                    <div class="neShow <empty name="order_goods"> show</empty> int_type">
                                        <ul class="choose_u1">
                                            <li>
                                                <input name="type" value="1" type="radio" class="choose_u1_inp" <if condition="$mach_type eq 1"> checked</if>/>
                                                <label for="">全框</label>
                                            </li>
                                            <li>
                                                <input name="type" value="2" type="radio" class="choose_u1_inp" <if condition="$mach_type eq 2"> checked</if>/>
                                                <label for="">半框</label>
                                            </li>
                                            <li>
                                                <input name="type" value="3" type="radio" class="choose_u1_inp" <if condition="$mach_type eq 3"> checked</if>/>
                                                <label for="">无框切边</label>
                                            </li>
                                            <li>
                                                <input name="type" value="4" type="radio" class="choose_u1_inp" <if condition="$mach_type eq 4"> checked</if>/>
                                                <label for="">无框打孔</label>
                                            </li>
                                            <li>
                                                <input name="is_zib" value="1" type="checkbox" class="choose_u1_inp" <if condition="$rec_id eq 0"> checked</if>/>
                                                <label for="">客户自备</label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="showdiv_btn">
				    <input name="html_type" value="0" type="hidden" />
                                    <input type="button" class="qd_btn1" onclick="getJiaData(this)" value="确定"/>
                                    <input type="button" class="qd_btn2" onclick="hideCover(this)" value="取消"/>
                                </div>
                            </div>
                        </div>
</if>