'use strict'

const { Percolator } = require('percolator')

const port = 3000
const server = Percolator({ port })

server.route('/api/keywords', {
  GET: (req, res) => {
    res.object({ foo: 'bar' }).send()
  }
})

server.listen(_ => {
  console.log(`Server started and listening on port ${port}...`)
})
