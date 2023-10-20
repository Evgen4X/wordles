function check_num(number, answer) {
	const result = [];
	const remainingLetters = answer.split("");

	// First pass: check for letters in the correct position
	for (let i = 0; i < number.length; i++) {
		if (number[i] === answer[i]) {
			result[i] = 2;
			remainingLetters[i] = null; // Mark the letter as used
		}
	}

	// Second pass: check for letters in the wrong position
	for (let i = 0; i < number.length; i++) {
		if (result[i] !== 2) {
			const letterIndex = remainingLetters.indexOf(number[i]);
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

function get_link() {
	let text = document.getElementById("link_input").value.toUpperCase();
	if (text.length < 1 || text.length > 20) {
		msg_alert("The number must be between 1 and 20 digits long!", 3000);
		return;
	}
	for (let i of text) {
		if (!"1234567890".includes(i)) {
			msg_alert("Invalid number!\nExample of a valid one: 1234567890", 3000);
			return;
		}
	}
	let url = new URL(window.location.href);
	url.searchParams.set("number", encode(text));
	url.searchParams.set("length", text.length);
	let link = document.getElementById("link");
	link.setAttribute("href", url);
	link.textContent = "Link is here";
	return;
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

function hide_letter(event) {
	const target = event.target;
	if (target.style.opacity == "0") {
		target.style.opacity = "1";
	} else {
		target.style.opacity = "0";
	}
}

function hide_all() {
	let target = brd_letters[0].style.opacity == "1" ? "0" : "1";
	brd_letters.forEach((letter) => {
		letter.style.opacity = target;
	});
	document.getElementById("hide_all").textContent = ["Show all letters", "Hide all letters"][parseInt(target)];
	close_all();
}
