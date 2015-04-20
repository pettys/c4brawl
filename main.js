(function() {

var Board = (function() {
	
	var cellIds = [];
	
	function constructor(tableId) {
		var table = document.getElementById(tableId);
		for(var y=0; y<6; y++){
			var row = table.insertRow(y);
			for(var x=0; x<7; x++) {
				var cell = row.insertCell(x);
				cell.id = x + "," + y;
				cellIds.push(cell.id);
				cell.appendChild(document.createElement('span'));
				//cell.addEventListener('click', function(e) {
				//	e.currentTarget.classList.toggle('red');			
				//})
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
		for(var i=0;i<cellIds.length;i++){
			var td = document.getElementById(cellIds[i]);
			if(td){
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
	
	function constructor() {
		initEmptyXy();
		boardUi = new Board('board');
		boardUi.update(xyClone());
	}
	
	constructor.prototype.newGame = function(player1, player2) {
		turn = 1;
		initEmptyXy();
		boardUi.update(xyClone());
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
			dropx = players[turn-1].makeMove(xyClone());
		} catch(err) {
			dropx = err;
		}
		if(typeof(dropx) !== 'number' || dropx < 0 || dropx >= xy.length) {
			console.log('Player ' + turn + ' returned an invalid response from makeMove. Turn skipped.');
			console.log(dropx);
			nextTurn();
			return;
		}
		var dropTo = xy[dropx].length-1;
		while(dropTo >= 0 && xy[dropx][dropTo] !== 0) {
			dropTo--;
		}
		if(dropTo < 0) {
			console.log('Player ' + turn + ' tried to play in a full column. Turn skipped.');
			nextTurn();
			return;
		}
		xy[dropx][dropTo] = turn;
		boardUi.update(xyClone());
		nextTurn();
	}
	
	function nextTurn() {
		var result = getGameResultOrNull();
		if(result !== null) {
			players.forEach(function(p) { if(p.gameOver) p.gameOver(result, xyClone()); });
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
	
	function getGameResultOrNull() {
		for(var x=0;x<xy.length;x++){
			for(var y=0;y<xy[x].length;y++){
				var winner = winnerAt(x,y);
				if(winner) return winner;
			}
		}
		var boardFull = xy.every(function(col) { return col[0] !== 0; });
		return boardFull ? 0 : null;
	}
	
	function winnerAt(x,y){
		return winnerAtLine(x,y,1,-1)
			|| winnerAtLine(x,y,1,0)
			|| winnerAtLine(x,y,1,1)
			|| winnerAtLine(x,y,0,1);
	}
	
	function winnerAtLine(x,y,dx,dy){
		var first = xy[x][y];
		if(first===0) return 0;
		for(var i=0;i<3;i++){
			x+=dx;
			y+=dy;
			if(x<0||y<0) return 0;
			if(x >= xy.length || y >= xy[x].length) return 0;
			if(first !== xy[x][y]) return 0;
		}
		return first;
	}
	
	function initEmptyXy() {
		xy=[];
		for(var x=0;x<7;x++){
			var col = [];
			for(var y=0;y<6;y++){
				col.push(0);
			}
			xy.push(col)
		}
	}
	
	// Create a clone of 'xy' to pass to other components.
	// That way if they trash their xy it doesn't affect
	// the game.
	function xyClone() {
		xyc=[];
		for(var x=0;x<xy.length;x++){
			var col = [];
			for(var y=0;y<xy[x].length;y++){
				col.push(xy[x][y]);
			}
			xyc.push(col)
		}
		return xyc;
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
		opt1.value = players.length-1;
		opt1.appendChild(document.createTextNode(player.name));
		var opt2 = opt1.cloneNode(true);
		opt1.selected = player.name == localStorage.getItem('p1');
		opt2.selected = player.name == localStorage.getItem('p2');
		document.getElementById('player-1-sel').appendChild(opt1);
		document.getElementById('player-2-sel').appendChild(opt2);
	}
	
	document.getElementById('fight').addEventListener('click', function() {
		var p1 = document.getElementById('player-1-sel').value;
		var p2 = document.getElementById('player-2-sel').value;
		if(p1==='') { alert('Select a red player.'); return; }
		if(p2==='') { alert('Select a blue player.'); return; }
		
		p1 = players[Number(p1)];
		p2 = players[Number(p2)];
		delay = document.getElementById('delay').value;
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
