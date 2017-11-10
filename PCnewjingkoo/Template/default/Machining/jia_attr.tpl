
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
                            <td><p class="tb2_p1"><if condition="$jia_info[goods_name]">{$jia_info.goods_name}<else />客户自备</if></p></td>
                            <td><input type="text" name="pinpai[]" placeholder="请输入"></td>
                            <td><input type="text" name="xinghao[]" placeholder="请输入"></td>
                            <td>{$mach_type_name}<input name="mach_type[]" value="{$mach_type}" type="hidden" ></td>
                            <td><input type="text" name="beizhu[]" placeholder="请输入"></td>
                        </tr>