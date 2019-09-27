'use strict'

const mapStream = require('through2-map').obj
const filterStream = require('through2-filter').obj
const { stringify, parse } = require('ndjson')
const clean = require('.')
const cleanWithLocation = require('./lib/with-location')

process.stdin
	.pipe(parse())
	.pipe(mapStream(({ name, location }) => [name, clean(name), cleanWithLocation(name, location)]))
	// .pipe(filterStream(([name, cleaned, cleanedWithLocation]) => name !== cleaned))
	.pipe(filterStream(([name, cleaned, cleanedWithLocation]) => cleanedWithLocation.short && (cleaned !== cleanedWithLocation.short)))
	.pipe(mapStream(([name, cleaned, cleanedWithLocation]) => {
		process.stdout.write(name + '\n' + cleaned + '\n' + cleanedWithLocation.short + '\n\n')
	}))
	.pipe(stringify())
	.pipe(process.stderr)
