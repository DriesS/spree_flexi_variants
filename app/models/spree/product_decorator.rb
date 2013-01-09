module Spree
  Product.class_eval do
    # These are the pool of POSSIBLE option values
    has_many :ad_hoc_option_types, :after_add => :attach_option_values

    # Each exclusion represents a disallowed combination of ad_hoc_option_values
    has_many :ad_hoc_variant_exclusions, :dependent => :destroy

    # allowed customizations
    has_and_belongs_to_many :product_customization_types

    attr_accessor :is_clone

    def duplicate_extra(original_product)

      self.is_clone = true

      self.ad_hoc_option_types = original_product.ad_hoc_option_types.map do |ad_hoc_option_type|
        ad_hoc_new = ad_hoc_option_type.dup
        ad_hoc_new.product_id = id
        ad_hoc_new.created_at = ad_hoc_new.updated_at = nil
        ad_hoc_new.ad_hoc_option_values = ad_hoc_option_type.ad_hoc_option_values.map do |ov|
          new_ov = ov.dup
          new_ov
        end
        ad_hoc_new
      end

      self.save!

      self.ad_hoc_variant_exclusions = original_product.ad_hoc_variant_exclusions.map do |exclusion|
        exclusion_new = exclusion.dup
        exclusion_new.product_id = id
        exclusion_new.created_at = exclusion_new.updated_at = nil
        exclusion_new.save
        exclusion_new.excluded_ad_hoc_option_values = exclusion.excluded_ad_hoc_option_values.map do |excluded_value|
          new_excluded_value = excluded_value.dup
          new_excluded_value.ad_hoc_option_value = AdHocOptionValue.joins(:ad_hoc_option_type).where("spree_ad_hoc_option_types.product_id = ?", self.id).where(:option_value_id => excluded_value.ad_hoc_option_value.option_value_id).first
          new_excluded_value
        end
        exclusion_new
      end

      self.save!

      self

    end

    private

    def attach_option_values(ad_hoc_option_type)
      return if self.is_clone
      ad_hoc_option_type.option_type.option_values.each do |ov|
        ahot = AdHocOptionValue.new()
        ahot.option_value_id = ov.id
        ahot.position = ov.position
        ahot.save
        ad_hoc_option_type.ad_hoc_option_values << ahot
      end
    end
  end
end