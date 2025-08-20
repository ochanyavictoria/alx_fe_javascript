let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { id: 2, text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { id: 3, text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Resilience" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.createElement("div");
syncStatus.id = "syncStatus";
document.body.appendChild(syncStatus);

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = "";

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const savedFilter = localStorage.getItem("lastFilter");
  if (savedFilter && categories.includes(savedFilter)) {
    categoryFilter.value = savedFilter;
  } else {
    categoryFilter.value = "all";
  }
}

function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" — ${filteredQuotes[randomIndex].category}`;
}

function filterQuotes() {
  localStorage.setItem("lastFilter", categoryFilter.value);
  showRandomQuote();
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    const newQuote = {
      id: Date.now(),
      text: newText,
      category: newCategory
    };

    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    textInput.value = "";
    categoryInput.value = "";
    postQuoteToServer(newQuote);
    alert("Quote added successfully!");
  } else {
    alert("Please enter both text and category.");
  }
}

document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
});

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

async function fetchQuotesFromServer() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const serverData = await res.json();
    const serverQuotes = serverData.map(post => ({
      id: post.id,
      text: post.title,
      category: "Server"
    }));
    resolveConflicts(serverQuotes);
  } catch (err) {
    updateSyncStatus("❌ Failed to fetch from server.");
  }
}

async function postQuoteToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(quote),
      headers: { "Content-Type": "application/json" }
    });
    updateSyncStatus("✅ Quote synced with server.");
  } catch (err) {
    updateSyncStatus("❌ Failed to sync with server.");
  }
}

function resolveConflicts(serverQuotes) {
  let merged = [...quotes];
  serverQuotes.forEach(sq => {
    const exists = merged.find(lq => lq.id === sq.id);
    if (!exists) {
      merged.push(sq);
    } else {
      const index = merged.findIndex(lq => lq.id === sq.id);
      merged[index] = sq;
    }
  });
  quotes = merged;
  saveQuotes();
  populateCategories();
  updateSyncStatus("🔄 Synced with server (server data took precedence).");
}

function updateSyncStatus(message) {
  syncStatus.textContent = message;
}

setInterval(fetchQuotesFromServer, 15000);

window.onload = function () {
  populateCategories();
  createAddQuoteForm();
  showRandomQuote();
  fetchQuotesFromServer();
};

newQuoteBtn.addEventListener("click", showRandomQuote);
