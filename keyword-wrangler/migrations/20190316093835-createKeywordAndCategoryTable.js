'use strict'

const async = require('async')

let dbm
// eslint-disable-next-line
let type
// eslint-disable-next-line
let seed

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = function (db, callback) {
  async.series([
    db.createTable.bind(db, 'keyword', {
      categoryID: {
        notNull: true,
        type: 'int'
      },
      id: {
        autoIncrement: true,
        notNull: true,
        primaryKey: true,
        type: 'int'
      },
      value: {
        length: 128,
        notNull: true,
        type: 'string',
        unique: true
      }
    }),
    db.createTable.bind(db, 'category', {
      id: {
        autoIncrement: true,
        notNull: true,
        primaryKey: true,
        type: 'int'
      },
      name: {
        length: 128,
        notNull: true,
        type: 'string'
      }
    })
  ], callback)
}

exports.down = function (db, callback) {
  async.series([
    db.dropTable.bind(db, 'keyword'),
    db.dropTable.bind(db, 'category')
  ], callback)
}

exports._meta = {
  'version': 1
}
