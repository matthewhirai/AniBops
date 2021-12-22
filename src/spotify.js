var gTitle = '@&';
var eTitle = '@&';
var gArtist = '@&';
var translationT = '@&';
var translationA = '@&';
var count = 0;

const TOKEN = "https://accounts.spotify.com/api/token";
const access_token = sessionStorage.getItem("token");
const SEARCH = "https://api.spotify.com/v1/search";

function fetchTracks(song) {
	var regExp = /\(([^)]+)\)/;
	var alphabet =
		/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
	song = song.trim()
	let title = song.split(" by ")[0];
	let artist = song.split(" by ")[1];

	if (title.includes("&nbsp;")) {
		title = title.replace("&nbsp;", "");
	}

	// for Tonikaku Kawaii
	if (title.includes('Koi no')) {
		title = 'Koino Uta'
	}

	if (artist.includes("&nbsp;")) {
		artist = artist.replace("&nbsp;", "");
	}

	if (artist.includes('feat.')) {
		artist = artist.substr(0, artist.indexOf('feat.'))
	}

	// Vivy: Fluorite Eye's Song
	if (artist.includes('Vivy')) {
		artist = 'ヴィヴィ(Vo.八木海莉)'
	}

	if (artist.includes('Estella')) {
		artist = 'エステラ(Vo.六花)'
	}

	if (song == 'Galaxy Anthem by Vivy (Kairi Yagi)') {
		artist = 'ディーヴァ(Vo.八木海莉)'
	}

	if (song == 'Happy Together by General-Purpose Diva AI (Miya Kotsuki)') {
		artist = '汎用型歌姫AI(Vo.コツキミヤ)'
	}

	gTitle = title;
	gArtist = artist;

	if (title.includes("(")) {
		var translation = regExp.exec(title);
		// Checks if str inside () is english
		if (alphabet.test(translation[1]) === true) {
			title = translation[1];
			translationT = title;
		}
		eTitle = title.substr(0, title.indexOf(translation[0]))
	}

	if (title.includes("#")) {
		title = title.replace("#", "");
	}

	// Check if there is an ou in the title and set the english title to that
	if (gTitle.includes("ou")) {
		gTitle = gTitle.replace("ou", "o");
		if (gTitle.includes("(")) {
			eTitle = gTitle.split(" (")[0];
		} else {
			title = gTitle; // if there is no translation then set the title to new gTitle w/o 'ou'
		}
	}

	if (artist.includes("(")) {
		artist = regExp.exec(artist);
		artist = artist[1];
		if (artist.includes(": ")) {
			artist = artist.split(": ")[1];
		}
		translationA = artist;
	}

	if (title.length > 0 && artist.length > 0) {
		url = SEARCH + `?q=${title}&type=track`;
		console.log(url);
		callApi("GET", url, null, handleTrackResponse);
	}
}

function callApi(method, url, body, callback) {
	let xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.setRequestHeader("Authorization", "Bearer " + access_token);
	xhr.send(body);
	xhr.onload = callback;
}

function handleTrackResponse() {
	if (this.status == 200) {
		var data = JSON.parse(this.responseText);
		var valid = false;
		var url = "";
		var dict = {}; //all artists with track title
		var alphabet =
			/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;

		//title
		for (let i = 0; i < data.tracks.items.length; i++) {
			if (data.tracks.items[i].name.toLowerCase().includes(gTitle.substring(0, 2).toLowerCase()) ||
				gTitle.substring(0, 2).toLowerCase().includes(data.tracks.items[i].name.toLowerCase()) ||
				data.tracks.items[i].name.includes(translationT.substring(0, 2))) {
				dict[i] = data.tracks.items[i].artists;
			}
		}

		//artist
		outerLoop: for (const [key, value] of Object.entries(dict)) {
			for (let i = 0; i < value.length; i++) {
				if (value[i].name.substring(0, 2).toLowerCase().includes(gArtist.substring(0, 2).toLowerCase()) ||
					gArtist.toLowerCase().includes(value[i].name.substring(0, 4).toLowerCase())) {
					url = data.tracks.items[key].external_urls.spotify;
					addTrack(url);
					valid = true;
					break outerLoop;
				} 
				else if (translationA.length > 0) {
					// Check if there is a japanese translation
					if (alphabet.test(translationA) === true && translationA.includes(value[i].name) && alphabet.test(value[i].name) === true) {
						url = data.tracks.items[key].external_urls.spotify;
						addTrack(url);
						valid = true;
						break outerLoop;
					}
				}
			}
		}

		if (valid == false) {
			if (count != 0) {
				count = 0;
			} 
			else if (eTitle != '@&' && eTitle.length > 0) {
				url = SEARCH + `?q=${eTitle}&type=track`;
				count++;
				callApi("GET", url, null, handleTrackResponse);
			}
			
		}
	} 
	else {
		console.log(this.responseText);
		alert(this.responseText);
	}
}

function addTrack(url) {
	var parent = document.getElementById("modal");
	var link = document.createElement("a");
	link.setAttribute("href", url);
	link.setAttribute("target", "_blank");
	link.innerHTML = "Spotify";
	parent.appendChild(link);

	var logo = document.createElement("img");
	logo.setAttribute("src", "img/spotify-logo.png");
	logo.setAttribute("id", "logo");
	link.appendChild(logo);
}