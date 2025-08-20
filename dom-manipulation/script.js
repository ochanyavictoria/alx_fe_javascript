let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { id: 2, text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { id: 3, text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Resilience" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const cats = ["all", ...new Set(quotes.map(q => q.category))];
  select.innerHTML = "";
  cats.forEach(c => {
    const o = document.createElement("option");
    o.value = c;
    o.textContent = c;
    select.appendChild(o);
  });
  const saved = localStorage.getItem("lastFilter");
  if (saved && cats.includes(saved)) select.value = saved; else select.value = "all";
}

function showRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  const cat = document.getElementById("categoryFilter").value;
  const list = cat === "all" ? quotes : quotes.filter(q => q.category === cat);
  if (!list.length) {
    display.textContent = "No quotes available in this category.";
    return;
  }
  const q = list[Math.floor(Math.random() * list.length)];
  display.innerHTML = `"${q.text}" <br><small>- ${q.category}</small>`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(q));
}

function filterQuotes() {
  localStorage.setItem("lastFilter", document.getElementById("categoryFilter").value);
  showRandomQuote();
}

function createAddQuoteForm() {
  const c = document.getElementById("formContainer");
  c.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteBtn">Add Quote</button>
  `;
  document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
}

function addQuote() {
  const t = document.getElementById("newQuoteText").value.trim();
  const cat = document.getElementById("newQuoteCategory").value.trim();
  if (!t || !cat) { alert("Please enter both text and category."); return; }
  const q = { id: Date.now(), text: t, category: cat };
  quotes.push(q);
  saveQuotes();
  populateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  postQuoteToServer(q);
  document.getElementById("quoteDisplay").innerHTML = `"${q.text}" <br><small>- ${q.category}</small>`;
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
  const fr = new FileReader();
  fr.onload = e => {
    try {
      const arr = JSON.parse(e.target.result);
      if (!Array.isArray(arr)) { alert("Invalid JSON format."); return; }
      quotes.push(...arr.map((q, i) => ({
        id: q.id ?? Date.now() + i,
        text: String(q.text || "").trim(),
        category: String(q.category || "Imported")
      })).filter(q => q.text));
      saveQuotes();
      populateCategories();
      showRandomQuote();
      updateSyncStatus("Imported quotes.");
    } catch { alert("Error reading JSON file."); }
  };
  fr.readAsText(event.target.files[0]);
}

async function fetchQuotesFromServer() {
  const r = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
  const data = await r.json();
  return data.map(p => ({ id: p.id, text: p.title, category: "Server" }));
}

async function postQuoteToServer(q) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(q)
    });
    updateSyncStatus("Quote synced with server.");
  } catch { updateSyncStatus("Failed to sync new quote."); }
}

function renderConflictPanel(conflicts) {
  const panel = document.getElementById("conflictPanel");
  const list = document.getElementById("conflictList");
  if (!conflicts.length) { panel.style.display = "none"; list.innerHTML = ""; return; }
  list.innerHTML = "";
  conflicts.forEach(c => {
    const row = document.createElement("div");
    row.style.marginBottom = "8px";
    row.innerHTML = `
      <div style="font-weight:600;">Conflict for ID ${c.id}</div>
      <div>Server: "${c.server.text}" [${c.server.category}]</div>
      <div>Local: "${c.local.text}" [${c.local.category}]</div>
      <label><input type="radio" name="conflict-${c.id}" value="server" checked> Keep Server</label>
      <label style="margin-left:8px;"><input type="radio" name="conflict-${c.id}" value="local"> Keep Local</label>
    `;
    list.appendChild(row);
  });
  panel.style.display = "block";
}

function applyConflictResolutions(conflicts) {
  conflicts.forEach(c => {
    const choice = document.querySelector(`input[name="conflict-${c.id}"]:checked`).value;
    const idx = quotes.findIndex(q => q.id === c.id);
    quotes[idx] = choice === "local" ? c.local : c.server;
  });
  saveQuotes();
  populateCategories();
  showRandomQuote();
  document.getElementById("conflictPanel").style.display = "none";
  updateSyncStatus("Applied conflict resolutions.");
}

document.getElementById("applyConflictsBtn").addEventListener("click", () => {
  const conflicts = JSON.parse(sessionStorage.getItem("pendingConflicts") || "[]");
  applyConflictResolutions(conflicts);
  sessionStorage.removeItem("pendingConflicts");
});

function updateSyncStatus(msg) {
  document.getElementById("syncStatus").textContent = msg;
}

async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();
    const conflicts = [];
    const byId = new Map(quotes.map(q => [q.id, q]));
    serverQuotes.forEach(sq => {
      if (!byId.has(sq.id)) {
        quotes.push(sq);
      } else {
        const lq = byId.get(sq.id);
        if (lq.text !== sq.text || lq.category !== sq.category) {
          const idx = quotes.findIndex(q => q.id === sq.id);
          quotes[idx] = sq;
          conflicts.push({ id: sq.id, server: sq, local: lq });
        }
      }
    });
    saveQuotes();
    populateCategories();
    showRandomQuote();
    if (conflicts.length) {
      sessionStorage.setItem("pendingConflicts", JSON.stringify(conflicts));
      renderConflictPanel(conflicts);
      updateSyncStatus("Synced. Conflicts detected (server applied).");
    } else {
      renderConflictPanel([]);
      sessionStorage.removeItem("pendingConflicts");
      updateSyncStatus("Synced with server.");
    }
  } catch {
    updateSyncStatus("Sync failed.");
  }
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("syncBtn").addEventListener("click", syncQuotes);

window.onload = () => {
  populateCategories();
  createAddQuoteForm();
  const last = sessionStorage.getItem("lastViewedQuote");
  if (last) {
    const q = JSON.parse(last);
    document.getElementById("quoteDisplay").innerHTML = `"${q.text}" <br><small>- ${q.category}</small>`;
  } else {
    showRandomQuote();
  }
  syncQuotes();
  setInterval(syncQuotes, 15000);
};
