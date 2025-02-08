class CreateDevices < ActiveRecord::Migration[6.1]
  def change
    create_table :devices do |t|
      t.string :vendor
      t.string :model_num
      t.string :market_name

      t.timestamps
    end
  end
end
