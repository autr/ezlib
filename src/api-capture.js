import * as types from './types.js'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import fetch from 'node-fetch'
import stdoutparse from 'generic-stdout-parser'


const slugify = text => text.toString().toLowerCase()
    .replaceAll(' ', '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -

export default [

	// ---------------- CAT_CAPTURE ----------------
	{
		url: '/v4l2_ctrls',
		type: 'get',
		description: 'retrieve a list of all controls',
		category: 'capture',	
		schema: {
			device: {
				type: 'string',
				required: true,
				default: '/dev/video0'
			}
		},
		data: async params => {
			console.log(params)

			const res = await execSync( `v4l2-ctl --device ${params.device} --list-ctrls`)
			const txt = (await res.toString()).split('\n').filter(l => l != '').join('\n')
			let out = {}
	        const a = (new stdoutparse( txt, { inputFormat: 'raw_structure_datatype_props' }).parse())?.result[0]?.properties

	        a.forEach( el => {
	        	const s = el.name.split(' ')
	        	const name = s[0]
	        	const id = s[1]
	        	let o = {
	        		name,
	        		type: el.dataType,
	        		id,
	        		properties: {}
	        	}
	        	el.properties.forEach( p => o.properties[p.name] = p.value )
	        	out[name] = o
	        })
	        return out
		}
	},
	{
		url: '/v4l2_device',
		type: 'get',
		description: 'device settings and formats',
		category: 'capture',	
		schema: {
			device: {
				type: 'string',
				required: true,
				default: '/dev/video0'
			}
		},
		data: async params => {
			console.log(params)

			const execFormats = await execSync( `v4l2-ctl --device ${params.device} -D --list-formats`)
			const execFormat = await execSync( `v4l2-ctl --device ${params.device} --get-fmt-video`)
			const execStandard = await execSync( `v4l2-ctl --device ${params.device} --get-standard`)
			const execInputs = await execSync( `v4l2-ctl --device ${params.device} -n`)

			const parseObject = (txt, array, in1, in2 ) => {
				let k
				let out = { }
				if (!in1) in1 = '\t'
				if (!in2) in2 = '\t\t'
				if (array) out[array] = {}
				txt.split('\n').forEach( l => {
					if ( l.substring(0,2) == in2 && k ) {
						if ( !Array.isArray( out[k] ) ) out[k] = [ out[k] ]
						out[slugify(k)].push( l.trim() )
					} else if ( l.substring(0,1) == in1 ) {
						const s = l.split(':')
						if (s[0]?.indexOf('[') != -1 && s[0]?.indexOf(']') != -1) {
							out.formats[s[1].substring(2,6)] = s[1].substring(7).replaceAll('(', '').replaceAll(')', '').trim()
						} else {
							let key = slugify(s[0]?.trim())
							k = key
							if (key == 'widthheight') {
								out['width'] = parseInt( s[1].split('/')[0] )
								out['height'] = parseInt( s[1].split('/')[1] )
							} else if (key =='pixel-format') {
								out[k] = l.split(':')[1].substring(2,6)
							} else {
								out[k] = s[1]?.trim()
							}
							
						}
					}
				})


				return out

			}

			const st = (await execStandard.toString()).split('\n').map( l => l = '\t' + l ).join('\n').replace('=', ':')

			console.log(st)

			return { 
				...(parseObject( await execFormats.toString(), 'formats' )),
				current_format: {
					...(parseObject( (await execFormat.toString()) + st ))
				},
				inputs: (await execInputs.toString() ).split('\n\tInput').map( s => {
					return ( parseObject( s ) )
				}).filter( o => o.name ),
			}


		}
	},


	{
		url: '/v4l2_list_cards',
		type: 'get',
		description: 'retrieve a list of all capture cards',
		category: 'capture',	
		schema: {
			rebuild: {
				desc: 'rebuild json list'
			}
		},
		data: async params => {

			const dir = './bin/'
			const dest = path.join( dir, 'v4l2_cards.json' )
			if (!fs.existsSync(dir)) await fs.mkdirSync(dir, '0744')
			if (fs.existsSync(dest) && !('rebuild' in params) ) return dest

			const res = await fetch('https://www.kernel.org/doc/Documentation/media/v4l-drivers/cardlist.rst')
			const t = await res.text()
			const a = ':maxdepth: 1'
			const items = t
				.substring( t.indexOf(a) + a.length)
				.split('\n')
				.filter( l => l != '' )
				.map( l => l.replace('\t', ''))
			let out = []
			for( let i = 0; i < items.length; i++ ) {
				const group = items[i].replace('-cardlist','')
				const rr = await fetch(`https://www.kernel.org/doc/Documentation/media/v4l-drivers/${group}-cardlist.rst`)
				const tt = await rr.text() + ''

				if (tt.indexOf(':header-rows:') != -1 && tt.indexOf('* -') != -1) {

					tt.split('* - ')
						.forEach( l => {
							const sp = l.split('\n')
							const idx = parseInt(sp[0])
							const name = sp[1].replace('     -','').trim()
							const pci = sp[2].replace('     -','').trim().split(',').map( n => n.trim() ).filter( n => n != '' )
							const o = { idx, id: slugify(name), name, pci, group }
							if (!isNaN(idx)) out.push(o)
						})
				}
			}

			await fs.writeFileSync( dest, JSON.stringify( out, null, 2 ) )
			return dest

		},
		next: (req, res, data) => {
			res.sendFile( path.resolve( data ))
		}
	}
]