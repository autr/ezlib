const md = require('./index.js').markdown
const fs = require('fs')

fs.writeFileSync('README.md', md)