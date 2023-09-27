const rs = require('readline-sync');

let board = [];
let boardSize = 10;
let sunkShips = [];
let ships = [];

function createShips () {
	ships = [
		{
      name: 'destroyer',
      length: 2,
      isSunk: false,
      hits: 0,
      location: [],
   },
   {
      name: 'cruiser',
      length: 3,
      isSunk: false,
      hits: 0,
      location: [],
   },
   {
      name: 'submarine',
      length: 3,
      isSunk: false,
      hits: 0,
      location: [],
   },
   {
      name: 'battleship',
      length: 4,
      isSunk: false,
      hits: 0,
      location: [],
   },
   {
      name: 'carrier',
      length: 5,
      isSunk: false,
      hits: 0,
      location: [],
   }
	];
}

function createBoard() {
	for (let i = 0; i < boardSize; i++) {
		let row = [];
		for (let j = 0; j < boardSize; j++) {
			row.push(' ');
		}
		board.push(row);
	}
	

	// Function to display the board with labels
	board.printBoard = function () {
		console.log('   ' + Array.from({ length: boardSize }, (_, i) => i + 1).join(' '));
		for (let i = 0; i < boardSize; i++) {
			console.log(String.fromCharCode(65 + i) + '  ' + board[i].join(' '));
		}
	}
};


function getRandomValue() {
	return Math.floor(Math.random() * boardSize);
}


function isValidPlacement(x, y, direction, shipLength) {

	if (direction === 'horizontal') {
		if (x + shipLength > boardSize) {
			return false;
		}
		for (let i = 0; i < shipLength; i++) {
			if (board[x + i][y] === 'S') {
				return false;
			}
		}
	} else {
		if (y + shipLength > boardSize) {
			return false;
		}
		for (let i = 0; i < shipLength; i++) {
			if (board[x][y + i] === 'S') {
				return false;
			}
		}
	}
	return true;
};



function placeShips() {
	let x, y, direction;

	ships.forEach(ship => {

		direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';

		do {
			x = getRandomValue();
			y = getRandomValue();

		} while (!isValidPlacement(x, y, direction, ship.length));

		ship.location = [];

		for (let i = 0; i < ship.length; i++) {
			if (direction === 'horizontal') {
				board[x + i][y] = 'S';
				ship.location.push({ x: x + i, y: y });
			} else {
				board[x][y + i] = 'S';
				ship.location.push({ x: x, y: y + i });
			}
		}
	});
};


function translateToNumber(letter) {
	const alphabet = 'ABCDEFGHIJ';
	const uppercase = letter.toUpperCase();
	const index = alphabet.indexOf(uppercase);

	if (index !== -1) {
		return index;
	} else {
		return -1;
	}
};



function isInputValid(inputX, inputY) {
	return inputX >= 0 && inputX < boardSize && inputY >= 0 && inputY < boardSize && !isNaN(inputY);
}



function handleHit(inputX, inputY) {
	console.log('Hit');
	board[inputX][inputY] = 'O';

	ships.forEach(ship => {
		const hitLocation = ship.location.find(coord => coord.x === inputX && coord.y === inputY);
		if (hitLocation && !ship.isSunk) {
			ship.hits++;
			console.log(`you hit the ${ship.name}!`);
			if (ship.hits === ship.length) {
				console.log(`You have sunk the ${ship.name}!`);
				sunkShips.push(ship);
			}
			if (sunkShips.length === ships.length) {
				endGame();
			}		
		}
	});
};



function handleMiss(inputX, inputY) {
	if (board[inputX][inputY] === 'O' || board[inputX][inputY] === 'X') {
		console.log('You have already chosen this location. Miss!');
	} else {
		board[inputX][inputY] = 'X';
		console.log('Miss!');
	}
}


function getGuesses() {
	const input = rs.question('Enter strike location (A1, A2, A3, B1, B2, B3, C1, C2, C3: ');
	const inputX = translateToNumber(input[0]);
	const inputY = parseInt(input.slice(1)) - 1;

	if (!isInputValid(inputX, inputY)) {
		console.log('Invalid input. Please try again.');
	} else {
		if (board[inputX][inputY] === 'S') {
			handleHit(inputX, inputY);
		} else {
			handleMiss(inputX, inputY);
		}
	}
	if (sunkShips.length !== ships.length) {
		board.printBoard();
		getGuesses();
	}
}



function resetGame () {
	board = [];
	sunkShips = [];
	startGame();
}



function startGame() {

	console.log('Press any key to start the game.');
	rs.keyInPause();

	createShips();
	createBoard();

	placeShips();

	board.printBoard();
	getGuesses();
}



function playAgain () {
	const answer = rs.keyInYN('Play Again?');
	if (answer) {
		resetGame();
		startGame();
	} else {
		console.log('Bye Loser!');
		return
	}
};



function endGame () {
	console.log('You have sunk all the Battleships!');
	playAgain();
}


startGame();
