let timerInterval = null;
let totalSeconds = 0;
let isPaused = false;
let timerStarted = false;

const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const congrats = document.getElementById('congrats');

function getTimeParts() {
  return {
    hours: parseInt(document.querySelector('[data-part="hours"]').textContent),
    minutes: parseInt(document.querySelector('[data-part="minutes"]').textContent),
    seconds: parseInt(document.querySelector('[data-part="seconds"]').textContent)
  };
}

function setTimeParts({ hours, minutes, seconds }) {
  document.querySelector('[data-part="hours"]').textContent = String(hours).padStart(2, '0');
  document.querySelector('[data-part="minutes"]').textContent = String(minutes).padStart(2, '0');
  document.querySelector('[data-part="seconds"]').textContent = String(seconds).padStart(2, '0');
}

function calculateTotalSeconds() {
  const { hours, minutes, seconds } = getTimeParts();
  return hours * 3600 + minutes * 60 + seconds;
}

function updateDisplay(total) {
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  setTimeParts({ hours: hrs, minutes: mins, seconds: secs });
}

function startTimer() {
  if (timerInterval) return;
  timerStarted = true;
  disableInputs();

  timerInterval = setInterval(() => {
    if (!isPaused && totalSeconds > 0) {
      totalSeconds--;
      updateDisplay(totalSeconds);
    } else if (totalSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      enableInputs();
      isPaused = false;
      timerStarted = false;
      totalSeconds = 0;
      updateDisplay(0);
      congrats.classList.remove('hidden');
      startPauseBtn.textContent = 'Start';
    }
  }, 1000);
}

function disableInputs() {
  document.querySelectorAll('.editable-time').forEach(part => {
    part.classList.add('pointer-events-none', 'opacity-70');
  });
}

function enableInputs() {
  document.querySelectorAll('.editable-time').forEach(part => {
    part.classList.remove('pointer-events-none', 'opacity-70');
  });
}

// Editable click setup
function makeEditable(part) {
  part.addEventListener('click', () => {
    if (timerStarted) return;

    const originalText = part.textContent;
    const input = document.createElement('input');
    input.type = 'number';
    input.value = parseInt(originalText);
    input.max = part.dataset.part === 'hours' ? 99 : 59;
    input.min = 0;
    input.className = 'bg-transparent w-12 text-center text-6xl font-mono text-white focus:outline-none';

    const partName = part.dataset.part;
    input.dataset.part = partName;
    part.replaceWith(input);
    input.focus();

    const saveInput = () => {
      const value = Math.min(Math.max(parseInt(input.value || 0), 0), partName === 'hours' ? 99 : 59);
      const padded = String(value).padStart(2, '0');
      const div = document.createElement('div');
      div.textContent = padded;
      div.className = `editable-time font-mono select-none ${partName === 'seconds' ? 'text-gray-400' : 'text-white'}`;
      div.dataset.part = partName;

      input.replaceWith(div);
      makeEditable(div);

      totalSeconds = calculateTotalSeconds();
    };

    input.addEventListener('blur', saveInput);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveInput();
    });
  });
}

document.querySelectorAll('.editable-time').forEach(makeEditable);

function attachClickListener(part) {
  part.addEventListener('click', () => {
    if (!timerStarted) {
      const clickEvent = new Event('click');
      part.dispatchEvent(clickEvent);
    }
  });
}

// Buttons
startPauseBtn.addEventListener('click', () => {
  if (startPauseBtn.textContent === 'Start' || startPauseBtn.textContent === 'Resume') {
    if (!timerStarted) totalSeconds = calculateTotalSeconds();
    isPaused = false;
    startTimer();
    startPauseBtn.textContent = 'Pause';
  } else {
    isPaused = true;
    startPauseBtn.textContent = 'Resume';
  }
});

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
  isPaused = false;
  timerStarted = false;
  totalSeconds = 0;
  updateDisplay(0);
  startPauseBtn.textContent = 'Start';
  congrats.classList.add('hidden');
  enableInputs();
});
