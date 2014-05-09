# tailbone

+ an error handler node module
+ a modular app of express, only do one thing: render error pages for main(parent) app.


### install
  npm install tailbone

### usage

```
  var Tailbone = require('tailbone');
  var express  = require('express');

  var tailbone = Tailbone.create();
  var app      = express();

  app.get('/e', function (req, res, next) {
    next(new Error('500 error found'));
  });

  tailbone.enable(app);

  app.listen(3000);

```

### detail
  pls see examples