# db-clean-station-name

Remove noise and common typographic issues from Deutsche Bahn (DB, german railways) station names, returned e.g. by the [db-hafas](https://github.com/derhuerst/db-hafas) module. For a list of changes that are applied to names, see the [rules section](#rules).

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

const noisy = 'Berlin Yorckstr. S2 U7 (S+U)'
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
Remove defined set of line and product names: *U1*, *(U)*, *(Bus)*, *(S 1)*, … | `Alexanderplatz (U) U5 U8, Berlin` → `Alexanderplatz, Berlin`, `Budberg (B63), Werl` → `Budberg (B63), Werl` | **≈700**

There are some additional rules which aren't listed here, but those only affect a handful of stations or fix the result of other rules (e.g. removing duplicate whitespace).

**What this module doesn't fix yet:** Location name inconsistencies, e.g. `Berlin Jungfernheide` vs. `Jungfernheide, Berlin`

## Contributing

If you found a bug or want to propose a feature, feel free to visit [the issues page](https://github.com/juliuste/db-clean-station-name/issues).
