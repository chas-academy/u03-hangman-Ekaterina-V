// (1) Definere globala variabler

// Skapa array med spelets alla ord:
const wordList = [ 
  "Pippi", 
  "Emil", 
  "Annika", 
  "Tommy", 
  "Astrid", 
  "Lindgren", 
  "Mio", 
  "Karlsson", 
  "Ida"
];

// Definiera lite ord som spelaren ska gissa på i arrayen wordList. 
// Sträng: ett av orden valt av en slumpgenerator från arrayen ovan.
let selectedWord;

// Number: håller antalet gissningar som gjorts
let guesses; 
const guessTries = 6;

// Nummer av letter som spelaren har gissat
let countLettersFound;

// Sträng: sökväg till bild som kommer visas (och ändras) fel svar. t.ex. `/images/h1.png`
let hangmanImg = document.getElementById("hangman");

// DOM-nod: Ger meddelande när spelet är över.
let msgHolderEl = document.getElementById("message"); 


// (2) Använd document.querySelector() för att hämta knappen "Starta Spelet" i DOM, lagra den i startGameBtnEl variabeln.
// DOM-nod: knappen som du startar spelet med
let startGameBtnEl = document.querySelector("#startGameBtn");
console.log(startGameBtnEl);

let letterButtonEls = document.querySelectorAll("#letterButtons > li > button"); // Array av DOM-noder: Knapparna för bokstäverna
let letterBoxEls = document.querySelector("#letterBoxes > ul"); // Array av DOM-noder: Rutorna där bokstäverna ska stå


// (3) Skapa en event-lyssnare för knappen (.addEventListener('click', callbackFn)).
// Skapa en event-lyssnare (attachEvent) för EI
if (startGameBtnEl.addEventListener) {
  startGameBtnEl.addEventListener("click", startButtonClick);
}
else if (startGameBtnEl.attachEvent) {
  startGameBtnEl.attachEvent("onclick", startButtonClick);
}

// (4) Skapa funktioner

function startButtonClick() {
  selectedWord = generateWord();
  createLetterBoxes();
  console.log("Game started with word: " + selectedWord);

  countLettersFound = 0;
  guesses = 0;
  // Activera letter buttons när spelet startar
  enableLetterButtons();
  printMessage(""); // Clear message
  hangmanImg.src = "images/h0.png";
}

function generateWord() {
  let index = Math.floor(Math.random() * wordList.length);
  return wordList[index].toUpperCase();
}

function createLetterBoxes() {
  // Ta bort letter box 
  while (letterBoxEls.firstChild) {
    letterBoxEls.removeChild(letterBoxEls.firstChild);
  }

  // Lägg  valt ord till letter boxes 
  for (let letterNum = 0; letterNum < selectedWord.length; letterNum++) {
    let item = document.createElement("li");
    let input = document.createElement("input");
    input.type = "text";
    input.value = " ";
    input.disabled = true;
    item.appendChild(input); // Append "input" to item
    letterBoxEls.appendChild(item); // Append item to "ul"
  }
}

// Skapa en callback-funktion startGame() för event-lyssnaren, denna funktion ska starta spelet. Det gör den genom att ropa på andra funktioner:

// Lyssna på klick på alla bokstavsknappar
for (let buttonNum = 0; buttonNum < letterButtonEls.length; buttonNum++) {
  if (letterButtonEls[buttonNum].addEventListener) {
    letterButtonEls[buttonNum].addEventListener("click", startletterButton);
  }
  else if (letterButtonEls[buttonNum].attachEvent) {
    letterButtonEls[buttonNum].attachEvent("onclick", startletterButton);
  }
}

// Array av DOM-noder: Knapparna för bokstäverna
function startletterButton(event) {
  let button = event.target || event.srcElement;
  console.log("Clicked button " + button.value);

  let match = false;
  for (let letterNum = 0; letterNum < selectedWord.length; letterNum++) {
    if (selectedWord.charAt(letterNum) == button.value) {
      console.log("Letter matched on position " + letterNum);
      match = true;
      break;
    }
  }

  if (match) {
    handleMatch(button);
  } else {
    handleNoMatch();
  }
}

function handleMatch(buttonEl) {
  console.log("Match");

  buttonEl.disabled = true;
  for (let letterNum = 0; letterNum < selectedWord.length; letterNum++) {
    if (selectedWord.charAt(letterNum) == buttonEl.value) {
      letterBoxEls.childNodes[letterNum].querySelector("input").value = selectedWord[letterNum];
      countLettersFound++;
    }
  }

  console.log("countLettersFound: " + countLettersFound);
  if (countLettersFound == selectedWord.length) {
    printMessage("Du är vinnare! Starta spelet igen?");
    prepareForPlaying();
  }
}

function handleNoMatch() {
  console.log("No match");

  guesses++;
  hangmanImg.src = "images/h" + guesses + ".png";

  if (guesses == guessTries) {
    printMessage("Du har förlorat. Starta spelet igen?");
    prepareForPlaying(); 
  }
}

function printMessage(message) {
  let h3El = msgHolderEl.querySelector("h3");
  h3El.textContent = message;
}

function prepareForPlaying() {
  disableLetterButtons();
}

function enableLetterButtons() {
  for (let buttonNum = 0; buttonNum < letterButtonEls.length; buttonNum++) {
    letterButtonEls[buttonNum].disabled = false;
  }
}

function disableLetterButtons() {
  for (let buttonNum = 0; buttonNum < letterButtonEls.length; buttonNum++) {
    letterButtonEls[buttonNum].disabled = true;
  }
}

// Called on reload
prepareForPlaying();
