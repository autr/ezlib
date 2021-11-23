const fs = require('fs')
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')
const mime = require('mime')
const exiftool = require('node-exiftool')
const exiftoolBin = require('dist-exiftool')
const Vibrant = require('node-vibrant')
const getFolderSize = require('get-folder-size')

const is_file_type = ( file, str ) => {

	const TYPES = {
		IMAGE: ['image/png', 'image/gif', 'image/jpeg', 'image/webp'],
		VIDEO: ['video/webm','video/mp4','video/mpeg','video/mpeg2','video/3gpp','video/avi','video/3gpp2','video/quicktime'],
		AUDIO: ['video/ogg','video/wav','video/mp3','video/aac','video/midi'],
		XML: ['image/svg+xml','text/html','application/xhtml+xml','application/xml','text/xml'],
		CSV: ['text/csv']
	}

	let type
	Object.keys( TYPES ).forEach( k => type = TYPES[k].indexOf(file?.mime) != -1 ? k : type )

	return str == type
}


const extract_dimensions = (file, objs) => {
	let width, height, ratio
	try {
		if (is_file_type(file, 'IMAGE')) {
			const imgSize = file?.exif?.[0]?.ImageSize
			if (imgSize) {
				const s = imgSize.split('x')
				width = parseInt( s[0] )
				height = parseInt( s[1] )
			} else {
				console.warn(`[ezlib] could not find an image size in exif ${file.id}`, file, objs)
			}
		}
		if (is_file_type(file, 'VIDEO')) {
			file.ffprobe.streams.forEach( stream => {
				if (stream?.width != undefined) width = stream.width
				if (stream?.height != undefined) height = stream.height
			})

			if (!width || !height) {
				console.warn(`[ezlib] could not find an video size in ffprobe ${file.id}`, file, objs)
			}
		}

		ratio = (height/width)
	} catch(err) {
		console.error( err )
	}
	return { width, height, ratio }
}



let ep = new exiftool.ExiftoolProcess( exiftoolBin )
ep.open()
const UNIQUE_FILE_ID = ( obj ) => {
	return `${obj.ino}-${obj.birthtimeMs}-${obj.ctimeMs}`
}

async function vibrant( url, opts ) {
	console.log('[ezlib] 🎨  vibrant:', url)
	return new Promise( (resolve,reject) => { 
		const v = new Vibrant( url, opts || {})
		v.getPalette((error, palette) => {
			if (error) reject( { error })
			if (!error) resolve( palette )
		})
	})
}

async function ffprobe ( url, params ) {
	console.log('[ezlib] 🎥  ffprobe:', url)
	return new Promise( (resolve,reject) => {
			ffmpeg.ffprobe( url, ( error, ffprobe ) => {
				if (!error) resolve( ffprobe )
				if (error) reject( {error} )
			})
	})
}

async function get_exif( url ) {
	console.log('[ezlib] 📸  exif:', url)
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

	console.log('[ezlib] 🖼  stat:', url)
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

	if (out.isDirectory) {
		out.size = await ( new Promise( (resolve,reject) => {
			getFolderSize( url, (err,size) => {
				if (err) return reject(err)
				resolve(size)
			} )
		}))
	}

	out.unique_id = UNIQUE_FILE_ID(out)
	let probe, exif, vibe

	if (is_file_type(out, 'VIDEO') && params.ffprobe) {
		probe = await ffprobe( url, params )
		if (!probe.error) out.ffprobe = probe
		if (probe.error) console.error('[ezlib] error extracting ffprobe:', probe.error)
	}
	if (is_file_type(out, 'IMAGE') && params.exif) {
		exif = await get_exif( url, params )
		if (!exif.error) out.exif = exif
		if (exif.error) console.error('[ezlib] error extracting exif:', exif.error)
	}
	if (is_file_type(out, 'IMAGE') && params.vibrant) {
		vibe = await vibrant( url, params )
		if (!vibe.error) out.vibrant = vibe
		if (vibe.error) console.error('[ezlib] error extracting vibrant:', vibe.error)
	}
	out.dimensions = extract_dimensions( out, {probe,exif,vibe} )

	return out
}



module.exports = { ffprobe, stat, get_exif, vibrant, extract_dimensions, is_file_type }