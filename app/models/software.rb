class Software < ApplicationRecord
  validates :name, presence: true
  validates :platform, presence: true
  validates :ptcrb, presence: true
  validates :svn, presence: true

  belongs_to :device
end
