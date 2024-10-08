var kb_buttons, brd_rows, brd_letters, letters_number;

const game_over = document.querySelector(".go");

function buttonType(event) {
	const sender = event.target;
	const text = sender.innerHTML;
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
			word += document.querySelectorAll(`.brd_row[status="active"] .letter[index="${i}"]`)[0].innerHTML;
		}
		if (word.length != letters_number) {
			return;
		}
		if (!is_word(word) && check_dict) {
			msg_alert("Enter a valid word!", 3000);
			return;
		}
		let check = check_word(word, answer);
		let check_reversed = check_word_reversed(word, answer);
		let check_alphabetical = check_word_alphabetical(word, answer);
		for (let i = 0; i < letters_number; i++) {
			let letter = document.querySelector(`.brd_row[status="active"] .letter[index="${i + 1}"]`);
			let button = document.querySelector(`#keyboard button[letter="${letter.innerHTML}"`);
			let event = letter.getAttribute("event");
			if (event == "lier" && Math.random() < 0.5) {
				let rnd_color = ["#545454", "#f3c237", "#79b851"][Math.floor(Math.random() * 3)];
				letter.style.setProperty("--color", rnd_color);
			} else {
				let status;
				if (event == "reverse") {
					status = check_reversed[i];
				} else if (event == "alphabetical") {
					status = check_alphabetical[i];
				} else {
					status = check[i];
				}

				if (status == 0) {
					if (event != "greens") {
						letter.style.setProperty("--color", "#545454");
						button.style.setProperty("--color", "#545454");
						if (event == "random") {
							letter.style.setProperty("--color", rgreen);
							button.style.setProperty("--color", rgreen);
						}
					} else {
						letter.style.animation = `rotate 0.8s linear ${i * 200 + "ms"} 1 normal forwards`;
						continue;
					}
				} else if (status == 1) {
					if (event != "greens" && letter.getAttribute("event") != "blind") {
						letter.style.setProperty("--color", "#f3c237");
						button.style.setProperty("--color", "#f3c237");
						if (event == "random") {
							letter.style.setProperty("--color", ryellow);
							button.style.setProperty("--color", ryellow);
						}
						if (event == "5050") {
							letter.style.animation = `rotate 0.8s linear ${i * 200 + "ms"} 1 normal forwards`;
							setTimeout(() => {
								letter.style.backgroundImage = "linear-gradient(135deg, rgba(121, 184, 81, 1) 0%, rgba(121, 184, 81, 1) 49%, rgba(243, 194, 55, 1) 50%, rgba(243, 194, 55, 1) 100%)";
								button.style.backgroundImage = "linear-gradient(135deg, rgba(121, 184, 81, 1) 0%, rgba(121, 184, 81, 1) 49%, rgba(243, 194, 55, 1) 50%, rgba(243, 194, 55, 1) 100%)";
							}, i * 200 + 400);
							continue;
						}
					} else {
						letter.style.animation = `rotate 0.8s linear ${i * 200 + "ms"} 1 normal forwards`;
						continue;
					}
				} else if (status == 2) {
					letter.style.setProperty("--color", "#79b851");
					button.style.setProperty("--color", "#79b851");
					if (event == "random") {
						letter.style.setProperty("--color", rgray);
						button.style.setProperty("--color", rgray);
					}
					if (event == "5050") {
						letter.style.animation = `rotate 0.8s linear ${i * 200 + "ms"} 1 normal forwards`;
						setTimeout(() => {
							letter.style.backgroundImage = "linear-gradient(135deg, rgba(121, 184, 81, 1) 0%, rgba(121, 184, 81, 1) 49%, rgba(243, 194, 55, 1) 50%, rgba(243, 194, 55, 1) 100%)";
							button.style.backgroundImage = "linear-gradient(135deg, rgba(121, 184, 81, 1) 0%, rgba(121, 184, 81, 1) 49%, rgba(243, 194, 55, 1) 50%, rgba(243, 194, 55, 1) 100%)";
						}, i * 200 + 400);
						continue;
					}
				} else if (status == 3) {
					letter.style.setProperty("--color", "#2c2cdf");
					button.style.setProperty("--color", "#2c2cdf");
				} else if (status == 4) {
					letter.style.setProperty("--color", "#ffaa00"); //orange, earlier
					button.style.setProperty("--color", "#ffaa00");
					letter.style.borderRadius = "0 0 0.5em 0.5em";
				} else if (status == 5) {
					letter.style.setProperty("--color", "#b700ff");
					button.style.setProperty("--color", "#b700ff");
					letter.style.borderRadius = "0.5em 0.5em 0 0";
				}
			}
			letter.style.animation = `to_color 0.8s linear ${i * 200 + "ms"} 1 normal forwards`;
			if (event != "lier") {
				button.style.animation = `to_color 0s linear ${i * 200 + "ms"} 1 normal forwards`;
			}
		}
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
			let target = document.querySelector(`.brd_row[status="active"] .letter[index="${letters_number}"]`);
			target.innerHTML = "";
			target.setAttribute("status", "active");
			return;
		}
		let index = parseInt(letter.getAttribute("index"));
		let target = document.querySelector(`.brd_row[status="active"] .letter[index="${index - 1}"]`);
		target.innerHTML = "";
		target.setAttribute("status", "active");
		letter.setAttribute("status", "none");
	} else {
		if (event == "deny" && denied.includes(text)) {
			return;
		}
		letter.innerHTML = text;
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
		title.innerHTML = "You won!";
	} else {
		title.innerHTML = "You lost!";
	}
	ans.innerHTML = `The correct answer was: ${answer.toLowerCase()}`;
	game_over.style.display = "flex";
}

