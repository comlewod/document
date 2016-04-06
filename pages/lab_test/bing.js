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
	var arr_content = [];
	var all_num = 0;

	$.each(this.content, function(index, item){
		if( index ){
			var obj = {};
			var start = 100 - self.content[index-1].values * 100;
			obj.index = index - 1,
			obj.start = start/100 * 2 * pi - pi/2;
			obj.name = item.name;
			obj.color = self.color[index-1];
			obj.percent= parseInt( self.content[index-1].values * 100  - item.values * 100 );
			obj.num = parseInt( self.content[index-1].values * 100  - item.values * 100 );
			obj.end = (start + obj.percent)/100 * 2 * pi - pi/2;
			obj.middle = (obj.end + obj.start)/2;

			arr_content.push(obj);
			all_num += obj.percent;
			
			//最后的——剩余电量
			if( index == self.content.length - 1 ){
				var last = {
					index: index,
					name: '剩余电量', 
					color: self.color[index],
					start: all_num/100 * 2 * pi - pi/2,
					percent: 100 - all_num,
					num: 100 - item.values * 100,
					end: 2*pi - pi/2
				};
				last.middle = (last.end + last.start)/2;
				arr_content.push(last);
			}
		}
	});

	//画区域
	this.makeBlock = function(radius, item, height, hover){
		var ctx = this.ctx;
		var w_width = 1/180 * pi;
		var w_radius = 210;
		ctx.save();
		ctx.translate(this.width/2, this.height/2);

		//提示文字
		var makeWords = function(){
			var w_x = (w_radius + 10) * Math.cos(item.middle);
			var w_y = (w_radius + 10)* Math.sin(item.middle);
			ctx.beginPath();
			ctx.moveTo( w_radius * Math.cos(item.middle), w_radius * Math.sin(item.middle));
			ctx.lineTo( w_x, w_y);
			
			if( item.middle <= pi/2 )
			ctx.lineTo( w_x + 20, w_y);
			else
			ctx.lineTo( w_x - 20, w_y);
			ctx.strokeStyle = 'gray';
			ctx.stroke();

			ctx.font = '10px';
			ctx.strokeStyle = '#000';
			ctx.textBaseline = 'middle';
			if( item.middle <= pi/2 )
			ctx.strokeText(item.name + ' ' + item.percent + '%', w_x + 25, w_y);
			else{
				ctx.textAlign = 'right';
				ctx.strokeText(item.name + ' ' + item.percent + '%', w_x-25, w_y);
			}
			ctx.closePath();

		};
	
		ctx.beginPath();
		ctx.moveTo(0, 0);
		if( hover ){
			//用白色扇形铺垫形成白边
			ctx.arc(0, 0, radius+1, item.start, item.end);
			ctx.lineTo(0, 0);
			ctx.fillStyle = '#fff';
			ctx.fill();
			ctx.closePath();

			//hover的区域
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.arc(0, 0, radius, item.start + w_width, item.end - w_width);
			ctx.lineTo(0, 0);
			ctx.fillStyle = item.color;
			ctx.fill();
			ctx.closePath();
			
			makeWords();
			
			//小三角
			var s_radius = 210;
			var s_width = 5;
			for(var i=0; i<2; i++){
				ctx.save();
				if(i) ctx.rotate(item.end + pi/2);
				else ctx.rotate(item.start + pi/2);
				ctx.beginPath();	
				ctx.moveTo(0, -s_radius); 
				ctx.lineTo(s_width, -s_radius - s_width);
				ctx.lineTo(-s_width, -s_radius - s_width);
				ctx.lineTo(0, -s_radius);
				ctx.fillStyle = 'red';
				ctx.fill();
				ctx.closePath();
				ctx.restore();
			}
		} else {
			ctx.arc(0, 0, radius, item.start, item.end);
			ctx.lineTo(0, 0);
			ctx.fillStyle = item.color;
			ctx.fill();
			ctx.closePath();
		}
		
		if( item.index == arr_content.length - 1){
			makeWords();
		}

		ctx.restore();
	};

	this.makeCircle = function(radius){
		var ctx = this.ctx;
		ctx.save();
		ctx.translate(this.width/2, this.height/2);

		ctx.beginPath();
		ctx.arc(0, 0, radius, 0, 2*pi);
		ctx.fillStyle = '#fff';
		ctx.fill();
		ctx.closePath();

		ctx.restore();
	};
	
	var radius = 200;
	var height = 20;
	var hover_height = height + 8;
	var catch_obj = null;

	this.run = function(angle){
		catch_obj = null;
		//判断鼠标在哪个区域
		$.each(arr_content, function(index, item){
			if( angle && angle >= item.start && angle <= item.end && item.index != arr_content.length - 1 ){
				catch_obj = item;
			} else {
				self.makeBlock(radius, item, height, false);
			}
		});
		//先画中间的白色圆
		self.makeCircle(radius-height);
		//画出hover的部分
		if( catch_obj ){
			self.makeBlock(radius, catch_obj, height+8, true);
			self.makeCircle(radius-hover_height);
		}
	};
	this.run();

	this.canvas.on('mousemove', function(ev){
		var mouse = F.getMousePos(ev, $(this));
		//相对于中心原点的坐标轴位置
		var pos = { x: mouse.x - self.width/2, y: mouse.y - self.height/2 };

		//鼠标与X轴正方向的弧长
		var angle = Math.atan2(pos.y, pos.x);

		//当鼠标移到左上角区域时做处理，因为鼠标angle的范围原来为(0, pi, -pi, -0)，在x轴负方向，pi即等于-pi，即突然变小，不是一直增大的过程
		//而start和end由于从0刻度开始所以的范围是-pi/2到3/2*pi，即-pi/2 + 2 * pi，从-pi到3/2*pi是一直增大的过程
		if( angle >= -pi && angle < -pi/2 ) 
		angle = 2*pi - Math.abs(angle);

		//鼠标距离中心店的距离
		var length = Math.abs(pos.y / Math.sin(angle));
		//judge_height，当鼠标hover时，判断鼠标离开的区域为hover块的区域
		var judge_height = height;
		if( catch_obj ) judge_height = hover_height;

		if( length >= radius - judge_height && length <= radius ){
			$(this).css('cursor', 'pointer');
			self.ctx.clearRect(0, 0, self.width, self.height);
			self.run(angle);
		} else {
			$(this).css('cursor', 'default');
			self.ctx.clearRect(0, 0, self.width, self.height);
			self.run();
		}
	});
};

var drawWater = new batteryWater({
	dom: $box,
	content: [
		{name: '起始点亮', values: '1.00'},
		{name: '网络视频', values: '0.92'},
		{name: '本地视频', values: '0.81'},
		{name: '电子书', values: '0.75'},
		{name: '微博', values: '0.62'},
		{name: '拍照', values: '0.52'},
		{name: '游戏', values: '0.43'},
		{name: '微信', values: '0.36'},
		{name: '网页', values: '0.32'},
		{name: '通话', values: '0.31'},
		{name: '本地音乐', values: '0.11'},
	],
	color: [
		'#0096ff',
		'#44be05',
		'#ffc411',
		'#f86117',
		'#b3b3b3',
		'#0096ff',
		'#44be05',
		'#ffc411',
		'#f86117',
		'#b3b3b3',
		'#ffc411',
	]
});
