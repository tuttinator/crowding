require 'bundler'
Bundler.require


require 'capybara'
require 'capybara/dsl'

class Scraper
  include Capybara::DSL

  attr_reader :regions

  def initialize
    Capybara.current_driver = :mechanize
    Capybara.run_server = false
    Capybara.app_host = "http://www.healthpoint.co.nz"
    Capybara.app = self

    @regions = %w[
      http://www.healthpoint.co.nz/doctors/central-auckland/
      http://www.healthpoint.co.nz/doctors/east-auckland/
      http://www.healthpoint.co.nz/doctors/north-auckland/
      http://www.healthpoint.co.nz/doctors/south-auckland/
      http://www.healthpoint.co.nz/doctors/west-auckland/
    ]
  end

  def extract_gps
    puts 'Extracting...'

    clinics_url_selector = '.result-list#paginator-services a:not(.page):not(.next):not(.prev)'

    find_all(clinics_url_selector).map do |link|
      [link.text, link['href']]
    end
  end


  def scrape!
    gp_clinics = []


    regions.each do |region|
      visit region
      puts "Visiting #{region}"

      gp_clinics += extract_gps

      loop do
        begin
          find('.result-list#paginator-services a.next').click
          gp_clinics += extract_gps
        rescue Capybara::ElementNotFound
          puts 'End of list'
          break
        end
      end

    end

    CSV.open('gp_clinic_urls.csv', 'wb') do |csv|
      csv << %w(name url address lat lng)
      gp_clinics.each do |clinic|
        url = clinic[1]

        result = get_clinic_details(url)
        csv << clinic + result
      end
    end

  end

  def get_clinic_details(clinic_url)
    puts "Visiting #{clinic_url}"
    visit clinic_url

    begin
      address = find('.service-location h3 a').text
      lat, lng = find_all('.service-map meta').map do |meta|
        meta['content']
      end
    rescue Capybara::ElementNotFound
    rescue Capybara::Ambiguous
      return []
    end

    return [address, lat, lng]
  end

end

Scraper.new.scrape!

puts 'Done'
