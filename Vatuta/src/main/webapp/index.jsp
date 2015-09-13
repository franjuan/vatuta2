<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Vatuta</title>
<script src="https://code.createjs.com/easeljs-0.8.1.min.js"></script>
<script src="https://code.jquery.com/jquery-2.1.4.js"></script>
<script
	src="https://ajax.googleapis.com/ajax/libs/dojo/1.10.4/dojo/dojo.js"
	data-dojo-config="async: true"></script>
</head>

<body>
	<h2>Hello World!</h2>
	<h1 id="greeting">Hello</h1>
	<script>
		require([ "dojo/dom", "dojo/dom-construct", "./vatuta/project.js" ],
				function(dom, domConstruct, project) {
					var greetingNode = dom.byId('greeting');
					var pr = new project();
					console.log(pr);
					domConstruct.place(pr.getHello(), greetingNode);
				});
	</script>
</body>
</html>
