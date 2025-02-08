class CreateSoftwareFeatures < ActiveRecord::Migration[7.1]
  def change
    create_table :software_features do |t|
      t.references :software, null: false, foreign_key: true
      t.references :feature, null: false, foreign_key: true

      t.timestamps
    end
  end
end
