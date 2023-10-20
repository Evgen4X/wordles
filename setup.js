function hide_letter(event) {
	const target = event.target;
	if (target.style.opacity == "0") {
		target.style.opacity = "1";
	} else {
		target.style.opacity = "0";
	}
}

function generate(cols, rows) {
	let html = "";
	for (let i = 1; i <= rows; i++) {
		html += `<div class="brd_row" index="${i}">`;
		for (let j = 1; j <= cols; j++) {
			html += `<button class="letter" index="${j}"></button>`;
		}
		html += `</div>`;
	}
	document.querySelector(".mainboard").innerHTML = html;
	letters_number = cols;

	kb_buttons = document.querySelectorAll(".kb_key");
	brd_rows = document.querySelectorAll(".brd_row");
	brd_rows[0].setAttribute("status", "active");
	brd_letters = document.querySelectorAll(".letter");
	brd_letters[0].setAttribute("status", "active");
	brd_letters.forEach((letter) => {
		letter.addEventListener("click", hide_letter);
	});

	answers = answers.filter((answer) => answer.length == cols);

	if (params.get("word") == null) {
		answer = answers[Math.floor(Math.random() * answers.length)];
	} else {
		answer = decode(params.get("word"));
		msg_alert("That wordle may not use standart dictionary!", 7500);
	}

	check_dict = answers.includes(answer);
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

function show_settings() {
	document.querySelector(".settings").style.display = "flex";
}

function show_custom() {
	document.querySelector(".custom").style.display = "flex";
}

function close_all() {
	document.querySelectorAll(".absolute").forEach((el) => {
		el.style.display = "none";});
}

function show_how_to() {
	document.querySelector(".how_to").style.display = "flex";
}

show_how_to();
