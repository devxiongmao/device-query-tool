# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_08_17_220151) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "devices", force: :cascade do |t|
    t.string "vendor"
    t.string "model_num"
    t.string "market_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "features", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "software_features", force: :cascade do |t|
    t.bigint "software_id", null: false
    t.bigint "feature_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["feature_id"], name: "index_software_features_on_feature_id"
    t.index ["software_id"], name: "index_software_features_on_software_id"
  end

  create_table "softwares", force: :cascade do |t|
    t.string "name"
    t.string "platform"
    t.integer "ptcrb"
    t.integer "svn"
    t.bigint "device_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["device_id"], name: "index_softwares_on_device_id"
  end

  add_foreign_key "software_features", "features"
  add_foreign_key "software_features", "softwares"
  add_foreign_key "softwares", "devices"
end
