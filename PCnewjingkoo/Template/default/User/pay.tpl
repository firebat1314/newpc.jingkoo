<!doctype html>
<html>
<head>
<include file="Public:head" />

<script type="text/javascript" src="__JS__/pingppnew.js"></script>
</head>

<body>

<include file="Public:header" />

正在加载支付网关。。。。

<include file="Public:footer" />

<script type="text/javascript">
<!--
	pingpp.createPayment({$pingxx}, function(result, err){
	// 处理错误信息
		console.log(err);
		console.log(result);
	});	
	
	
//-->
</script>

</body>
</html>