module.exports = Tailbone;

var path   = require('path');
var yi     = require('yi');
var CONFIG = require('../config');

function Tailbone (settings) {
  
  this.settings = yi.merge(settings || {}, {
    mount: '',
    imagesMap   : {},
    stylesheets : {},
    javascripts : {}
  });

  this.initApp();
  this.initLocals();
}

Tailbone.prototype.initApp = function () {
  var self = this;
  var express        = require('express');
  var favicon        = require('serve-favicon');
  var logger         = require('morgan');
  // var cookieParser   = require('cookie-parser');
  // var bodyParser     = require('body-parser');
  // var session        = require('cookie-session');
  // var multipart      = require('connect-multiparty');
  // var debug       = require('debug')('app');
  // var csrf           = require('csurf');
  
  var swig           = require('swig');
  // var swigExtras  = require('swig-extras');
  var app            = express();

  app.isProduction   = app.get('env') === 'production';

  // swigExtras.useFilter(swig, 'nl2br');

  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, '../views'));

  if ( ! app.isProduction ) {
    app.set('view cache', false);
    swig.setDefaults({ cache: false });
  }
  
  // view engine setup
  // app.set('views', path.join(__dirname, 'views'));
  // app.set('view engine', 'jade');


  app.use(favicon(this.settings.favicon || CONFIG.favicon));
  app.use(logger('dev'));
  // app.use(bodyParser.json());
 //  app.use(bodyParser.urlencoded());

  /*
  app.use(multipart({
    maxFilesSize: 20 * 1024 * 1024,
    uploadDir: path.join(__dirname, 'public/uploads')
  }));
  */

  app.use(require('stylus').middleware({
     src:path.join(__dirname, '../public'),
     compress: (app.isProduction ? true : false),
     force: (app.isProduction ?  false : true)
   }));

  // app.use(cookieParser('jsoncan auths'));
  // app.use(session({keys: ['jsoncan', 'auths'], maxAge: 60 * 60 * 1000}));
  // app.use(csrf());
  app.use(express.static(path.join(__dirname, '../public')));

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
  var statusMessages = this.settings.messages || CONFIG.messages;
  var status;

  if (e.message) {
    return e.message;
  }

  status = e.status || 500;

  return statusMessages[status + ''];
};

Tailbone.prototype.getErrorImage = function (status) {
  status = status + '';
  return this.settings.imagesMap[status] ||  this.settings.mount + (CONFIG.imagesMap[status] || CONFIG.imagesMap['404']);
};

Tailbone.prototype.getView = function (status) {

  switch (status + '') {
    case '404':
      return '404';
    default:
      return 'error';
  }

};

Tailbone.prototype.initLocals = function () {

  if ( ! this.app) { return; }

  var anchors = require('bootstrap-helper').anchors;
  var locals  = this.app.locals;

  locals.pageTitle = this.settings.pageTitle || CONFIG.pageTitle;
  locals.mount     = this.settings.mount;
  
  locals.stylesheets = {
    base      : this.settings.mount + CONFIG.stylesheets.base,
    custom    : this.settings.stylesheets.customCss,
    bootstrap : this.settings.stylesheets.bootstrap || CONFIG.stylesheets.bootstrap,
    fa        : this.settings.stylesheets.fa || CONFIG.stylesheets.fa
  };

  locals.javascripts = {
    jquery    : this.settings.javascripts.jquery || CONFIG.javascripts.jquery,
    custom    : this.settings.javascripts.custom,
    bootstrap : this.settings.javascripts.bootstrap || CONFIG.javascripts.bootstrap
  };

  locals.needBootstrap    = this.settings.needBootstrap;

  if (locals.needBootstrap) {
    locals.needJquery = true;
    locals.needFontAwesome = this.settings.needFontAwesome;
  } else {
    locals.needJquery = this.settings.needJquery;  
  }

  // for user defined header and footer
  locals.header = this.settings.header;
  locals.footer = this.settings.footer;

};

Tailbone.prototype.enable = function (parentApp) {
  parentApp.use(this.app); // for 404
  parentApp.use(this.errorHandler(true)); // for error
};