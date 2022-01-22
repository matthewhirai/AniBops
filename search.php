<!DOCTYPE html>
<html>
<head>
	<title>Ani-Bops</title>
	<script src="src/script2.js"></script>
	<script src="src/songRegExp.js"></script>
	<script src="src/spotify.js"></script>
	<link rel="shortcut icon" type="image/png" href="img/favicon.png" sizes="32x32">
	<link rel="stylesheet" type="text/css" href="style.css">
	<link href="https://fonts.googleapis.com/css2?family=Fira+Sans&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
		integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ=="
		crossorigin="anonymous" referrerpolicy="no-referrer" />
	<meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body onload="onLoad()">
	<div class="header">
		<a href="index.php">
			Ani-Bops
		</a>
	</div>

	<div id="results" class="result-container"></div>

	<div id="id01" class="modal">
		<div class="modal-content">
			<div class="modal-header">
				<span class="close" onclick="document.getElementById('id01').style.display='none'">
					&times;
				</span>
				<h4>Music Links</h4>
			</div>
			<div id="modal" class="modal-body"></div>
		</div>
	</div>
</body>
</html>