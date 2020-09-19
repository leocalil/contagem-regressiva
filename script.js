const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let coundownValue = Date; // Set blank variable to type 'Date'
let countdownActive;
let savedCountdown;

const oneSecond = 1000; // In milliseconds
const oneMinute = 60*oneSecond;
const oneHour =  60*oneMinute;
const oneDay = 24*oneHour;

// Today's date
let today = new Date().toISOString();
today = today.split("T")[0]; // Split the string for date only

// Set min date input for today
dateEl.setAttribute('min',today);

// Populated Countdown && Complete UI
function updateDOM(){
    const now = new Date().getTime();
    const delta = coundownValue - now;

    const deltaDays = Math.floor(delta/oneDay);
    const deltaHours = Math.floor((delta % oneDay)/oneHour);
    const deltaMinutes = Math.floor((delta % oneHour)/oneMinute);
    const deltaSeconds = Math.floor((delta % oneMinute)/oneSecond);
    //console.log(deltaDays, deltaHours, deltaMinutes, deltaSeconds);
      
    // Hide Input
    inputContainer.hidden = true;

    // If countdown has eneded, show complete
    if (delta<0){
        countdownEl.hidden = true;
        clearInterval(countdownActive);
        completeElInfo.textContent = `${countdownTitle} terminou em ${countdownDate}`
        completeEl.hidden = false;
    } else {
        // Popupate Countdown
        countdownElTitle.textContent = `${countdownTitle}`;
        timeElements[0].textContent =`${deltaDays}`;
        timeElements[1].textContent =`${deltaHours}`;
        timeElements[2].textContent =`${deltaMinutes}`;
        timeElements[3].textContent =`${deltaSeconds}`;
        completeEl.hidden = true;
        countdownEl.hidden = false;
    }
}

// Take values from form input
function updateCountdown(event){
    event.preventDefault(); // Prevent event from submitting network request and refreshing page
    countdownTitle = event.srcElement[0].value;
    countdownDate = event.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown',JSON.stringify(savedCountdown));  // Save title and date to local storage
    //Check for valid date
    if (countdownDate === '') {
        alert('Por favor selecione uma data.');
    }else{
        // Get number version of current Date, updateDOM
        coundownValue = new Date(countdownDate).getTime();
        updateDOM();
        // Countdown
        countdownActive = setInterval(updateDOM,oneSecond);
    }
}

// Reset All Values
function reset(){
    // Hide Countdowns, show Input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    // Stop the countdown 
    clearInterval(countdownActive);
    // Reset values
    countdownTitle ='';
    countdownDate ='';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown(){
    // Get countdown from localStorage if available
    if (localStorage.getItem('countdown')){
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        coundownValue = new Date(countdownDate).getTime();
        countdownActive = setInterval(updateDOM,oneSecond);
    }
}

// Event Listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// On Load, check local storage
restorePreviousCountdown();