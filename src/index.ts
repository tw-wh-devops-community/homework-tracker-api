import * as http from 'http'
import App from './App'

const onError = (error: NodeJS.ErrnoException, currentPort: string|number): void => {
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = (typeof currentPort === 'string') ? 'Pipe ' + currentPort : 'Port ' + currentPort
  switch (error.code) {
  case 'EACCES':
    console.error(`${bind} requires elevated privileges`) // tslint:disable-line
    process.exit(1)
    break
  case 'EADDRINUSE':
    console.error(`${bind} is already in use`) // tslint:disable-line
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
server.on('error', (error) => onError(error, port))
server.on('listening', () => {
  const addr = server.address()
  const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`
  console.log(`Listening on ${bind}`) // tslint:disable-line
})
