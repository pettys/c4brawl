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
		players.forEach(function(p) {
			if(p.newGame) {
				p.newGame();
			}
		});
		setTimeout(takeTurn, delay);
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
			console.log('Winner: ' + result);
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
	
	function randoFill() {
		for(var i=0; i<320; i++) {
			(function() {
				var c = i%2 + 1;
				var x = Math.floor(Math.random()*9);
				var y = Math.floor(Math.random()*9);
				var to = Math.floor(Math.random()*4000+i*50);
				console.log(to);
				setTimeout(function() { xy[x][y] = c; boardUi.update(xyClone()); }, to);
			})();
		}
	}
	
	return constructor;
})();

var randoPlayer = {
	makeMove: function(xy) {
		var x;
		do{
			x = Math.floor(Math.random()*xy.length);
		} while(xy[x][0]!==0);
		return x;
	}
};

var leftPlayer = {
	makeMove: function(xy) {
		for(var x=0; x<xy.length; x++) {
			if(xy[x][0]==0) return x;
		}
		return 0;
	}
};

var thomasBot = {
	makeMove: function(xy) {
		for(var x=0; x<xy.length; x++) {
			if(xy[x][1]==0) return x;
			if(xy[x][0]==0) return 0;
			if(xy[x][5]==0) return 1;
			if(xy[x][6]==0) return 2;
		}
		return 0;
	}
};

var engine = new Engine();
engine.newGame(randoPlayer, thomasBot);

})();
