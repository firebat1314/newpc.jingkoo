<!doctype html>
<html>
<head>
<include file="Public:head" />
</head>

<body>

<include file="Public:header" />

<form method="post" enctype="multipart/form-data">
标题<input type="text" name="title" /><br/>
正文<textarea name="content"></textarea><br/>
视频<input type="file" name="filevideo" /><br/>
图片<input type="file" name="fileimg" /><br/>
推荐理由<textarea name="result"></textarea><br/>
<input type="hide" name="pic" value="" />
<input type="hide" name="video" value="" /><br/>
<input type="submit" name="" value="提交" />
</form>

<include file="Public:footer" />

<script type="text/javascript">
$(function(){
	$('input[name="filevideo"]').on('change', function(){
		//创建FormData对象
		var data = new FormData();
		$.each($(this)[0].files, function(i, file) {
			data.append('filedata', file);
		});
		data.append('type',    2);
		data.append('time',    <?php echo time();?>);
		$.ajax({
			url:'{:U('Public/upload')}',
			type:'POST',
			data:data,
			cache: false,
			contentType: false,    //不可缺
			processData: false,    //不可缺
			success:function(data){
				if (data.status == 0){
					layer.msg(data.info);
				}else{
					var result = data.data;
					$('input[name="video"]').val(result.fileid);
				}
			}
		});
	});

	$('input[name="fileimg"]').on('change', function(){
		//创建FormData对象
		var data = new FormData();
		$.each($(this)[0].files, function(i, file) {
			data.append('filedata', file);
		});
		data.append('type',    1);
		data.append('time',    <?php echo time();?>);
		$.ajax({
			url:'{:U('Public/upload')}',
			type:'POST',
			data:data,
			cache: false,
			contentType: false,    //不可缺
			processData: false,    //不可缺
			success:function(data){
				if (data.status == 0){
					layer.msg(data.info);
				}else{
					var result = data.data;
					$('input[name="pic"]').val(result.fileid);
				}
			}
		});
	});
});
</script>


</body>
</html>