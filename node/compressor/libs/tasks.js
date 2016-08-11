var Task = function(is_tip){
	this.is_tip = is_tip || false;
	this.tasks = [];
	this.running = false;

	this.pushTask = function(fn){
		this.tasks.push(fn);
		if( !this.running ){
			this.start();
		}
	};
	
	this.start = function(){
		if( this.tasks[0] ){
			this.running = true;
			console.log('\n++++++ 任务开始 ++++++\n');
			this.tasks[0]();
		} else {
			this.is_tip && console.log('\n****** 所有任务已完成 ******\n');
		}
	};

	this.end = function(){
		if( !this.running ) return;

		this.tasks.shift();//移除数组中的第一个任务，使下一个任务排到第一位
		this.is_tip && console.log('\n------ 任务结束 ------\n');
		this.start();//开始下个任务
	};
};

var tasks = {};

var Tasks = function(name, is_tip){
	if( !name ){
		name = 'null';
	}

	var task = tasks[name];
	if( !task ){
		task = new Task(is_tip);
		tasks[name] = task;
	}
	return task;
};

module.exports = Tasks;
