// === Quotes Array ===
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// === Storage Helpers ===
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) {
    try {
      quotes = JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing stored quotes:", e);
    }
  }
}

// === Show Random Quote ===
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (!quotes.length) {
    quoteDisplay.innerText = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const q = quotes[randomIndex];

  quoteDisplay.innerHTML = `"${q.text}" <br><small>- ${q.category}</small>`;

  // Save last viewed quote in session storage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(q));
}

// === Create Add Quote Form ===
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = "";

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.innerText = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
}

// === Add Quote ===
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  saveQuotes(); // persist to LocalStorage

  document.getElementById("quoteDisplay").innerHTML = `"${newText}" <br><small>- ${newCategory}</small>`;

  textInput.value = "";
  categoryInput.value = "";
}

// === Export Quotes to JSON File ===
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// === Import Quotes from JSON File ===
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (ev) {
    try {
      const importedQuotes = JSON.parse(ev.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
        showRandomQuote();
      } else {
        alert("Invalid file format.");
      }
    } catch (e) {
      alert("Error reading file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// === Event Listeners ===
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportBtn").addEventListener("click", exportToJsonFile);

// === Init App ===
loadQuotes();
createAddQuoteForm();

// Show last viewed quote if available, otherwise random
const lastViewed = sessionStorage.getItem("lastViewedQuote");
if (lastViewed) {
  const q = JSON.parse(lastViewed);
  document.getElementById("quoteDisplay").innerHTML = `"${q.text}" <br><small>- ${q.category}</small>`;
} else {
  showRandomQuote();
}
