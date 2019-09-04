'use strict'

const flow = require('lodash/flow')
const escapeRegExp = require('lodash/escapeRegExp')

// one-time changes
const replaceUnderscores = name => name.replace(/_+/g, ' ')
const correctApostrophes = name => name.replace(/[`´']/g, '’')
const replaceNonRoundBrackets = name => {
	const replacedOpening = name.replace(/[[{]/g, '(')
	const replacedClosing = replacedOpening.replace(/[\]}]/g, ')')
	return replacedClosing
}

// general cleanup that needs to be run more than once
const removeEmptyBrackets = name => name.replace(/\(\s*\)/g, ' ')
const correctWhitespace = name => {
	const removedDuplicate = name.replace(/\s+/g, ' ')
	const alsoRemovedLeading = removedDuplicate.replace(/^\s+/g, '')
	const alsoRemovedTrailing = alsoRemovedLeading.replace(/\s+$/g, '')
	return alsoRemovedTrailing
}
const removeDuplicateSigns = name => name.replace(/[,:;]\s+(?=[.,:;])/g, '')
const correctSignWhitespace = name => {
	const correctedLeading = name.replace(/\s+(?=[.,:;/])/g, '')
	const alsoCorrectedTrailing = correctedLeading.replace(/(?<=[,:;])(?=[^\s])/g, ' ')
	const alsoCorrectedTrailingForPeriods = alsoCorrectedTrailing.replace(/(?<=[\p{L}])\.(?=[\p{L}]+($|[^\p{L}.]))/gu, '. ')
	const alsoCorrectedTrailingForSlashes = alsoCorrectedTrailingForPeriods.replace(/(?<=[/])\s+(?=\p{L})/gu, '')
	return alsoCorrectedTrailingForSlashes
}
const removeTrailingSigns = name => name.replace(/[,:;]\s*(?=$)/g, '')
const correctBracketWhitespace = name => {
	const correctedLeadingForOpening = name.replace(/(?<=[^\s])\(/g, ' (')
	const alsoCorrectedTrailingForOpening = correctedLeadingForOpening.replace(/\(\s+/g, '(')
	const alsoCorrectedLeadingForClosing = alsoCorrectedTrailingForOpening.replace(/\s+\)/g, ')')
	const alsoCorrectedTrailingForClosing = alsoCorrectedLeadingForClosing.replace(/\)(?=[\p{L}])/gu, ') ')
	return alsoCorrectedTrailingForClosing
}
const correctAbbreviatedStreetWhitespace = name => name.replace(/\.\sstraße/g, '.straße')
const cleanup = flow([
	removeEmptyBrackets,
	correctWhitespace,
	removeDuplicateSigns,
	correctSignWhitespace,
	removeTrailingSigns,
	correctBracketWhitespace,
	correctAbbreviatedStreetWhitespace
])

// "logical" changes (removals / replacements)
const replaceAbzweig = name => name.replace(/(?<=^|[^\p{L}])abzw\.?(?=$|[^\p{L}])/gui, 'Abzweig')
const replaceBei = name => name.replace(/(?<=^|[^\p{L}])b\.?(?=\s+\p{L}+)/gui, 'bei')
const replaceRichtung = name => name.replace(/(?<=^|[^\p{L}])Ri\.?(?=\s+\p{L}+)/gui, 'Richtung')
const replaceLocationAbbreviation = ({ short, long }) => name => {
	return name.replace(new RegExp(`\\(${short}\\.?\\)`, 'gi'), `(${long})`)
}
const removeBracketWithAbbreviation = abbreviation => name => name.replace(new RegExp(`\\(${escapeRegExp(abbreviation)}\\)`, 'gi'), ' ')
const replaceStreet = name => name.replace(/(?<=str)\./gi, 'aße')

const replaceAbbreviations = flow([
	replaceAbzweig,
	replaceBei,
	replaceRichtung,
	replaceLocationAbbreviation({ short: 'Westf', long: 'Westfalen' }),
	replaceLocationAbbreviation({ short: 'Württ', long: 'Württemberg' }),
	replaceLocationAbbreviation({ short: 'Thür', long: 'Thüringen' }),
	replaceLocationAbbreviation({ short: 'Meckl', long: 'Mecklenburg' }),
	removeBracketWithAbbreviation('S+U'),
	removeBracketWithAbbreviation('Bus'),
	removeBracketWithAbbreviation('Tram'),
	removeBracketWithAbbreviation('S'),
	removeBracketWithAbbreviation('U'),
	replaceStreet
])

const removeLineNames = name => name.replace(/(?<=^|[(\s,])[SUsu]\s?[0-9]{0,2}(?=$|[)\s,])/g, ' ')

module.exports = {
	replaceUnderscores,
	correctApostrophes,
	replaceNonRoundBrackets,

	removeEmptyBrackets,
	correctWhitespace,
	removeDuplicateSigns,
	correctSignWhitespace,
	removeTrailingSigns,
	correctBracketWhitespace,
	correctAbbreviatedStreetWhitespace,
	cleanup,

	replaceAbzweig,
	replaceBei,
	replaceRichtung,
	replaceLocationAbbreviation,
	removeBracketWithAbbreviation,
	replaceStreet,
	replaceAbbreviations,

	removeLineNames
}
