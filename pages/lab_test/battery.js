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

	//画电池
	
	this.makeBattery = function(){
		var b_width = 74;
		var b_height = 105;
		var r_out = 8;
		var ctx = this.ctx;
		ctx.save();
		ctx.translate(this.width/2, this.height/2);

		ctx.beginPath();
		ctx.moveTo(0, -b_height/2);
		ctx.arcTo(b_width/2, -b_height/2, b_width/2, 1-b_height/2, r_out);
		ctx.arcTo(b_width/2, b_height/2, b_width/2-1, b_height/2, r_out);
		ctx.arcTo(-b_width/2, b_height/2, -b_width/2, 1-b_height, r_out);
		ctx.arcTo(-b_width/2, -b_height/2, -b_width/2+1, -b_height/2, r_out);
		ctx.lineTo(0, -b_height/2);

		ctx.lineWidth = 2;
		ctx.strokeStyle = self.color.gray;
		ctx.stroke();
		ctx.closePath();

		ctx.restore();

	};


	//波浪
	this.drawWave = function(radius, nowNum, waveAngle, color, waveHeight){
		var b_width = 70;
		var b_height = 100;
		var r_out = 6;
		var ctx = this.ctx;
		//y为弧长相对应的纵轴长度，即整个高度需要减去的长度
		var y = nowNum/100 * 2 * radius;
		
		//左右两边点的波浪范围
		var leftHeight = waveHeight * Math.cos(waveAngle/180 * pi);
		var rightHeight = waveHeight * Math.sin(waveAngle/180 * pi);
		
		ctx.save();
		ctx.translate(this.width/2, this.height/2);

		//百分比
		/*ctx.beginPath();
		ctx.font = '40px Arial';
		ctx.textAlign = 'center';
		ctx.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ', 1)';
		ctx.fillText(parseInt(100-nowNum) + '%', 0, -40);
		ctx.closePath();*/
		ctx.restore();

		ctx.save();
		ctx.translate(this.width/2-radius, this.height/2+radius);

		//裁剪区域	
		ctx.beginPath();
		ctx.moveTo(radius, -b_height/2 - radius);
		ctx.arcTo(b_width/2 + radius, -b_height/2 - radius, b_width/2 + radius, 1-b_height/2 - radius, r_out);
		ctx.arcTo(b_width/2 + radius, b_height/2 - radius, b_width/2-1 + radius, b_height/2 - radius, r_out);
		ctx.arcTo(-b_width/2 + radius, b_height/2 - radius, -b_width/2 + radius, 1-b_height - radius, r_out);
		ctx.arcTo(-b_width/2 + radius, -b_height/2 - radius, -b_width/2+1 + radius, -b_height/2 - radius, r_out);
		ctx.lineTo(radius, -b_height/2 - radius);
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
	var wave_height = 20;
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
			self.makeBattery();
			self.drawWave(52, now_num, waveAngle, now_color, wave_height);

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
	num: 20,
	consume: false 
});
