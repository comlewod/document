var Processor = function(opts){
	this.opts = {
		del_old_file: {},
	};
	//将opts的属性和this.opts默认属性合并
	for( var i in opts ){
		this.opts[i] = opts[i];
	}
};

Processor.prototype = {
	start: function(){
		var self = this;
		this.delOldFile(function(){
		});
	},
	delOldFile: function(callback){
		var self = this;
	}
};

module.exports = Processor;
