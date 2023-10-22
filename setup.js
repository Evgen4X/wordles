function is_word(word) {
	return answers.includes(word);
}

function check_word(word, answer) {
	const result = [];
	const remainingLetters = answer.split("");

	// First pass: check for letters in the correct position
	for (let i = 0; i < word.length; i++) {
		if (word[i] === answer[i]) {
			result[i] = 2;
			remainingLetters[i] = null; // Mark the letter as used
		}
	}

	// Second pass: check for letters in the wrong position
	for (let i = 0; i < word.length; i++) {
		if (result[i] !== 2) {
			const letterIndex = remainingLetters.indexOf(word[i]);
			if (letterIndex !== -1) {
				result[i] = 1;
				remainingLetters[letterIndex] = null; // Mark the letter as used
			} else {
				result[i] = 0;
			}
		}
	}

	return result;
}

function set_first() {
	document.querySelectorAll('.brd_row[status="active"] .letter[index="1"]')[0].setAttribute("status", "active");
}

function new_game() {
	let url = new URL(window.location.href);
	url.searchParams.delete("word");
	window.location.href = url;
}

function get_link() {
	let text = document.getElementById("link_input").value.toUpperCase();
	if (text.length < 3 || text.length > 15) {
		msg_alert("The word must be from 3 to 15 letters long!", 3000);
		return;
	}
	for (let i of text) {
		if (!"QAZWSXEDCRFVTGBYHNUJMIKOLP".includes(i)) {
			msg_alert("Invalid word!", 3000);
			return;
		}
	}
	let url = new URL(window.location.href);
	url.searchParams.set("word", encode(text));
	let link = document.getElementById("link");
	link.setAttribute("href", url);
	link.textContent = "Link is here";
	return;
}

function show_custom() {
	document.querySelector(".custom").style.display = "flex";
}

function close_all() {
	document.querySelectorAll(".absolute").forEach((el) => {
		el.style.display = "none";
	});
}

function show_how_to() {
	document.querySelector(".how_to").style.display = "flex";
}

show_how_to();
