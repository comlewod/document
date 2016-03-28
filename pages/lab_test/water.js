var $box = $('.box');

var batteryWater = function(opts){
	var self = this;
	this.opts = $.extend({
		dom: '',
		timeScale: [],
		percentage: 50,
		minutes: 160,
		allminutes: 300,
		color: [],
		speed: 2000,
		radius: 200
	}, opts)

	this.$dom = this.opts.dom; 
	this.canvas = this.$dom.find('canvas');
	this.width = this.$dom.width();
	this.height = this.$dom.height();
	this.ctx = this.canvas.get(0).getContext('2d');

	var pi = Math.PI;

	//画圆弧
	this.makeCircle = function(radius, length, color, borderWidth, time){
		var ctx = this.ctx;
		ctx.beginPath();
		ctx.arc(this.width/2, this.height/2, radius, -pi/2, length-pi/2);
		ctx.strokeStyle = color;
		ctx.lineWidth = borderWidth;
		ctx.stroke();
		ctx.closePath();
	};
	this.makeWater = function(radius, num, clock){
		var _start = pi * (0.5 - num /100);  	
		//_start-(-pi/2):开始位置（从0点钟开始, 即-pi/2）到右边流量的弧长，再根据对称算出一半的流量弧长，乘以2后即为整个弧长长度
		var _end = (pi - (_start + pi/2)) * 2;

		var ctx = this.ctx;
		ctx.beginPath();
		ctx.arc(this.width/2, this.height/2, radius, _start, _start + _end);
		ctx.fillStyle = 'green';
		ctx.fill();
		ctx.closePath();
	};

	this.drawBall = function(radius, num, lineWidth){
		var ctx = this.ctx;
		ctx.save();
		ctx.translate(this.width/2, this.height/2);
		//ctx.rotate(0);
		//ctx.scale(1, 1);
		
		ctx.beginPath();
		ctx.arc(0, 0, 10, 0, 2*pi);
		ctx.fillStyle = 'green';
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.arc(0, 0, 8, 0, 2*pi);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.arc(0, 0, 6, 0, 2*pi);
		ctx.fillStyle = 'green';
		ctx.fill();
		ctx.closePath();

		ctx.restore();
	};
	this.drawBall(60, 2);

	var _speed = 0;
	var _num = 100;
	this.run = function(){
		_speed = (100-_num)/100 * 2 * pi;
		_num -= 1;
		if( _num > 20 ){
			self.ctx.clearRect(0, 0, self.width, self.height);

			self.makeCircle(230, 2*pi, '#000', 2);
			self.makeCircle(210, 2*pi, 'green', 2);
			self.drawBall(210, 60, 5);
			self.makeWater(210, _num);
			self.makeCircle(210, _speed, 'red', 6);

			self.animation = requestAnimationFrame(self.run);
		} else {
			cancelAnimationFrame(this.animation);
		}
	}
	this.animation = requestAnimationFrame(this.run);
};

var drawWater = new batteryWater({
	dom: $box
});
