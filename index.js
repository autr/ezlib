export { default as createScriptEndpoint } from './src/createScriptEndpoint.js'
export * as utils  from './src/utilities.js'

import api_cloud from './src/api-cloud.js'
import api_comms from './src/api-comms.js'
import api_ext from './src/api-ext.js'
import api_file from './src/api-file.js'
import api_media from './src/api-media.js'
import api_capture from './src/api-capture.js'
import api_net from './src/api-net.js'
import api_proc from './src/api-proc.js'
import api_sys from './src/api-sys.js'
import api_scripts from './src/api-scripts.js'

const _endpoints = {
	cloud: {
		data: api_cloud,
		title: 'cloud and backup',
		description: 'TBA'
	},
	comms: {
		data: api_comms,
		title: 'hardware communication',
		description: 'midi, osc, serial'
	},
	ext: {
		data: api_ext,
		title: 'weather',
		description: 'weather'
	},
	file: {
		data: api_file,
		title: 'filesystem',
		description: 'read, write, list files and folders'
	},
	media: {
		data: api_media,
		title: 'media',
		description: ''
	},
	capture: {
		data: api_capture,
		title: 'capture',
		description: ''
	},
	net: {
		data: api_net,
		title: 'network and connections',
		description: 'wlan and network connections'
	},
	proc: {
		data: api_proc,
		title: 'processes',
		description: 'spawning apps and processes'
	},
	sys: {
		data: api_sys,
		title: 'system',
		description: 'system preferences and information'
	},
	scripts: {
		data: api_scripts,
		title: 'scripts',
		description: 'useful and miscelleneous functions'
	}
}

let _markdown = `
| category | path | method | arguments | description |
| - | - | - | - | - |`
let __endpoints = { all: [] }
let _methods = {}

for (const [k, v] of Object.entries(_endpoints)) {
	__endpoints.all = __endpoints.all.concat( v.data )
	__endpoints[k] = v.data
	_methods[k] = {}
	v.data.forEach( ep => {
		const n = `${ep.type}_${ep.url.substring(1).toLowerCase().replaceAll('/', '_')}`
		_methods[k][n] = ep
		const schema = (ep.schema || {})
		const args = Object.keys(schema).map( k => {
			const s = (schema[k]?.default) ? `=${schema[k].default}` : ''
			return k + s
		})
		_markdown += `
| ${ep.category} | ${ep.url} | ${n} | ${args.join(', ')} | ${ep.description} |`
	})
}

export const markdown = _markdown
export const endpoints = __endpoints
export const methods = _methods