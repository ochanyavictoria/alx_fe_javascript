// Quotes array with text and category
let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// Function to show a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  let randomIndex = Math.floor(Math.random() * quotes.length);
  let randomQuote = quotes[randomIndex];

  // update DOM
  quoteDisplay.innerHTML = `"${randomQuote.text}" <br><small>- ${randomQuote.category}</small>`;
}

// Function to create the Add Quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  // Create input for text
  let textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  // Create input for category
  let categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  // Create button
  let addButton = document.createElement("button");
  addButton.innerText = "Add Quote";
  addButton.addEventListener("click", addQuote);

  // Append to form container
  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);
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

    // update DOM immediately
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `"${newText}" <br><small>- ${newCategory}</small>`;

    // clear inputs
    textInput.value = "";
    categoryInput.value = "";
  }
}

// Event listener for showing new quote
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Run functions on page load
showRandomQuote();
createAddQuoteForm();
