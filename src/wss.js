const WebSocket = require('ws')
const http = require('http')
const types = require('./types.js')

let _wss = null

module.exports = { 
	wss: async () => {

		if (_wss) return _wss

		_wss = new WebSocket.Server( { port: 9876 } )

		_wss.on('connection', function connection(ws) {

			const addr = ws._socket.address()
			console.log(`[websockets] 🌐 ✅  connection made: ${addr.address} ${addr.port}"`)

			ws.on('message', function incoming(message) {
				console.log('received: %s', message)
			})

			inform( 0, types.API_SUCCESS, 'connected to client')
		})

	}, 
	inform: async ( pid, type, message, extra ) => {

		if (!_wss) await wss()

		const msg = typeof( message ) == 'object' || typeof( message ) == 'array' ? JSON.stringify( message ) : message
		console.log(`[inform] ${type}  🌐  ${pid}: "${msg}"`, extra || '')
		wss.clients.forEach(function each(client) {
		  if (client.readyState === WebSocket.OPEN) {
		    client.send( JSON.stringify( { pid, type, msg } ) )
		  }
		})
	}
}