require 'csv'

mapping = CSV.read 'source/area_unit_mappings.csv', headers: true

census_2006 = CSV.read 'processing/census_2006_area_units.csv', headers: true

census_2013 = CSV.read 'processing/census_2013_area_units.csv', headers: true

headers = ['area_unit_id'] + census_2013.headers

def clean_values(row)
  row.to_h.values.map do |item|
    item == '..C' ? nil : item
  end
end

CSV.open('final/census_2006_area_units.csv', 'wb') do |csv|
  csv << headers

  census_2006.each do |row|
    matching_row = mapping.find {|a| a['name'] == row['area_unit_name'] }

    next unless matching_row

    csv << [matching_row['id']] + clean_values(row)
  end
end


CSV.open('final/census_2013_area_units.csv', 'wb') do |csv|
  csv << headers

  census_2013.each do |row|
    matching_row = mapping.find {|a| a['name'] == row['area_unit_name'] }

    next unless matching_row

    csv << [matching_row['id']] + clean_values(row)
  end
end
