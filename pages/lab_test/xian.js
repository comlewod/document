var $box = $('.box');

var F = {};
F.getMousePos = function(e, $relaveDom) {
    var x = 0;
    var y = 0;

    if (!e) {
        var e = window.event;
    }   
    if (e.pageX || e.pageY) {
      x = e.pageX;
      y = e.pageY;
    }   
    else if (e.clientX || e.clientY) {
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }   

    if($relaveDom) {
        var offset = $relaveDom.offset();
        x -= offset.left;
        y -= offset.top;
    }   

    return {x:x, y:y};
};

var batteryWater = function(opts){
	var self = this;
	this.opts = $.extend({
		dom: '',
		content: [],
		color: {}
	}, opts)

	this.$dom = this.opts.dom; 
	this.content = this.opts.content;
	this.timeScale = this.opts.timeScale;
	this.color = this.opts.color;

	this.canvas = this.$dom.find('canvas');
	this.width = this.$dom.width();
	this.height = this.$dom.height();
	this.ctx = this.canvas.get(0).getContext('2d');

	var pi = Math.PI;
	var o_x = 30.5; //原点坐标
	var o_y = 185.5;
	var scale_width = 700;
	var each_width = parseInt(scale_width/(2 * this.timeScale.length));
	var each_height = 25;
	var scale_height = each_height * 6;
	var point_radius = 2.5; //小点半径
	var o_temp = 25; //原点坐标的起始温度
	var y_height = 0; //每个点在动画过程中的纵坐标
	var arr_pos = []; //存储每个点的坐标

	this.makeScale = function(){
		var ctx = this.ctx;
		ctx.save();
		ctx.translate(o_x, o_y);
		//温度数字
		ctx.beginPath();
		ctx.font = '10px Arial';
		ctx.fillStyle = self.color.gray;
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'right';
		ctx.fillText(o_temp, -10, 0);
		ctx.closePath();

		//温度横线
		ctx.beginPath();
		for( var i=1; i<7; i++){
			ctx.fillText(o_temp + 5 * i , -10, -i * each_height);
			ctx.moveTo(0, -i * each_height);
			ctx.lineTo(scale_width, -i * each_height);
		}
		ctx.lineWidth = 1;
		ctx.strokeStyle = self.color.l_gray;
		ctx.stroke();
		ctx.closePath();

		ctx.restore();
	};

	this.drawTemp = function(y_height){
		var ctx = this.ctx;
		ctx.save();
		ctx.translate(o_x, o_y);
		for(var i=0; i<self.content.length; i++){
			var temp_x = i * each_width;
			var ny = self.content[i].values - o_temp;
			var temp_y = -ny * 5 * y_height;
			if( i != self.content.length - 1 ){
				var nny = self.content[i+1].values - o_temp;
				var temp_ny = -nny * 5 * y_height;
			}
			if( y_height >= 1 ){
				arr_pos.push({x: temp_x, y: temp_y, values: self.content[i].values});
			}

			//温度区间块
			ctx.beginPath();
			ctx.moveTo( temp_x, 0);
			ctx.lineTo( temp_x, temp_y);
			ctx.lineTo( (i+1) * each_width, temp_ny);
			ctx.lineTo( (i+1) * each_width, 0);
			ctx.lineTo( temp_x, 0);
			ctx.fillStyle = 'rgba(89, 103, 107, 0.05)';
			ctx.fill();
			ctx.closePath();
			//竖线
			ctx.beginPath();
			ctx.moveTo(temp_x, 0);
			ctx.lineTo(temp_x, temp_y);
			ctx.strokeStyle = self.color.l_gray;
			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.closePath();
			//点与点之间的连线(除了最后一个点);
			if( i != self.content.length - 1 ){
				ctx.beginPath();
				ctx.moveTo(temp_x, temp_y);
				ctx.lineTo( (i+1) * each_width,  temp_ny);
				ctx.strokeStyle = self.color.black;
				ctx.lineWidth = 1;
				ctx.stroke();
				ctx.closePath();
			}
			//温度圆点的白色底
			ctx.beginPath();
			ctx.arc(temp_x, temp_y, point_radius-0.5, 0, 2*pi);
			ctx.fillStyle = '#fff';
			ctx.fill();
			ctx.closePath();
			//温度圆点
			ctx.beginPath();
			ctx.arc(temp_x, temp_y, point_radius-0.5, 0, 2*pi);
			ctx.strokeStyle = self.color.black;
			ctx.stroke();
			ctx.closePath();

		}
		ctx.restore();
	};

	this.makeOy = function(){
		var ctx = this.ctx;
		ctx.save();
		ctx.translate(o_x, o_y);

		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(scale_width, 0);
		ctx.strokeStyle = self.color.black;
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		for(var i=0; i<this.timeScale.length; i++){
			ctx.font = '10px Arial';
			ctx.textAlign = 'center';
			ctx.fillStyle = self.color.black;
			ctx.fillText(this.timeScale[i], (2 * i + 1)* each_width, 20);
		}
		ctx.closePath();

		ctx.beginPath();
		for(var j=0; j<2 * this.timeScale.length + 1; j+=2){
			ctx.arc(j * each_width, 0, point_radius, 0, 2*pi);
			ctx.fillStyle = self.color.black;
		}
		ctx.fill();
		ctx.closePath();

		ctx.restore();
	};
	//鼠标悬浮
	this.makeHover = function(pos){
		var ctx = this.ctx;
		ctx.save();
		ctx.translate(o_x, o_y);
		ctx.beginPath();
		ctx.arc(pos.x, pos.y, point_radius+0.5, 0, 2*pi);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.arc(pos.x, pos.y, point_radius+0.5, 0, 2*pi);
		ctx.strokeStyle = self.color.blue;
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.arc(pos.x, pos.y, 1.5, 0, 2*pi);
		ctx.fillStyle = self.color.blue;
		ctx.fill();
		ctx.closePath();

		var r = 2;			//圆角半径
		var r_width = 36;	//正方体框宽度 
		var r_height = 16;	//正方体框高度
		var a_width = 7;	//小箭头宽度
		var a_height = 3;	//小箭头高度
		var radius = 10;
		
		//温度数字框
		ctx.beginPath();
		var a_x = Math.floor(pos.x) - 0.5;
		var a_y = Math.floor(pos.y) - 25.5;
		ctx.moveTo(a_x, a_y);
		ctx.arcTo(r_width/2 + a_x, a_y, r_width/2 + a_x, 1 - a_y, r);
		ctx.arcTo(r_width/2 + a_x, r_height + a_y, r_width/2 + a_x - 1, r_height + a_y, r);
		ctx.lineTo( a_width/2 + a_x, r_height + a_y);
		ctx.lineTo( a_x, r_height + a_height + a_y);
		ctx.lineTo( a_x - a_width/2, r_height + a_y);
		ctx.arcTo(a_x - r_width/2, r_height + a_y, a_x - r_width/2, r_height + a_y - 1, r);
		ctx.arcTo(a_x - r_width/2, a_y, a_x - r_width/2 + 1, a_y, r);
		ctx.lineTo(a_x, a_y);
		ctx.fillStyle = self.color.blue;
		ctx.fill();

		ctx.font = '12px Arial';
		//ctx.font = '12px "Helvitica Neue" lighter';
		//ctx.font = '12px "Helvitica Neue", Helvitica, Arial, "Microsoft YaHei", sans-serif lighter';
		ctx.textAlign = 'center';
		ctx.fillStyle = '#fff';
		ctx.fillText(pos.values, a_x, Math.floor(pos.y) - 13);

		ctx.closePath();
		ctx.restore();
	};

	this.run = function(){
		if( y_height <  100 ){
			y_height += 2;
			self.ctx.clearRect(0, 0, self.width, self.height);
			self.makeScale();
			self.drawTemp(y_height/100);
			self.makeOy();
			self.animation = requestAnimationFrame(self.run);
		} else {
			cancelAnimationFrame(this.animation);
		}
	};
	this.animation = requestAnimationFrame(this.run);

	this.canvas.on('mousemove', function(ev){
		if( y_height >= 100 ){
			var mouse = F.getMousePos(ev, $(this));
			//相对于原点的坐标轴位置
			var pos = { x: mouse.x - o_x, y: mouse.y - o_y };
			var now_one = Math.ceil( (pos.x - each_width/2) / each_width);
			if( pos.x > 0 && pos.y < 0 ){
				self.ctx.clearRect(0, 0, self.width, self.height);
				self.makeScale();
				self.drawTemp(1);
				self.makeOy();
				self.makeHover(arr_pos[now_one]);
			}
		}
	});
};

