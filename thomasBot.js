(function() {

	// Called when a new game starts.
	// yourNumber = 1 if you are Red, 2 if you are Blue.
	function newGame(yourNumber) {
	}

	// Called when it's your turn to make a move.
	// xy is a two-D array of numbers, where
	// 0 = blank, 1 = Red, 2 = Blue.
	// Return the x-index of the slot you want to
	// drop into.
	// LEFT-MOST is 0
	// RIGHT-MOST is xy.length-1
	function makeMove(xy) {
		for(var x=0; x<xy.length; x++) {
			if(xy[x][1]==0) return x;
			if(xy[x][0]==0) return 0;
			if(xy[x][5]==0) return 1;
			if(xy[x][6]==0) return 2;
		}
		return 0;
	}

	enterTheFray({
		name: 'ThomasBot',
		newGame: newGame,
		makeMove: makeMove
	});

})();
