var clicks = 0;

function onLoad() {
	var data = sessionStorage.getItem("item");
	search(data);
}

function search(anime) {
	fetch(`https://api.jikan.moe/v4/anime?q=${anime}&limit=20`)
		.then(function (response) {
			return response.json();
		})
		.then(function (respData) {
			for (let i = 0; i < respData.data.length; i++) {
				if (respData.data[i].type !== "Music") {
					var titles = document.createElement("H2");
					titles.setAttribute("id", respData.data[i].mal_id);
					titles.setAttribute("onclick", "music(id); event.cancelBubble=true;");
					titles.setAttribute("name", clicks);
					var title = respData.data[i].title;
					titles.innerHTML = title;
					document.getElementById("results").appendChild(titles);
				}
			}
		});
}

function music(id) {
	var count = document.getElementById(id).getAttribute("name");
	count++;
	document.getElementById(id).setAttribute("name", count);

	if (count % 2 !== 0) {
		fetch(`https://api.jikan.moe/v4/anime/${id}/themes`)
			.then(function (response) {
				return response.json();
			})
			.then(function (respData) {
				var opening = respData.data.openings;
				var ending = respData.data.endings;
				var all = opening.concat(ending);

				//removes the element that just consists of artists and empty songs
				let removed = [
					"No opening themes have been added to this title. Help improve our database by adding an opening theme here.",
					"No ending themes have been added to this title. Help improve our database by adding an ending theme here.",
				];
				all = all.filter(
					(i) => !removed.includes(i) && i.indexOf(" by ") !== -1
				);

				var uniq_tracks = [];
				var track = "";
				var artist = "";

				if (all.length > 0) {
					for (item in all) {
						var song = all[item];

						if (song.indexOf(":") !== -1) {
							var i = song.indexOf(":") - 1;
							if (!isNaN(song[i]) || song[i] === " ") {
								song = song.substr(song.indexOf(":") + 1);
							}

							if (song[1] === ":") {
								song = song.substr(2);
							}
						}

						// deletes quotations so that \&quot; does not appear
						song = song.split('"')[1].concat(song.split('"')[2]);

						if (song.indexOf(" ") === 0) {
							song = song.substr(song.indexOf(" ") + 1);
						}

						if (song.includes("(ep")) {
							song = song.split("(ep")[0];
						}

						if (song.includes("(TV")) {
							song = song.split("(TV")[0];
						}

						if (song.includes("(eps")) {
							song = song.split("(eps")[0];
						}

						if (song.includes(" by ")) {
							track = song.split(" by ")[0];
							artist = " by " + song.split(" by ")[1].trim();
						} else {
							track = song;
						}

						if (track.includes("<") && track.includes(">")) {
							track = track.replace(/\</g, "(").replace(/\>/g, ")");
						}

						// checks for balanced ()
						if (artist[artist.length - 1] == "(") {
							artist = artist.substring(0, artist.lastIndexOf("("));
						}
						if (
							artist.lastIndexOf("(") != -1 &&
							artist.lastIndexOf(")") == -1
						) {
							artist = artist.concat(")");
						}

						if (!uniq_tracks.includes(track)) {
							var songs = document.createElement("H3");
							song = track + artist;

							if (song.length > 179) {
								song = song.substr(0, 179) + "...";
							}

							songs.innerHTML = song;
							songs.setAttribute("id", track);
							songs.setAttribute(
								"onclick",
								"displayLinks(id); event.cancelBubble=true;"
							);
							document.getElementById(`${id}`).appendChild(songs);
							document.getElementById(id).style.border = "none";
							uniq_tracks.push(track);
						}
					}
				} else {
					alert("Sorry...there are no OPs/EDs in this show");
				}
			});
	} else if (count % 2 === 0) {
		document.getElementById(id).setAttribute("name", count);
		document.getElementById(id).style.borderLeft = "solid";
		document.getElementById(id).style.borderColor = "#a44a3f";
		var childs = document.getElementById(id).getElementsByTagName("h3");
		for (let i = 0; i < childs.length; i++) {
			var childSetting = childs[i].style.display;
			if (childSetting !== "none") {
				childs[i].style.display = "none";
			}
		}
	}
}

function displayLinks(id) {
	var parent = document.getElementById("modal");
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
	var song = document.createElement("p");
	var s = document.getElementById(id).innerHTML;
	song.innerHTML = s;
	parent.appendChild(song);
	document.getElementById("id01").style.display = "block";
	fetchTracks(s);
}