var drawWater = new batteryWater({
	dom: $box,
	timeScale: ['网络视频', '本地视频','电子书', '微博', '拍照', '游戏', '微信', '网页', '通话', '音乐'],
	content: [
		{name: '起始点亮', values: '29.20'},
		{name: '网络视频1', values: '33.30'},
		{name: '网络视频2', values: '33.60'},
		{name: '本地视频1', values: '32.50'},
		{name: '本地视频2', values: '31.80'},
		{name: '电子书1', values: '33.30'},
		{name: '电子书2', values: '32.50'},
		{name: '微博1', values: '33.40'},
		{name: '微博2', values: '33.70'},
		{name: '拍照1', values: '37.30'},
		{name: '拍照2', values: '38.30'},
		{name: '游戏1', values: '38.50'},
		{name: '游戏2', values: '38.00'},
		{name: '微信1', values: '35.60'},
		{name: '微信2', values: '40.00'},
		{name: '网页1', values: '40.00'},
		{name: '网页2', values: '33.20'},
		{name: '通话1', values: '29.50'},
		{name: '通话2', values: '29.60'},
		{name: '音乐1', values: '37.00'},
		{name: '音乐2', values: '37.00'},
	],
	color: {
		blue:	'#0096ff',
		green:	'#44be05',
		yellow:	'#ffc411',
		red:	'#f86117',
		black:	'#59676b',
		gray:	'#b3b3b3',
		l_gray: '#e2e5e7'
	}
});
