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
		// This guy just keeps picking a random column
		// until he finds a column that isn't full.
		var x;
		do{
			x = Math.floor(Math.random()*xy.length);
		} while(xy[x][0]!==0);
		return x;
	}

	enterTheFray({
		name: 'RandoPlayer',
		newGame: newGame,
		makeMove: makeMove
	});

})();
