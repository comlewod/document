var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');

var name_arr = ['comlewod', 'koala', 'smith'];

var CakeSale = React.createClass({
	getInitialState: function(){
		return { value: 'comlewod'};
	},
	handleClick: function(event){
		this.setState({
			//value: event.target.value
			value: this.refs.text.value //这两种方法都可以实现数据双向绑定
		});
	},
	render: function(){
		var color = 'red';
		return (
		<div>
			<p style="color: {color}">123</p> 
			<p style={{color: color}}>123</p>
		</div>
		);
	}
});

ReactDom.render(
	<CakeSale></CakeSale>,
	document.body
);
