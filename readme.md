# db-clean-station-name

Remove noise and common typographic issues from Deutsche Bahn (DB, german railways) and VBB (Berlin-Brandenburg transportation authority) station names, returned e.g. by the [db-hafas](https://github.com/derhuerst/db-hafas) and [vbb-hafas](https://github.com/derhuerst/vbb-hafas) module. For a list of changes that are applied to names, see the [rules section](#rules).

[![npm version](https://img.shields.io/npm/v/db-clean-station-name.svg)](https://www.npmjs.com/package/db-clean-station-name)
[![Build Status](https://travis-ci.org/juliuste/db-clean-station-name.svg?branch=master)](https://travis-ci.org/juliuste/db-clean-station-name)
[![Greenkeeper badge](https://badges.greenkeeper.io/juliuste/db-clean-station-name.svg)](https://greenkeeper.io/)
[![license](https://img.shields.io/github/license/juliuste/db-clean-station-name.svg?style=flat)](license)
[![chat on gitter](https://badges.gitter.im/juliuste.svg)](https://gitter.im/juliuste)

## Installation

```shell
npm install db-clean-station-name
```

## Usage

```js
const cleanStationName = require('db-clean-station-name')

const noisy = 'S+U Berlin Yorckstr. S2 U7 (S+U)'
const cleaned = cleanStationName(noisy)
console.log(cleaned) // 'Berlin Yorckstraße'
```

### Rules

The module applies a specific set of rules, which were test-run against a dataset of **≈250,000** station names. The *matches* column in the following table specifies how many of those station names a rule could be applied to at least once. Samples for each rule were checked manually for QA.

Rule | Example | Matches
-----|---------|--------
Fix typographically incorrect apostrophes | ``Up`n Kiwitt`` → `Up’n Kiwitt` | **≈100**
Replace non-round braces | `Bersarinplatz [Weidenweg]` → `Bersarinplatz (Weidenweg)` | **≈100**
Fix whitespace for braces | `Frankfurt(Main)Hbf` → `Frankfurt (Main) Hbf` | **≈2100**
Fix whitespace for punctuation and slashes | `St.Georg` → `St. Georg`, `Landau a.d. Isar` → `Landau a.d. Isar` | **≈700**
Replace generic abbreviations: *Abzw.*, *b.*, *Ri.* | `Abzw. Baalborn` → `Abzweig Baalborn`, `Garching b. München` → `Garching bei München` | **≈10000**
Replace most common location abbreviations: *Thür*, *Württ*, *Meckl*, … Note that this rule will probably be replaced by a more generic location-parsing rule at some point | `Minden(Westf)` → `Minden (Westfalen)` | **≈5000**
Replace *Str.* with *Straße* | `Bülowstr.` → `Bülowstraße`, `Willy-Brandt-Str.` → `Willy-Brandt-Straße` | **≈22000**
Remove defined set of line and product names: *U1*, *(U)*, *(Bus)*, *(S 1)*, *S+U*, … | `Alexanderplatz (U) U5 U8, Berlin` → `Alexanderplatz, Berlin`, `Budberg (B63), Werl` → `Budberg (B63), Werl` | **≈700**

There are some additional rules which aren't listed here, but those only affect a handful of stations or fix the result of other rules (e.g. removing duplicate whitespace).

## Removing location names

This module also offers a method to *attempt to* remove location names from station names, e.g. the `Berlin` in `Amrumer Straße, Berlin` or `Köln` in `Köln Messe/Deutz`. The module also has a blacklist for particles for which the location is never removed even if it was detected correctly, e.g. for `Frankfurt Süd`, where the remaining part wouldn't really make sense on its own.

```js
const cleanStationNameWithLocation = require('db-clean-station-name/lib/with-location')

// you must provide a station name as well as a geolocation for that station
const cleaned = cleanStationNameWithLocation('(S) Berlin Hauptbahnhof', { longitude: 13.0991973, latitude: 52.404288 })
const result = {
    full: 'Berlin Hauptbahnhof' // normal output of db-clean-station-name
    short: 'Hauptbahnhof' // will be `null` if no locations were detected
    matchedLocationIds: ['11000000'] // some id(s) corresponding to locations that were detected, you can use those to check e.g. if two stations are in the same city. will be empty of no location(s) were detected. note that for cases like `Frankfurt Süd`, where `short` will be null because nothing could be removed because of some blacklisted name, the list of matched location ids can still contain values
}
```

## Contributing

If you found a bug or want to propose a feature, feel free to visit [the issues page](https://github.com/juliuste/db-clean-station-name/issues).
