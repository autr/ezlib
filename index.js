const createScriptEndpoint = require('./src/createScriptEndpoint.js')
const types = require('ezapi').types
const utils = require('./src/utilities.js')

const _endpoints = {
	cloud: {
		data: require('./src/api-cloud.js'),
		title: 'cloud and backup',
		description: 'TBA'
	},
	comms: {
		data: require('./src/api-comms.js'),
		title: 'hardware communication',
		description: 'midi, osc, serial'
	},
	ext: {
		data: require('./src/api-ext.js'),
		title: 'weather',
		description: 'weather'
	},
	file: {
		data: require('./src/api-file.js'),
		title: 'filesystem',
		description: 'read, write, list files and folders'
	},
	media: {
		data: require('./src/api-media.js'),
		title: 'media',
		description: ''
	},
	capture: {
		data: require('./src/api-capture.js'),
		title: 'capture',
		description: ''
	},
	net: {
		data: require('./src/api-net.js'),
		title: 'network and connections',
		description: 'wlan and network connections'
	},
	proc: {
		data: require('./src/api-proc.js'),
		title: 'processes',
		description: 'spawning apps and processes'
	},
	sys: {
		data: require('./src/api-sys.js'),
		title: 'system',
		description: 'system preferences and information'
	},
	scripts: {
		data: require('./src/api-scripts.js'),
		title: 'scripts',
		description: 'useful and miscelleneous functions'
	}
}

let markdown = `
| category | path | method | arguments | description |
| - | - | - | - | - |`

let endpoints = { all: [] }
let methods = { }

for (const [k, v] of Object.entries(_endpoints)) {
	endpoints.all = endpoints.all.concat( v.data )
	endpoints[k] = v.data
	methods[k] = {}
	v.data.forEach( ep => {
		const n = `${ep.type}_${ep.url.substring(1).toLowerCase().replaceAll('/', '_')}`
		methods[k][n] = ep
		const schema = (ep.schema || {})
		const args = Object.keys(schema).map( k => {
			const s = (schema[k]?.default) ? `=${schema[k].default}` : ''
			return k + s
		})
		markdown += `
| ${ep.category} | ${ep.url} | ${n} | ${args.join(', ')} | ${ep.description} |`
	})
}




const out = {
	endpoints,
	methods,
	createScriptEndpoint,
	markdown,
	utils
}

module.exports = out