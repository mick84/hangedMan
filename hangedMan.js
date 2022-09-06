//NEW ONE!
(() => {
  "use strict";
  const figlet = require("figlet"); //package.json dependency
  const rl = require("readline/promises"); //node -v 18.6.0
  const { stdin: input, stdout: output } = require("process");
  const readline = rl.createInterface({ input, output });
  const helloMessage = (message) =>
    console.log(
      figlet.textSync(
        message,
        {
          font: "Ghost",
          horizontalLayout: "default",
          verticalLayout: "default",
          width: 180,
          whitespaceBreak: true,
        },
        function (err, data) {
          if (err) {
            console.log("Something went wrong...");
            console.dir(err);
            return;
          }
          console.log(data);
        }
      )
    );

  //words from letters only are allowed:
  const wordsArray = [
    "AppleSeedsAcademy",
    "bootcamp",
    "react",
    "javascript",
    "express",
    "frontend",
  ].filter((word) => {
    const arrayFromWord = word.match(/[a-zA-Z]/g);
    //assure that non-words will not be asked:
    return arrayFromWord.length === word.length;
  });
  if (!wordsArray.length) {
    return;
  }
  const showWord = (word, guessed) => {
    const table = word.split("");
    const result = [];
    table.forEach((cell) => {
      if (guessed.includes(cell)) {
        result.push(cell);
      } else {
        result.push("*");
      }
    });

    return result.join("");
  };
  const MAX_GUESSES = 10;
  function printScreen(word, state) {
    console.log(`You have ${state.guessesLeft} guesses`);
    console.log("The word is :");
    console.log(showWord(word, state.guessedLetters));
  }
  helloMessage("Let's play!");
  const indexToChose = Math.floor(wordsArray.length * Math.random());
  const WordToGuess = wordsArray[indexToChose].toLowerCase();
  //get letters from word to guess, each letter once:
  const allLetters = [...new Set(WordToGuess.split(""))];
  const state = {
    guessesLeft: MAX_GUESSES,
    guessedLetters: [],
    continue: true,
    message: "",
  };
  //this will appear in console
  state.wordToShow = showWord(WordToGuess, state.guessedLetters);

  const playTurn = async (gameState) => {
    gameState.message && console.log(gameState.message);
    //stop condition:
    if (!gameState.continue) {
      readline.close();
      process.exit(1);
    }
    printScreen(WordToGuess, gameState);
    try {
      const input = await readline
        .question(`What is your guess?\n`)
        .then((res) => res.toLowerCase());

      switch (true) {
        case !!input.match(/[^a-z]/g):
          gameState.message = "Invalid input. Only letters allowed.";
          break;
        case input === WordToGuess:
          gameState.continue = false;
          gameState.message = "Wow You are good!!!";
          break;
        case input.length === 1 &&
          WordToGuess.includes(input) &&
          !gameState.guessedLetters.includes(input):
          //correct letter, that was not entered before and not the last guessed:
          gameState.guessedLetters.push(input);
          break;
        case input.length === 1 &&
          WordToGuess.includes(input) &&
          gameState.guessedLetters.includes(input):
          gameState.message = "the letter is already open. Try again";
          break;
        case input.length === 1 && !WordToGuess.includes(input):
          gameState.guessesLeft--;
          gameState.message = "";
          break;
        case input.length > 1:
          gameState.message = "Please enter only one character";
          break;
      }
      if (!gameState.guessesLeft) {
        //Loss:
        gameState.continue = false;
        gameState.message = "Get ready to be hanged!";
      } else if (gameState.guessedLetters.length === allLetters.length) {
        //Victory:
        gameState.continue = false;
        gameState.message = "Wow You are good!!!";
      }
      playTurn(gameState); //recursive calling with updated state argument
    } catch (error) {
      console.log(error);
    }
  };
  playTurn(state); //first calling with initial state
})();
