var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');

var name_arr = ['comlewod', 'koala', 'smith'];

var CakeSale = React.createClass({
	render: function(){
		return (
			<div onClick={this.props.clickBack}>组件</div>
		);
	}
});

var House = React.createClass({
	parentClick: function(){
		console.log(123);
	},
	render: function(){
		return (
			<div>
				<CakeSale ref="cake" clickBack={this.parentClick}></CakeSale>
			</div>
		);
	}
});
module.exports = House;
