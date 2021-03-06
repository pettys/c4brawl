/// <reference path="boardFunctions.js" />

(function() {

var BoardUi = (function() {

	var cellIds = [];

	window.boardClickHandlers = [];

	function onCellClicked(e) {
		var parts = e.currentTarget.id.split(',');
		var evt = { x: Number(parts[0]), y: Number(parts[1]) };
		console.log(evt);
		window.boardClickHandlers.forEach(function(fn) { fn(evt); });
	}

	function constructor(tableId) {
		var table = document.getElementById(tableId);
		for(var y=0; y<6; y++){
			var row = table.insertRow(y);
			for(var x=0; x<7; x++) {
				var cell = row.insertCell(x);
				cell.id = x + "," + y;
				cellIds.push(cell.id);
				cell.appendChild(document.createElement('span'));
				cell.addEventListener('click', onCellClicked);
			}
		}
	}
	
	constructor.prototype.update = function(xy) {
		for(var x=0; x<xy.length; x++) {
			for(var y=0; y<xy[x].length; y++){
				var td = document.getElementById(x+','+y);
				switch(xy[x][y]) {
					case 0:
						td.classList.remove('red');
						td.classList.remove('blue');
						break;
					case 1:
						td.classList.add('red');
						td.classList.remove('blue');
						break;
					case 2:
						td.classList.add('blue');
						td.classList.remove('red');
						break;
					default:
						console.log('strange: ' + xy[x][y]);
						break;
				}
			}
		}
	}

	return constructor;

})();

var Engine = (function() {
	
	var xy;
	var boardUi;
	var players = [];
	var turn = 1;
	var delay = 500;
	var board = boardFunctions;
	
	function constructor() {
		xy = board.initEmptyXy();
		boardUi = new BoardUi('board');
		boardUi.update(board.clone(xy));
	}
	
	constructor.prototype.newGame = function(player1, player2) {
		turn = 1;
		xy = board.initEmptyXy();
		boardUi.update(board.clone(xy));
		players = [player1, player2];
		players.forEach(function(p, idx) {
			if(p.newGame) {
				p.newGame(idx+1);
			}
		});
		setTimeout(takeTurn, delay);
	}

	constructor.prototype.setDelay = function(delayInput) {
		if(typeof(delayInput) !== 'number' || isNaN(delayInput)) {
			console.log('bad delay input');
		} else {
			delay = delayInput;
		}
	}

	function takeTurn() {
		var dropx;
		try {
			dropx = players[turn-1].makeMove(board.clone(xy));
		} catch(err) {
			dropx = err;
		}

		if(dropx && typeof(dropx.then) === 'function') {
			dropx.then(executeTurn);
		} else {
			executeTurn(dropx);
		}
	}

	function executeTurn(dropx) {
		var error = board.dropIn(xy, turn, dropx);
		if(error) {
			console.log('Player ' + turn + ' skipped because of illegal move: ' + error + '.');
			console.log(dropx);
			nextTurn();
			return;
		}
		boardUi.update(board.clone(xy));
		nextTurn();
	}
	
	function nextTurn() {
		var result = board.getGameResultOrNull(xy);
		if(result !== null) {
			players.forEach(function(p) {
				if(p.gameOver) p.gameOver(result, board.clone(xy));
			});
			if(result === 0) {
				console.log('Tie.');
			} else {
				console.log('Winner: ' + players[result-1].name + ' (' + (result==1?'Red':'Blue') + ')');
			}
			return;
		}
		turn = turn == 1 ? 2 : 1;
		setTimeout(takeTurn, delay);
	}
	
	return constructor;
})();

(function() {
	
	// Brawl Organizer.
	var engine = new Engine();
	var players = [];
	
	document.getElementById('delay').value = localStorage.getItem('delay') || '250';

	window.enterTheFray = function(player) {
		if(typeof(player.name) !== 'string' || player.name.trim().length == 0) {
			console.log('Someone tried to enter the fray without a name. Denied!');
			return;
		}
		if(typeof(player.makeMove) !== 'function') {
			console.log('Player "' + player.name + '" does not have a makeMove player and will probably lose badly as a result.');
		}
		players.push(player);
		var opt1 = document.createElement('option');
		opt1.value = (players.length-1).toString();
		opt1.appendChild(document.createTextNode(player.name));
		var opt2 = opt1.cloneNode(true);
		opt1.selected = player.name == localStorage.getItem('p1');
		opt2.selected = player.name == localStorage.getItem('p2');
		document.getElementById('player-1-sel').appendChild(opt1);
		document.getElementById('player-2-sel').appendChild(opt2);
	};
	
	document.getElementById('fight').addEventListener('click', function() {
		var p1 = document.getElementById('player-1-sel').value;
		var p2 = document.getElementById('player-2-sel').value;
		if(p1==='') { alert('Select a red player.'); return; }
		if(p2==='') { alert('Select a blue player.'); return; }
		
		p1 = players[Number(p1)];
		p2 = players[Number(p2)];
		var delay = document.getElementById('delay').value;
		engine.setDelay(Number(delay));
		engine.newGame(p1, p2);
		localStorage.setItem('p1', p1.name);
		localStorage.setItem('p2', p2.name);
		localStorage.setItem('delay', delay);

	});
	
})();

enterTheFray({
	name: 'LeftPlayer',
	makeMove: function(xy) {
		for(var x=0; x<xy.length; x++) {
			if(xy[x][0]==0) return x;
		}
		return 0;
	}
});

})();
