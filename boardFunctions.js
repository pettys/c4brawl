// A set of functions to help working with xy connect-4 boards.

var boardFunctions = {

	// Modifies the xy board so that 'player' (1 or 2)
	// has dropped a token into column 'dropx' (0-xy.length-1).
	// Calculates for you how far the token falls.
	// If the move is illegal, xy is unchanges and a string
	// explaining the problem is returned.
	dropIn: function(xy, player, dropx) {
		if(typeof(dropx) !== 'number' || dropx < 0 || dropx >= xy.length) {
			return 'The desired drop column must be a number, and must be in range for this board.';
		}
		var dropTo = xy[dropx].length-1;
		while(dropTo >= 0 && xy[dropx][dropTo] !== 0) {
			dropTo--;
		}
		if(dropTo < 0) {
			return 'Column is already full.';
		}
		xy[dropx][dropTo] = player;
	},

	// Examines the board for a winner. Returns:
	//   null - if the game isn't over.
	//   0    - if the board is full with no winnder.
	//   1    - if player one (red) has won this game. 
	//   2    - if player two (blue) has won this game. 
	getGameResultOrNull: function(xy) {
		for(var x=0;x<xy.length;x++){
			for(var y=0;y<xy[x].length;y++){
				var winner = this.winnerAt(xy, x ,y);
				if(winner) return winner;
			}
		}
		var boardFull = xy.every(function(col) { return col[0] !== 0; });
		return boardFull ? 0 : null;
	},

	// Starting at x,y, determines whether there is
	// a winning row running right-up, right, right-down,
	// and down. (Returns 0, 1 or 2)
	winnerAt: function(xy, x, y) {
		return this.winnerAtLine(xy, x, y, 1, -1)
			|| this.winnerAtLine(xy, x, y, 1, 0)
			|| this.winnerAtLine(xy, x, y, 1, 1)
			|| this.winnerAtLine(xy, x, y, 0, 1);
	},

	// Checks a specific 4-cell sequence for a winner.
	// Returns 0, 1 or 2.
	winnerAtLine: function(xy, x, y, dx, dy) {
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
	},

	// Returns an empty 7-wide by 6-tall xy board.	
	initEmptyXy: function() {
		var xy=[];
		for(var x=0;x<7;x++){
			var col = [];
			for(var y=0;y<6;y++){
				col.push(0);
			}
			xy.push(col);
		}
		return xy;
	},

	// Create a deep clone of 'xy'. This can be used to
	// pass boards to other components without worrying
	// about them modifying your own copy of the board.
	clone: function(xy) {
		var xyc=[];
		for(var x=0; x<xy.length; x++){
			var col = [];
			for(var y=0; y<xy[x].length; y++){
				col.push(xy[x][y]);
			}
			xyc.push(col);
		}
		return xyc;
	}

};
