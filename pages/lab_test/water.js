var $box = $('#box');

var batterWatter = function(opts){
	var self = this;
	this.opts = $.extend({
		dom: ''
		timeScale: [],
		percentage: 50,
		minutes: 160,
		allminutes: 300,
		color: [],
		time: 2000,
		diameter: 200
	}, opts)

	this.$dom = this.opts.dom; 

	//画圆弧
	this.makeCircle = function(diameter, length, color, borderWidth, time){
	};
};

