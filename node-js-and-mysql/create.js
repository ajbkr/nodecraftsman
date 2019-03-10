'use strict'

const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'my-secret-pw'
})

connection.query('CREATE DATABASE node', err => {
  if (err) {
    console.log('Could not create database "node"')
  }
})

connection.query('USE node', err => {
  if (err) {
    console.log('Could not switch to database "node"')
  }
})

connection.query([
  'CREATE TABLE test (',
  '  id INT(11) AUTO_INCREMENT,',
  '  content VARCHAR(255),',
  '  PRIMARY KEY(id)',
  ')'
].join('\n'),
err => {
  if (err) {
    console.log('Could not create table "test"')
  }
})

connection.query('INSERT INTO test (content) VALUES ("Hello")')
connection.query('INSERT INTO test (content) VALUES ("World")')

connection.query([
  'CREATE TABLE passwords (',
  '  id INT(11) AUTO_INCREMENT,',
  '  password VARCHAR(255),',
  '  PRIMARY KEY(id)',
  ')'
].join('\n'),
err => {
  if (err) {
    console.log('Could not create table "passwords"')
  }
})

connection.query('INSERT INTO passwords (password) VALUES ("secret")')
connection.query('INSERT INTO passwords (password) VALUES ("dont_tell")')

connection.end()
