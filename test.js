'use strict'

const tape = require('tape')
const dbCleanStationName = require('.')
const dbCleanStationNameWithLocation = require('./lib/with-location')
const {
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

	replaceAbzweig,
	replaceBei,
	replaceRichtung,
	replaceLocationAbbreviation,
	replaceAbbreviatedWord,
	removeBracketWithAbbreviation,
	removeLeadingAbbreviation,
	replaceStreet,

	removeLineNames,

	removeFirstLevelBrackets
} = require('./lib/helpers')

tape('helpers', t => {
	t.equal(replaceUnderscores('a_bc	d__e'), 'a bc	d e', 'replaceUnderscores')
	t.equal(correctApostrophes('a``bc´déò\'fg'), 'a’’bc’déò’fg', 'correctApostrophes')
	t.equal(replaceNonRoundBrackets('Seestraße (Berlin) [U6] {Anmerkung…'), 'Seestraße (Berlin) (U6) (Anmerkung…', 'replaceNonRoundBrackets')

	t.equal(removeEmptyBrackets('a (b ) c d ( 	) e ( ) f( g )'), 'a (b ) c d   e   f( g )', 'removeEmptyBrackets')
	t.equal(correctWhitespace(' abc   d	 ef	g  '), 'abc d ef g', 'correctWhitespace')
	t.equal(removeLeadingAndTrailingRelicts('- (abc d ef g" ;'), '(abc d ef g"', 'removeLeadingAndTrailingRelicts')
	t.equal(removeLeadingAndTrailingRelicts('a, bc,'), 'a, bc', 'removeLeadingAndTrailingRelicts')
	t.equal(removeLeadingAndTrailingRelicts('a, bc; 	'), 'a, bc', 'removeLeadingAndTrailingRelicts')
	t.equal(removeLeadingAndTrailingRelicts('+1 und 2 '), '1 und 2', 'removeLeadingAndTrailingRelicts')
	t.equal(removeDuplicateSigns('a,  ; b. c. d. ,e, . f'), 'a; b. c. d. ,e. f', 'removeDuplicateSigns')
	t.equal(correctSignWhitespace('a.bc	:def g,h i,  j. H.-Mann-Wg./ Kaiserdamm, Bf., Test / as a.d. Oder i.H.v. Test'), 'a. bc: def g, h i,  j. H.-Mann-Wg./Kaiserdamm, Bf., Test/as a.d. Oder i.H.v. Test', 'correctSignWhitespace')
	t.equal(correctBracketWhitespace('a(bce )fg(hi) jkl (m), nop'), 'a (bce) fg (hi) jkl (m), nop', 'correctBracketWhitespace')
	t.equal(correctAbbreviatedStreetWhitespace('Test. straße Test. Straße'), 'Test.straße Test. Straße', 'correctAbbreviatedStreetWhitespace')

	t.equal(replaceAbzweig('Abzw. Berlin gabzw (abzw)'), 'Abzweig Berlin gabzw (Abzweig)', 'replaceAbzweig')
	t.equal(replaceBei('Bernau b Berlin (b Spandau b) b. Charlottenburg b'), 'Bernau bei Berlin (bei Spandau b) bei Charlottenburg b', 'replaceBei')
	t.equal(replaceRichtung('Abzweig Ri. Lichtenberg (und Ri Ahrensfelde), St. Petri'), 'Abzweig Richtung Lichtenberg (und Richtung Ahrensfelde), St. Petri', 'replaceRichtung')
	t.equal(
		replaceLocationAbbreviation({ short: 'Thür', long: 'Thüringen' })('Eisenach (Thür), Gotha (Thür.), Thür Alt (Thür. Mittelgebirge)'),
		'Eisenach (Thüringen), Gotha (Thüringen), Thür Alt (Thür. Mittelgebirge)',
		'replaceLocationAbbreviation'
	)
	t.equal(replaceAbbreviatedWord({ short: 'Hbf', long: 'Hauptbahnhof' })('Hbf Hbf-Süd Schuhbf Hbf'), 'Hauptbahnhof Hauptbahnhof-Süd Schuhbf Hauptbahnhof', 'replaceAbbreviatedWord')
	t.equal(removeBracketWithAbbreviation('S+U')('S+U Frankfurter Allee (S+U) und (U) Westhafen (S+U)'), 'S+U Frankfurter Allee   und (U) Westhafen  ', 'removeBracketWithAbbreviation')
	t.equal(removeLeadingAbbreviation('U')('U Wilmersdorfer Str./S Charlottenburg (Berlin)'), ' Wilmersdorfer Str./S Charlottenburg (Berlin)', 'removeLeadingAbbreviation')
	t.equal(removeLeadingAbbreviation('S')('U Wilmersdorfer Str./S Charlottenburg (Berlin)'), 'U Wilmersdorfer Str./ Charlottenburg (Berlin)', 'removeLeadingAbbreviation')
	t.equal(replaceStreet('Kantstr, Kantstr., Str. des 17. Juni, Strauch'), 'Kantstraße , Kantstraße , Straße  des 17. Juni, Strauch', 'replaceStreet')
	t.equal(replaceStreet('Str zur Laus, Kaiserin-Augusta-Str, Kantstr, Kantstr'), 'Straße  zur Laus, Kaiserin-Augusta-Straße , Kantstraße , Kantstraße ', 'replaceStreet')

	t.equal(removeLineNames('(S 4) Frankfurter Allee U5 (U 5) B12 (S1) U 5, Richtung A10 und U146,U7'), '( ) Frankfurter Allee   ( ) B12 ( )  , Richtung A10 und U146, ', 'removeLineNames')
	t.equal(removeFirstLevelBrackets('Hallo (Welt, dies ist) ein (Experiment (zweitens)) und erstens (a'), 'Hallo ein (Experiment) und erstens (a', 'removeFirstLevelBrackets')
	t.end()
})

