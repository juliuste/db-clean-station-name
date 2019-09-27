'use strict'

const gemeinden = require('german-administrative-areas/gemeinden.geo.json')
const assert = require('assert')
const l = require('lodash')
const flatten = require('@turf/flatten').default
const getBbox = require('@turf/bbox').default
const getBboxPolygon = require('@turf/bbox-polygon').default
const truncate = require('@turf/truncate').default
const area = require('@turf/area').default

const simplifyPolygon = polygon => {
	const bbox = getBbox(polygon.geometry)
	const bboxPolygon = getBboxPolygon(bbox)
	const share = l.round(area(polygon) / area(bboxPolygon), 2)
	assert(share > 0.25 || area(bboxPolygon) <= 20000 * 20000) // @todo
	return truncate(bboxPolygon)
}

const geojsonTypes = {
	polygon: 'Polygon',
	multiPolygon: 'MultiPolygon'
}

const buildReducedGeometries = () => {
	console.error('flattening features')
	const flattenedFeatures = l.flatMap(gemeinden, entry => entry.features || entry)

	console.error('flattening geometries')
	const flattenedGeometries = l.flatMap(flattenedFeatures, entry => {
		assert([geojsonTypes.polygon, geojsonTypes.multiPolygon].includes(entry.geometry.type))
		if (entry.geometry.type === geojsonTypes.polygon) return [entry]
		else {
			const { features } = flatten(entry.geometry)
			assert(features.every(feature => feature.geometry.type === geojsonTypes.polygon))
			return features.map(feature => ({ ...feature, properties: entry.properties }))
		}
	})

	console.error('reducing geometries')
	const reducedGeometries = flattenedGeometries.map(entry => ({
		...entry,
		geometry: simplifyPolygon(entry).geometry
	}))

	console.error('reducing properties')
	const reducedProperties = reducedGeometries.map(entry => {
		assert(!!entry.properties.GEN)
		assert(!!entry.properties.AGS_0)
		return {
			...entry,
			properties: {
				name: entry.properties.GEN,
				key: entry.properties.AGS_0
			}
		}
	})

	return reducedProperties
}

module.exports = buildReducedGeometries
