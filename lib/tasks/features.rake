namespace :features do
  desc "Initializes a small list of features"
  task seed: :environment do
    feature_list = [
      '2x2 MIMO',
      '4x4 MIMO',
      '5G-NSA',
      '5G-SA',
      'CA',
      'EVS',
      'IMS',
      'IPv4',
      'IPv4v6',
      'IPv6',
      'LAA',
      'LTE',
      'QAM',
      'RCS',
      'UMTS',
      'ViLTE',
      'VoLTE',
      'VoLTE-Roaming',
      'VoWiFi'
    ]
    feature_list.each do |feature|
      begin
        Feature.create!(name: feature)
      rescue ActiveRecord::RecordInvalid => invalid
        Rails.logger.info{ invalid.record.errors }
      end
    end
  end
end