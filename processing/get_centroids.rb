require 'bundler'
Bundler.require
require 'rgeo/shapefile'

Dotenv.load

require 'csv'

csv = CSV.open('processing/au_centroids.csv', 'wb')

csv << %w(id centroid)


RGeo::Shapefile::Reader.open('shapes/auckland_aus.shp') do |file|
  puts "File contains #{file.num_records} records."
  file.each do |record|

    next unless record.geometry

    puts record.attributes['AU2013_NAM']

    csv << [record.attributes['AU2013']] + [record.geometry.centroid]
  end
end


csv.close
