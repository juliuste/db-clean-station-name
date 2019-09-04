'use strict'

const flow = require('lodash/flow')

const {
	replaceUnderscores,
	correctApostrophes,
	replaceNonRoundBrackets,
	cleanup,
	replaceAbbreviations,
	removeLineNames
} = require('./helpers')

const cleanStationName = flow([
	replaceUnderscores,
	correctApostrophes,
	replaceNonRoundBrackets,
	cleanup,

	removeLineNames,
	cleanup,

	replaceAbbreviations,
	cleanup
])

module.exports = cleanStationName
