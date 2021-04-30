const types = require('ezapi').types
const fs = require('fs')
const path = require('path')
const xpm2png = require('xpm2png')
const { execSync } = require('child_process')
const exifr = require('exifr')
const sharp = require('sharp')
const utilities = require('./utilities.js')
const ffmpeg = require('fluent-ffmpeg')


module.exports = [

	// ---------------- CAT_MEDIA ----------------

	{
		url: '/vibrant',
		type: 'get',
		description: 'get prominant colours from image',
		category: types.CAT_MEDIA,
		schema: {
			path: {
				type: 'string',
				required: true
			}
		},
		data: async params => {
			return await utilities.vibrant(  params.path )
		}
	},
	{
		url: '/ffmpeg_screenshot',
		type: 'get',
		description: 'take a video screenshot',
		category: types.CAT_MEDIA,
		schema: {
			source: {
				type: 'string',
				required: true
			},
			destination: {
				type: 'string',
				required: true
			},
			timemarks: {
				type: 'array',
				required: true,
				minLength: 1
			},
			size: {
				type: 'string',
				required: true
			}

		},
		data: async params => {

			const i = params.destination.lastIndexOf('/')
			const filename = params.destination.substring(i + 1)
			const folder = params.destination.substring(0, i)

			return (await (new Promise( (resolve,reject) => { 

				let filenames = []
				const vid = new ffmpeg({ 
					source: params.source,
					nolog: true 
				})
				vid
				.on('filenames', function( filenames_ ) {
					filenames = filenames_
					// resolve( filenames )

				})
				.on('end', function( error ) {
					if (error) reject(error)
					if (!error) resolve(filenames)
				})
				.screenshot(
					{ 
						timemarks: params.timemarks, //[ '00:00:02.000' ], 
						size: params.size,
						filename
					}, 
					folder
				)
			})))
		}
	},
	{
		url: '/ffprobe',
		type: 'get',
		description: 'probe video information with ffmpeg',
		category: types.CAT_MEDIA,
		schema: {
			path: {
				type: 'string',
				required: true
			}
		},
		data: async params => {
			return await utilities.ffprobe(  params.path, params )
		}
	},
	{
		url: '/exif',
		type: 'get',
		description: 'probe video information with ffmpeg',
		category: types.CAT_MEDIA,
		schema: {
			path: {
				type: 'string',
				required: true
			}
		},
		data: async params => {
			return await utilities.get_exif(  params.path )
		}
	},
	{
		url: '/xpm2png',
		type: 'post',
		description: 'retrieve a png from xpm',
		category: types.CAT_MEDIA,	
		schema: {
			path: {
				type: 'string',
				description: 'path to xpm file',
				required: true
			}
		},
		data: async params => {
			const input = params.path
			const name = path.basename( input )
			const output = path.join( __dirname, '../bin/icons/' + name + '.png' )
			if (await fs.existsSync(output)) return output
			const img = await xpm2png( input, true )
			const file = await img.writeAsync( output )
			return output
		},
		next: async (req, res, data) => res.sendFile( data )
	},
	{
		url: '/icons',
		type: 'get',
		description: 'find application icons',
		category: types.CAT_MEDIA,	
		schema: {
			iname: {
				type: 'string',
				description: 'iname of app',
				required: true
			}
		},
		data: async params => {
			const s = params.iname
			const cmd = `find /usr/share/icons /usr/share/pixmaps -iname '*${s}*.xpm' -o -iname '*${s}*.png' -o -iname '*${s}*.svg'`
			const data = ( await execSync( cmd ) ).toString().split('\n').filter( e => e != '' )
			return data
		}
	},
	{
		url: '/exif',
		type: 'get',
		description: 'get jpeg exif data',
		category: types.CAT_MEDIA,	
		schema: {
			path: {
				type: 'string',
				description: 'path to jpeg file',
				required: true
			},
			tags: {
				type: 'string',
				description: 'comma-separated list of tags',
				required: false
			}
		},
		data: async params => {
			const tags = params.tags ? params.tags.split(',') : null
			const exif = await exifr.gps( params.path, tags )
			console.log('>>>>>>>', params.path, tags, exif)
			return exif
		}
	},
	{
		url: '/resize',
		type: 'post',
		description: 'get a resized image',
		category: types.CAT_MEDIA,	
		schema: {
			file: {
				type: 'string',
				required: true
			},
			format: {
				type: 'string',
				oneOf: ['jpeg', 'png', 'webp', 'tiff', 'avif', 'heif' ],
				default: 'jpeg'
			},
			quality: {
				type: 'integer',
				default: 'jpeg'
			},
			width: {
				type: 'integer',
				default: 200
			},
			height: {
				type: 'integer',
				default: 200
			},
			fit: {
				type: 'string',
				oneOf: ['cover', 'contain', 'fill', 'inside', 'outside' ],
				default: 'cover'
			},
			position: {
				type: 'string',
				oneOf: ['top', 'right-top', 'right', 'right-bottom', 'bottom', 'left-bottom', 'left', 'left-top'],
				default: 'center'
			},
			kernel: {
				type: 'string',
				oneOf: ['lanczos3', 'lanczos2', 'mitchell', 'cubic', 'nearest'],
				default: 'lanczos3'
			}
		},
		data: async params => {
			const opts = {
				width: parseInt( params.width ) || null,
				height: parseInt( params.height ) || null,
				kernel: sharp.kernel[ params.kernel ] || sharp.kernel.lanczos3,
				fit: sharp.fit[ params.fit ] || sharp.fit.cover,
				position: params.position ? params.position.replaceAll('-', ' ') : 'center',
				quality: params.quality || 99,
				format: params.format || 'jpeg'
			}
			return await sharp( params.file ).resize( opts )[opts.format]( { quality: opts.quality } ).toBuffer()
		},
		next: async (req, res, data) => {
			res.end( data )
		}
	}
]