function gen_answer(len) {
	let gend_answer = "";
	for (let i = 0; i < len; i++) {
		gend_answer += Math.floor(Math.random() * 10);
	}
	return gend_answer;
}

const params = new URL(window.location.href).searchParams;
var answer;
var alphabet = ["ENTER", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫"];

if (params.get("length") == null) {
	generate(5, 6, alphabet);
	answer = gen_answer(5);
} else if (params.get("number") != null) {
	generate(params.get("number").length / 2, 6, alphabet);
	answer = decode(params.get("number"));
} else {
	generate(parseInt(params.get("length")), 6, alphabet);
	answer = gen_answer(params.get("length"));
}
