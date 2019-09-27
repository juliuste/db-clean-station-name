'use strict'

const tape = require('tape')
const dbCleanStationName = require('.')
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
	removeBracketWithAbbreviation,
	replaceStreet,

	removeLineNames
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
	t.equal(removeBracketWithAbbreviation('S+U')('S+U Frankfurter Allee (S+U) und (U) Westhafen (S+U)'), 'S+U Frankfurter Allee   und (U) Westhafen  ', 'removeBracketWithAbbreviation')
	t.equal(replaceStreet('Kantstr, Kantstr., Str. des 17. Juni, Strauch'), 'Kantstr, Kantstraße, Straße des 17. Juni, Strauch', 'replaceStreet')

	t.equal(removeLineNames('(S 4) Frankfurter Allee U5 (U 5) B12 (S1) U 5, Richtung A10 und U146,U7'), '( ) Frankfurter Allee   ( ) B12 ( )  , Richtung A10 und U146, ', 'removeLineNames')
	t.end()
})

tape('main module', t => {
	t.equal(
		dbCleanStationName('- Yorckstr. S1, U 2, [U5] (S+U), Abzw. Kassel (Thür) Ri Aum.str. Frankfurt(Main),'),
		'Yorckstraße, Abzweig Kassel (Thüringen) Richtung Aum.straße Frankfurt (Main)'
	)
	t.end()
})
