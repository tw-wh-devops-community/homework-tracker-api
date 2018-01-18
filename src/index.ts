import * as http from 'http'
import App from './App'

const onListening = (): void => {
  let addr = server.address()
  let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`
  console.log(`Listening on ${bind}`)
}

const onError = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== 'listen') throw error
  let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port
  switch(error.code) {
  case 'EACCES':
    console.error(`${bind} requires elevated privileges`)
    process.exit(1)
    break
  case 'EADDRINUSE':
    console.error(`${bind} is already in use`)
    process.exit(1)
    break
  default:
    throw error
  }
}

const port = process.env.PORT || 3000
App.set('port', port)

const server = http.createServer(App)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
