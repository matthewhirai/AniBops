function setSearchValue() {
	let b = document.getElementById('search').value;
	sessionStorage.setItem('item', b);
}

function grabSearchInput(id) {
	let title = document.getElementById(id).innerHTML;
	document.getElementById('search').value = title;
}

function myFunction(id) {
	document.getElementById(id).classList.toggle('show');
}

function topAnime() {
	let seasons = { 'Jan Feb Mar': 'winter', 'Apr Jun': 'spring', 'Jul Aug Sep': 'summer', 'Oct Nov Dec': 'fall' };
	let today = new Date().toString();
	let keys = Object.keys(seasons);
	const match = keys.find((element) => {
		if (element.includes(today.substring(4, 7))) {
			return true;
		}
	});

	fetch(`https://api.jikan.moe/v4/seasons/2022/${seasons[match]}?limit=12`)
		.then(function(response) {
			return response.json();
		})
		.then(function(respData) {
			for (let i = 0; i < 12; i++) {
				let titles = document.createElement('li');
				titles.setAttribute('id', respData.data[i].title);
				titles.setAttribute('onclick', 'grabSearchInput(id)');
				let title = respData.data[i].title;
				titles.innerHTML = title;
				document.getElementById('top').appendChild(titles);
			}
		});
}
