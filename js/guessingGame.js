function generateWinningNumber(max = 100, min = 0) {
  var randNum = Math.floor((Math.random()*(max - min)) + 1);
  return randNum;
}

function shuffle(arr) {
  var m = arr.length, temp, i;
  while (m) {
    i = Math.floor(Math.random() * m--)
    temp = arr[m];
    arr[m] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function () {
  return Math.abs(this.winningNumber - this.playersGuess);
}

Game.prototype.isLower = function () {
  return this.playersGuess < this.winningNumber;
}

Game.prototype.checkGuess = function () {
  if (this.playersGuess === this.winningNumber) {
    return 'You Win!';
  } else if(this.pastGuesses.includes(this.playersGuess)) {
    return 'This number was already guessed.';
  }

  this.pastGuesses.push(this.playersGuess)
  $('.guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
  if (this.pastGuesses.length === 5) return 'You Lose!';

  var diff = this.difference()
  switch (true) {
    case diff < 10:
      return `You're burning up!`;
      break;
    case diff < 25:
      return `You're lukewarm.`;
      break;
    case diff < 50:
      return `You're a bit chilly.`;
      break;
    default:
      return `You're ice cold!`;
  }
}
Game.prototype.playersGuessSubmission = function (num) {
  if (num > 0 && num <= 100 && typeof num === 'number'){
    this.playersGuess = num;
  } else {
     throw 'That is an invalid guess.';
  }
  return this.checkGuess(this.playersGuess);
}

function newGame() {
  return new Game();
}

Game.prototype.provideHint = function () {
  let hintArray = [this.winningNumber];
  while (hintArray.length < 3){
      var randomNumber = generateWinningNumber()
      if (!hintArray.includes(randomNumber)){
      hintArray.push(randomNumber)
    }
  }
  return shuffle(hintArray);
}

function makeGuess(game) {
  var currentInput = $('#player-input').val();
  $('#player-input').val('');
  var checkedGuess = game.playersGuessSubmission(Number(currentInput));
  $('#title').text(checkedGuess);
  $('#subtitle').text(function () {
    if(checkedGuess === 'You Win!' || checkedGuess === 'You Lose!') {
      $('#hint, #submit').prop('disabled', true);
      return 'Click the Reset button to play again';
    } else {
      return game.isLower() ? 'Guess Higher' : 'Guess Lower';
    }
  });
  console.log(checkedGuess,'WN:', game.winningNumber, 'PG:', game.pastGuesses);

}

$(document).ready(function () {
  var game = newGame();
  $('#input-parent').on('click', '#submit', function () {
    makeGuess(game);
  });
  $('#input-parent').keydown(function (event) {
    if (event.which === 13) $('#submit').click();
  });
  $('#hint').click(function () {
    var hintArray = game.provideHint();
    $('#title').text('The winning numer is:')
    $('#subtitle').text(`${hintArray[0]}, ${hintArray[1]}, or ${hintArray[2]} `)
    $('#hint').prop('disabled', true);
  });
  $('#reset').click(function () {
    game = newGame();
    $('#title').text('Guessing Game!');
    $('#subtitle').text('Pick a number between 1-100')
    $('#hint, #submit').prop('disabled', false);
    $('.guess').text('-')
  })
});
