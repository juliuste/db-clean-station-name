'use strict'

const cleanWithLoc = require('./lib/with-location')

const gorgastSchäferei = {
	id: '740366',
	name: 'Gorgast Abzw. Schäferei, Küstriner Vorland',
	location: {latitude: 52.575695, longitude: 14.558633}
}
const gothaSchäferei = {
	id: '963916',
	name: 'Gotha (b. Eilenburg) Abzw. Schäferei, Jesewitz',
	location: {latitude: 51.412833, longitude: 12.621952}
}
const kirchplatz = {
	id: '954197',
	name: 'Wölkau (b. Delitzsch) Kirchplatz, Schönwölkau',
	location: {latitude: 51.496639, longitude: 12.496993}
}
const leipzigHbf = {
	id: '8098205',
	name: 'Leipzig Hbf (tief)',
	location: {latitude: 51.345216, longitude: 12.379836}
}

console.log(cleanWithLoc(gorgastSchäferei.name, gorgastSchäferei.location))
console.log(cleanWithLoc(gothaSchäferei.name, gothaSchäferei.location))
console.log(cleanWithLoc(kirchplatz.name, kirchplatz.location))
console.log(cleanWithLoc(leipzigHbf.name, leipzigHbf.location))
