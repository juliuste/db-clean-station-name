'use strict'

const geojsonRbush = require('geojson-rbush').default
const listWithReducedGeometries = require('./reduced-geometries')
const buildDictionary = require('./wikidata')

const build = async () => {
	const gemeinden = listWithReducedGeometries()
	const tree = geojsonRbush()
	gemeinden.forEach(feature => tree.insert(feature))

	const wikidataDictionary = await buildDictionary()

	return {
		tree: tree.toJSON(),
		dictionary: wikidataDictionary
	}
}

build()
	.then(data => process.stdout.write(JSON.stringify(data)))
	.catch(console.error)
