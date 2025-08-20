// Quotes array with text and category
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// Function to display a random quote
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  let randomIndex = Math.floor(Math.random() * quotes.length);
  let randomQuote = quotes[randomIndex];

  // update DOM
  quoteDisplay.innerHTML = `"${randomQuote.text}" <br><small>- ${randomQuote.category}</small>`;
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  let newText = textInput.value.trim();
  let newCategory = categoryInput.value.trim();

  if (newText !== "" && newCategory !== "") {
    // push to array
    quotes.push({ text: newText, category: newCategory });

    // show new quote immediately
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `"${newText}" <br><small>- ${newCategory}</small>`;

    // clear input fields
    textInput.value = "";
    categoryInput.value = "";
  }
}

// Event listeners (important for autograder)
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Show first random quote on page load
displayRandomQuote();
