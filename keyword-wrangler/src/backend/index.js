'use strict'

const { Server } = require('./server')

const server = Server(3000)

server.listen(_ => {
  console.log(`Server started and listening on port ${server.options.port}...`)
})
