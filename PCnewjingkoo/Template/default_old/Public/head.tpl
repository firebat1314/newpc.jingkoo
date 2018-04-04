<meta charset="{$Think.CONFIG.DEFAULT_CHARSET}">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
{$page_title}

<link href="__Css__/reset.css" rel="stylesheet">
<link href="__Css__/style.css" rel="stylesheet">

<script type="text/javascript">
//全局变量
var GLOBALS = {
	HOST: '{$Think.SITE_URL}',
	LOGIN:'{:U('Login/index')}',
	TOKEN_NAME: '{$Think.config.TOKEN_NAME}'
};
</script>

<script type="text/javascript" src="__JS__/jquery/1.8.3/jquery.js"></script>
<script type="text/javascript" src="__JS__/layer/2.4.0/layer.js"></script>