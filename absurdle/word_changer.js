/*
To find the "best" word for changing, use that criteria:
- amount of yellows (the least, the better)
|
--- anount of greens (the least, the better)

If there're many words with the same amount of yellows/greens, choose a random one
*/

function count_yellows(word, target) {
	let res = check_word(word, target),
		ans = 0;
	res.forEach((status) => {
		if (status == 1) {
			ans++;
		}
	});
	return ans;
}

function count_greens(word, target) {
	let ans = 0;
	for (let i = 0; i < word.length; i++) {
		if (target[i] == word[i]) {
			ans++;
		}
	}
	return ans;
}

function find_word(answer, checks) {
	let best_word = "",
		best_word_yellows = 6,
		best_word_greens = 6;
	var all_words = answers;
	for (let i = 0; i < all_words.length; i++) {
		const word = all_words[i];
		let flag = false;
		for (let check of checks) {
			for (let i = 1; i < check.length; i++) {
				let status = check[i],
					letter = check[0][i - 1];
				if (status == 0 && word.indexOf(letter) != -1) {
					flag = true;
					break;
				} else if (status == 1) {
					let index = word.indexOf(letter);
					if (index == -1 || index == i - 1) {
						flag = true;
						break;
					}
				} else if (status == 2 && word.indexOf(letter) != i - 1) {
					flag = true;
					break;
				}
			}
			if (flag) {
				break;
			}
		}
		if (flag) {
			continue;
		}

		let yellows = count_yellows(answer, word);
		if (yellows < best_word_yellows) {
			best_word = word;
			best_word_yellows = yellows;
			best_word_greens = count_greens(answer, word);
			continue;
		}
		//yellows are the same OR higher
		let greens = count_greens(answer, word);
		if (greens > best_word_greens) {
			continue;
		}
		if (greens < best_word_greens) {
			best_word = word;
			best_word_yellows = yellows;
			best_word_greens = greens;
			continue;
		}
		if (greens == best_word_greens && Math.random() < 0.4) {
			best_word = word;
			best_word_yellows = yellows;
		}
		//if both yellows and green equal, then do nothing
	}

	return best_word;
}
