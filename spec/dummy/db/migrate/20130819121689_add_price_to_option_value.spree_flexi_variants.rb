# This migration comes from spree_flexi_variants (originally 20130530120155)
class AddPriceToOptionValue < ActiveRecord::Migration
  def change
    add_column :spree_option_values, :price_modifier, :decimal, :null => false, :default => 0, :precision => 8, :scale => 2
  end
end
