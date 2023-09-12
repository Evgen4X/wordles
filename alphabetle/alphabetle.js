const params = new URL(window.location.href).searchParams;
var answer, check_dict;

if (params.get("length") == null) {
	generate(5, 6);
} else if (params.get("word") != null) {
	generate(params.get("word").length / 2, 6);
} else {
	generate(parseInt(params.get("length")), 6);
}
