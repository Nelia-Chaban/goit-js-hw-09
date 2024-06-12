import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const startBtn = document.querySelector('button[data-start]');
const input = document.querySelector('#datetime-picker');
const day = document.querySelector('.value[data-days]');
const hour = document.querySelector('.value[data-hours]');
const minute = document.querySelector('.value[data-minutes]');
const second = document.querySelector('.value[data-seconds]');
startBtn.disabled = true;

let dateObj;
let setDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    setDate = selectedDates[0];
    if (setDate < options.defaultDate) {
      Notiflix.Notify.warning('Please choose a date in the future', {
        timeout: 2000,
        position: 'center-top',
      });
    } else {
      startBtn.disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

const addLeadingZero = value => value.toString().padStart(2, '0');

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

startBtn.addEventListener('click', onClick);

function onClick() {
  startBtn.disabled = true;
  input.disabled = true;

  const timer = setInterval(() => {
    dateObj = setDate - new Date();
    const { days, hours, minutes, seconds } = convertMs(dateObj);

    day.textContent = addLeadingZero(days);
    hour.textContent = addLeadingZero(hours);
    minute.textContent = addLeadingZero(minutes);
    second.textContent = addLeadingZero(seconds);

    const isTimerFinished = [days, hours, minutes, seconds].every(
      value => value === 0
    );

    if (isTimerFinished) {
      clearInterval(timer);
      input.disabled = false;
    }
  }, 1000);
}
