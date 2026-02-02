const numberInput = document.getElementById("numberInput");
const getFactBtn = document.getElementById("getFactBtn");
const resultContainer = document.getElementById("result");

const historyList = document.getElementById("historyList");
const historyEmpty = document.getElementById("historyEmpty");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const themeToggle = document.getElementById("themeToggle");

resultContainer.textContent = "Your number fact will appear here.";

/*  Dark Mode */
const THEME_KEY = "numberFactTheme";

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
    themeToggle.title = "Switch to light mode";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "🌙";
    themeToggle.title = "Switch to dark mode";
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);
}

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  const newTheme = isDark ? "light" : "dark";
  localStorage.setItem(THEME_KEY, newTheme);
  applyTheme(newTheme);
});

initTheme();

/* Search History */

const HISTORY_KEY = "numberFactHistory";
let history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");

function saveHistory() {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function addToHistory(num) {
  // Remove duplicates
  history = history.filter(n => n !== num);
  // Add to front
  history.unshift(num);
  // Keep only last 7
  history = history.slice(0, 7);

  saveHistory();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyEmpty.style.display = "block";
    clearHistoryBtn.disabled = true;
    clearHistoryBtn.style.opacity = "0.6";
    clearHistoryBtn.style.cursor = "not-allowed";
    return;
  }

  historyEmpty.style.display = "none";
  clearHistoryBtn.disabled = false;
  clearHistoryBtn.style.opacity = "1";
  clearHistoryBtn.style.cursor = "pointer";

  history.forEach(num => {
    const li = document.createElement("li");
    li.textContent = num;
    li.title = `Click to use ${num}`;
    li.addEventListener("click", () => {
      numberInput.value = num;
      getFactBtn.click();
    });
    historyList.appendChild(li);
  });
}

clearHistoryBtn.addEventListener("click", () => {
  history = [];
  saveHistory();
  renderHistory();
});

renderHistory();
   /* Enter key support*/

numberInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getFactBtn.click();
  }
});

/*  Main click -> show fact */

getFactBtn.addEventListener("click", () => {
  const number = numberInput.value.trim();

  if (number === "") {
    showError("Please enter a number.");
    return;
  }

  if (isNaN(number)) {
    showError("Please enter a valid number.");
    return;
  }

  showLoading();

  setTimeout(() => {
    const num = Number(number);
    const fact = generateNumberFact(num);
    showFact(fact);

    // Save to history
    addToHistory(number);
  }, 500);
});

/* Fact generation helpers*/

function generateNumberFact(num) {
  const facts = [
    `${num} is ${num % 2 === 0 ? "an even" : "an odd"} number.`,
    `${num} squared equals ${num * num}.`,
    `${num} multiplied by 10 equals ${num * 10}.`,
    `The sum of digits in ${num} is ${getSumOfDigits(num)}.`,
    `${num} is ${isPrime(num) ? "a prime number" : "not a prime number"}.`,
    `${num} in binary is ${num.toString(2)}.`,
    `${num} in hexadecimal is ${num.toString(16).toUpperCase()}.`,
    `The square root of ${num} is approximately ${Math.sqrt(num).toFixed(2)}.`,
    `${num} appears ${countDigit(num, Math.abs(num) % 10)} time(s) in the number ${num}.`,
    `${num} divided by 2 equals ${(num / 2).toFixed(2)}.`
  ];

  return facts[Math.floor(Math.random() * facts.length)];
}

function getSumOfDigits(num) {
  return Math.abs(num)
    .toString()
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}

function isPrime(num) {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;

  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

function countDigit(num, digit) {
  return Math.abs(num)
    .toString()
    .split("")
    .filter(d => Number(d) === digit).length;
}

/* UI helpers*/

function showLoading() {
  resultContainer.classList.remove("has-content");
  resultContainer.innerHTML = `<span class="loading">Fetching fact...</span>`;
}

function showFact(fact) {
  resultContainer.classList.add("has-content");
  resultContainer.textContent = fact;
}

function showError(message) {
  resultContainer.classList.remove("has-content");
  resultContainer.textContent = message;
}
``