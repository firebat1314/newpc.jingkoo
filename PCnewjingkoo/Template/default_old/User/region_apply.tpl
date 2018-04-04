<!doctype html>
<html>
<head>
<include file="Public:head" />
</head>

<body>

<include file="Public:header" />

<form method="post" action="region_apply" enctype="multipart/form-data">
身份证正面： <input type="file" name="frdb_code_zm" value="" /><br />
身份证反面： <input type="file" name="frdb_code_fm" value="" /><br />

<input type="submit" name="" value="提交" />
</form>

<include file="Public:footer" />

<script type="text/javascript" src="__JS__/region.js"></script>

</body>
</html>