var config = {};
var path = require('path');

config.favicon = path.join(__dirname, './public/images/favicon.ico');

// cdn settings
config.javascripts = {
  jquery    : '//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.11.0.min.js',
  bootstrap : '//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js'
};

config.stylesheets = {
  base      : '/stylesheets/error.css',
  bootstrap : '//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css',
  fa        : '//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css'
};

config.messages = {
  '404': 'Sorry, the page you visit does not exist.',
  '500': 'Sorry, something wrong in server.'
};

config.imagesMap = {
  '404': '/images/ghost.png'
};

config.pageTitle = '出错了';

module.exports = config;