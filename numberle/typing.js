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
	} else if ("1234567890".includes(key)) {
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
		let number = "";
		for (let i = 1; i < letters_number + 1; i++) {
			number += document.querySelector(`.brd_row[status="active"] .letter[index="${i}"]`).textContent;
		}
		if (number.length != letters_number) {
			return;
		}
		let check = check_num(number, answer),
			i = 1;
		for (let status of check) {
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
		if (check.every((status) => status == 2)) {
			setTimeout(() => {
				show_game_over(true);
			}, 4000);
			return;
		}
		let index = parseInt(row.getAttribute("index"));
		if (index == 6) {
			setTimeout(() => {
				show_game_over(false);
			}, 4000);
			return;
		}
		row.setAttribute("status", "filled");
		let next_row = document.querySelectorAll(`.brd_row[index="${index + 1}"]`)[0];
		next_row.setAttribute("status", "active");
		set_first();
	}
	if (text == "⌫") {
		if (letter == null) {
			let target = document.querySelector(`.brd_row[status="active"] .letter[index="${letters_number}"]`);
			target.textContent = "";
			target.setAttribute("status", "active");
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
			let next = document.querySelector(`.brd_row[status="active"] .letter[index="${index + 1}"]`);
			next.setAttribute("status", "active");
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
	ans.textContent = `The correct answer was: ${answer}`;
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
