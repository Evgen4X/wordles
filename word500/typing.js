const kb_buttons = document.querySelectorAll(".kb_key");
const brd_rows = document.querySelectorAll(".brd_row");
brd_rows[0].setAttribute("status", "active");
const brd_letters = document.querySelectorAll(".letter");
brd_letters[0].setAttribute("status", "active");
const game_over = document.querySelector(".go");

function toggle(event) {
    const sender = event.target;
    if (sender.textContent == "") { return; }
    let state = sender.getAttribute("state");
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
        let check = check_word(word, answer);
        let r = 0, y = 0, g = 0;
        if (check.every(status => status == 0)) {
            r = 5;
            let index = document.querySelector('.brd_row[status="active"]').getAttribute("index");
            for (let i = 1; i <= index; i++) {
                for (let j = 1; j < 6; j++) {
                    let letter = document.querySelector(`.brd_row[index="${i}"] .letter[index="${j}"]`);
                    if (word.includes(letter.textContent)) {
                        letter.style.backgroundColor = "#c21b1b";
                        if (i == index) {
                            let button = document.querySelector(`#keyboard button[letter="${letter.textContent}"`);
                            letter.style.animation = `rotate 0.8s linear ${(j - 1) * 200 + "ms"} 1 normal forwards`;
                            button.style.backgroundColor = "#c21b1b";
                        }
                    }
                }
            }
        }
        else if (check.every(status => status == 2)) {
            g = 5;
            for (let i = 1; i < 6; i++) {
                let letter = document.querySelector(`.brd_row[status="active"] .letter[index="${i}"]`);
                let button = document.querySelector(`#keyboard button[letter="${letter.textContent}"`);
                letter.style.backgroundColor = "#79b851";
                button.style.backgroundColor = "#79b851";
                letter.style.animation = `rotate 0.8s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
            }
        }
        else {
            let i = 1;
            for (let status of check) {
                let letter = document.querySelector(`.brd_row[status="active"] .letter[index="${i}"]`);
                let button = document.querySelector(`#keyboard button[letter="${letter.textContent}"`);
                if (status == 0) {
                    r++;
                }
                else if (status == 1) {
                    y++;
                }
                else {
                    g++;
                }
                if (button.style.backgroundColor != "#c21b1b") {
                    button.style.backgroundColor = "#c3c3c3";
                }
                letter.style.animation = `rotate 0.8s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
                i++;
            }
        }
        let green = document.querySelector('.brd_row[status="active"] .green');
        setTimeout(() => { green.textContent = g; }, 1700)

        green.style.animation = "rotate 0.8s linear 1200ms 1 normal forwards";

        let yellow = document.querySelector('.brd_row[status="active"] .yellow');
        setTimeout(() => { yellow.textContent = y; }, 1900);
        yellow.style.animation = "rotate 0.8s linear 1400ms 1 normal forwards";

        let red = document.querySelector('.brd_row[status="active"] .red');
        setTimeout(() => { red.textContent = r; }, 2100);
        red.style.animation = "rotate 0.8s linear 1600ms 1 normal forwards";
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

brd_letters.forEach(letter => {
    if (letter.getAttribute("index") != null) {
        letter.addEventListener('click', toggle);
    }
})

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