exports.create = create;

var Tailbone = require('./libs/tailbone');

function create (settings) {
  return new Tailbone(settings);
}