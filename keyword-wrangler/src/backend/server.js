'use strict'

const { Percolator } = require('percolator')

const dbSession = require('../../src/backend/db-session')

function Server (port) {
  const server = Percolator({
    autoLink: false,
    port,
    staticDir: `${__dirname}/../frontend`
  })

  server.route('/api/keywords', {
    GET: (req, res) => {
      dbSession.fetchAll('SELECT id, value, categoryID FROM keyword ORDER BY id',
        (err, rows) => {
          if (err) {
            console.log(err)
            res.status.internalServerError(err)
          } else {
            res.collection(rows).send()
          }
        })
    }
  })

  server.route('/api/keywords/categories', {
    GET: (req, res) => {
      dbSession.fetchAll('SELECT id, name FROM category ORDER BY id', (err, rows) => {
        if (err) {
          console.log(err)
          res.status.internalServerError(err)
        } else {
          res.collection(rows).send()
        }
      })
    }
  })

  return server
}

module.exports = { Server }
