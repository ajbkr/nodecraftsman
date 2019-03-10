'use strict'

const fs = require('fs')
const util = require('util')
const { EventEmitter } = require('events')

function FilesizeWatcher (path) {
  if (/^\//.test(path) === false) {
    process.nextTick(_ => {
      this.emit('error', 'Path does not start with a slash')
    })
    return
  }

  fs.stat(path, (err, stats) => {
    if (err) {}
    this.lastfilesize = stats.size
  })

  this.interval = setInterval(_ => {
    fs.stat(path, (err, stats) => {
      if (err) {}
      if (stats.size > this.lastfilesize) {
        this.emit('grew', stats.size - this.lastfilesize)
        this.lastfilesize = stats.size
      } else if (stats.size < this.lastfilesize) {
        this.emit('shrank', this.lastfilesize - stats.size)
        this.lastfilesize = stats.size
      }
    })
  }, 1 * 1000)
}

util.inherits(FilesizeWatcher, EventEmitter)

FilesizeWatcher.prototype.stop = function () {
  clearInterval(this.interval)
}

module.exports = FilesizeWatcher
