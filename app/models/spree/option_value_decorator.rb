module Spree
  OptionValue.class_eval do
    attr_accessible :price_modifier
    has_many :ad_hoc_option_values, :dependent => :destroy
  end
end
