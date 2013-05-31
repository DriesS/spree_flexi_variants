Deface::Override.new(:virtual_path => "spree/admin/option_types/_option_value_fields",
                         :name => "added_price_modifier_331970321",
                         :insert_after => "td.presentation",
                         :partial => "spree/admin/option_types/price_modifier")

Deface::Override.new(:virtual_path => "spree/admin/option_types/edit",
                         :name => "added_price_modifier_header_331970321",
                         :insert_before => "th.actions",
                         :text => "<th>Price</th>")
