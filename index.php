<?php
    include 'dbh.php';
?>

<!DOCTYPE html>
<html>

<head>
	<title>Ani-Bops</title>
	<script>sessionStorage.setItem("token", '<?php echo $tk; ?>')</script>
	<script src="src/script.js"></script>
	<link rel="shortcut icon" type="image/png" href="img/favicon.png" sizes="32x32">
	<link rel="stylesheet" type="text/css" href="style.css">
	<link href="https://fonts.googleapis.com/css2?family=Fira+Sans&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
		integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ=="
		crossorigin="anonymous" referrerpolicy="no-referrer" />
	<meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>
	<div class="header" id="header">
		<a href="index.php">
			Ani-Bops
		</a>
	</div>

	<div id="home">
		<img class="home-img" src="img/kon_transparent.png" onload="topAnime()" />

		<form action="search.php" onsubmit="setSearchValue()" method="POST" id="theFormID" class="input-wrapper">
			<button name="search" class="fa fa-search"></button>
			<input type="text" id="search" placeholder="Search for anime..." value="" minlength="3">
			<div class="fa fa-times" onclick="document.getElementById('search').value = ''"></div>
		</form>

		<h4 class="dropdown">Suggested anime</h4>
		<div class="drop-button">
			<button class="fas fa-chevron-down" onclick="myFunction('top')"></button>
		</div>

		<div id="top" class="music-container" style="margin-top: 10px;"></div>
	</div>
</body>

</html>