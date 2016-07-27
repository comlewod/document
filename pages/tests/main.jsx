var React = require('react');
var ReactDom = require('react-dom');
var $ = require('jquery');

var House = require('./cake.jsx');
 
ReactDom.render(
	<House></House>,
	$('#box').get(0)
);
