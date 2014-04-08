<!DOCTYPE html>
<html>
	<head>
		<title>Twitter Bootstrap tab Example [xima-api]</title>
		<meta charset="utf-8">

		<!-- jQuery -->
		<script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>

		<!-- twitter bootstrap -->
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
		<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap-theme.min.css">
		<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>

		<!-- xima api -->
		<script src="../../../../js/xima_api.js"></script>

		<script>
			jQuery(document).ready(function($)
			{
				// initiate twitter.bootstrap from xima.api
				var myTwbs = new xima.api.twitter.bootstrap();

				myTwbs.selectTab('messages');

			});
		</script>
	</head>
	<body>
		<!-- Nav tabs -->
		<ul class="nav nav-tabs">
		  <li><a href="#home" data-toggle="tab">Home</a></li>
		  <li><a href="#profile" data-toggle="tab">Profile</a></li>
		  <li><a href="#messages" data-toggle="tab">Messages</a></li>
		  <li><a href="#settings" data-toggle="tab">Settings</a></li>
		</ul>

		<!-- Tab panes -->
		<div class="tab-content">
		  <div class="tab-pane" id="home">Home Content</div>
		  <div class="tab-pane" id="profile">Profile Content</div>
		  <div class="tab-pane" id="messages">Messages Content</div>
		  <div class="tab-pane" id="settings">Settings Content</div>
		</div>

	</body>
</html>