var test = require('tape')
var Store = require('../')

var file = '/tmp/fd-chunk-store-test-' + Math.random()
test('put get', function (t) {
  t.plan(2)
  var store = Store(5, file)
  store.put(0, new Buffer('hello'), function (err) {
    t.ifError(err)
    store.get(0, function (err, buf) {
      t.deepEqual(buf, new Buffer('hello'))
    })
  })
})

test('get()', function (t) {
  var store = Store(5, file)
  store.get(0)
  t.end()
})

test('get() after destroyed', function (t) {
  t.plan(1)
  var store = Store(5, file)
  store.destroy()
  store.get(0, function (err) {
    t.ok(err)
  })
})

test('put get string', function (t) {
  t.plan(2)
  var store = Store(5, file)
  store.put(0, 'hello', function (err) {
    t.ifError(err)
    store.get(0, function (err, buf) {
      t.deepEqual(buf, new Buffer('hello'))
    })
  })
})
