function CanvasBoard(options) {
	this.options = options;
	this.dom = document.querySelector('canvas');
}
CanvasBoard.prototype = {
	addEventListener: function (type, handler) {
		this.dom.addEventListener(type, handler);
	}
};

module.exports = CanvasBoard;