import * as types from './types.js'
import { spawn, execSync, spawnSync } from 'child_process'
import wta from 'wireless-tools-alt'
const { ifconfig, iwconfig, iwlist, wpa, wpa_supplicant } = wta
import pi_wifi from './piwifi.js'

export default [

	// ---------------- CAT_NET ----------------

	{
		url: '/ifconfig',
		type: 'get',	
		description: 'list of interfaces',
		category: types.CAT_NET,
		schema: {},
		data: async params => {
			return new Promise( (resolve, reject) => ifconfig.status( (err, data) => {
				if (err) return reject(err)
				resolve(data)
			}) )
			
		}
	},
	{
		url: '/iwconfig',
		type: 'get',	
		description: 'list of active connections',
		category: types.CAT_NET,
		schema: {},
		data: async params => {
			return new Promise( (resolve, reject) => iwconfig.status( (err, data) => {
				if (err) return reject(err)
				resolve(data)
			}))
		}
	},
	{
		url: '/iwlist',
		type: 'get',	
		description: 'scan for networks',
		category: types.CAT_NET,
		schema: {
			iface: {
				type: 'string',
				required: false,
				desc: 'interface name (defaults to wlan0)'
			}
		},
		data: async params => {
			return new Promise( (resolve, reject) => iwlist.scan( { 
					iface: params.iface || 'wlan0',
					show_hidden: true
				}, (err, data) => {
				if (err) return reject(err)
				resolve(data)
			}) )
			
		}
	},
	{
		url: '/wpa_status',
		type: 'get',	
		description: 'status of wpa_supplicant',
		category: types.CAT_NET,
		schema: {
			iface: {
				type: 'string',
				required: false,
				desc: 'interface name (defaults to wlan0)'
			}
		},
		data: async params => {
			return new Promise( (resolve, reject) => wpa.status( params.iface || 'wlan0', (err, data) => {
				if (err) return reject(err)
				resolve(data)
			}) )
			
		}
	},
	{
		url: '/wpa_supplicant_enable',
		type: 'post',	
		description: 'connect to wifi network',
		category: types.CAT_NET,
		schema: {
			ssid: {
				type: 'string',
				required: true,
				desc: 'name of wifi network'
			},
			pass: {
				type: 'string',
				required: false,
				desc: 'password for wifi network'
			},
			iface: {
				type: 'string',
				required: false,
				desc: 'interface name (defaults to wlan0)'
			}
		},
		data: async params => {
			const opts = {
			  interface: params.iface || 'wlan0',
			  ssid: params.ssid,
			  passphrase: params.pass,
			  driver: 'wext'
			}
			if (!params.ssid) return res.status(500).send({ message: 'no ssid supplied'})
			return new Promise( (resolve, reject) => wpa_supplicant.enable( opts, params.pass || '', (err, data) => {
				if (err) return reject(err)
				resolve(data)
			}) )
		}
	},
	{
		url: '/connect',
		type: 'post',	
		description: 'connect to wifi network',
		category: types.CAT_NET,
		schema: {
			ssid: {
				type: 'string',
				required: true,
				desc: 'name of wifi network'
			},
			pass: {
				type: 'string',
				required: false,
				desc: 'password for wifi network'
			}
		},
		data: async params => {
			if (!params.ssid) return res.status(500).send({ message: 'no ssid supplied'})
			return new Promise( (resolve, reject) => pi_wifi.connect( params.ssid, params.pass || '', (err, data) => {
				if (err) return reject(err)
				resolve(data)
			}))
		}
	},
	{
		url: '/netstat',
		type: 'get',
		description: 'show list of TCP connections',
		category: types.CAT_NET,
		schema: {},
		data: async params => {

			return JSON.parse( await (await execSync( 'netstat | jc --netstat')).toString() )
		}
	}

]

