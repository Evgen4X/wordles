const kb_buttons = document.querySelectorAll(".kb_key");
const brd_rows = document.querySelectorAll(".brd_row");
brd_rows[0].setAttribute("status", "active");
const brd_letters = document.querySelectorAll(".letter");
brd_letters[0].setAttribute("status", "active");
brd_letters.forEach(letter => {
    letter.addEventListener("click", hide_letter);
})
const game_over = document.querySelector(".go");

function buttonType(event) {
    const sender = event.target;
    const text = sender.textContent;
    typeLetter(text);
}

function keyType(event) {
    const key = event.key;
    if (key == "Backspace") {
        typeLetter('⌫');
        return;
    }
    else if ("qazwsxedcrfvtgbyhnujmikolp".includes(key)) {
        typeLetter(key.toUpperCase())
        return;
    }
    else if (key == "Enter") {
        typeLetter("Enter");
    }
}

function typeLetter(text) {
    const row = document.querySelectorAll('.brd_row[status="active"]');
    const letter = document.querySelectorAll('.letter[status="active"]');
    document.getElementById("error").textContent = "";

    if (text == "Enter") {
        let word = "";
        for (let i = 1; i < 6; i++) {
            word += document.querySelectorAll(`.brd_row[status="active"] .letter[index="${i}"]`)[0].textContent;
        }
        if (word.length != 5) {
            msg_alert("Enter full word!", 3000);
            return;
        }
        if (!is_word(word) && check_dict) {
            document.getElementById("error").textContent = "Enter a valid word!";
            msg_alert("Evter a valid word!", 3000);
            return;
        }
        console.log("PREVIOUS ANSWER: ", answer);
        let potential_answer = find_word(word, checks)
        if (potential_answer != "" && check_word(word, answer).toString() != [0, 0, 0, 0, 0].toString()) { console.log(check_word(word, answer)); answer = potential_answer; }
        console.log("NEW ANSWER: ", answer);
        let check = check_word(word, answer), i = 1;
        let to_push = [word];
        for (let status of check) {
            to_push.push(status);
            let letter = document.querySelectorAll(`.brd_row[status="active"] .letter[index="${i}"]`)[0];
            let button = document.querySelectorAll(`#keyboard button[letter="${letter.textContent}"`)[0];
            if (status == 0) {
                letter.style.setProperty("--color", "#545454");
                button.style.setProperty("--color", "#545454");
            }
            else if (status == 1) {
                letter.style.setProperty("--color", "#f3c237");
                button.style.setProperty("--color", "#f3c237");
            }
            else {
                letter.style.setProperty("--color", "#79b851");
                button.style.setProperty("--color", "#79b851");
            }
            letter.style.animation = `to_color 0.8s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
            button.style.animation = `to_color 0s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
            i++;
        }
        checks.push(to_push);

        if (check.every((status) => status == 2)) {
            setTimeout(() => { show_game_over(true); }, 2000);
            return;
        }
        let index = parseInt(row[0].getAttribute("index"));
        if (index == 8) {
            setTimeout(() => { show_game_over(false); }, 2000);
            return;
        }
        row[0].setAttribute("status", "filled");
        let next_row = document.querySelectorAll(`.brd_row[index="${index + 1}"]`)[0];
        next_row.setAttribute("status", "active");
        set_first();
    }
    else if (text == "⌫") {
        if (letter.length == 0) {
            let target = document.querySelectorAll('.brd_row[status="active"] .letter[index="5"]');
            target[0].textContent = "";
            target[0].setAttribute("status", "active");
            return;
        }
        let index = parseInt(letter[0].getAttribute("index"));
        let target = document.querySelectorAll(`.brd_row[status="active"] .letter[index="${index - 1}"]`)[0];
        target.textContent = "";
        target.setAttribute("status", "active");
        letter[0].setAttribute("status", "none");
    }
    else {
        letter[0].textContent = text;
        letter[0].setAttribute("status", "filled");
        if (letter[0].getAttribute("index") != 5) {
            let index = parseInt(letter[0].getAttribute("index"));
            let next = document.querySelectorAll(`.brd_row[status="active"] .letter[index="${index + 1}"]`);
            next[0].setAttribute("status", "active");
        }
    }
}

function show_game_over(win) {
    let title = document.querySelector(".absolute .title"), ans = document.querySelector(".absolute .go_answer");
    if (win) {
        title.textContent = "You won!";
    }
    else {
        title.textContent = "You lost!";
    }
    ans.textContent = `The correct answer was: ${answer.toLowerCase()}`;
    game_over.style.display = "flex";
}

kb_buttons.forEach(button => {
    button.addEventListener('click', buttonType);
    button.setAttribute("letter", button.textContent.toString());
});
document.addEventListener('keyup', keyType);

const params = new URL(window.location.href).searchParams;
var answer;
if (params.get("word") == null) {
    answer = possible_words[Math.floor(Math.random() * possible_words.length)];
}
else {
    answer = decode(params.get("word"));
    msg_alert("That wordle may not use standart dictionary!", 7500);
}

const check_dict = possible_words.includes(answer) || words.includes(answer);
var checks = [];
var global_dict = false;

const GD_check = document.querySelector("#global_dict");
GD_check.addEventListener('change', () => { global_dict = !global_dict; });