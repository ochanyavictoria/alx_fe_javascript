// Quotes array
let quotes = [
    { text: "The best way to predict the future is to create it.", category: "Motivation" },
    { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
    { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// Function to display a random quote
function displayRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");

    if (quotes.length === 0) {
        quoteDisplay.innerText = "No quotes available!";
        return;
    }

    let randomIndex = Math.floor(Math.random() * quotes.length);
    let randomQuote = quotes[randomIndex];

    // Update the DOM
    quoteDisplay.innerHTML = `"${randomQuote.text}" <br><small>- ${randomQuote.category}</small>`;
}

// Function to add a new quote
function addQuote() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");

    let newText = textInput.value.trim();
    let newCategory = categoryInput.value.trim();

    if (newText === "" || newCategory === "") {
        alert("Please enter both a quote and a category");
        return;
    }

    // Add to array
    quotes.push({ text: newText, category: newCategory });

    // Update DOM immediately with the new quote
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `"${newText}" <br><small>- ${newCategory}</small>`;

    // Clear inputs
    textInput.value = "";
    categoryInput.value = "";
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Display one quote on page load
displayRandomQuote();
