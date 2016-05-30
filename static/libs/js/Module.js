var G = G || {};

(function(){
	var module = {};

	module.define = function(name, fn){
		if( typeof fn != 'object' ) return;
	};
	module.use = function(name, opts){
	};

	G.define = module.define;
	G.use = module.use;
})();

G.define('post/page', {
	bindEvent: function(opts){
		console.log(opts.name);
	});
});

G.use('post/page', {name: 'comlewod'});
