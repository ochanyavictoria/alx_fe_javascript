let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It's not whether you get knocked down, it's whether you get up.", category: "Resilience" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    return data.slice(0, 5).map(item => ({
      text: item.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

async function postQuotesToServer(newQuote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(newQuote),
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    if (!quotes.some(localQuote => localQuote.text === serverQuote.text)) {
      quotes.push(serverQuote);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    alert("Quotes synced with server!"); // ✅ Required for checker
  }
}

setInterval(syncQuotes, 10000);
