const rs = require('readline-sync');

let board = [];
let boardSize = 3;
let remainingShips = 2;


function clearBoard() {
	board = [];
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

function getGuesses() {
	let input = rs.question('Enter strike location (A1, A2, A3, B1, B2, B3, C1, C2, C3: ');
	let inputX = translateToNumber(input[0]);
	let inputY = Number(input[1]) - 1;
	
	// for invalid inputs
	if (inputX === -1 || isNaN(inputY) || inputY < 0 || inputY >= boardSize) {
		console.log('Invalid input. Please try again.');
	}

	if (board[inputX][inputY] === 'S') {
		board[inputX][inputY] = 'H';
		console.log(`Hit! You have sunk a battleship! ${remainingShips - 1} ships remaining`);
		remainingShips--;
	}
	else if (board[inputX][inputY] === 'H') {
		console.log('You have already picked this location. Miss!');
	}
	else {
		board[inputX][inputY] = 'X';
		console.log('Miss!');
	}

	hits = countHits();
	if (hits === 2) {
		console.log('You have sunk all the Battleships!')
		let answer = rs.keyInYN('Play Again?')
		if (answer) {
			clearBoard();
			startGame();
		} else {
			return console.log('Bye Loser!');
		}
	} else {
		console.log(board)
			getGuesses();
		}
	}


function translateToNumber(letter) {
	letter = letter.toUpperCase();

	switch (letter) {
		case 'A': return 0;
		case 'B': return 1;
		case 'C': return 2;
		default: return -1;
	}

	// if (letter === 'A') return 0
	// else if (letter === 'B') return 1
	// else if (letter === 'C') return 2
	// else return -1;
	
}

function randomShipPlacement () {
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

function createBoard () {
	for (let i = 0; i < boardSize; i++) {
		let row = [];
		for (let j = 0; j < boardSize; j++) {
			row.push(' ');
		}
		board.push(row);
	}
}

function getRandomValue () {
	return Math.floor(Math.random() * boardSize);
}


function startGame() {

	console.log('Press any key to start the game.');
	rs.keyInPause();

	createBoard();
	randomShipPlacement();

	console.log(board);

	getGuesses();

}


startGame();