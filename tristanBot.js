(function() {

	var me;
	var not_me;

	// Called when a new game starts.
	// yourNumber = 1 if you are Red, 2 if you are Blue.
	function newGame(yourNumber) {
		me = yourNumber;
		not_me = me == 1 ? 2 : 1;
	}

	// Called when it's your turn to make a move.
	// xy is a two-D array of numbers, where
	// 0 = blank, 1 = Red, 2 = Blue.
	// Return the x-index of the slot you want to
	// drop into.
	// LEFT-MOST is 0
	// RIGHT-MOST is xy.length-1
	// 0,0 is upper left
	function makeMove(xy) {
		//xy.length = 7

		// play defense in y-dir
		var col_cnt;
		for(var x=0; x<xy.length; x++) {
		      col_cnt = 0;
		      for(var y=xy.length-2; y>0; y--) {
                        if(xy[x][y] == not_me){
			  col_cnt++;
			}
			else {
			  col_cnt = 0;
			}
			if(col_cnt == 3 && xy[x][y-1] != me){
			  return x;
			}
		      }
		}

		// play defense in x-dir
		row_cnt = 0;
	        for(var y=xy.length-2; y>0; y--) {
	          for(var x=0; x<xy.length; x++) {
		      row_cnt = 0;
                        if(xy[x][y] == not_me){
			  row_cnt++;
			}
			else {
			  row_cnt = 0;
			}
			if(row_cnt == 3 && xy[x+1][y] != me){
			  return x;
			}
		      }
		}

		//no immediate defense needed
		//play right-most
		for(var x=xy.length-1; x>0; x--) {
		  for(var y=xy.length-2; y>0; y--) {
		    if(xy[x][y] == 0){
	              return x;
		    }
		  }
                }
	}

	enterTheFray({
		name: 'Tristan the Titan',
		newGame: newGame,
		makeMove: makeMove
	});

})();
