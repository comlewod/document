var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');

var Cake = require('./cake.jsx');
var House = Cake.house;
ReactDom.render(
	<House></House>,
	$('#box').get(0)
);
