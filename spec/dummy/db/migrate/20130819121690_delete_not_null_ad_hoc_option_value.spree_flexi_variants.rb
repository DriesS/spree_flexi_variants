# This migration comes from spree_flexi_variants (originally 20130530122204)
class DeleteNotNullAdHocOptionValue < ActiveRecord::Migration
  def change
    change_column :spree_ad_hoc_option_values, :price_modifier, :decimal, :null => true
  end
end
