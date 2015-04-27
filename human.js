(function() {

	function newGame(yourNumber) {
	}

	function makeMove(xy) {
		return {
			then: function(callback) {
				makeMoveCallback = callback
			}
		};
	}

	enterTheFray({
		name: 'Human',
		newGame: newGame,
		makeMove: makeMove
	});

	var makeMoveCallback = null;

	window.boardClickHandlers.push(function(location) {
		if(makeMoveCallback) {
			makeMoveCallback(location.x);
			makeMoveCallback = null;
		}
	});

})();
