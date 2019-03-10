'use strict'

const http = require('http')
const querystring = require('querystring')
const url = require('url')

http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url)
  const { id } = querystring.parse(query)

  const result = {
    id,
    pathname,
    value: Math.floor(Math.random() * 100)
  }

  // setTimeout(_ => {
  res.writeHead(200, { 'Content-Type': 'application.json' })
  res.end(JSON.stringify(result))
  // }, 2 * 1000 + Math.floor(Math.random() * 1000))
}).listen(
  3000,
  _ => process.stdout.write('Echo server listening on port 3000...\n')
)
