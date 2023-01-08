from javascript import require

clean_station_name = require("db-clean-station-name")
clean_with_location= require("db-clean-station-name/lib/with-location")

gorgastSchäferei = {
	'id': '740366',
	'name': 'Gorgast Abzw. Schäferei, Küstriner Vorland',
	'location': {'latitude': 52.575695, 'longitude': 14.558633}
}
gothaSchäferei = {
	'id': '963916',
	'name': 'Gotha (b. Eilenburg) Abzw. Schäferei, Jesewitz',
	'location': {'latitude': 51.412833, 'longitude': 12.621952}
}
kirchplatz = {
	'id': '954197',
	'name': 'Wölkau (b. Delitzsch) Kirchplatz, Schönwölkau',
	'location': {'latitude': 51.496639, 'longitude': 12.496993}
}
leipzigHbf = {
	'id': '8098205',
	'name': 'Leipzig Hbf (tief)',
	'location': {'latitude': 51.345216, 'longitude': 12.379836}
}

print(clean_station_name(gorgastSchäferei['name']))

print(clean_with_location(gorgastSchäferei['name'], gorgastSchäferei['location']))
print(clean_with_location(gothaSchäferei['name'], gothaSchäferei['location']))
print(clean_with_location(kirchplatz['name'], kirchplatz['location']))
print(clean_with_location(leipzigHbf['name'], leipzigHbf['location']))
