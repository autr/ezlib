import { markdown } from './index.js'
import fs from 'fs'

fs.writeFileSync('README.md', markdown)