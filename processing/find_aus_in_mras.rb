require 'bundler'
Bundler.require
require 'rgeo/shapefile'

Dotenv.load

require 'csv'

csv = CSV.read('processing/au_centroids.csv', headers: true)

points = csv.map do |row|
   [ row['id'], RGeo::Cartesian::Factory.new().parse_wkt(row['centroid']) ]
end


mapping = {}

RGeo::Shapefile::Reader.open('shapes/market_rent_area.shp') do |file|
  puts "File contains #{file.num_records} records."
  file.each do |record|

    next unless record.geometry

    mapping[record.attributes['mr_marke_1']] = []

    puts record.attributes['mr_market_']

    points.each do |point|
      mapping[record.attributes['mr_marke_1']] << point[0] if record.geometry.contains? point[1]
    end

  end
end

binding.pry

puts mapping
