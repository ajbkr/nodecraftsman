const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`))

io.on('connection',
  socket => console.log('A new WebSocket connection has been established'))

setInterval(_ => {
  const stockPrice = Math.floor(Math.random() * 1000)
  io.emit('stock price update', stockPrice)
}, 2 * 1000)

http.listen(3000, _ => process.stdout.write('Listening on *:3000...\n'))