//random colors
const hue = Math.floor(Math.random() * 100 + 100),
	saturation = Math.floor(Math.random() * 40 + 60),
	lightness = Math.floor(Math.random() * 30);
const rgreen = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
const ryellow = `hsl(${hue + Math.floor(Math.random() * 200 - 100)}, ${saturation - Math.floor(Math.random() * 25)}%, ${lightness + Math.floor(Math.random() * 50)}%)`;
const rgray = `hsl(${hue + Math.floor(Math.random() * 200 - 100)}, ${saturation - Math.floor(Math.random() * 25)}%, ${lightness + Math.floor(Math.random() * 50)}%)`;

var possible_events = ["normal", "reverse", "random", "5050", "lier", "greens", "alphabetical"];
var events_descs = ["Nothing special, just a normal Wordle", "Blue means that there's a letter in your guess in that spot", "Colors are randomized", "Green and yellow are mixed", "Sometimes there will be lie", "You get only greens, no yellows, no grays", "Orange means that the correct letter is earlier in the alphabet and purple that is later"];
var events = [];
for (let i = 1; i < letters_number + 1; i++) {
	let index;
	index = Math.floor(Math.random() * possible_events.length);
	let chosen = possible_events[index];
	events.push(chosen);

	if (chosen == "lier" || chosen == "greens") {
		possible_events.splice(index, 1);
	}

	let event_box = document.querySelector(`.brd_row[index="0"] .letter[index="${i}"]`);
	event_box.setAttribute("event", chosen);
	event_box.setAttribute("event_desc", events_descs[index]);
	event_box.innerHTML = `<img src="${chosen}.png">`;
	event_box.addEventListener("mouseover", show_event_tooltip);
	for (let j = 1; j < 9; j++) {
		document.querySelector(`.brd_row[index="${j}"] .letter[index="${i}"]`).setAttribute("event", chosen);
	}
	events_descs.splice(index, 1);
}

kb_buttons.forEach((button) => {
	button.addEventListener("click", buttonType);
	button.setAttribute("letter", button.innerHTML.toString());
	if (events[0] == "deny" && denied.includes(button.innerHTML)) {
		button.setAttribute("prev_bg", button.style.backgroundColor);
		button.style.backgroundColor = "#820000";
	}
});

document.addEventListener("keyup", keyType);

// setting amount of letters
const letters_slider = document.querySelectorAll(".amount_of_letters");
letters_slider.forEach((button) => {
	button.addEventListener("click", () => {
		let url = new URL(window.location.href);
		url.search = "";
		url.searchParams.set("length", button.innerHTML);
		window.location.href = url;
	});
});
