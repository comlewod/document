var G = G || {};

(function(){
	var module = {};
	module.fn = {};

	module.define = function(name, fn){
		if( typeof fn != 'object' ) return;
		module.fn[name] = fn;
	};
	module.use = function(name, opts){
		module.fn[name].init(opts);
	};
	module.require = function(name, opts){
		var now_fn = module.fn[name];
		return now_fn;
	};

	G.define = module.define;
	G.use = module.use;
	G.require = module.require;
})();

G.define('post/page', {
	init: function(opts){
		this.bindEvent();
	},
	bindEvent: function(){
		console.log(23424);
	}
});

//G.use('post/page', {name: 'comlewod'});

var re = G.require('post/page');
//re.bindEvent();
