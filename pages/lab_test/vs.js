var $box = $('.box');

var vsAnimation = function(opts){
	var self = this;
	this.opts = $.extend({
		dom: '',
		content: [],
		color: {}
	}, opts);

	this.$dom = this.opts.dom;
	this.content = this.opts.content;
	this.color = this.opts.color;

	this.canvas = this.$dom.find('canvas');
	this.width = this.$dom.width();
	this.height = this.$dom.height();
	this.ctx = this.canvas.get(0).getContext('2d');

	var pi = Math.PI;
	var point_radius = 2;
	var c_radius = 35;//大圆半径
	var r_angle = 0;//转动起始角
	var each_angle = 15;//度数
	var run_speed = 8;

	var line_angle = -pi/4;
	var r_line = c_radius;//线目前的位置
	var l_line = -c_radius;//线目前的位置
	var m_speed = 2;//线移动速度

	this.makeCircle = function(r_angle){
		var ctx = this.ctx;
		var now_angle = r_angle;

		for(var i=0; i<24; i++){
			now_angle += each_angle;

			ctx.save();
			ctx.translate(this.width/2, this.height/2);
			ctx.rotate(now_angle/180 * pi);
			ctx.beginPath();

			ctx.arc(c_radius, 0, point_radius, 0, 2*pi);
			ctx.closePath();
			ctx.fillStyle = self.color.gray;
			ctx.fill();

			ctx.restore();
		}
	};
	this.makeLine = function(m_line){
		var ctx = this.ctx;
		ctx.save();
		ctx.translate(this.width/2, this.height/2);
		ctx.rotate(line_angle);

		ctx.beginPath();

		ctx.arc(m_line, 0, 3, 0, 2*pi);
		ctx.lineWidth = 1;
		ctx.strokeStyle = self.color.gray;
		ctx.stroke();
		ctx.closePath();

		if( m_line > 0 ){
			var p_num = Math.ceil((m_line - c_radius) / 10);
			for(var i=1; i<p_num; i++){
				ctx.beginPath();
				ctx.arc(m_line - i * 10, 0, point_radius, 0, 2*pi);
				ctx.fillStyle = self.color.gray;
				ctx.fill();
				ctx.closePath();
			}
		} else {
			var p_num = Math.ceil((-m_line - c_radius) / 10);
			for(var i=1; i<p_num; i++){
				ctx.beginPath();
				ctx.arc(m_line + i * 10, 0, point_radius, 0, 2*pi);
				ctx.fillStyle = self.color.gray;
				ctx.fill();
				ctx.closePath();
			}
		}

		ctx.restore();
	};

	this.run = function(){
		if( r_angle <= 360){
			self.ctx.clearRect(0, 0, self.width, self.height);

			self.makeCircle(r_angle);

			self.animation = requestAnimationFrame(self.run);
			r_angle += run_speed;

		} else if( r_angle > 360 && r_line < c_radius + 70 ){
			self.ctx.clearRect(0, 0, self.width, self.height);

			self.makeCircle(360);
			r_line += m_speed;
			l_line -= m_speed;
			self.makeLine(r_line);
			self.makeLine(l_line);

			self.animation = requestAnimationFrame(self.run);
		} else {
			cancelAnimationFrame(this.animation);
		}
	};
	this.animation = requestAnimationFrame(this.run);
};

var vsAnimate = new vsAnimation({
	dom: $box,
	color: {
		gray: 'gray'
	},
});
