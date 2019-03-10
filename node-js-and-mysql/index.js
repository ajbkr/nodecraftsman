'use strict'

const http = require('http')
const mysql = require('mysql')
const querystring = require('querystring')
const url = require('url')

http.createServer(handleRequest).listen(3000)

function handleRequest (req, res) {
  const pageContent = [
    '<!DOCTYPE html>',
    '<html>',
    '  <head>',
    '    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />',
    '  </head>',
    '  <body>',
    '    <form action="/add" method="post">',
    '      <input type="text" name="content" />',
    '      <input type="submit" value="Add content" />',
    '    </form>',
    '    <div>',
    '      <strong>Content in database:</strong>',
    '      <pre>{{dbcontent}}</pre>',
    '    </div>',
    '    <form action="/" method="get">',
    '      <input type="text" name="q" />',
    '      <input type="submit" value="Filter content" />',
    '    </form>',
    '  </body>',
    '</html>'
  ].join('\n')

  const { pathname } = url.parse(req.url)

  if (pathname === '/add') {
    let requestBody = ''

    req.on('data', data => {
      requestBody += data
    })

    req.on('end', _ => {
      const postParameters = querystring.parse(requestBody)

      addContentToDatabase(postParameters.content, _ => {
        res.writeHead(302, { 'Location': '/' })
        res.end()
      })
    })
  } else {
    const filter = querystring.parse(url.parse(req.url).query).q

    getContentsFromDatabase(filter, contents => {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.write(pageContent.replace('{{dbcontent}}', contents))
      res.end()
    })
  }
}

function getContentsFromDatabase (filter, callback) {
  const connection = mysql.createConnection({
    database: 'node',
    host: 'localhost',
    password: 'my-secret-pw',
    user: 'root'
  })
  let resultsAsString = ''

  const query = connection.query([
    'SELECT id, content FROM test',
    filter ? 'WHERE content LIKE ?' : ''
  ].join('\n'), filter ? `${filter}%` : null)

  query.on('error', err => console.log('A database error occurred:', err))

  query.on('result', result => {
    resultsAsString += `id: ${result.id}`
    resultsAsString += `, content: ${result.content}`
    resultsAsString += '\n'
  })

  query.on('end', result => {
    connection.end()
    callback(resultsAsString)
  })
}

function addContentToDatabase (content, callback) {
  const connection = mysql.createConnection({
    database: 'node',
    host: 'localhost',
    password: 'my-secret-pw',
    user: 'root'
  })

  connection.query(
    'INSERT INTO test (content) VALUES (?)',
    content,
    err => {
      if (err) {
        console.log(`Could not insert content "${content}" into database`)
      }
      callback()
    }
  )
}
