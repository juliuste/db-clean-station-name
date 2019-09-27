'use strict'

const wdk = require('wikidata-sdk')
const got = require('got')
const l = require('lodash')

const buildWikidataNameDictionary = async () => {
	const languages = '("de","en","fr","pl","it","es")'
	const wikidataUrl = wdk.sparqlQuery(`
        SELECT ?item ?key ?label
        WHERE 
        {
            ?item wdt:P439 ?key.
            { { ?item rdfs:label ?label filter(lang(?label) in ${languages}) } union { ?item skos:altLabel ?label filter(lang(?label) in ${languages}) } }
        }
    `)

	console.error('fetching aliases from wikidata, this might take a minute…')
	const { body } = await got.get(wikidataUrl, { json: true })

	console.error('processing results')
	const simplified = wdk.simplify.sparqlResults(body)
	const groupedByKey = Object.values(l.groupBy(simplified, 'key'))
	const byKey = l.fromPairs(groupedByKey.map(group => {
		const key = group[0].key
		const labels = l.uniq(group.map(({ label }) => label))
		return [key, labels]
	}))

	return byKey
}

module.exports = buildWikidataNameDictionary
