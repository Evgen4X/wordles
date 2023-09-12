const params = new URL(window.location.href).searchParams;
var answer, check_dict;

if (params.get("length") == null) {
	generate(5, 8);
} else if (params.get("word") != null) {
	generate(params.get("word").length / 2, 8);
} else {
	generate(parseInt(params.get("length")), 8);
}
