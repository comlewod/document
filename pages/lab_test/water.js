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
	this.timeScale = this.opts.timeScale;
	this.minutes = this.opts.minutes;

	this.canvas = this.$dom.find('canvas');
	this.width = this.$dom.width();
	this.height = this.$dom.height();
	this.ctx = this.canvas.get(0).getContext('2d');

	var pi = Math.PI;

	//画圆弧
	this.makeCircle = function(radius, length, color, borderWidth){
		var ctx = this.ctx;
		ctx.beginPath();
		ctx.arc(this.width/2, this.height/2, radius, -pi/2, length-pi/2);
		ctx.strokeStyle = color;
		ctx.lineWidth = borderWidth;
		ctx.lineCap = 'round';
		ctx.stroke();
		ctx.closePath();
	};

	//时钟箭头
	this.drawTip = function(_length, minutes){
		var ctx = this.ctx;
		var radius = 260;
		var r = 5;			//圆角半径
		var r_width = 60;	//正方体框宽度 
		var r_height = 20;	//正方体框高度
		var a_width = 20;	//小箭头宽度
		var a_height = 6;	//小箭头高度

		ctx.save();
		ctx.translate(this.width/2, this.height/2);
		ctx.rotate(_length);
		ctx.beginPath();
		ctx.moveTo(0, -radius);
		ctx.arcTo(r_width/2, -radius, r_width/2, 1-radius, r);
		ctx.arcTo(r_width/2, r_height-radius, r_width/2-1, r_height-radius, r);
		ctx.lineTo( a_width/2, r_height-radius);
		ctx.lineTo( 0, r_height+a_height-radius);
		ctx.lineTo( -a_width/2, r_height-radius);
		ctx.arcTo(-r_width/2, r_height-radius, -r_width/2, r_height-radius-1, r);
		ctx.arcTo(-r_width/2, -radius, -r_width/2+1, -radius, r);
		ctx.lineTo(0, -radius);
		ctx.fillStyle = 'green';
		ctx.fill();
		
		//时间变化
		var hour = Math.floor(minutes/60);
		var minute = minutes - hour * 60;
		ctx.font = '10px';
		ctx.textAlign = 'center';
		ctx.strokeStyle = '#fff';
		ctx.strokeText(hour + ':' + minute, 0, 15-radius);

		ctx.closePath();

		ctx.restore();
	};
	//游动指针
	this.drawBall = function(radius, angle){
		var ctx = this.ctx;
		var _x = radius * Math.sin(angle);
		var _y = -radius * Math.cos(angle);
		ctx.save();
		ctx.translate(this.width/2, this.height/2);
		
		ctx.beginPath();
		ctx.arc(_x, _y, 10, 0, 2*pi);
		ctx.fillStyle = 'green';
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.arc(_x, _y, 8, 0, 2*pi);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.arc(_x, _y, 6, 0, 2*pi);
		ctx.fillStyle = 'green';
		ctx.fill();
		ctx.closePath();

		ctx.restore();
	};

	//刻度
	this.makeClock = function(radius, arr){
		var num = arr.length;
		var each_length = 360 / num;
		var ctx = this.ctx;
		var lineWidth = 2;
		var lineLength = 10;

		ctx.save();
		ctx.beginPath();
		ctx.translate(this.width/2, this.height/2);
		ctx.strokeStyle = '#000';

		for(var i=0; i<num; i++){
			var now_length = i * each_length/180 * pi;
			var x = Math.sin(now_length) * radius;
			var y = Math.cos(now_length) * radius;
			var _x = Math.sin(now_length) * (radius - lineLength);
			var _y = Math.cos(now_length) * (radius - lineLength);
			ctx.moveTo(x, -y);
			ctx.lineTo(_x, -_y);
			
			if( arr[i] ){
				//数字刻度
				ctx.save();
				x = Math.sin(now_length) * (radius + 20);
				y = Math.cos(now_length) * (radius + 20);
				ctx.translate(x, -y);
				ctx.rotate(now_length);
				ctx.font = 'lighter 10px';
				ctx.textAlign = 'center';
				ctx.strokeText(arr[i], 0, 0);
				ctx.restore();
			}
		}
		ctx.lineWidth = lineWidth;
		//ctx.strokeStyle = '#000';
		ctx.stroke();
		ctx.closePath();

		ctx.restore();
	};

	//水量
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

	//波浪
	this.drawWave = function(radius, length, waveAngle, num){
		var ctx = this.ctx;
		var _y = radius * Math.cos(length/2);
		//y为弧长相对应的纵轴长度，
		var y = radius - _y;
		
		//左右两边点的波浪范围
		var leftHeight = 80 * Math.cos(waveAngle/180 * pi);
		var rightHeight = 80 * Math.sin(waveAngle/180 * pi);

		ctx.save();
		ctx.translate(this.width/2-radius, this.height/2+radius);

		//裁剪区域	
		ctx.beginPath();
		ctx.arc(radius, -radius, radius, 0, 2*pi);
		ctx.clip();
		ctx.closePath();

		//波浪线1
		var pointWave = 3; //左上角和右上角纵坐标波动幅度小点，所以除以pointWave
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, -(2*radius - y) + leftHeight / pointWave); 
		ctx.bezierCurveTo(
			radius,	-(2*radius - y) + rightHeight, 
			1.5*radius, -(2*radius - y) - rightHeight, 
			2*radius,	-(2*radius - y) + rightHeight / pointWave
		);
		ctx.lineTo(2*radius, 0);
		ctx.fillStyle = 'rgba(200, 0, 200, 0.2)';
		ctx.fill();
		ctx.closePath();

		//波浪线2
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, -(2*radius - y) + leftHeight / pointWave);
		ctx.bezierCurveTo(
			radius/2,	-(2*radius - y) + rightHeight, 
			1.2*radius, -(2*radius - y) - rightHeight, 
			2*radius,	-(2*radius - y) + rightHeight / pointWave
		);
		ctx.lineTo(2*radius, 0);
		ctx.fillStyle = 'rgba(200, 0, 200, 0.2)';
		ctx.fill();
		ctx.closePath();

		ctx.restore();
	};

	var _length = 0;			//弧长
	var _num = 100;				//百分比
	var waveAngle_1 = 0;		//波动的起始角
	var wave_speed = 6;			//波动速度
	var speed = 0.4;			//百分比增减速度
	var minutes = 0;			//总共分钟数

	this.run = function(){
		if( _num > 10 ){
			_length = (100-_num)/100 * 2 * pi;
			_num -= speed;
			waveAngle_1 += wave_speed;
			minutes++;

			self.ctx.clearRect(0, 0, self.width, self.height);

			self.makeCircle(230, 2*pi, '#000', 2);
			self.makeCircle(210, 2*pi, 'green', 2);
			self.makeClock(225, self.timeScale);
			self.drawTip(_length, minutes);

			self.drawWave(210, _length, waveAngle_1);
			//self.makeWater(210, _num);
			self.makeCircle(210, _length, 'red', 6);
			self.drawBall(210, _length);

			self.animation = requestAnimationFrame(self.run);
		} else {
			cancelAnimationFrame(this.animation);
		}
	}
	this.animation = requestAnimationFrame(this.run);
};

var drawWater = new batteryWater({
	dom: $box,
	timeScale: ['0:00', '', '1:00', '', '2:00', '', '3:00', '', '4:00', ''],
	minutes: 220
});
