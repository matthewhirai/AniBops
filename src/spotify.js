let originalTitle = '@&';
let englishTitle = '@&';
let originalArtist = '@&';
let englishArtist = '@&';
let translationTitle = '@&';
let translationArtist = '@&';
let count = 0;

const japanese = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
const TOKEN = 'https://accounts.spotify.com/api/token';
const access_token = sessionStorage.getItem('token');
const SEARCH = 'https://api.spotify.com/v1/search';

function fetchTracks(song) {
	const regExp = /\(([^)]+)\)/;
	song = song.trim().replace('’', "'");
	let title = song.split(' by ')[0];
	let artist = song.split(' by ')[1];

	[title, artist] = deleteFromSong(title, artist, song);

	originalTitle = title;
	originalArtist = artist;

	if (title.includes('(')) {
		let translation = regExp.exec(title);
		// Checks if str inside () is japanese
		if (japanese.test(translation[1]) === true) {
			title = translation[1];
			translationTitle = title;
		}
		englishTitle = originalTitle.substring(0, originalTitle.indexOf(translation[0])).trim();
	}

	if (title.includes('#')) {
		title = title.replace('#', '');
	}

	// Check if there is an ou in the title and remove it
	if (originalTitle.includes('ou')) {
		if (originalTitle.includes('(')) {
			englishTitle = originalTitle.split(' (')[0];
		} else {
			let substringOU = originalTitle.split(' ').find((a) => a.includes('ou'));
			fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${substringOU}`)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					if (!data.message) {
						title = title.replace('ou', 'o'); // if there is no translation then set the title to new originalTitle w/o 'ou'
					}
				});
		}
	}

	// remove feat from title
	if (title.includes('feat.')) {
		title = title.substring(0, title.indexOf('feat.'));
		originalTitle = title;
		translationTitle = title;
	}

	if (artist.includes('(')) {
		let translation = regExp.exec(artist);
		if (japanese.test(translation[1]) == true) {
			translationArtist = translation[1];
		}
		// if there's a CV:
		if (translationArtist.includes(': ')) {
			translationArtist = translationArtist.split(': ')[1];
		}
		englishArtist = originalArtist.substring(0, originalArtist.indexOf(translation[0])).trim();
	}

	if (title.length > 0 && artist.length > 0) {
		url = SEARCH + `?q=${title}&type=track&market=JP&limit=50`;
		callApi('GET', url, null, handleTrackResponse);
	}
}

function callApi(method, url, body, callback) {
	let xhr = new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
	xhr.send(body);
	xhr.onload = callback;
}

function handleTrackResponse() {
	if (this.status == 200) {
		let data = JSON.parse(this.responseText);
		let valid = false;
		let url = '';
		let artistsWithoutUU = '@&';
		let artistsWithoutOU = '@&';
		let dict = {}; //all artists with track title

		//title
		for (let i = 0; i < data.tracks.items.length; i++) {
			if ((data.tracks.items[i].name.toLowerCase().includes(originalTitle.toLowerCase()) ||
					data.tracks.items[i].name.toLowerCase().includes(englishTitle.toLowerCase()) ||
					data.tracks.items[i].name.includes(translationTitle.substring(0, 2))) &&
				!data.tracks.items[i].name.toLowerCase().includes('tv size')
			) {
				dict[i] = data.tracks.items[i].artists;
			}
		}

		if (originalArtist.includes('uu')) {
			let index = originalArtist.indexOf('uu');
			artistsWithoutUU = originalArtist.slice(0, index) + originalArtist.slice(index + 1);
		}

		if (originalArtist.includes('ou')) {
			let index = originalArtist.indexOf('ou');
			artistsWithoutOU = originalArtist.slice(0, index) + originalArtist.slice(index + 1);
		}

		//artist
		outerLoop: for (const [key, value] of Object.entries(dict)) {
			for (let i = 0; i < value.length; i++) {
				let spotifyName = value[i].name.toLowerCase();
				if (spotifyName.includes(originalArtist.toLowerCase()) || originalArtist.toLowerCase().includes(spotifyName) ||
					spotifyName.includes(translationArtist.toLowerCase()) || translationArtist.toLowerCase().includes(spotifyName) ||
					spotifyName.includes(englishArtist.toLowerCase()) || englishArtist.toLowerCase().includes(spotifyName) ||
					spotifyName.includes(artistsWithoutUU.toLowerCase()) || artistsWithoutUU.toLowerCase().includes(spotifyName) ||
					spotifyName.includes(artistsWithoutOU.toLowerCase()) || artistsWithoutOU.toLowerCase().includes(spotifyName)
				) {
					url = data.tracks.items[key].external_urls.spotify;
					addTrack(url);
					valid = true;
					break outerLoop;
				} else if (translationArtist.length > 0) {
					// Check if there is a japanese translation
					if ( japanese.test(translationArtist) === true && translationArtist.includes(value[i].name) 
						&& japanese.test(value[i].name) === true
					) {
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
			} else if (englishTitle != '@&' && englishTitle.length > 0) {
				url = SEARCH + `?q=${englishTitle}&type=track&limit=50`;
				count++;
				callApi('GET', url, null, handleTrackResponse);
			}
		}
	} else {
		alert(this.responseText);
	}
}

function addTrack(url) {
	let parent = document.getElementById('modal');
	let link = document.createElement('a');
	link.setAttribute('href', url);
	link.setAttribute('target', '_blank');
	link.innerHTML = 'Spotify';
	parent.appendChild(link);

	let logo = document.createElement('img');
	logo.setAttribute('src', 'img/spotify-logo.png');
	logo.setAttribute('id', 'logo');
	link.appendChild(logo);
}
