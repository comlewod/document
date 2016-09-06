<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>{=isset($title) ? $title : '这是title'}</title>
<meta name="keywords" content="{=isset($keywords) ? $keywords : '这是关键字'}" />
<meta name="description" content="{=isset($description) ? $description : '这是关键字'}" />

<link href="{yiiApp 'STATIC_HOST'}page/css/libs.css" rel="stylesheet" type="text/css" />
<link href="{yiiApp 'STATIC_HOST'}page/css/global.css" rel="stylesheet" type="text/css" />
<? if( isset($page_css) && $page_css ){ ?>
<link href="{yiiApp 'STATIC_HOST'}page/css/{$page_css}" rel="stylesheet" type="text/css" />
<? } ?>

<script>
var STATIC_HOST = "{yiiApp 'STATIC_HOST'}";
</script>

</head>

<body>
	{widget "header", array(), 'global'}
	<div class="wrap">
		{$content}
	</div>

	<script src="{yiiApp 'STATIC_HOST'}page/js/libs.js"></script>
	<script src="{yiiApp 'STATIC_HOST'}page/js/global.js"></script>
	<? if( isset($page_js) && $page_js ){ ?>
	<script src="{yiiApp 'STATIC_HOST'}page/js/{$page_js}"></script>
	<? } ?>
	<script>
	{$this->_scriptPool}
	</script>
</body>

</html>
