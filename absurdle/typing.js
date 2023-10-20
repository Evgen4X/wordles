var kb_buttons,
	brd_rows,
	brd_letters,
	letters_number,
	checks = [];

const game_over = document.querySelector(".go");

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
		for (let i = 1; i < letters_number + 1; i++) {
			word += document.querySelectorAll(`.brd_row[status="active"] .letter[index="${i}"]`)[0].textContent;
		}
		if (word.length != letters_number) {
			msg_alert("Enter full word!", 3000);
			return;
		}
		if (!is_word(word) && check_dict) {
			document.getElementById("error").textContent = "Enter a valid word!";
			msg_alert("Evter a valid word!", 3000);
			return;
		}
		let potential_answer = find_word(word, checks);
		if (potential_answer != "" && check_word(word, answer).toString() != [0, 0, 0, 0, 0].toString()) {
			answer = potential_answer;
		}
		let check = check_word(word, answer),
			i = 1;
		let to_push = [word];
		for (let status of check) {
			to_push.push(status);
			let letter = document.querySelectorAll(`.brd_row[status="active"] .letter[index="${i}"]`)[0];
			let button = document.querySelectorAll(`#keyboard button[letter="${letter.textContent}"`)[0];
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
		checks.push(to_push);

		if (check.every((status) => status == 2)) {
			setTimeout(() => {
				show_game_over(true);
			}, 2000);
			return;
		}
		let index = parseInt(row.getAttribute("index"));
		if (index == 8) {
			setTimeout(() => {
				show_game_over(false);
			}, 2000);
			return;
		}
		row.setAttribute("status", "filled");
		let next_row = document.querySelectorAll(`.brd_row[index="${index + 1}"]`)[0];
		next_row.setAttribute("status", "active");
		set_first();
	} else if (text == "⌫") {
		if (letter == null) {
			let target = document.querySelectorAll(`.brd_row[status="active"] .letter[index="${letters_number}"]`);
			target[0].textContent = "";
			target[0].setAttribute("status", "active");
			return;
		}
		let index = parseInt(letter.getAttribute("index"));
		let target = document.querySelectorAll(`.brd_row[status="active"] .letter[index="${index - 1}"]`)[0];
		target.textContent = "";
		target.setAttribute("status", "active");
		letter.setAttribute("status", "none");
	} else {
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
	let title = document.querySelector(".absolute .title"),
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
	button.addEventListener("click", buttonType);
	button.setAttribute("letter", button.textContent.toString());
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
