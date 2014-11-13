<!DOCTYPE html>
<!--(if target dist || dev)>
{{banner}}
<!(endif)-->
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>NetWork Web App</title>
	<meta name="description" content="">
	<meta name="keywords" content="">
	<!--(if target dev)>
	<link rel="stylesheet" href="style/css/app.css">
	<!(endif)-->

	<!--(if target dist)>
	<link rel="stylesheet" href="style/css/{{appname}}.min.css?v={{rlsdate}}">
	<!(endif)-->

	<!--(if target dev)>
	
	<script type="text/javascript">
          var $CONFIG = {};
          $CONFIG['version'] = 'Test';
          $CONFIG['release_time'] = 'Test';
      </script>
	<!(endif)-->

	<!--(if target dist)>
	<script type="text/javascript">
        var $CONFIG = {};
        $CONFIG['version'] = '{{version}}';
        $CONFIG['release_time'] = '{{rlsdate2}}';
    </script>
	<!(endif)-->
</head>
<body>
	<div class="container-fluid">
		<article class="panel">
			<div class="panel-head text-center">
				<h4>网络图</h4>
				<div class="form-group">
                    <a id="btnGetInfo" class="btn btn-primary">发送当前配置</a>
                    <a id="btnGetData1" class="btn btn-default">读取配置1</a>
                    <a id="btnGetData2" class="btn btn-default">读取配置2</a>
                    <a id="btnClean" class="btn btn-warning">清空</a>
                </div>
			</div>
			<div id='paper' class="panel-body">
				
			</div>
		</article>
  			
	</div>
	


	<!--(if target dev)>
	<script data-main="script/main" src="bower_components/requirejs/require.js"></script>
	<!(endif)-->

	<!--(if target dist)>
	<script data-main="script/{{appname}}.min" src="script/require.min.js?v={{rlsdate}}"></script>
	<!(endif)-->
</body>
</html>