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
    },

    POST: (req, res) => {
      req.onJson((err, newKeyword) => {
        if (err) {
          console.log(err)
          res.status.internalServerError(err)
        } else {
          dbSession.query(
            'INSERT INTO keyword (value, categoryID) VALUES (?, ?);',
            [newKeyword.value, newKeyword.categoryID],
            err => {
              if (err) {
                console.log(err)
                res.status.internalServerError(err)
              } else {
                res.object({ status: 'ok', id: dbSession.getLastInsertId() }).send()
              }
            }
          )
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

  server.route('/api/keywords/:id', {
    POST: (req, res) => {
      const keywordId = req.uri.child()
      req.onJson((err, keyword) => {
        if (err) {
          console.log(err)
          res.status.internalServerError(err)
        } else {
          dbSession.query(
            'UPDATE keyword SET value = ?, categoryID = ? WHERE keyword.id = ?;',
            [keyword.value, keyword.categoryID, keywordId],
            (err, result) => {
              if (err) {
                console.log(err)
                res.status.internalServerError(err)
              } else {
                res.object({ status: 'ok' }).send()
              }
            }
          )
        }
      })
    },

    DELETE: (req, res) => {
      const keywordId = req.uri.child()
      dbSession.query(
        'DELETE FROM keyword WHERE keyword.id = ?;',
        [keywordId],
        (err, result) => {
          if (err) {
            console.log(err)
            res.status.internalServerError(err)
          } else {
            res.object({ status: 'ok' }).send()
          }
        }
      )
    }
  })

  return server
}

module.exports = { Server }
