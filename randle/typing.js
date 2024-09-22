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
	const event = row.getAttribute("event");

	if (event == "deny") {
		kb_reset = true;
		kb_buttons.forEach((button) => {
			if (denied.includes(button.innerHTML)) {
				button.style.opacity = 0.15;
			}
		});
	} else {
		kb_buttons.forEach((button) => {
			button.style.opacity = 1;
		});
	}

	if (text == "Enter") {
		let word = "";
		for (let i = 1; i < letters_number + 1; i++) {
			word += document.querySelectorAll(`.brd_row[status="active"] .letter[index="${i}"]`)[0].innerHTML;
		}
		if (word.length != letters_number) {
			msg_alert("Enter full word!", 3000);
			return;
		}
		if (event == "backwards") {
			word = word.split("").reverse().join("");
		}
		if (!is_word(word) && check_dict && event != "unreal") {
			msg_alert("Evter a valid word!", 3000);
			return;
		}
		if (event == "unreal" && is_word(word)) {
			msg_alert("Enter an <b>IN</b>valid word!", 3000);
			return;
		}
		for (let i = 1; i < letters_number + 1; i++) {
			let letter = document.querySelector(`.brd_row[status="active"] .letter[index="${i}"]`);
			if (letter.getAttribute("event") == "vowel") {
				if (!"AEUIO".includes(letter.innerHTML)) {
					msg_alert("Every bordered spot must be a vowel!", 3000);
					return;
				}
			}
		}
		if (event == "repeat" && !has_repeated(word)) {
			msg_alert("You must repeat a letter!", 3000);
			return;
		}
		if (event == "backwards") {
			word = word.split("").reverse().join("");
		}
		let event_done = 0;
		let check = check_word(word, answer),
			i = 1;
		if (event == "reverse") {
			check = check_word_reversed(word, answer);
		} else if (event == "alphabetical") {
			check = check_word_alphabetical(word, answer);
		}
		if (event == "shuffle") {
			try {
				let temp_word = word.split("").sort((a, b) => 0.5 - Math.random());
				check = check_word(temp_word, answer);
				for (let i = 1; i < letters_number + 1; i++) {
					document.querySelector(`.brd_row[status="active"] .letter[index="${i}"]`).innerHTML = temp_word[i - 1];
				}
			} catch (ex) {
				alert(ex);
			}
		}
		for (let status of check) {
			let letter = document.querySelector(`.brd_row[status="active"] .letter[index="${i}"]`);
			let button = document.querySelector(`#keyboard button[letter="${letter.innerHTML}"`);
			debugger;
			if (status == 0) {
				if (event != "greens" && letter.getAttribute("event") != "blind") {
					letter.style.setProperty("--color", "#545454");
					button.style.setProperty("--color", "#545454");
					if (event == "random") {
						letter.style.setProperty("--color", rgreen);
						button.style.setProperty("--color", rgreen);
					}
					if (event == "lier" && Math.random() < 0.4 && event_done == 0) {
						letter.style.setProperty("--color", "#f3c237");
						button.style.setProperty("--color", "#f3c237");
						event_done = 1;
					}
				} else {
					letter.style.animation = `rotate 0.8s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
					button.style.animation = `to_color 0s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
					i++;
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
						letter.style.animation = `rotate 0.8s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
						setTimeout(() => {
							letter.style.backgroundImage = "linear-gradient(135deg, rgba(121, 184, 81, 1) 0%, rgba(121, 184, 81, 1) 49%, rgba(243, 194, 55, 1) 50%, rgba(243, 194, 55, 1) 100%)";
							button.style.backgroundImage = "linear-gradient(135deg, rgba(121, 184, 81, 1) 0%, rgba(121, 184, 81, 1) 49%, rgba(243, 194, 55, 1) 50%, rgba(243, 194, 55, 1) 100%)";
						}, (i - 1) * 200 + 400);
						i++;
						continue;
					}
					if (event == "lier" && event_done == 0 && Math.random() < 0.4) {
						letter.style.setProperty("--color", "#545454");
						button.style.setProperty("--color", "#545454");
						event_done = 1;
					}
				} else {
					letter.style.animation = `rotate 0.8s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
					button.style.animation = `to_color 0s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
					i++;
					continue;
				}
			} else if (status == 2) {
				if (letter.getAttribute("event") != "blind") {
					letter.style.setProperty("--color", "#79b851");
					button.style.setProperty("--color", "#79b851");
					if (event == "random") {
						letter.style.setProperty("--color", rgray);
						button.style.setProperty("--color", rgray);
					}
					if (event == "5050") {
						letter.style.animation = `rotate 0.8s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
						setTimeout(() => {
							letter.style.backgroundImage = "linear-gradient(135deg, rgba(121, 184, 81, 1) 0%, rgba(121, 184, 81, 1) 49%, rgba(243, 194, 55, 1) 50%, rgba(243, 194, 55, 1) 100%)";
							button.style.backgroundImage = "linear-gradient(135deg, rgba(121, 184, 81, 1) 0%, rgba(121, 184, 81, 1) 49%, rgba(243, 194, 55, 1) 50%, rgba(243, 194, 55, 1) 100%)";
						}, (i - 1) * 200 + 400);
						i++;
						continue;
					}
					if (event == "lier" && event_done == 0) {
						letter.style.setProperty("--color", "#f3c237");
						button.style.setProperty("--color", "#f3c237");
						event_done = 1;
					}
				} else {
					letter.style.setProperty("--color", letter.style.backgroundColor);
				}
			} else if (status == 3) {
				letter.style.setProperty("--color", "#2c2cdf");
				button.style.setProperty("--color", "#2c2cdf");
			} else if (status == 4) {
				letter.style.setProperty("--color", "#ffaa00"); //orange, earlier
				button.style.setProperty("--color", "#888888");
				letter.style.borderRadius = "0 0 0.5em 0.5em";
			} else if (status == 5) {
				letter.style.setProperty("--color", "#b700ff"); //purple, after
				button.style.setProperty("--color", "#888888");
				letter.style.borderRadius = "0.5em 0.5em 0 0";
			}
			letter.style.animation = `to_color 0.8s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
			button.style.animation = `to_color 0s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
			i++;
		}
		if (check.every((status) => status == 2)) {
			setTimeout(() => {
				show_game_over(true);
			}, 2000);
			return;
		}
		let index = parseInt(row.getAttribute("index"));
		if (index == 6) {
			setTimeout(() => {
				show_game_over(false);
			}, 2000);
			return;
		}
		row.setAttribute("status", "filled");
		let next_row = document.querySelectorAll(`.brd_row[index="${index + 1}"]`)[0];
		next_row.setAttribute("status", "active");
		set_first();
		if (kb_reset) {
			kb_reset = false;
			kb_buttons.forEach((button) => {
				let bg = button.getAttribute("prev_bg");
				if (bg != null) {
					button.style.backgroundColor = bg;
					button.setAttribute("prev_bg", null);
				}
			});
		}

		typeLetter("0"); //needed to update letters on 'deny' event
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
	} else if (text != "0") {
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
//event "deny"
var denied = new Array();
do {
	let a = "QAZWSXEDCRFVTGBYHNUJMIKOLP"[Math.floor(Math.random() * 26)];
	if (!denied.includes(a)) {
		denied.push(a);
	}
} while (denied.length < 6);
//flag
var kb_reset = false;

var possible_events = ["vowel", "blind", "unreal", "reverse", "random", "50/50", "lier", "backwards", "deny", "greens", "shuffle", "repeat", "alphabetical"];
var events_descs = ["Every bordered spot must be a vowel", "You won't see the color of the grey spots", "Enter anything but a real word!", "Blue means that in that spot should be another letter of your guess", "Colors are randomized", "Greens and yellows are mixed", "One spot lies to you", "The word must be reversed", "You are not allowed to use 6 random letters", "You get only greens, no yellows, no grays", "Order of letters will be randomized after your guess", "You must use any letter twice", "Orange means that the correct letter is earlier in the alphabet and purple means that the letter is later"];
var events = [];
for (let i = 1; i < 6; i++) {
	let index = Math.floor(Math.random() * possible_events.length);
	let chosen = possible_events[index];
	possible_events.splice(index, 1);
	document.querySelector(`.brd_row[index="${i}"] span`).innerHTML = chosen[0].toUpperCase() + chosen.slice(1) + ": " + events_descs[index];
	if (chosen == "50/50") {
		chosen = "5050";
	}
	events.push(chosen);
	document.querySelector(`.brd_row[index="${i}"]`).setAttribute("event", chosen);
	document.querySelector(`.brd_row[index="${i}"] .event`).innerHTML = `<img src="${chosen}.png">`;
	events_descs.splice(index, 1);
	if (chosen == "blind") {
		let done = 0;
		for (let j = 1; j < letters_number + 1; j++) {
			if (Math.random() < 0.33 || done == 0) {
				let target = document.querySelector(`.brd_row[index="${i}"] .letter[index="${j}"]`);
				target.style.backgroundColor = "#232323";
				target.setAttribute("event", "blind");
				done++;
			}
			if (done == 3) {
				break;
			}
		}
	} else if (chosen == "vowel") {
		let done = 0;
		for (let j = 1; j < letters_number + 1; j++) {
			if (Math.random() < 0.33 || done == 0) {
				let target = document.querySelector(`.brd_row[index="${i}"] .letter[index="${j}"]`);
				target.style.border = "0.1em dashed #fff";
				target.style.margin = "0.05em";
				target.setAttribute("event", "vowel");
				done++;
			}
			if (done >= letters_number / 2 - 1 || done > 2) {
				break;
			}
		}
	}
}

kb_buttons.forEach((button) => {
	button.addEventListener("click", buttonType);
	button.setAttribute("letter", button.innerHTML.toString());
	if (events[0] == "deny" && denied.includes(button.innerHTML)) {
		kb_reset = true;
		button.setAttribute("prev_bg", button.style.backgroundColor);
		button.style.opacity = 0.15;
	}
});

document.addEventListener("keyup", keyType);

// setting amount of letters
const letters_slider = document.querySelectorAll(".amount_of_letters");
letters_slider.forEach((button) => {
	button.addEventListener("click", () => {
		let url = new URL(window.location.href);
		url.searchParams.set("length", button.innerHTML);
		window.location.href = url;
	});
});
