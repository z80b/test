  
var webpack = require('webpack');
var config = require('./webpack.config');
var express = require('express');

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  mode: 'development'
}));

app.use('/static', express.static(__dirname + '/public'));

app.listen(3000, function(err) {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:3000/');
});