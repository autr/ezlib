const types = require('./types.js')

module.exports = ( conf ) => {

	if (!conf.type) conf.type = 'get'
	if (!conf.category) conf.category = types.CAT_SCRIPT

	let schema = {}

	for (const [k, v] of Object.entries(conf.params)) {
		schema[k] = {
			type: typeof(v),
			default: v,
			required: false
		}
	}

	if ( !conf.parse ) conf.parse = txt => txt

	return {
		url: conf.url,
		type: conf.type,
		description: (conf.description || 'no description'),
		category: conf.category,
		schema,
		data: async params => {

			const t = typoeof( conf.script )

			if ( t == 'function' ) {
				return await methods.proc.spawn( conf.script( params ) )
			} else if ( t == 'object' ) {
				return await methods.proc.spawn( conf.script )
			} else if ( t == 'string' ) {
				const txt = await methods.proc.exec( conf.script )
				return conf.parse( txt )
			} else {
				console.error('unrecognised script:', conf.script)
			}
		}
	}
}
