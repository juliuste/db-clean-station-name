#!/usr/bin/env node
'use strict'

const mri = require('mri')
const clean = require('.')
const cleanWithLocation = require('./lib/with-location')

const argv = mri(process.argv.slice(2))

const name = argv._[0]
if (typeof name !== 'string' || !name) {
	console.error('missing name positional argument')
	process.exit(1)
}

let _clean = clean
const args = [name]
if (argv.lat && typeof argv.lat !== 'number') {
	console.error('--lat must be a number')
	process.exit(1)
}
if (argv.lon && typeof argv.lon !== 'number') {
	console.error('--lon must be a number')
	process.exit(1)
}
if ((argv.lat && !argv.lon) || (!argv.lat && argv.lon)) {
	console.error('--lat and --lon imply each other')
	process.exit(1)
}
if (argv.lat && argv.lon) {
	_clean = cleanWithLocation
	args.push({
		latitude: argv.lat,
		longitude: argv.lon
	})
}

console.log(_clean(...args))
