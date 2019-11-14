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
const removeLeadingAndTrailingRelicts = name => {
	const correctedLeading = name.replace(/^[^\p{L}("'’„\d]+(?=[\p{L}("'’„\d])/gui, '')
	const alsoCorrectedTrailing = correctedLeading.replace(/(?<=[\p{L})"'’“\d])[^\p{L})"'’“\d]+$/gui, '')
	return alsoCorrectedTrailing
}
const removeDuplicateSigns = name => name.replace(/[,:;]\s+(?=[.,:;])/g, '')
const correctSignWhitespace = name => {
	const correctedLeading = name.replace(/\s+(?=[.,:;/])/g, '')
	const alsoCorrectedTrailing = correctedLeading.replace(/(?<=[,:;])(?=[^\s])/g, ' ')
	const alsoCorrectedTrailingForPeriods = alsoCorrectedTrailing.replace(/(?<=[\p{L}])\.(?=[\p{L}]+($|[^\p{L}.]))/gu, '. ')
	const alsoCorrectedTrailingForSlashes = alsoCorrectedTrailingForPeriods.replace(/(?<=[/])\s+(?=\p{L})/gu, '')
	return alsoCorrectedTrailingForSlashes
}
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
	removeLeadingAndTrailingRelicts,
	correctSignWhitespace,
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
const replaceAbbreviatedWord = ({ short, long }) => name => name.replace(new RegExp(`(?<=(^|[^\\p{L}])${escapeRegExp(short.slice(0, 1))})${escapeRegExp(short.slice(1))}(?=($|[^\\p{L}]))`, 'gui'), long.slice(1))
const removeBracketWithAbbreviation = abbreviation => name => name.replace(new RegExp(`\\(${escapeRegExp(abbreviation)}\\)`, 'gi'), ' ')
const removeLeadingAbbreviation = abbreviation => name => name.replace(new RegExp(`(?<=^)${escapeRegExp(abbreviation)}(?=[\\s]+)`, 'gi'), ' ')
const replaceStreet = name => name.replace(/(?<=str)[.]?(?=($|[^\p{L}]))/gui, 'aße ')

const locationAbbreviations = [
	{ short: 'Westf', long: 'Westfalen' },
	{ short: 'Württ', long: 'Württemberg' },
	{ short: 'Thür', long: 'Thüringen' },
	{ short: 'Meckl', long: 'Mecklenburg' },
	{ short: 'Bay', long: 'Bayern' },
	{ short: 'Sachs', long: 'Sachsen' },
	{ short: 'Anh', long: 'Anhalt' },
	{ short: 'Oberpf', long: 'Oberpfalz' },
	{ short: 'Schwab', long: 'Schwaben' },
	{ short: 'Oberbay', long: 'Oberbayern' },
	{ short: 'Holst', long: 'Holstein' },
	{ short: 'Braunschw', long: 'Braunschweig' },
	{ short: 'Saalkr', long: 'Saalekreis' },
	{ short: 'Niederbay', long: 'Niederbayern' },
	{ short: 'Schwarzw', long: 'Schwarzwald' },
	{ short: 'Oldb', long: 'Oldenburg' },
	{ short: 'Uckerm', long: 'Uckermark' },
	{ short: 'Rheinl', long: 'Rheinland' },
	{ short: 'Oberfr', long: 'Oberfranken' },
	{ short: 'Rheinhess', long: 'Rheinhessen' },
	{ short: 'Hess', long: 'Hessen' },
	{ short: 'Altm', long: 'Altmark' },
	{ short: 'Limes', long: 'Limesstadt' },
	{ short: 'Vogtl', long: 'Vogtland' },
	{ short: 'Meckl', long: 'Mecklenburg' },
	{ short: 'Mittelfr', long: 'Mittelfranken' },
	{ short: 'Dillkr', long: 'Dillkreis' },
	{ short: 'Odenw', long: 'Odenwald' },
	{ short: 'Erzgeb', long: 'Erzgebirge' },
	{ short: 'Prign', long: 'Prignitz' },
	{ short: 'Oberhess', long: 'Oberhessen' },
	{ short: 'Ostfriesl', long: 'Ostfriesland' },
	{ short: 'Schlesw', long: 'Schleswig' },
	{ short: 'Unterfr', long: 'Unterfranken' },
	{ short: 'Westerw', long: 'Westerwald' },
	{ short: 'Dithm', long: 'Dithmarschen' }
]

const otherAbbreviations = [
	{ short: 'Hp', long: 'Haltepunkt' },
	{ short: 'Hs', long: 'Haltestelle' },
	{ short: 'Bf', long: 'Bahnhof' },
	{ short: 'Bhf', long: 'Bahnhof' },
	{ short: 'Glowny', long: 'Główny' },
	{ short: 'Glowna', long: 'Główna' }
]

const replaceAbbreviations = flow([
	replaceAbzweig,
	replaceBei,
	replaceRichtung,
	...locationAbbreviations.map(replaceLocationAbbreviation),
	removeBracketWithAbbreviation('S+U'),
	removeBracketWithAbbreviation('Bus'),
	removeBracketWithAbbreviation('Tram'),
	removeBracketWithAbbreviation('S'),
	removeBracketWithAbbreviation('U'),
	removeLeadingAbbreviation('S+U'),
	removeLeadingAbbreviation('S'),
	removeLeadingAbbreviation('U'),
	replaceStreet,
	...otherAbbreviations.map(replaceAbbreviatedWord)
])

const removeLineNames = name => name.replace(/(?<=^|[(\s,])[SUsu]\s?[0-9]{0,2}(?=$|[)\s,])/g, ' ')

const removeFirstLevelBrackets = name => {
	const withoutBrackets = name.replace(/\([^()]+\)/gi, '')
	return cleanup(withoutBrackets)
}

module.exports = {
	replaceUnderscores,
	correctApostrophes,
	replaceNonRoundBrackets,

	removeEmptyBrackets,
	correctWhitespace,
	removeLeadingAndTrailingRelicts,
	removeDuplicateSigns,
	correctSignWhitespace,
	correctBracketWhitespace,
	correctAbbreviatedStreetWhitespace,
	cleanup,

	replaceAbzweig,
	replaceBei,
	replaceRichtung,
	replaceLocationAbbreviation,
	replaceAbbreviatedWord,
	removeBracketWithAbbreviation,
	replaceStreet,
	replaceAbbreviations,

	removeLineNames,

	removeFirstLevelBrackets
}
