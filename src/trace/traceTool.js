import CanvasBoard from './canvasBoard';
function TraceTool(options) {
	options = options || {};
	let self = this;
	this.map = options.map;
	this.choosedLink = [];
	let canvasBoard = this.canvasBoard = document.querySelector('canvas');
	this.event();
}
TraceTool.prototype = {
	
	// res: {data: [x: 1, y: 1, t: 2], toatl: 20, callback: callback}
	drawTrace: function (res) {
		this.type = 'drawTrace';
		this.data = res;
		this.linkCallback = res.callback;
		this.linkLength = res.data.length;
		this.choosedLink = [];

		this._update();

	},
	_update: function () {
		let data = this.data || [];
		if (this.canvasBoard) {
			let ctx = this.canvasBoard.getContext('2d');
			ctx.clearRect(0, 0, this.canvasBoard.width, this.canvasBoard.height);
			ctx.save();
			if (this.type == 'drawTrace') {
                this._drawPath({
                    data: this.data || [],
                    strokeStyle: 'rgba(0, 255, 0, 0.298039215686275)',
                    borderStyle: '#00B3FD'
                });
                this._drawPath({
                    data: this.choosedLink || [],
                    lineWidth: 1,
                    strokeStyle: '#FD5200',
                    borderStyle: '#BB453F'
                });
            } else if (this.type == 'chooseLink') {
                this._drawPath({
                    data: this.data || [],
                    lineWidth: 1,
                    strokeStyle: '#00B3FD',
                    borderStyle: '#00B3FD'
                });

                this._drawPath({
                    data: this.choosedLink || [],
                    lineWidth: 1,
                    strokeStyle: 'green',
                    borderStyle: '#BB7502'
                });

                /*this._drawPath({
                    data: this.hoverd || [],
                    lineWidth: 10,
                    strokeStyle: '#FD5200',
                    borderStyle: '#BB453F',
                });*/
            }
            ctx.restore();
		}
	},
	_drawPath: function (options) {
		let data = options.data.data || [];
		if (this.canvasBoard) {
			let ctx = this.canvasBoard.getContext('2d');
			ctx.leneCap = 'round';
			if (options && options.borderStyle) {
				ctx.beginPath();
				data.forEach((val, key) => {
					let pos = val.data || [];
					pos.forEach((v, k) => {
						if (k == 0) {
							ctx.moveTo(v.x, v.y);
						} else {
							ctx.lineTo(v.x, v.y);
						}
					});
				});
				ctx.lineWidth = options.lineWidth + 2;
                ctx.strokeStyle = options.borderStyle;
                ctx.stroke();
			}
		
			// base line
            ctx.beginPath();
            data.forEach((val, key) => {
				let pos = val.data || [];
				pos.forEach((v, k) => {
					if (k == 0) {
						ctx.moveTo(v.x, v.y);
					} else {
						ctx.lineTo(v.x, v.y);
					}
				});
			});
            ctx.stroke();
		}
	},
	getLinkByPos: function (e) {
		let self = this;
		let P = {x: e.offsetX, y: e.offsetY};
		if (this.data) {
			this.hoverd = [];
			for (var i in self.data.data) {
                for (var j = 1; j < self.data.data[i].data.length; j++) {
                    var A = self.data.data[i].data[j - 1];
                    var B = self.data.data[i].data[j];
                    var vAP = [P.x - A.x, P.y - A.y];
                    var vAB = [B.x - A.x, B.y - A.y];
                    var vPB = [B.x - P.x, B.y - P.y];

                    var cAPAB = vAP[0] * vAB[0] + vAP[1] * vAB[1];
                    var lAPAB = Math.sqrt(Math.pow(vAP[0], 2) + Math.pow(vAP[1], 2)) * Math.sqrt(Math.pow(vAB[0], 2) + Math.pow(vAB[1], 2));
                    var rPAB = Math.acos(cAPAB / lAPAB);

                    var cABPB = vAB[0] * vPB[0] + vAB[1] * vPB[1];
                    var lABPB = Math.sqrt(Math.pow(vAB[0], 2) + Math.pow(vAB[1], 2)) * Math.sqrt(Math.pow(vPB[0], 2) + Math.pow(vPB[1], 2));
                    var rPBA = Math.acos(cABPB / lABPB);

                    if (rPAB < Math.PI / 2 && rPBA < Math.PI / 2) {
                        self.hoverd.push({
                            index: i,
                            length: Math.sin(rPAB) * Math.sqrt(Math.pow(vAP[0], 2) + Math.pow(vAP[1], 2))
                        });
                    }
                }
            }
            var minWidth = 50;
            var hoverTemp = {};
            for (var i in self.hoverd) {
                if (self.hoverd[i].length < minWidth) {
                    minWidth = parseInt(self.hoverd[i].length);
                    hoverTemp.data = [self.data.data[self.hoverd[i].index]];
                }
            }
            // self.hoverd = hoverTemp;
            return hoverTemp;

		}
	},
	_chooseLink: function (choosedLink) {
		var self = this;
        self.choosedLink = choosedLink || [];
    	
        self.type = 'chooseLink';
        self.linkCallback && self.linkCallback(self.choosedLink);
	},
	event: function () {
		let self = this;
		this.canvasBoard.addEventListener('click', (e) => {
			let choosedLink = self.getLinkByPos(e);

			self._chooseLink(choosedLink);
			self._update();
		});
	},
};
module.exports = TraceTool;