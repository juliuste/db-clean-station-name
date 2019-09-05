'use strict'

const mapStream = require('through2-map').obj
const filterStream = require('through2-filter').obj
const { stringify, parse } = require('ndjson')
const clean = require('.')

process.stdin
	.pipe(parse())
	.pipe(mapStream(({ name }) => [name, clean(name)]))
	.pipe(filterStream(([name, cleanedName]) => name !== cleanedName))
	.pipe(mapStream(([name, cleanedName]) => {
		process.stdout.write(name + '\n' + cleanedName + '\n\n')
	}))
	.pipe(stringify())
	.pipe(process.stderr)
