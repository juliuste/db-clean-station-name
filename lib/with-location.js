'use strict'

const validateFptf = require('validate-fptf')()
const geojsonRbush = require('geojson-rbush').default
const circle = require('@turf/circle').default
const uniq = require('lodash/uniq')
const uniqBy = require('lodash/uniqBy')
const sortBy = require('lodash/sortBy')
const flatMap = require('lodash/flatMap')
const range = require('lodash/range')
const flow = require('lodash/flow')
const cleanStationName = require('.')
const { replaceAbbreviatedWord, removeFirstLevelBrackets } = require('./helpers')
const { dictionary, tree: rawTree } = require('../data.json')

const tree = geojsonRbush()
tree.fromJSON(rawTree)
const candidatesForLocation = ({ latitude, longitude }) => {
	const { features } = tree.search(circle([longitude, latitude], 1)) // search within 1km
	const candidates = (features || []).map(({ properties }) => properties)
	const uniqueCandidates = uniqBy(candidates, 'key')
	const pairs = flatMap(uniqueCandidates, ({ key, name }) => {
		const aliases = dictionary[key] || []
		return [name, ...aliases]
			.map(alias => ({
				alias: cleanStationName(alias),
				officialName: name,
				key
			}))
			.filter(({ alias }) => !!alias)
	})
	return uniqBy(pairs, 'alias')
}

const removeTrailing = (name, locationCandidates) => {
	const char = ', '
	const splitName = name.split(char)
	if (splitName.length === 0) return { name, matchedLocationKeys: [] }

	// gets all "tails" of splitName and re-joins them, e.g for a splitName
	// ['A', 'B', 'C', 'D'], this would give 'B, C, D'; 'C, D'; 'D'
	const possibilities = range(0, splitName.length)
		.map(index => range(index, splitName.length).map(idx => splitName[idx]).join(char))
		.map(cleanStationName)
		.filter(possibility => !!possibility)

	const matchingCandidates = locationCandidates.filter(({ alias }) => possibilities.includes(alias))
	if (matchingCandidates.length === 0) return { name, matchedLocationKeys: [] }

	const longestCandidate = sortBy(matchingCandidates, c => -c.alias.length)[0]
	const shortenedName = name.slice(0, -(longestCandidate.alias.length + char.length))
	const cleanedShortenedName = cleanStationName(shortenedName)

	if (!cleanedShortenedName) return { name, matchedLocationKeys: [] }
	return { name: cleanedShortenedName, matchedLocationKeys: [longestCandidate.key] }
}

const removeLeadingForChar = (char) => (name, locationCandidates) => {
	const splitName = name.split(char)
	if (splitName.length === 0) return { name, matchedLocationKeys: [] }

	// gets all "reverse-tails" of splitName and re-joins them, e.g for a splitName
	// ['A', 'B', 'C', 'D'], this would give 'A, B, C'; 'A, B'; 'A'
	const possibilities = range(0, splitName.length)
		.map(index => range(0, index + 1).map(idx => splitName[idx]).join(char))
		.map(cleanStationName)
		.filter(possibility => !!possibility)

	const matchingCandidates = locationCandidates.filter(({ alias }) => possibilities.includes(alias))
	if (matchingCandidates.length === 0) return { name, matchedLocationKeys: [] }

	const longestCandidate = sortBy(matchingCandidates, c => -c.alias.length)[0]
	const shortenedName = name.slice(longestCandidate.alias.length + char.length)
	const cleanedShortenedName = cleanStationName(shortenedName)

	// @todo filter this out in the initial regex instead
	if (
		!cleanedShortenedName ||
		cleanedShortenedName[0] === '(' ||
		cleanedShortenedName.indexOf('bei ') === 0 ||
		cleanedShortenedName.indexOf('a ') === 0 ||
		cleanedShortenedName.indexOf('a.') === 0) {
		return { name, matchedLocationKeys: [] }
	}

	return { name: cleanedShortenedName, matchedLocationKeys: [longestCandidate.key] }
}

// these terms cannot be the only thing that is left after truncation as they need further context
const shortNameBlacklist = [
	'Stadt',
	'Ort',
	'Zentrum',
	'Mitte',
	'Haltepunkt',
	'Ost',
	'West',
	'Nord',
	'Süd',
	'Abzweig',
	'Kreuzung',
	'Ausgang',
	'Ortsausgang',
	'Eingang',
	'Ortseingang',
	'I',
	'II',
	'III',
	'IV',
	'V',
	'VI',
	'VII',
	'VIII',
	'IX',
	'X',
	'Bad'
	// 'ZOB',
	// 'Schule',
	// 'Kirche',
	// 'Amt',
	// 'Post',
	// 'Apotheke',
	// 'Deich',
	// 'Hof'
]

// when appearing in a shortened name, these terms should be replaced by something else
const shortNameReplacements = [
	{ short: 'Hbf', long: 'Hauptbahnhof' },
	{ short: 'Bf', long: 'Bahnhof' },
	{ short: 'Bhf', long: 'Bahnhof' }
]
const replaceShortNameAbbreviations = flow(shortNameReplacements.map(({ short, long }) => replaceAbbreviatedWord({ short, long })))

const cleanStationNameWithLocation = (name, location) => {
	validateFptf({ type: 'location', ...location })

	const cleanedName = cleanStationName(name)
	const locationCandidates = candidatesForLocation(location)

	const withoutTrailing = removeTrailing(cleanedName, locationCandidates)
	const withoutLeadingDash = removeLeadingForChar('-')(withoutTrailing.name, locationCandidates)
	const withoutLeadingSpace = removeLeadingForChar(' ')(withoutLeadingDash.name, locationCandidates)

	const matchedLocationIds = uniq(flatMap([withoutTrailing, withoutLeadingDash, withoutLeadingSpace], item => item.matchedLocationKeys))
	if (matchedLocationIds.length === 0) return { full: cleanedName, short: null, matchedLocationIds }

	const shortenedName = withoutLeadingSpace.name
	if (shortNameBlacklist.includes(removeFirstLevelBrackets(shortenedName))) return { full: cleanedName, short: null, matchedLocationIds }

	return {
		full: cleanedName,
		short: replaceShortNameAbbreviations(shortenedName),
		matchedLocationIds
	}
}

module.exports = cleanStationNameWithLocation
