const types = require('ezapi').types
const os = require('os')
const fs = require('fs')
const path = require('path')
const mime = require('mime')
const shell = require('shelljs')
const { spawn, execSync } = require('child_process')
const utilities = require('./utilities.js')

module.exports = [

	// ---------------- CAT_FILE ----------------

	{
		url: '/stat',
		type: 'get',
		description: 'get info on a file',
		category: types.CAT_FILE,
		schema: {
			path: {
				type: 'string',
				required: true
			},
			ffprobe: {
				type: 'boolean'
			},
			exif: {
				type: 'boolean'
			},
			vibrant: {
				type: 'boolean'
			}
		},
		data: async params => {
			return await utilities.stat(  params.path, params )
		}
	},

	{
		url: '/ls',
		type: 'get',
		description: 'list files and folders',
		category: types.CAT_FILE,
		schema: {
			path: {
				type: 'string',
				required: true
			},
			recursive: {
				type: 'boolean'
			}
		},
		data: async params => {
			let args = [ params.path ]
			if ( params.recursive ) args.unshift( '-R' )
			let data = await shell.ls( ...args )
			if (data.stderr) throw data.stderr
			return data
		}
	},
	{
		url: '/find',
		type: 'get',
		description: 'find files with -iname',
		category: types.CAT_FILE,
		schema: {
			paths: {
				type: 'string',
				required: true,
				desc: 'comma-separated list of directories'
			},
			iname: {
				type: 'string',
				required: true,
				desc: 'comma-separated list of search queries of name'
			}
		},
		data: async params => {
			const paths = (params.paths || '').replaceAll(',',' ').trim()
			const iname = (params.iname || '').split(',')
			let search = '-iname '
			iname.forEach( (n, i) => search += (i > 0) ? `-o -iname '${n}' ` : n )
			const cmd = `find ${ paths } ${search}`
			const e = await execSync( cmd )
			return e.toString().split('\n').filter( e => e != '' )
		}
	},
	{
		url: '/cat',
		type: 'get',
		description: 'read file to string',
		category: types.CAT_FILE,
		path: {
			type: 'string',
			required: true,
			desc: 'path to file'
		},
		data: async params => await fs.readFileSync( params.path, 'utf8' )
	},
	{
		url: '/sendfile',
		type: 'get',
		description: 'receive file',
		category: types.CAT_FILE,
		path: {
			type: 'string',
			required: true,
			desc: 'path to file'
		},
		data: async params => params.path,
		next: async (req, res, data) => res.sendFile( data )
	}

]