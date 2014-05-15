module.exports = Tailbone;

var path   = require('path');
var yi     = require('yi');

function Tailbone (settings) {
  
  this.initConfig(settings);
  this.initApp();

}

Tailbone.prototype.initConfig = function (settings) {
  var Config = require('../config');
  
  settings = yi.merge(settings, {
    mount           : '',
    viewMount       : '', // important, for static source url
    staticRoot      : '/tailbone',  // the route app serve the static files
    needBootstrap   : false,
    needFontAwesome : false,
    needJquery      : false,
    header          : '',
    footer          : ''
  });

  if (! settings.viewMount && settings.mount ) { settings.viewMount = settings.mount; }

  this.config = yi.merge(settings, Config.create(settings.viewMount, settings.staticRoot));

};

Tailbone.prototype.initApp = function () {
  var self = this;
  var express        = require('express');
  var favicon        = require('serve-favicon');
  var logger         = require('morgan');
  
  var swig           = require('swig');
  var app            = express();

  app.isProduction   = app.get('env') === 'production';

  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, '../views'));

  if ( ! app.isProduction ) {
    app.set('view cache', false);
    swig.setDefaults({ cache: false });
  }


  app.use(favicon(this.config.favicon));
  app.use(logger('dev'));

  app.use(this.config.staticRoot, require('stylus').middleware({
    src      : path.join(__dirname, '../public'),
    compress : (app.isProduction ? true : false),
    force    : (app.isProduction ?  false : true)
  }));
 
  app.use(this.config.staticRoot, express.static(path.join(__dirname, '../public')));

  /// error handlers
  // development error handler
  // will print stacktrace
  /// catch 404 and forwarding to error handler
  
  app.use(function(req, res, next) {
    var e = new Error();

    e.status = 404;
    next(e);
  });

  app.use(self.errorHandler());

  yi.merge(app.locals, this.config);

  this.app = app;
};

Tailbone.prototype.errorHandler = function (mounted) {
  var self = this;

  return function (e, req, res, next) {
    var status = e.status = e.status || 500;
    var locals = {
      message: self.getErrorMessage(e),
      errorImage: self.getErrorImage(status)
    };

    if ( ! self.app.isProduction ) {
      locals.error = e;
    }

    if (mounted) {
      req.__proto__ = self.app.request;
      res.__proto__ = self.app.response;
    }

    res.status(status);
    res.render(self.getView(status), locals);
  };
};

Tailbone.prototype.getErrorMessage = function (e) {
  var status;

  if (e.message) {
    return e.message;
  }

  status = e.status || 500;

  return this.config.messages[status + ''];
};

Tailbone.prototype.getErrorImage = function (status) {
  status = status + '';
  return this.config.imagesMap[status] || this.config.imagesMap['404'];
};

Tailbone.prototype.getView = function (status) {

  switch (status + '') {
    case '404':
      return '404';
    default:
      return 'error';
  }

};

Tailbone.prototype.enable = function (parentApp) {
  parentApp.use(this.app); // for 404
  parentApp.use(this.errorHandler(true)); // for error
};