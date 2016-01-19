var fs = require('fs')
var inherits = require('inherits')
var EventEmitter = require('events').EventEmitter
var defined = require('defined')

module.exports = FS
inherits(FS, EventEmitter)

function FS (size, opts) {
  if (!(this instanceof FS)) return new FS(size, opts)
  var self = this
  self.size = size
  self.chunkLength = size
  if (typeof opts === 'string') opts = { path: opts }
  EventEmitter.call(self)
  self.path = opts.path
  fs.open(opts.path, 'r+', function onopen (err, fd) {
    if (err && err.code === 'ENOENT') {
      return fs.open(opts.path, 'w+', onopen)
    }
    self.fd = fd
    self.emit('open')
  })
}

function ready (f) {
  return function () {
    var self = this
    var args = arguments
    if (self.fd) f.apply(self, args)
    else self.once('open', function () { f.apply(self, args) })
  }
}

FS.prototype.get = ready(function (n, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  if (!opts) opts = {}
  if (!cb) cb = noop
  var self = this
  var buf = new Buffer(defined(opts.length, self.size))
  var total = 0
  var offset = defined(opts.offset, 0)
  fs.read(self.fd, buf, 0, buf.length, n * self.size + offset, onread)
 
  function onread (err, bytesRead) {
    if (err) return cb(err)
    else if (bytesRead < self.size) {
      cb(null, buf.slice(0, bytesRead))
    }
    else cb(null, buf)
  }
})

FS.prototype.put = ready(function (n, buf, opts, cb) {
  var self = this
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  if (buf.length !== this.size) {
    return tick(cb, new Error('invalid chunk length'))
  }
  if (!opts) opts = {}
  if (!cb) cb = noop
  var pos = self.size * n + defined(opts.offset, 0)
  var len = defined(opts.length, buf.length)
  fs.write(self.fd, buf, 0, len, pos, cb)
})

FS.prototype.destroy = ready(function (cb) {
  fs.close(this.fd, cb)
})

FS.prototype.close = ready(function (cb) {
  fs.close(this.fd, cb)
})

function noop () {}
function tick (cb, err) {
  if (cb) process.nextTick(function () { cb(err) })
}
