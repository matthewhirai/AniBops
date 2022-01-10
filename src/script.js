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
	fetch(`https://api.jikan.moe/v3/search/anime?status=airing&score=7&limit=12`)
		.then(function(response) {
			return response.json();
		})
		.then(function(respData) {
			for (let i = 0; i < 12; i++) {
				let titles = document.createElement('li');
				titles.setAttribute('id', respData.results[i].title);
				titles.setAttribute('onclick', 'grabSearchInput(id)');
				let title = respData.results[i].title;
				titles.innerHTML = title;
				document.getElementById('top').appendChild(titles);
			}
		});
}
