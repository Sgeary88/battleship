const rs = require('readline-sync');

let board = [];
let boardSize = 3;
let remainingShips = 2;

function createBoard() {
	for (let i = 0; i < boardSize; i++) {
		let row = [];
		for (let j = 0; j < boardSize; j++) {
			row.push(' ');
		}
		board.push(row);
	}
}

function getRandomValue() {
	return Math.floor(Math.random() * boardSize);
}


function countHits() {
	let hits = 0;
	for (let i = 0; i < boardSize; i++) {
		for (let j = 0; j < boardSize; j++) {
			if (board[i][j] === 'H') {
				hits++
			}
		}
	}
	return hits;
}

function randomShipPlacement() {
	let x;
	let y;

	x = getRandomValue();
	y = getRandomValue();

	board[x][y] = 'S';

	do {
		x = getRandomValue();
		y = getRandomValue();
	} while (board[x][y] === 'S');

	board[x][y] = 'S';
}

function translateToNumber(letter) {
	letter = letter.toUpperCase();

	const alphabet = {
		'A': 0,
		'B': 1,
		'C': 2,
	}

	return Object.keys(alphabet).includes(letter) ? alphabet[letter] : -1;

}

function isInputValid(inputX, inputY) {
	return inputX >= 0 && inputX < boardSize && inputY >= 0 && inputY < boardSize && !isNaN(inputY);
}


function handleHit(inputX, inputY) {
	console.log('Hit');
	board[inputX][inputY] = 'O';
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
	let input = rs.question('Enter strike location (A1, A2, A3, B1, B2, B3, C1, C2, C3: ');
	let inputX = translateToNumber(input[0]);
	let inputY = Number(input[1]) - 1;

	// for invalid inputs
	if (!isInputValid(inputX, inputY)) {
		console.log('Invalid input. Please try again.');
	} else {
		if (board[inputX][inputY] === 'S') {
			handleHit(inputX, inputY);
			remainingShips--;
		} else {
			handleMiss(inputX, inputY);
		}
	}

	if (remainingShips !== 0) {
		console.log(board);
		getGuesses();
	} else {
		console.log('You have sunk all the Battleships!');
		let answer = rs.keyInYN('Play Again?');
		if (answer) {
			startGame();
		} else {
			console.log('Bye Loser!');
		}
	}
}



function startGame() {

	console.log('Press any key to start the game.');
	rs.keyInPause();

	remainingShips = 2;
	board = [];

	createBoard();
	randomShipPlacement();

	console.log(board);

	getGuesses();

}


startGame();