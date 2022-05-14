let clicks = 0;
let fetching = 0;

function onLoad() {
	let data = sessionStorage.getItem('item');
	search(data);
}

function search(anime) {
	fetch(`https://api.jikan.moe/v4/anime?q=${anime}&limit=20`)
		.then(function(response) {
			return response.json();
		})
		.then(function(respData) {
			for (let i = 0; i < respData.data.length; i++) {
				if (respData.data[i].type !== 'Music') {
					let titles = document.createElement('H2');
					titles.setAttribute('id', respData.data[i].mal_id);
					titles.setAttribute('onclick', 'music(id); event.cancelBubble=true;');
					let title = respData.data[i].title;
					titles.innerHTML = title;
					document.getElementById('results').appendChild(titles);
				}
			}
		});
}

function music(id) {
	if (
		document.getElementById(id).children.length > 0 &&
		document.getElementById(id).children[0].style.display === 'none'
	) {
		let children = document.getElementById(id).getElementsByTagName('h3');
		for (let i = 0; i < children.length; i++) {
			children[i].removeAttribute('style');
		}
	} else if (document.getElementById(id).children.length === 0 || fetching > 0) {
		fetch(`https://api.jikan.moe/v4/anime/${id}/themes`)
			.then(function(response) {
				if (!response.ok && fetching < 5) {
					fetching++;
					music(id);
				}
				return response.json();
			})
			.then(function(respData) {
				fetching = 0;
				let opening = respData.data.openings;
				let ending = respData.data.endings;
				let all = opening.concat(ending);

				//removes the element that just consists of artists and empty songs
				let removed = [
					'No opening themes have been added to this title. Help improve our database by adding an opening theme here.',
					'No ending themes have been added to this title. Help improve our database by adding an ending theme here.'
				];
				all = all.filter((i) => !removed.includes(i) && i.indexOf('by') !== -1);

				let uniq_tracks = [];
				let track = '';
				let artist = '';

				if (all.length > 0) {
					for (item in all) {
						let song = all[item];
						
						// if the song doesn't have 'by' with spaces at start and end, this will add it
						if (!(song[song.indexOf('by') - 1] === " " && song[song.indexOf('by') + 2] === " ")) {
							p1 = song.split('by')[0].trim()
							p2 = song.split('by')[1].trim()
							song = p1 + " by " + p2
						} 

						if (song.indexOf(':') !== -1) {
							let i = song.indexOf(':') - 1;
							if (!isNaN(song[i]) || song[i] === ' ') {
								song = song.substr(song.indexOf(':') + 1);
							}

							if (song[1] === ':') {
								song = song.substr(2);
							}
						}

						// deletes quotations so that \&quot; does not appear
						song = song.split('"')[1].concat(song.split('"')[2]);

						if (song.indexOf(' ') === 0) {
							song = song.substr(song.indexOf(' ') + 1);
						}

						if (song.includes('(ep')) {
							song = song.split('(ep')[0];
						}

						if (song.includes('(TV')) {
							song = song.split('(TV')[0];
						}

						if (song.includes('(eps')) {
							song = song.split('(eps')[0];
						}

						if (song.includes(' by ')) {
							track = song.split(' by ')[0];
							artist = ' by ' + song.split(' by ')[1].trim();
						} else {
							track = song;
						}

						if (track.includes('<') && track.includes('>')) {
							track = track.replace(/\</g, '(').replace(/\>/g, ')');
						}

						// checks for balanced ()
						if (artist[artist.length - 1] == '(') {
							artist = artist.substring(0, artist.lastIndexOf('('));
						}
						if (artist.lastIndexOf('(') != -1 && artist.lastIndexOf(')') == -1) {
							artist = artist.concat(')');
						}

						if (!uniq_tracks.includes(track)) {
							let songs = document.createElement('H3');
							song = track + artist;

							if (song.length > 179) {
								song = song.substr(0, 179) + '...';
							}

							songs.innerHTML = song;
							songs.setAttribute('id', track);
							songs.setAttribute('onclick', 'displayLinks(id); event.cancelBubble=true;');
							document.getElementById(`${id}`).appendChild(songs);
							document.getElementById(id).style.border = 'none';
							uniq_tracks.push(track);
						}
					}
				} else {
					alert('Sorry...there are no OPs/EDs in this show');
				}
			});
	} else if (document.getElementById(id).children[0].style.display !== 'none') {
		document.getElementById(id).style.borderLeft = 'solid';
		document.getElementById(id).style.borderColor = '#a44a3f';
		let childs = document.getElementById(id).getElementsByTagName('h3');
		for (let i = 0; i < childs.length; i++) {
			let childSetting = childs[i].style.display;
			if (childSetting !== 'none') {
				childs[i].style.display = 'none';
			}
		}
	}
}

function displayLinks(id) {
	let parent = document.getElementById('modal');
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
	let song = document.createElement('p');
	let s = document.getElementById(id).innerHTML;
	song.innerHTML = s;
	parent.appendChild(song);
	document.getElementById('id01').style.display = 'block';
	fetchTracks(s);
}
