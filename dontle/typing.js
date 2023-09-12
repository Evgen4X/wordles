var kb_buttons,
	brd_rows,
	brd_letters,
	letters_number,
	checked_letters = [];

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
	document.getElementById("error").textContent = "";

	if (text == "Enter") {
		let word = "";
		for (let i = 1; i < 6; i++) {
			word += document.querySelectorAll(`.brd_row[status="active"] .letter[index="${i}"]`)[0].textContent;
		}
		if (word.length != 5) {
			msg_alert("Enter full word!", 3000);
			return;
		}
		if (!is_word(word) && check_dict) {
			document.getElementById("error").textContent = "Enter a valid word!";
			msg_alert("Evter a valid word!", 3000);
			return;
		}
		let check = check_word(word, answer),
			i = 1;
		word.split().forEach((letter, index) => {
			checked_letters.push((letter, check[index]));
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
		if (index == 6) {
			setTimeout(() => {
				show_game_over(true);
			}, 2000);
			return;
		}
		row.setAttribute("status", "filled");
		let next_row = document.querySelectorAll(`.brd_row[index="${index + 1}"]`)[0];
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
		if (checked_letters.includes(text)) {
			if (answer.indexOf(text) == -1) {
				msg_alert(`"${text}" has been already checked`);
				return;
			}
			let index = letter.getAttribute("index") - 1;
			if (checked_letters[index] == 1 && answer.indexOf(text) == index) {
				msg_alert(`"${text}" cannot be in the spot #${index + 1}`);
				return;
			}
		}
		letter.textContent = text;
		letter.setAttribute("status", "filled");
		if (letter.getAttribute("index") != letters_number) {
			let index = parseInt(letter.getAttribute("index"));
			let next = document.querySelectorAll(`.brd_row[status="active"] .letter[index="${index + 1}"]`);
			next[0].setAttribute("status", "active");
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
		url.searchParams.set("length", button.textContent);
		window.location.href = url;
	});
});
