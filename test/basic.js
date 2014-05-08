var should = require('should');
var request = require('supertest');

var express  = require('express');
var Tailbone = require('../index');

var tailbone = Tailbone.create({pageTitle: 'Error page'});
var app      = express();

app.get('/error', function (req, res, next) {
  // console.log('error emit');
  next(new Error('test 500 error'));
});

tailbone.enable(app);

describe('<basic test>', function () {

  var agent = request.agent(app);

  it('get /none-exist', function (done) {

    agent
      .get('/none-exist')
      .expect(404)
      .end(function (e, res) {

        if (e) { console.error(e); console.log(e.stack); return; }

        should.not.exist(e);

        // console.log(res.text);

        done();

      });

  });

  it('get /error', function (done) {

    agent
      .get('/error')
      .expect(500)
      .end(function (e, res) {

        if (e) { console.error(e); console.log(e.stack); return; }

        should.not.exist(e);

        // console.log(res.text);

        done();

      });

  });

});