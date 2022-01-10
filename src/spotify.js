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

	if (title.includes('&nbsp;')) {
		title = title.replace('&nbsp;', '');
	}

	if (artist.includes('&nbsp;')) {
		artist = artist.replace('&nbsp;', '');
	}

	if (artist.includes('feat.')) {
		artist = artist.substring(0, artist.indexOf('feat.'));
		artist = artist.trim();
	}

	if (artist.includes('uu')) {
		let index = artist.indexOf('uu');
		artist = artist.slice(0, index) + artist.slice(index + 1);
	}

	// Adachi to Shimamura
	if (title.includes('Kimi no Tonari de')) {
		title = 'Kimi no Tonaride (キミのとなりで)';
	}

	if (title.includes('Kimi ni Aeta Hi (君に会えた日)')) {
		title = 'Kimi ni Aetahi';
		artist = 'Adachi(CV:Akari Kito)';
	}

	// Tonikaku Kawaii
	if (title.includes('Koi no')) {
		title = 'Koino Uta';
	}

	// Anohana
	if (title.includes('secret base ~Kimi ga Kureta Mono~ (10 years after ver.)')) {
		title = 'secret base ~君がくれたもの~ (10 years after Ver.)';
		artist = '本間芽衣子 (CV.茅野愛衣)';
	}

	// Code Geass R2
	if (title.includes('Shiawase Neiro (ｼｱﾜｾﾈｲﾛ)')) {
		title = 'Shiawase Neiro (シアワセネイロ)';
	}

	if (title.includes('02~O-Two~ (02~ｵｰ･ﾂｰ~)')) {
		title = 'O2';
	}

	// Vivy: Fluorite Eye's Song
	if (artist.includes('Vivy')) {
		artist = 'ヴィヴィ(Vo.八木海莉)';
	}

	if (artist.includes('Estella')) {
		artist = 'エステラ(Vo.六花)';
	}

	if (song == 'Galaxy Anthem by Vivy (Kairi Yagi)') {
		artist = 'ディーヴァ(Vo.八木海莉)';
	}

	if (title == "Flourite Eye's Song") {
		title = "Fluorite Eye's Song";
	}

	// Love is War S1/S2
	if (title == 'Chikatto Chika Chika♡ (チカっとチカ千花っ♡)') {
		title = 'Chikatto Chika Chika';
		artist = 'Konomi Kohara';
	}

	if (artist == 'Haruka Fukuhara') {
		artist = '福原 遥';
	}

	// AOT S3
	if (title.includes('Akatsuki no Chinkonka')) {
		title = 'Akatsuki no Requiem (暁の鎮魂歌)';
	}

	// Houkago Teibou Nisshi
	if (artist.includes('Umino High School Teibou-bu')) {
		artist = '海野高校ていぼう部:鶴木陽渚(CV:高尾奏音), 帆高夏海(CV:川井田夏海),黒岩悠希(CV:篠原侑),大野真(CV:明坂聡美)';
	}

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

	// Check if there is an ou in the title and set the english title to that
	if (originalTitle.includes('ou') && !originalTitle.includes('Shoukei to Shikabane no Michi')) {
		originalTitle = originalTitle.replace('ou', 'o');
		if (originalTitle.includes('(')) {
			englishTitle = originalTitle.split(' (')[0];
		} else {
			title = originalTitle; // if there is no translation then set the title to new originalTitle w/o 'ou'
		}
	}

	if (originalArtist.includes('ou')) {
		originalArtist = originalArtist.replace('ou', 'o');
		artist = originalArtist;
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
		url = SEARCH + `?q=${title}&type=track&market=JP`;
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
		let dict = {}; //all artists with track title

		//Vivy
		if (originalTitle == 'Happy Together' && originalArtist == 'General-Purpose Diva AI (Miya Kotsuki)') {
			addTrack('https://open.spotify.com/track/0q3Y33IbDD19oXx5qwHCxR');
			valid = true;
		}

		//title
		for (let i = 0; i < data.tracks.items.length; i++) {
			if (
				(data.tracks.items[i].name.toLowerCase().includes(originalTitle.toLowerCase()) ||
					data.tracks.items[i].name.toLowerCase().includes(englishTitle.toLowerCase()) ||
					data.tracks.items[i].name.includes(translationTitle.substring(0, 2))) &&
				!data.tracks.items[i].name.toLowerCase().includes('tv size')
			) {
				dict[i] = data.tracks.items[i].artists;
			}
		}

		//artist
		outerLoop: for (const [key, value] of Object.entries(dict)) {
			for (let i = 0; i < value.length; i++) {
				if (
					value[i].name.toLowerCase().includes(originalArtist.toLowerCase()) ||
					value[i].name.toLowerCase().includes(translationArtist.toLowerCase()) ||
					value[i].name.toLowerCase().includes(englishArtist.toLowerCase())
				) {
					url = data.tracks.items[key].external_urls.spotify;
					addTrack(url);
					valid = true;
					break outerLoop;
				} else if (translationArtist.length > 0) {
					// Check if there is a japanese translation
					if (
						japanese.test(translationArtist) === true &&
						translationArtist.includes(value[i].name) &&
						japanese.test(value[i].name) === true
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
				url = SEARCH + `?q=${englishTitle}&type=track`;
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
