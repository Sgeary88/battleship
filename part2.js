const rs = require('readline-sync');

let board = [];
let boardSize = 10;
const sunkShips = [];
const ships = [
	{
		name: 'destroyer',
		length: 2,
		isSunk: false,
		hits: 0,
	},
	{
		name: 'cruiser',
		length: 3,
		isSunk: false,
		hits: 0,
	},
	{
		name: 'submarine',
		length: 3,
		isSunk: false,
		hits: 0,
	},
	{
		name: 'battleship',
		length: 4,
		isSunk: false,
		hits: 0,
	},
	{
		name: 'carrier',
		length: 5,
		isSunk: false,
		hits: 0,
	}
];

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

		ship.x = x;
		ship.y = y;

		for (let i = 0; i < ship.length; i++) {
			if (direction === 'horizontal') {
				board[x + i][y] = 'S';
			} else {
				board[x][y + i] = 'S';
			}
		}
	});
};


function translateToNumber(letter) {
	letter = letter.toUpperCase();

	switch (letter) {
		case 'A': return 0;
		case 'B': return 1;
		case 'C': return 2;
		case 'D': return 3;
		case 'E': return 4;
		case 'F': return 5;
		case 'G': return 6;
		case 'H': return 7;
		case 'I': return 8;
		case 'J': return 9;
		default: return -1;
	}

};


function getGuesses() {
	const input = rs.question('Enter strike location (A1, A2, A3, B1, B2, B3, C1, C2, C3: ');
	const inputX = translateToNumber(input[0]);
	const inputY = Number(input[1]) - 1;


	if (inputX === -1 || inputY > boardSize || isNaN(inputY)) {
		console.log('Invalid input. Please try again.');
	} else {
		if (board[inputX][inputY] === 'S') {
			console.log('Hit');
			board[inputX][inputY] = 'O';

			ships.forEach(ship => {
				console.log(ship)
				if (ship.x === inputX && ship.y === inputY && !ship.isSunk === true) {
					ship.hits++;

					if (!ship.hits === ship.length) {
						ship.isSunk = true;
						console.log(`You sank the ${ship.name}`);
					}
				}
			});
		} else {
			console.log('Miss!');
		}
	}
	board.printBoard();
}




function startGame() {

	console.log('Press any key to start the game.');
	rs.keyInPause();

	createBoard();

	placeShips();

	board.printBoard();
	getGuesses();

}


startGame();