tape('main module', t => {
	t.equal(
		dbCleanStationName('- S Yorckstr. S1, U 2, [U5] (S+U), Abzw. Kassel (Thür) Ri Aum.str. Frankfurt(Main),'),
		'Yorckstraße, Abzweig Kassel (Thüringen) Richtung Aum.straße Frankfurt (Main)'
	)
	t.equal(
		dbCleanStationName('Hp Szczecin Glowny Friedrichstr Strom'),
		'Haltepunkt Szczecin Główny Friedrichstraße Strom'
	)
	t.end()
})

tape('with-location', t => {
	t.deepEqual(
		dbCleanStationNameWithLocation('Berlin Jungfernheide (S)', { latitude: 52.530408, longitude: 13.299424 }),
		{ full: 'Berlin Jungfernheide', short: 'Jungfernheide', matchedLocationIds: ['11000000'] }
	)
	t.deepEqual(
		dbCleanStationNameWithLocation('S+U Jungfernheide (Berlin)', { latitude: 52.530408, longitude: 13.299424 }),
		{ full: 'Jungfernheide (Berlin)', short: 'Jungfernheide', matchedLocationIds: ['11000000'] }
	)
	t.deepEqual(
		dbCleanStationNameWithLocation('Baden-Baden', { latitude: 48.790392, longitude: 8.190773 }),
		{ full: 'Baden-Baden', short: null, matchedLocationIds: [] }
	)
	t.deepEqual(
		dbCleanStationNameWithLocation('-Berlin Hbf,Potsdam', { longitude: 13.0991973, latitude: 52.404288 }),
		{ full: 'Berlin Hbf, Potsdam', short: 'Hauptbahnhof', matchedLocationIds: ['12054000', '11000000'] }
	)
	t.deepEqual(
		dbCleanStationNameWithLocation('Berlin Süd (asdf), Potsdam', { longitude: 13.0991973, latitude: 52.404288 }),
		{ full: 'Berlin Süd (asdf), Potsdam', short: null, matchedLocationIds: ['12054000', '11000000'] }
	)
	t.deepEqual(
		dbCleanStationNameWithLocation('Berlin Hbf (Washingtonplatz)', { longitude: 13.0991973, latitude: 52.404288 }),
		{ full: 'Berlin Hbf (Washingtonplatz)', short: 'Hauptbahnhof (Washingtonplatz)', matchedLocationIds: ['11000000'] }
	)
	t.deepEqual(
		dbCleanStationNameWithLocation('Berlin (Washingtonplatz)', { longitude: 13.0991973, latitude: 52.404288 }),
		{ full: 'Berlin (Washingtonplatz)', short: null, matchedLocationIds: [] }
	)
	t.deepEqual(
		dbCleanStationNameWithLocation('Kemtau B180, Burkhardtsdorf', { longitude: 12.959811, latitude: 50.740493 }),
		{ full: 'Kemtau B180, Burkhardtsdorf', short: 'Kemtau B180', matchedLocationIds: ['14521120'] }
	)
	t.deepEqual(
		dbCleanStationNameWithLocation('Großmuß Kirchstr.18, Hausen (Niederbayern)', { longitude: 11.962125, latitude: 48.838367 }),
		{ full: 'Großmuß Kirchstraße 18, Hausen (Niederbayern)', short: 'Großmuß Kirchstraße 18', matchedLocationIds: ['09273125'] }
	)
	t.deepEqual(
		dbCleanStationNameWithLocation('U Wilmersdorfer Str./S Charlottenburg (Berlin)', { latitude: 52.505631, longitude: 13.305704 }),
		{ full: 'Wilmersdorfer Straße/Charlottenburg (Berlin)', short: 'Wilmersdorfer Straße/Charlottenburg', matchedLocationIds: ['11000000'] }
	)
	t.end()
})
