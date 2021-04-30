const ezapi = require('ezapi')
const ezlib = require('./index.js')
return ezapi.app( ezlib.endpoints.all, {nocache: true} )