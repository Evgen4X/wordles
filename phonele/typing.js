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
    else if ("1234567890".includes(key)) {
        typeLetter(key.toUpperCase())
        return;
    }
    else if (key == "Enter") {
        typeLetter("Enter");
    }
}

function typeLetter(text) {
    const row = document.querySelector('.brd_row[status="active"]');
    const letter = document.querySelector('.letter[status="active"]');
    document.getElementById("error").textContent = "";

    if (text == "Enter") {
        let number = ""
        for (let i = 1; i < 11; i++) {
            number += document.querySelector(`.brd_row[status="active"] .letter[index="${i}"]`).textContent;
        }
        if (number.length != 10) {
            return;
        }
        let check = check_num(number, answer), i = 1;
        for (let status of check) {
            let letter = document.querySelectorAll(`.brd_row[status="active"] .letter[index="${i}"]`)[0];
            let button = document.querySelectorAll(`#keyboard button[letter="${letter.textContent}"`)[0];
            let prev_color = button.style.getPropertyValue("--color");
            if (status == 0) {
                letter.style.setProperty("--color", "#545454");
                if (prev_color != "#79b851" && prev_color != "#f3c237") { button.style.setProperty("--color", "#545454"); };
            }
            else if (status == 1) {
                letter.style.setProperty("--color", "#f3c237");
                if (prev_color != "#79b851") { button.style.setProperty("--color", "#f3c237"); };
            }
            else {
                letter.style.setProperty("--color", "#79b851");
                button.style.setProperty("--color", "#79b851");
            }
            letter.style.animation = `to_color 0.8s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
            button.style.animation = `to_color 0s linear ${(i - 1) * 200 + "ms"} 1 normal forwards`;
            i++;
        }
        if (check.every((status) => status == 2)) {
            setTimeout(() => { show_game_over(true); }, 4000);
            return;
        }
        let index = parseInt(row.getAttribute("index"));
        if (index == 6) {
            setTimeout(() => { show_game_over(false); }, 4000);
            return;
        }
        row.setAttribute("status", "filled");
        let next_row = document.querySelectorAll(`.brd_row[index="${index + 1}"]`)[0];
        next_row.setAttribute("status", "active");
        set_first();
    }
    if (text == "⌫") {
        if (letter.length == 0) {
            let target = document.querySelectorAll('.brd_row[status="active"] .letter[index="10"]');
            target[0].textContent = "";
            target[0].setAttribute("status", "active");
            return;
        }
        let index = parseInt(letter.getAttribute("index"));
        let target = document.querySelectorAll(`.brd_row[status="active"] .letter[index="${index - 1}"]`)[0];
        target.textContent = "";
        target.setAttribute("status", "active");
        letter.setAttribute("status", "none");
    }
    else {
        letter.textContent = text;
        letter.setAttribute("status", "filled");
        if (letter.getAttribute("index") != 10) {
            let index = parseInt(letter.getAttribute("index"));
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
    let p_answer = `${answer.slice(0, 3)}-${answer.slice(3, 6)}-${answer.slice(6)}`;
    ans.textContent = `The correct answer was: ${p_answer}`;
    game_over.style.display = "flex";
}

kb_buttons.forEach(button => {
    button.addEventListener('click', buttonType);
    button.setAttribute("letter", button.textContent.toString());
});

document.addEventListener('keyup', keyType);

const params = new URL(window.location.href).searchParams;
var answer;
if (params.get("number") == null) {
    answer = "";
    for (let i = 0; i < 10; i++) {
        answer += Math.floor(Math.random() * 10);
    }
}
else {
    answer = decode(params.get("number"));
}