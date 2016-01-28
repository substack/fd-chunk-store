# fd-chunk-store

implement a [chunk store](https://github.com/mafintosh/abstract-chunk-store)
over a single file descriptor

# example

``` js
var Store = require('fd-chunk-store')

var store = Store(5, './wow')
store.put(0, new Buffer('hello'), function (err) {
  store.get(0, function (err, buf) {
    console.log(buf)
  })
})
```

output:

```
<Buffer 68 65 6c 6c 6f>
```

# api

``` js
var Store = require('fd-chunk-store')
```

## var store = Store(size, path)
## var store = Store(size, opts)

Create a store with chunks `size` bytes long at `opts.path`.

## store.on('open', function () {})

When the underlying file descriptor is opened, `'open'` fires.

## store.get(i, opts={}, cb)

Get the chunk at index `i` as `cb(err, buf)`.

## store.put(i, buf, opts={}, cb)

Put the chunk in `buf` at chunk offset `i`.

## store.destroy(cb)

Close the underlying file descriptor and destroy the underlying resource,
removing the file.

## store.close(cb)

Close the underlying file descriptor.

# install

```
npm install fd-chunk-store
```

# license

MIT
