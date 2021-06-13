const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
const mime = require('mime')
const exiftool = require('node-exiftool')
const exiftoolBin = require('dist-exiftool')
const Vibrant = require('node-vibrant')

const is_file_type = ( str, file ) => {
	return file.mime.indexOf(str) != -1
}


const extract_dimensions = (file) => {
	let width, height, ratio
	try {
		if (is_file_type('image', file)) {
			const s = file.exif[0].ImageSize.split('x')
			width = parseInt( s[0] )
			height = parseInt( s[1] )
		}
		if (is_file_type('video', file)) {
			file.ffprobe.streams.forEach( stream => {
				if (stream?.width != undefined) width = stream.width
				if (stream?.height != undefined) height = stream.height
			})
		}

		ratio = (height/width)
	} catch(err) {
		console.error( err )
	}
	return { width, height, ratio }
}



let ep = new exiftool.ExiftoolProcess( exiftoolBin )
ep.open()
console.log('[api-utilities] 🖼  exiftool opened')
const UNIQUE_FILE_ID = ( obj ) => {
	return `${obj.ino}-${obj.birthtimeMs}-${obj.ctimeMs}`
}

async function vibrant( url, opts ) {
	return new Promise( (resolve,reject) => { 
		const v = new Vibrant( url, opts || {})
		v.getPalette((error, palette) => {
			if (error) reject( { error })
			if (!error) resolve( palette )
		})
	})
}

async function ffprobe ( url, params ) {
	return new Promise( (resolve,reject) => {
			ffmpeg.ffprobe( url, ( error, ffprobe ) => {
				if (!error) resolve( ffprobe )
				if (error) reject( {error} )
			})
	})
}

async function get_exif( url ) {
	return new Promise( (resolve,reject) => {
		ep
			.readMetadata(url, ['-File:all'])
			.then( res => {
				if (!res.error) resolve(res.data)
				if (res.error) reject( {error: res.error} )
			}, error => {
				reject( {error} )
			})
			.catch( error => {
				reject( {error} )
			})

	})
}

async function stat( url, params ) {

	// console.log('[api-utilities] 🖼  running stat on:', url)
	const stat = await fs.statSync( url )
	let out = {
		...stat,
		url,
		basename: path.basename( url ),
		name: path.basename( url, path.extname( url ) ),
		extname: path.extname( url ),
		isDirectory: stat.isDirectory(),
		mime: mime.getType( path.extname( url ) ) || 'folder',
	}
	out.unique_id = UNIQUE_FILE_ID(out)

	if (out.mime.indexOf('video') != -1 && params.ffprobe) {
		const probe = await ffprobe( url, params )
		if (!probe.error) out.ffprobe = probe
	}
	if (out.mime.indexOf('image') != -1 && params.exif) {
		const exif = await get_exif( url, params )
		if (!exif.error) out.exif = exif
	}
	if (out.mime.indexOf('image') != -1 && params.vibrant) {
		const vibe = await vibrant( url, params )
		if (!vibe.error) out.vibrant = vibe
	}

	out.dimensions = extract_dimensions( out )

	return out
}



module.exports = { ffprobe, stat, get_exif, vibrant, extract_dimensions }