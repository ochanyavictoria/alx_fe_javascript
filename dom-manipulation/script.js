const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Motivation" },
    { text: "Don't let yesterday take up too much of today.", author: "Will Rogers", category: "Wisdom" },
    { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi", category: "Resilience" }
];

function displayQuotes() {
    const container = document.getElementById("quote-container");
    container.innerHTML = "";
    quotes.forEach(q => {
        const div = document.createElement("div");
        div.className = "quote";
        div.innerHTML = `<p>"${q.text}"</p><p>- ${q.author}</p><p><em>${q.category}</em></p>`;
        container.appendChild(div);
    });
}

async function fetchQuotesFromServer() {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    return data.slice(0, 5).map(item => ({
        text: item.title,
        author: "Server Author",
        category: "Server"
    }));
}

async function syncQuotes() {
    try {
        const serverQuotes = await fetchQuotesFromServer();
        let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

        localQuotes = [...serverQuotes, ...localQuotes.filter(lq =>
            !serverQuotes.some(sq => sq.text === lq.text)
        )];

        localStorage.setItem("quotes", JSON.stringify(localQuotes));
        displayQuotes();

        await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            body: JSON.stringify(localQuotes),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        showNotification("Quotes synced successfully!");
    } catch (error) {
        showNotification("Sync failed. Try again later.");
    }
}

function showNotification(message) {
    const note = document.createElement("div");
    note.textContent = message;
    note.className = "notification";
    document.body.appendChild(note);
    setTimeout(() => note.remove(), 3000);
}

document.getElementById("syncBtn").addEventListener("click", syncQuotes);

setInterval(syncQuotes, 15000);

displayQuotes();
