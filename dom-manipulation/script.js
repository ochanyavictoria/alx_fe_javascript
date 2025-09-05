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
    showNotification("Quotes synced with server!"); // ✅ Required text
  }
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.innerText = message;
  notification.style.position = "fixed";
  notification.style.bottom = "10px";
  notification.style.right = "10px";
  notification.style.background = "#333";
  notification.style.color = "#fff";
  notification.style.padding = "10px";
  notification.style.borderRadius = "5px";
  notification.style.zIndex = "1000";
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

setInterval(syncQuotes, 10000);
