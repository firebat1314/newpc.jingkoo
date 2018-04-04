<!doctype html>
<html>
<head>
<include file="Public:head" />
</head>

<body>

<include file="Public:header" />

<form method="post" action="register" enctype="multipart/form-data">
用户名： <input type="text" name="user_name" value="" /><br />
手机号： <input type="text" name="mobile_phone" value="" /><br />
<p style="position: relative;margin-top: 10px;"><span class="p_logo"></span> <input class="ipt" style="width: 34%;" type="text" placeholder="请输入验证码" value="" name="str_verify"/>
   <img src="{:U('App/Login/verify')}" style="height: 37px;float: right;margin-right: 35px;cursor: pointer;" onClick="this.src='{:U('App/Login/verify')}?' + Math.random()">
   </p> 
短信验证码：<input type="text" name="mobile_code" value="" /><br />
密码： <input type="text" name="password" value="" /><br />
确认密码： <input type="text" name="cpassword" value="" /><br />

图片<input type="file" name="zhizhao" value="" /><br />
<input type="hidden" name="step" value="two" />



<input type="submit" name="" value="提交" />
</form>

<include file="Public:footer" />

<script type="text/javascript" src="__JS__/region.js"></script>

</body>
</html>
