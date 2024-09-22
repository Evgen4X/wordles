function generate() {
	let alphabet = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"];
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
}

generate();
