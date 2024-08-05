const timeInputField = document.getElementById('time-input');
const quoteElement = document.querySelector('.quote');
const alarmSound = document.getElementById('alarm-sound');

function parseTimeInput(input) {
    const parts = input.split(':').reverse();
    let seconds = 0;
    if (parts[0]) seconds += parseInt(parts[0]);
    if (parts[1]) seconds += parseInt(parts[1]) * 60;
    if (parts[2]) seconds += parseInt(parts[2]) * 3600;
    return seconds;
}

function showMessage(message) {
    quoteElement.textContent = message;
}

const FULL_DASH_ARRAY = 283;

let timeLimit = null;
let timePassed = 0;
let timeLeft = timeLimit;
let timerInterval = null;
let isRunning = false;

function onTimesUp() {
    document.querySelector(".quote").classList.remove("hidden");
    document.querySelector(".base-timer__svg").classList.add("hidden");
    document.getElementById("base-timer-label").classList.add("hidden");
    showMessage("Tempo esgotado!");
    clearInterval(timerInterval);
    alarmSound.play();
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timeLeft = timeLimit = parseTimeInput(timeInputField.value);
        document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
        document.querySelector(".quote").classList.add("hidden");
        document.querySelector(".base-timer__svg").classList.remove("hidden");
        document.getElementById("base-timer-label").classList.remove("hidden");
        document.getElementById("pause").classList.remove("hidden");


        timerInterval = setInterval(() => {
            timePassed += 1;
            timeLeft = timeLimit - timePassed;
            updateTitle();
            document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
            setCircleDasharray();

            if (timeLeft === 0) {
                onTimesUp();
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        document.getElementById("pause").textContent = "Retomar";
        document.getElementById("pause").removeEventListener("click", pauseTimer);
        document.getElementById("pause").addEventListener("click", resumeTimer);
    }
}

function resumeTimer() {
    if (!isRunning) {
        isRunning = true;
        document.getElementById("pause").textContent = "Pausar";
        document.getElementById("pause").removeEventListener("click", resumeTimer);
        document.getElementById("pause").addEventListener("click", pauseTimer);

        timerInterval = setInterval(() => {
            timePassed += 1;
            timeLeft = timeLimit - timePassed;
            updateTitle();
            document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);
            setCircleDasharray();

            if (timeLeft === 0) {
                onTimesUp();
                alarmSound();
            }
        }, 1000);
    }
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}


function updateTitle() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    document.title = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / timeLimit;
    return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
}