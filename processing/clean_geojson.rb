require 'json'

area_unit_geojson = JSON.parse(File.read 'shapes/auckland_area_units.geojson')


field_name_mapping = {
  "AU2013": "id",
  "AU2013_NAM": "name",
  "area_unit_": "name",
  "2 + bedroo": "2_plus_bedrooms_required",
  "1 bedroom": "1 bedroom required",
  "total_crow": "total_crowded",
  "total_cr_1": "percent_crowded",
  "No extra b": "no_extra_bedrooms_required",
  "1 bedroo_1": "1_bedroom_spare",
  "2 or more": "2_plus_bedrooms_spare",
  "total_not_": "total_not_crowded",
  "total_no_1": "percent_not_crowded",
  "total_stat": "total_stated",
  "total_unkn": "total_unknown",
  "total_hous": "total_households",
  "average_ho": "average_household_size"
}

area_unit_geojson['features'] = area_unit_geojson['features'].map do |feature|

  feature['properties'] = Hash[field_name_mapping.values.zip(feature['properties'].values)]

  feature
end

File.open('web/dist/area_units.geojson', 'wb') do |f|
  f.write JSON.dump(area_unit_geojson)
end
