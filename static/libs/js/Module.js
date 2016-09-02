var G = G || {};

(function(){
	var module = {};
	module.fn = {};

	module.define = function(name, fn){
		if( typeof fn != 'object' ) return;
		module.fn[name] = fn;
	};
	module.use = function(name, opts){
		module.fn[name].initialize(opts);
	};
	module.require = function(name, opts){
		var now_fn = module.fn[name];
		return now_fn;
	};

	G.define = module.define;
	G.use = module.use;
	G.require = module.require;
})();

