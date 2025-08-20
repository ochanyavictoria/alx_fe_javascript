// simple array to keep quotes
let quotes = [
    { text: "The best way to predict the future is to create it.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// grab elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");

// function to show random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerText = "No quotes available!";
        return;
    }
    let randomIndex = Math.floor(Math.random() * quotes.length);
    let quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `"${quote.text}" <br><small>- ${quote.category}</small>`;
}

// function to add a new quote
function addQuote() {
    let textInput = document.getElementById("newQuoteText");
    let catInput = document.getElementById("newQuoteCategory");

    let text = textInput.value.trim();
    let category = catInput.value.trim();

    if (text === "" || category === "") {
        alert("Please fill in both fields!");
        return;
    }

    // push new quote to array
    quotes.push({ text: text, category: category });

    // clear inputs
    textInput.value = "";
    catInput.value = "";

    alert("New quote added!");
}

// events
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// show a quote on page load
showRandomQuote();
