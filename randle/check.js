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
		if (result[i] != 2) {
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

function check_word_reversed(word, answer) {
	const result = [];

	// First pass: check for letters in the correct position
	for (let i = 0; i < word.length; i++) {
		if (word[i] === answer[i]) {
			result[i] = 2;
		}
	}
	// Second pass: check for blues
	for (let i = 0; i < word.length; i++) {
		if (result[i] !== 2) {
			const index = word.indexOf(answer[i]);
			if (index != -1) {
				result[i] = 3;
			} else {
				result[i] = 0;
			}
		}
	}
	return result;
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
	url.searchParams.set("length", text.length);
	let link = document.getElementById("link");
	link.setAttribute("href", url);
	link.textContent = "Link is here";
	return;
}

function check_word_alphabetical(word, answer) {
	const result = [];
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	// First pass: check for letters in the correct position
	for (let i = 0; i < word.length; i++) {
		if (word[i] === answer[i]) {
			result[i] = 2;
		}
	}
	// Second pass: check for incorrect letters
	for (let i = 0; i < word.length; i++) {
		if (result[i] === 2) {
			continue;
		}
		if (alphabet.indexOf(word[i]) > alphabet.indexOf(answer[i])) {
			result[i] = 4;
		} else {
			result[i] = 5;
		}
	}
	return result;
}

function set_first() {
	document.querySelectorAll('.brd_row[status="active"] .letter[index="1"]')[0].setAttribute("status", "active");
}

function msg_alert(msg, time) {
	let msgbox = document.querySelector("#alert"),
		spanbox = document.querySelector("#alert #alert-span");
	spanbox.textContent = msg;
	msgbox.animate([{top: "-12%"}, {top: "0"}], {duration: 1000, fill: "forwards", easing: "cubic-bezier(0, 1, 0.4, 1)"});
	setTimeout(() => {
		msgbox.animate([{top: "0"}, {top: "-12%"}], {duration: 1000, fill: "forwards", easing: "cubic-bezier(0, 1, 0.5, 1)"});
	}, time);
}

function new_game() {
	let url = new URL(window.location.href);
	url.searchParams.delete("word");
	window.location.href = url;
}

function has_repeated(text) {
	for (let i = 0; i < text.length; i++) {
		if (text.indexOf(text[i], i + 1) != -1) {
			return true;
		}
	}
	return false;
}

function show_settings() {
	document.querySelector(".settings").style.display = "flex";
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
