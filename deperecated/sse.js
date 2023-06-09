/**
 * https://github.com/koajs/examples/blob/master/stream-server-side-events/sse.js
 * Create a transform stream that converts a stream
 * to valid `data: <value>\n\n' events for SSE.
 */

var Transform = require('stream').Transform;
var inherits = require('util').inherits;

module.exports = SSE;

inherits(SSE, Transform);

function SSE(options) {
  if (!(this instanceof SSE)) return new SSE(options);

  options = options || {};
  Transform.call(this, options);
}

SSE.prototype._transform = function(data, enc, cb) {
  this.push('data: ' + data.toString('base64') + '\n\n');
  cb();
};