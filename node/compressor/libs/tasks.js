/*
 * 任务队列
 * 示例:
 * var tasks = require('task');
 * tasks('name').push(function() {
 *      setTimeout(function() {
 *          console.log(1);
 *          tasks('name').end();
 *      }, 100);
 * });
 * tasks('name').push(function() {
 *      setTimeout(function() {
 *          console.log(2);
 *          tasks('name').end();
 *      }, 200);
 * });
 * 会依次输出1、2，按push的顺序执行，在一个任务中，只有遇到tasks('name').end()时才会执行下一个任务。
 * 根据name的不同，建立不同的任务栈
*/


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
		this.running = false;
		this.is_tip && console.log('\n------ 任务结束 ------\n');
		this.start();//开始下个任务
	};

	this.isEmpty = function(){
		return this.tasks.length == 0;
	}
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
