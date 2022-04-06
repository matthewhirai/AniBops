function deleteFromSong(title, artist, song) {
	if (title.includes('&nbsp;')) {
		title = title.replace('&nbsp;', '');
	}

	if (artist.includes('&nbsp;')) {
		artist = artist.replace('&nbsp;', '');
	}

	if (artist.includes('&amp;')) {
		artist = artist.replace('&amp;', '&');
	}

	if (artist.includes('feat.')) {
		artist = artist.substring(0, artist.indexOf('feat.'));
		artist = artist.trim();
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
	if (title == 'Koi no Uta') {
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
	if (song == 'Galaxy Anthem by Vivy (Kairi Yagi)') {
		artist = 'ディーヴァ(Vo.八木海莉)';
	}

	if (title == "Flourite Eye's Song") {
		title = "Fluorite Eye's Song";
	}

	if (artist.includes('Vivy')) {
		artist = 'ヴィヴィ(Vo.八木海莉)';
	}

	if (artist.includes('Estella')) {
		artist = 'エステラ(Vo.六花)';
	}

	if (artist == 'General-Purpose Diva AI (Miya Kotsuki)') {
		artist = '汎用型歌姫AI(Vo.コツキミヤ)';
	}

	// Love is War S1/S2
	if (title == 'Chikatto Chika Chika♡ (チカっとチカ千花っ♡)') {
		title = 'Chikatto Chika Chika';
		artist = 'Konomi Kohara';
	}

	if (artist == 'Haruka Fukuhara') {
		artist = '福原 遥';
	}

	// AOT
	if (song == 'Call your name by Gemie') {
		artist = 'Hiroyuki Sawano';
	}

	if (title.includes('Akatsuki no Chinkonka')) {
		title = 'Akatsuki no Requiem (暁の鎮魂歌)';
	}

	// Houkago Teibou Nisshi
	if (artist.includes('Umino High School Teibou-bu')) {
		artist = '海野高校ていぼう部:鶴木陽渚(CV:高尾奏音), 帆高夏海(CV:川井田夏海),黒岩悠希(CV:篠原侑),大野真(CV:明坂聡美)';
	}

	// The End Girl Trip
	if (artist.includes('Chito (Inori Minase) & Yuri (Yurika Kubo)')) {
		artist = 'チト(CV:水瀬いのり) & ユーリ(CV:久保ユリカ)';
	}

	// Yuruyuri
	if (artist.includes('Nanamori Chu☆')) {
		artist = 'Nanamori-Chu☆Goraku-Bu';
	}

	if (artist.includes('Yui Funami (Minami Tsuda) & Chinatsu Yoshikawa (Rumi Ookubo)')) {
		artist = '結衣(CV:津田美波) & "ちなつ(CV:大久保瑠美)"';
	}

	// Oregairu
	if (artist === 'Nagi Yanagi') {
		artist = '"yanaginagi"';
	}

	if (artist.includes('Yukino Yukinoshita (Saori Hayami)')) {
		artist = '雪ノ下雪乃(CV.早見沙織)';
	}

	if (artist.includes('Yui Yuigahama (Nao Touyama)')) {
		artist = '由比ヶ浜結衣(CV.東山奈央)';
	}

	// Takagi-san
	if (song == 'Zero Centimeter by Yuiko Oohara') {
		title = 'ゼロセンチメートル ';
	}

	if (title.includes('(奏（かなで）)')) {
		title = title.replace('(奏（かなで）)', '"奏(かなで)"');
	}

	if (artist == 'Yuiko Oohara') {
		artist = '大原ゆい子';
	}

	if (artist.includes('Takagi-san')) {
		artist = '高木さん(CV:高橋李依)';
	}

	// The Promised Neverland
	if (title == 'Zettai Zetsumei (絶対絶命)') {
		title = 'Zettai Zetsumei (絶体絶命)';
	}

	if (song == 'Identity by Kiiro Akiyama (秋山黄色)') {
		title = 'アイデンティティ'
		artist = 'Kiro Akiyama (秋山黄色)'
	}

	if (artist.toLowerCase() == 'cö shu nie') {
		artist = 'Cö Shu Nie';
	}

	// Vanitas no Carte
	if (artist == 'Mononkul') {
		artist = 'Mononkvl';
	}

	// Sabage-bu!
	if (artist == 'Ayaka Ohashi') {
		artist = '大橋彩香'
	}

	// Nana
	if (artist == "Anna inspi' Nana ~Black Stones~") {
		artist = "ANNA TSUCHIYA inspi' NANA(BLACK STONES)"
		if (title == 'Kuroi Namida') {
			title = '黒い涙'
		}
	}

	return [title, artist];
}
