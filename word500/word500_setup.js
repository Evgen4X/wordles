function generate(cols, rows) {
	let html = "";
	for (let i = 1; i <= rows; i++) {
		html += `<div class="brd_row" index="${i}">`;
		for (let j = 1; j <= cols; j++) {
			html += `<button state="gray" class="letter" index="${j}"></button>`;
		}
		html += `<div class="letter green"></div><div class="letter yellow"></div><div class="letter red"></div></div>`;
	}
	document.querySelector(".mainboard").innerHTML = html;
	letters_number = cols;

	var kbd = document.getElementById("keyboard");
	var row = document.createElement("div");
	row.classList.add("kb_row");
	for (let i of alphabet) {
		let letter = document.createElement("button");
		letter.classList.add("kb_key");
		letter.innerHTML = i;
		if (i == "ENTER") {
			letter.setAttribute("style", "aspect-ratio: 2 / 1");
		}
		row.appendChild(letter);
		if ("PL⌫".includes(i)) {
			kbd.appendChild(row);
			row = document.createElement("div");
			row.classList.add("kb_row");
			console.log(kbd);
		}
	}

	kb_buttons = document.querySelectorAll(".kb_key");
	brd_rows = document.querySelectorAll(".brd_row");
	brd_rows[0].setAttribute("status", "active");
	brd_letters = document.querySelectorAll(".letter");
	brd_letters[0].setAttribute("status", "active");
	brd_letters.forEach((letter) => {
		letter.addEventListener("click", () => {
			toggle(letter);
		});
	});

	answers = answers.filter((answer) => answer.length == cols);

	if (params.get("word") == null) {
		answer = answers[Math.floor(Math.random() * answers.length)];
	} else {
		answer = decode(params.get("word"));
		msg_alert("That wordle may not use standart dictionary!", 7500);
	}
	check_dict = answers.includes(answer);

	document.querySelector(".title").innerHTML = `WORD ${cols}00`;
}

function toggle(sender, state = null) {
	// const sender = event.target;
	if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(sender.innerHTML) == -1) {
		return;
	}
	if (state == null) {
		state = sender.getAttribute("state");
	}
	if (state == "gray") {
		sender.setAttribute("state", "red");
		sender.style.backgroundColor = "#c21b1b";
		return;
	}
	if (state == "red") {
		sender.setAttribute("state", "yellow");
		sender.style.backgroundColor = "#f3c237";
		return;
	}
	if (state == "yellow") {
		sender.setAttribute("state", "green");
		sender.style.backgroundColor = "#79b851";
		return;
	}
	sender.setAttribute("state", "gray");
	sender.style.backgroundColor = "#888888";
}

function encode(text) {
	let ans = "",
		n,
		chr;
	for (let i of text) {
		n = Math.floor(Math.random() * 30);
		chr = i.charCodeAt(0);
		ans += String.fromCharCode(chr - n) + String.fromCharCode(chr + n);
	}
	return ans;
}

function decode(text) {
	let ans = "",
		s1,
		s2;
	for (let i = 0; i < text.length; i += 2) {
		s1 = text[i].charCodeAt(0);
		s2 = text[i + 1].charCodeAt(0);
		ans += String.fromCharCode((s1 + s2) / 2);
	}
	return ans;
}

function msg_alert(msg, time) {
	let msgbox = document.querySelector("#alert"),
		spanbox = document.querySelector("#alert #alert-span");
	spanbox.innerHTML = msg;
	msgbox.animate([{top: "-12%"}, {top: "0"}], {duration: 1000, fill: "forwards", easing: "cubic-bezier(0, 1, 0.4, 1)"});
	setTimeout(() => {
		msgbox.animate([{top: "0"}, {top: "-12%"}], {duration: 1000, fill: "forwards", easing: "cubic-bezier(0, 1, 0.5, 1)"});
	}, time);
}

function clear_all() {
	brd_letters.forEach((letter) => {
		toggle(letter, "green");
	});
	close_all();
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

let alphabet = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"];

var kb_buttons, brd_rows, brd_letters, letters_number;

const params = new URL(window.location.href).searchParams;
var answer, check_dict;

if (params.get("length") == null) {
	generate(5, 8);
} else if (params.get("word") != null) {
	generate(params.get("word").length / 2, 8);
} else {
	generate(parseInt(params.get("length")), 8);
}

show_how_to();
