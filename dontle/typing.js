const checked_letters = {
	letter_list: [],
	status_list: [],
};

const game_over = document.querySelector(".go");

var undos_used = 0;
var undos = [];

function set_undos() {
	let html = '<div class="board">';
	for (let i = 0; i < undos.length; i++) {
		let word = '<div class="brd_row">';
		for (let j = 0; j < undos[i][0].length; j++) {
			let color;
			if (undos[i][1][j] == 0) {
				color = "#545454";
			} else if (undos[i][1][j] == 1) {
				color = "#f3c237";
			} else {
				color = "#79b851";
			}
			let letter = `<div class="letter" style="background-color: ${color}">${undos[i][0][j]}</div>`;
			word += letter;
		}
		html += `${word}</div>`;
	}
	document.querySelector("#undos_table").innerHTML = html;
}

function undo() {
	var index = parseInt(document.querySelector('.brd_row[status="active"]').getAttribute("index"));
	if (index == 1) {
		return;
	}
	let word = "";
	index--;
	for (let i = 1; i < letters_number + 1; i++) {
		let letter = document.querySelector(`.brd_row[index="${index}"] .letter[index="${i}"]`);
		word += letter.textContent;
		let key = document.querySelector(`.kb_row .kb_key[letter="${letter.textContent}"]`);
		key.style.setProperty("--color", "#888");
		key.style.animation = "to_color 0s linear 0s 1 normal forwards";
		if (i == 1) {
			letter.setAttribute("status", "active");
		}
		letter.textContent = "";
		letter.style.setProperty("--color", "#888");
		letter.style.animation = "to_color 0s linear 0s 1 normal forwards";
	}
	document.querySelector('.brd_row[status="active"] .letter[status="active"]').setAttribute("status", null);
	document.querySelector('.brd_row[status="active"]').setAttribute("status", null);
	document.querySelector(`.brd_row[index="${index}"]`).setAttribute("status", "active");
	undos.push([word, check_word(word, answer)]);
	undos_used++;
	let undos_counter = document.getElementById("undos_counter");
	undos_counter.textContent = `Undos used: ${undos_used} / 5`;
	if (undos_used == 5) {
		undos_counter.style.color = "#f00";
		document.querySelector('.kb_row button[id="undo_btn"]').disabled = true;
	}
}

function buttonType(event) {
	const sender = event.target;
	const text = sender.textContent;
	typeLetter(text);
}

function keyType(event) {
	const key = event.key;
	if (key == "Backspace") {
		typeLetter("⌫");
		return;
	} else if ("qazwsxedcrfvtgbyhnujmikolp".includes(key)) {
		typeLetter(key.toUpperCase());
		return;
	} else if (key == "Enter") {
		typeLetter("Enter");
	}
}

function typeLetter(text) {
	const row = document.querySelector('.brd_row[status="active"]');
	const letter = document.querySelector('.letter[status="active"]');

	if (text == "Enter") {
		let word = "";
		for (let i = 1; i < letters_number + 1; i++) {
			word += document.querySelector(`.brd_row[status="active"] .letter[index="${i}"]`).textContent;
		}
		if (word.length != letter_number) {
			msg_alert("Enter full word!", 3000);
			return;
		}
		if (!is_word(word) && check_dict) {
			msg_alert("Evter a valid word!", 3000);
			return;
		}
		console.log(checked_letters);
		for (let i = 0; i < letters_number; i++) {
			let current_letter = word[i].toUpperCase();
			console.log("DEBUGGING: ", current_letter, word);
			if (checked_letters["letter_list"].includes(current_letter)) {
				if (answer.indexOf(current_letter) == -1) {
					msg_alert(`"${current_letter}" has been already checked`, 2000);
					return;
				}
				let index = i;
				if (checked_letters["status_list"][index] == 1 && word[index] == index) {
					msg_alert(`"${current_letter}" cannot be in the spot #${index + 1}`, 2000);
					return;
				}
			}
		}
		let check = check_word(word, answer),
			i = 1;
		word.split("").forEach((letter, index) => {
			checked_letters["letter_list"].push(letter);
			checked_letters["status_list"].push(check[index]);
		});
		for (let status of check) {
			let letter = document.querySelector(`.brd_row[status="active"] .letter[index="${i}"]`);
			let button = document.querySelector(`#keyboard button[letter="${letter.textContent}"`);
			let prev_color = button.style.getPropertyValue("--color");
			if (status == 0) {
				letter.style.setProperty("--color", "#545454");
				if (prev_color != "#79b851" && prev_color != "#f3c237") {
					button.style.setProperty("--color", "#545454");
				}
			} else if (status == 1) {
				letter.style.setProperty("--color", "#f3c237");
				if (prev_color != "#79b851") {
					button.style.setProperty("--color", "#f3c237");
				}
			} else {
				letter.style.setProperty("--color", "#79b851");
				button.style.setProperty("--color", "#79b851");
			}
			letter.style.animation = `to_color 0.8s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
			button.style.animation = `to_color 0s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
			i++;
		}
		if (check.every((status) => status == 2)) {
			setTimeout(() => {
				show_game_over(false);
			}, 2000);
			return;
		}
		let index = parseInt(row.getAttribute("index"));
		if (index == letter_number + 1) {
			setTimeout(() => {
				show_game_over(true);
			}, 2000);
			return;
		}
		row.setAttribute("status", "filled");
		let next_row = document.querySelector(`.brd_row[index="${index + 1}"]`);
		next_row.setAttribute("status", "active");
		set_first();
	} else if (text == "⌫") {
		if (letter == null || letter == undefined) {
			let target = document.querySelector(`.brd_row[status="active"] .letter[index="${letters_number}"]`);
			target.textContent = "";
			target.setAttribute("status", "active");
			return;
		}
		let index = parseInt(letter.getAttribute("index"));
		let target = document.querySelector(`.brd_row[status="active"] .letter[index="${index - 1}"]`);
		target.textContent = "";
		target.setAttribute("status", "active");
		letter.setAttribute("status", "none");
	} else {
		letter.textContent = text;
		letter.setAttribute("status", "filled");
		if (letter.getAttribute("index") != letters_number) {
			let index = parseInt(letter.getAttribute("index"));
			let next = document.querySelector(`.brd_row[status="active"] .letter[index="${index + 1}"]`);
			next.setAttribute("status", "active");
		}
	}
}

function show_game_over(win) {
	let title = document.querySelector(".go .title"),
		ans = document.querySelector(".absolute .go_answer");
	if (win) {
		title.textContent = "You won!";
	} else {
		title.textContent = "You lost!";
	}
	ans.textContent = `The correct answer was: ${answer.toLowerCase()}`;
	game_over.style.display = "flex";
}

kb_buttons.forEach((button) => {
	if (!button.classList.contains("NAL")) {
		//NAL - Not A Letter
		button.addEventListener("click", buttonType);
		button.setAttribute("letter", button.textContent.toString());
	}
});
document.addEventListener("keyup", keyType);

// setting amount of letters
const letters_slider = document.querySelectorAll(".amount_of_letters");
letters_slider.forEach((button) => {
	button.addEventListener("click", () => {
		let url = new URL(window.location.href);
		url.search = "";
		url.searchParams.set("length", button.textContent);
		window.location.href = url;
	});
});
