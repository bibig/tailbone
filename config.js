exports.create = create;

var path = require('path');
var yi   = require('yi');


// base settings
var Config = {
  
  favicon   : path.join(__dirname, './public/images/favicon.ico'),
  pageTitle : 'something wrong :(',
  imagesMap : {},

  // cdn settings  
  javascripts: {
    jquery    : '//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.11.0.min.js',
    bootstrap : '//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js'
  },

  stylesheets: {
    bootstrap : '//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css',
    fa        : '//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css'
  },

  messages: {
    '404': 'Sorry, the page you visit does not exist.',
    '500': 'Sorry, something wrong in server.'
  }
};


// all local url should added viewMount and staticRoot
function create (viewMount, staticRoot) {
  var config = yi.clone(Config);

  config.stylesheets.base = path.join(viewMount, staticRoot, '/stylesheets/error.css');
  config.imagesMap['404'] = path.join(viewMount, staticRoot, '/images/ghost.png');

  return config;
}