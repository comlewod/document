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
	this.color = this.opts.color;

	this.canvas = this.$dom.find('canvas');
	this.width = this.$dom.width();
	this.height = this.$dom.height();
	this.ctx = this.canvas.get(0).getContext('2d');

	var pi = Math.PI;
	var scale_width = 700;
	var scale_height = 25;
	var point_radius = 2.5;

	this.makeScale = function(){
		var ctx = this.ctx;
		ctx.save();
		ctx.translate(30.5, 185.5);
		ctx.beginPath();
		
		ctx.font = '10px';
		ctx.strokeStyle = self.color.gray;
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'right';
		ctx.strokeText(25, -10, 0);

		for( var i=1; i<7; i++){
			ctx.strokeText(25 + 5 * i , -10, -i * scale_height);
			ctx.moveTo(0, -i * scale_height);
			ctx.lineTo(scale_width, -i * scale_height);
		}

		ctx.lineWidth = 1;
		ctx.strokeStyle = self.color.l_gray;
		ctx.stroke();
		ctx.closePath();
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(scale_width, 0);
		ctx.strokeStyle = self.color.black;
		ctx.stroke();

		ctx.arc(0, 0, point_radius, 0, 2*pi);
		ctx.fillStyle = self.color.black;
		ctx.fill();

		ctx.closePath();
		ctx.restore();
	};

	this.run = function(){
		this.makeScale();
	};

	this.run();
};

var drawWater = new batteryWater({
	dom: $box,
	timeScale: ['网络视频', '本地视频‘， ’电子书', '微博', '拍照', '游戏', '微信', '网页', '通话', '音乐'],
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
		{name: '微信2', values: '34.20'},
		{name: '网页1', values: '33.20'},
		{name: '网页2', values: '33.20'},
		{name: '通话1', values: '29.50'},
		{name: '通话2', values: '29.60'},
		{name: '音乐1', values: '29.80'},
		{name: '音乐2', values: '29.80'},
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
