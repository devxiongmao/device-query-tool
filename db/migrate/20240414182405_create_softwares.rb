class CreateSoftwares < ActiveRecord::Migration[6.1]
  def change
    create_table :softwares do |t|
      t.string :name
      t.string :platform
      t.integer :ptcrb
      t.integer :svn
      t.references :device, null: false, foreign_key: true

      t.timestamps
    end
  end
end
