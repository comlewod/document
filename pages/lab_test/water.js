var $box = $('.box');

var batteryWater = function(opts){
	var self = this;
	this.opts = $.extend({
		dom: '',
		timeScale: [],		//时钟刻度
		num: 50,			//电量百分比
		minutes: 160,		//所耗时间
		color: {},
		speed: 2000,
		consume: true		//true耗电，true充电
	}, opts)

	this.$dom = this.opts.dom; 
	this.timeScale = this.opts.timeScale;
	this.color = this.opts.color;
	this.minutes = this.opts.minutes;
	this.allMinutes = this.opts.allMinutes;
	this.num = this.opts.num;
	this.consume = this.opts.consume;

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
		if( color.r ){
			ctx.strokeStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',1)';
		} else {
			ctx.strokeStyle = color;
		}
		ctx.lineWidth = borderWidth;
		ctx.lineCap = 'round';
		ctx.stroke();
		ctx.closePath();
	};

	//时钟箭头
	this.drawTip = function(radius, _length, minutes, a_over, scale_num, color){
		var ctx = this.ctx;
		var r = 5;			//圆角半径
		var r_width = 36;	//正方体框宽度 
		var r_height = 22;	//正方体框高度
		var a_width = 10;	//小箭头宽度
		var a_height = 6;	//小箭头高度
		
		//时间框
		ctx.save();
		ctx.translate(this.width/2, this.height/2);
		if( a_over ) ctx.scale(scale_num, scale_num);
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
		ctx.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 1)';
		ctx.fill();
		
		//时间变化
		var hour = Math.floor(minutes/60);
		var minute = minutes - hour * 60;
		if( minute < 10 ){
			minute = '0' + minute;
		}
		ctx.font = '10px';
		ctx.textAlign = 'center';
		ctx.strokeStyle = '#fff';
		ctx.strokeText(hour + ':' + minute, 0, 15-radius);

		ctx.closePath();

		ctx.restore();
	};
	//游动指针
	this.drawBall = function(radius, angle, color){
		var ctx = this.ctx;
		var _x = radius * Math.sin(angle);
		var _y = -radius * Math.cos(angle);
		ctx.save();
		ctx.translate(this.width/2, this.height/2);
		
		ctx.beginPath();
		ctx.arc(_x, _y, 5, 0, 2*pi);
		ctx.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 1)';
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.arc(_x, _y, 3, 0, 2*pi);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.arc(_x, _y, 2, 0, 2*pi);
		ctx.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 1)';
		ctx.fill();
		ctx.closePath();

		ctx.restore();
	};

	//刻度
	this.makeClock = function(radius, arr, color){
		var num = arr.length;
		var each_length = 360 / num;
		var ctx = this.ctx;
		var lineWidth = 1;
		var lineLength = 3;

		ctx.save();
		ctx.beginPath();
		ctx.translate(this.width/2, this.height/2);
		ctx.strokeStyle = color;

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
				ctx.strokeText(arr[i], 0, 12);
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
	/*this.makeWater = function(radius, num, clock){
		var _start = pi * (0.5 - num /100);  	
		//_start-(-pi/2):开始位置（从0点钟开始, 即-pi/2）到右边流量的弧长，再根据对称算出一半的流量弧长，乘以2后即为整个弧长长度
		var _end = (pi - (_start + pi/2)) * 2;

		var ctx = this.ctx;
		ctx.beginPath();
		ctx.arc(this.width/2, this.height/2, radius, _start, _start + _end);
		ctx.fillStyle = 'green';
		ctx.fill();
		ctx.closePath();
	};*/

	//波浪
	this.drawWave = function(radius, nowNum, waveAngle, color, waveHeight){
		var ctx = this.ctx;
		//y为弧长相对应的纵轴长度，即整个高度需要减去的长度
		var y = nowNum/100 * 2 * radius;
		
		//左右两边点的波浪范围
		var leftHeight = waveHeight * Math.cos(waveAngle/180 * pi);
		var rightHeight = waveHeight * Math.sin(waveAngle/180 * pi);
		
		ctx.save();
		ctx.translate(this.width/2, this.height/2);
		ctx.beginPath();
		ctx.font = '20px';
		ctx.textAlign = 'center';
		ctx.strokeStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 1)';
		ctx.strokeText(parseInt(100-nowNum) + ' %', 0, -50);
		ctx.closePath();
		ctx.restore();

		ctx.save();
		ctx.translate(this.width/2-radius, this.height/2+radius);

		//裁剪区域	
		ctx.beginPath();
		ctx.arc(radius, -radius, radius, 0, 2*pi);
		ctx.clip();
		ctx.closePath();

		//波浪线1
		var pointWave = 1; //左上角和右上角纵坐标波动幅度小点，所以除以pointWave
		ctx.beginPath();
		var dis_y = -(2*radius - y);

		ctx.moveTo(0, 0);
		ctx.lineTo(0, dis_y); 
		ctx.bezierCurveTo(
			0.7,		dis_y + leftHeight / pointWave,
			1.4*radius, dis_y + rightHeight / pointWave, 
			2*radius,	dis_y
		);
		ctx.lineTo(2*radius, 0);
		ctx.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 0.2)';
		ctx.fill();
		ctx.closePath();

		//波浪线2
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, dis_y);
		ctx.quadraticCurveTo(radius, dis_y+leftHeight, 2*radius, dis_y);
		ctx.lineTo(2*radius, 0);
		ctx.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 0.2)';
		ctx.fill();
		ctx.closePath();

		ctx.restore();
	};

	var _length = 0;			//弧长
	var waveAngle = 0;		//波动的起始角
	var minutes = 0;			//目前所耗分钟数
	var wave_speed = 2;			//波动速度
	var wave_height = 40;
	var animate_over = false;	//时钟动画是否结束
	var scale_num = 1;
	var scale_speed = 0.01;

	//颜色渐变计算
	var green = {
		r: 68,
		g: 190,
		b: 6
	};
	var yellow = {
		r: 178,
		g: 213,
		b: 54 
	};
	var red = {
		r: 242,
		g: 107,
		b: 26 
	};
	var g2y = {};//绿——黄
	var y2r = {};//黄——红
	var split = 70;//中间渐变的分割点
	var r_split = 100 - split;
	var firstTime = 0;//从0点开始完成第一次渐变（变成黄色）所需的时间

	if( this.consume ) {
		var now_color = green; //当前颜色
		var	now_num = 0; //目前已经消耗的百分比，即100-液体剩余的百分比
		firstTime = this.allMinutes * split/100;
	} else {
		var now_color = red; //当前颜色
		var	now_num = 100; //目前已经消耗的百分比，即100-液体剩余的百分比
		firstTime = this.allMinutes * r_split/100;
	}
	//r、g、b值在该部分渐变时间内的速度
	g2y.r = (yellow.r - green.r) / split;
	g2y.g = (yellow.g - green.g) / split;
	g2y.b = (yellow.b - green.b) / split;

	y2r.r = (red.r - yellow.r) / r_split;
	y2r.g = (red.g - yellow.g) / r_split;
	y2r.b = (red.b - yellow.b) / r_split;

	this.run = function(){
		if( minutes <= self.minutes ){
			self.ctx.clearRect(0, 0, self.width, self.height);

			self.makeCircle(149, 2*pi, self.color.gray, 1);
			self.makeCircle(138, 2*pi, now_color, 1);
			self.makeClock(145, self.timeScale, self.color.gray);
			self.drawTip(180, _length, minutes, animate_over, scale_num, now_color);

			self.drawWave(138, now_num, waveAngle, now_color, wave_height);
			//self.makeWater(210, now_num);
			self.makeCircle(138, _length, now_color, 3);
			self.drawBall(138, _length, now_color);

			if( now_num <= split ){
				now_color = {
					r: parseInt(green.r + g2y.r * now_num),
					g: parseInt(green.g + g2y.g * now_num),
					b: parseInt(green.b + g2y.b * now_num)
				};
			} else if( now_num > split && now_num <= 100 ){
				var o_num = now_num - split;
				now_color = {
					r: parseInt(yellow.r + y2r.r * o_num),
					g: parseInt(yellow.g + y2r.g * o_num),
					b: parseInt(yellow.b + y2r.b * o_num)
				};
			}
			
			//消耗 now_num 从0到self.num
			if( self.consume ) now_num = (100 - self.num)/self.minutes * minutes;
			//充电 now_num 从100到0
			else now_num = 100 - (100/self.minutes) * minutes;

			_length = (self.minutes/self.allMinutes * 2*pi)/self.minutes * minutes;
			waveAngle += wave_speed;
			minutes++;

			//时钟结束
			if( minutes >= self.minutes ) {
				minutes = self.minutes;
				animate_over = true;

				if( scale_num >= 1.1) scale_speed = -scale_speed;
				if( scale_num < 1) scale_speed = 0;
				scale_num += scale_speed;

				if( !self.consume ){
					if( wave_height ) wave_height--;
					else wave_height = 0;
				}
			}

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
	color: {
		blue:	'#0096ff',
		green:	'#44be05',
		yellow:	'#ffc411',
		red:	'#f86117',
		gray:	'#b3b3b3'
	},
	minutes: 220,
	allMinutes: 300,
	num: 0,
	consume: false 
});
