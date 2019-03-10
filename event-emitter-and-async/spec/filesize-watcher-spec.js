/* global afterEach, describe, expect, it */
'use strict'

const FilesizeWatcher = require('../src/filesize-watcher')
const { exec } = require('child_process')

describe('FilesizeWatcher', function () {
  const path = '/var/tmp/filesize-watcher.test'
  let watcher

  // jasmine-node doesn't call it()'s done() callback when using arrow function
  // syntax for afterEach():
  //   afterEach(_ => watcher.stop())
  afterEach(function () {
    watcher.stop()
  })

  it('should fire a "grew" event when the file grew in size', done => {
    exec(`rm -f ${path}; touch ${path}`, _ => {
      watcher = new FilesizeWatcher(path)

      watcher.on('grew', gain => {
        expect(gain).toBe(5)
        done()
      })

      exec(`echo test > ${path}`, _ => {})
    })
  })

  it('should fire a "shrank" event when the file shrank in size', done => {
    exec(`rm -f ${path}; echo test > ${path}`, _ => {
      watcher = new FilesizeWatcher(path)

      watcher.on('shrank', loss => {
        expect(loss).toBe(3)
        done()
      })

      exec(`echo a > ${path}`, _ => {})
    })
  })

  it('should fire "error" if path does not start with a slash', done => {
    const path = 'var/tmp/filesize-watcher.test'
    watcher = new FilesizeWatcher(path)

    watcher.on('error', err => {
      expect(err).toBe('Path does not start with a slash')
      done()
    })
  })
})
