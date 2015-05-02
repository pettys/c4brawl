(function() {

	var me;
	var notMe;
	var scores;

	function newGame(yourNumber) { }

	function makeMove(xy, thoughtDepth) {

		me = boardFunctions.whoseTurnIsIt(xy);
		notMe = me==1?2:1;

		// Hypothetically play every option for a number of turns.
		// If we win, score it high (the sooner, the higher).
		// If the other player can win on his turn, score it low
		// (againk, the sooner, the lower). Then play the best-scoring
		// move (if there are multiple, pick one of the best at random).

		// Thought depth is a power of 10; each power of 10 is another
		// depth of turns to examine. 1 means only play my 7 current
		// options. 10 means play my 7 plus opponent's next 49. 100
		// examines the 343 possibilities over the next 3 turns. At
		// 10000 the AI is examining 16807 moves each turn (except any
		// illegal moves), and is actually pretty good. At Level 7
		// (thought depth one-million) there is a noticeable delay on
		// an i7 processor on Chrome as the AI crunches the 823,543 moves
		// and figures out which is best.

		scores = [];
		for(var i=0; i<xy.length; i++) scores[i] = 0;

		scoreMoves(xy, thoughtDepth, -1);
		console.log(scores);

		var maxScore = scores[0];
		var bestMoves = [0];
		for(var i=1; i<xy.length; i++) {
			if(scores[i] == maxScore) {
				bestMoves.push(i);
			} else if(scores[i] > maxScore) {
				bestMoves = [i];
				maxScore = scores[i];
			}
		}

		// randomly pick one of the top-scoring moves
		if(bestMoves.length == 1) {
			return bestMoves[0];
		} else {
			return bestMoves[Math.floor(Math.random() * bestMoves.length)];
		}
	}
	
	function scoreMoves(xy, rank, rootMove) {
		var turn = rank > 0 ? me : notMe;
		for(var move=0; move<xy.length; move++){
			var tempXy = boardFunctions.clone(xy);
			var error = boardFunctions.dropIn(tempXy, turn, move);
			var scoreIndex = rootMove == -1 ? move : rootMove;
			if(error) {
				if(rootMove == -1) {
					scores[scoreIndex] = -Math.abs(rank) - 1;
				}
			} else {
				var winner = boardFunctions.getGameResultOrNull(tempXy);
				if(winner) {
					scores[scoreIndex] += rank;
				} else if(Math.abs(rank) > 1) {
					var newRank = rank/-10;
					scoreMoves(tempXy, newRank, scoreIndex);
				}
			}
		}
	}


	enterTheFray({
		name: 'Brute Force Level 2',
		newGame: newGame,
		makeMove: function(xy) { return makeMove(xy, 10); }
	});

	enterTheFray({
		name: 'Brute Force Level 5',
		newGame: newGame,
		makeMove: function(xy) { return makeMove(xy, 10000); }
	});

	enterTheFray({
		name: 'Brute Force Level 7',
		newGame: newGame,
		makeMove: function(xy) { return makeMove(xy, 1000000); }
	});

})();
