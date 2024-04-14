class Device < ApplicationRecord
    validates :vendor, presence: true
    validates :model_num, presence: true, uniqueness: true
    validates :market_name, presence: true

    has_many :softwares, dependent: :destroy
end
