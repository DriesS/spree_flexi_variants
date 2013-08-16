

function legalCombination(triggering_select, triggering_value, current_target, target_option) {

  var all_vals={};

  $('.ad_hoc').not(current_target).each(function(i) {
    var cur_opt_arr = [];
    all_vals[$(this).attr('id')] = cur_opt_arr;

    if ($(this).find(":input:checked").val() !== "") {
      cur_opt_arr.push($(this).find(":input:checked").val());
    } else {
      var opts=$(this).data('options');
      $.each(opts, function(i, opt) { if (opt.value !== "") {cur_opt_arr.push(opt.value);} });
    }
  });

  var keyArray = [];
  var p = [];


  $.each(all_vals, function(sel_id, opt_arr) {
    keyArray.push(sel_id);
    p.push(opt_arr);
  });

  possibilities = possibleCombinations(p);


  var has_legal_possibility=false;

  if(possibilities.length === 0){

    var found_violation = false;

    $.each(exclusions, function(j, exclusion) {

      if ((exclusion[$(triggering_select).attr('id')] == triggering_value || exclusion[$(triggering_select).attr('id')] == "*") && (
        exclusion[$(current_target).attr('id')] == target_option.value || exclusion[$(current_target).attr('id')] == "*")) {
        found_violation=true;
        return false;
      }
    }); // each

    return !found_violation;
  }
  else {

    $.each(possibilities, function (i, possibility) {

      var found_violation = false;

      $.each(exclusions, function(j, exclusion) {

        if ((exclusion[$(triggering_select).attr('id')] == triggering_value || exclusion[$(triggering_select).attr('id')] == "*") && (
          exclusion[$(current_target).attr('id')] == target_option.value || exclusion[$(current_target).attr('id')] == "*")) {

          var truth_map= $.map(possibility, function (possbility_item, k) {
            // console.log("comparing exclusion["+keyArray[k] + "] == " + possbility_item);
            return (exclusion[keyArray[k]] == possbility_item || exclusion[keyArray[k]] == "*");
          });

          if ($.inArray(false, truth_map) == -1) {
            found_violation=true;
            return false; // this breaks us out of the 'each', since we are done hunting for violations for this exclusion
          }
        } // if
      }); // each exclusion

      if (!found_violation) {
        has_legal_possibility=true;
        // console.log("WINNER: passing possbility: " + possibility);
        return false; // break out of possbilities.each since we've found a winner
      }
    }); // each possbility
    return has_legal_possibility;
  } // else more than two drop downs
} // legal combination


// return an array of possible combinations
function possibleCombinations (options) {
  // adapted from http://stackoverflow.com/questions/1636355/jquery-javascript-multiple-array-combinations

  var recursiveSearch;
  var possibilities = [];

  if (options.length === 0) {
    return possibilities;
  }

  recursiveSearch = function (arr, depth )  {
    arr = arr || [];

    depth = depth || 0;
    for ( var i = 0; i < options[depth].length; i++ )
    {
      // is there one more layer?
      if ( depth +1 < options.length ) {
        // yes: iterate the layer
        var a = [];
        $.merge(a,arr);
        a.push(options[depth][i]);
        recursiveSearch ( a , depth +1 );
      }
      else {
        // no: this is the last layer. we add the result to the array
        var a = [];
        $.merge(a,arr);
        a.push(options[depth][i]);
        possibilities.push ( a);
      }
    }
  };

  recursiveSearch();

  return possibilities;
}


$(document).ready(function() {
  // initialize all the 'options'



  $('.ad_hoc').each(function(){

    var options = [];
    var select = this;

    // find the current options, and save them in the 'data' of the select

    $(select).find('input').each(function() {
      this.checked = false;
      var text_value = $(this).siblings('.variant-description').text();
      var price_value = $(this).siblings('.price').text();
      options.push({value: $(this).val(), text: text_value, price: price_value});
    });

    $(select).data('options', options);
  });

  // set up the change event handler when any drop down changes,

  $(document).on('click', 'input.ad-hoc-option-type:not(.trigger-change)', function() {
    $("#total_price").show();
    $("#add-to-cart-button").removeAttr("disabled");
  });

  $('.ad_hoc input.trigger-change').on('change', function() {

    var triggering_value = $(this).val();
    var triggering_select = $(this).parents('.ad_hoc:first');

    // alter the contents of every other drop down
    $('.ad_hoc').not(triggering_select).each(function(i) {

      var current_target = this;


      var current_target_option_value = $(current_target).find("input[type='radio']:checked").val();

      var target_options = $(current_target).empty().data('options');

      var name = $(current_target).data("form-name") + "[]";

      //$(current_target).append("<label class='error' for="+name+">This field is required.</label>");


      $.each(target_options, function(i) {
        var target_option = target_options[i];                  // e.g. s_2_0

        if(target_option.value === ""){
          var value = target_option.value;
          var id = $(current_target).attr("id") + '__' + value;

          $(current_target).append(
            $("<li><label><input type='radio' class='ad-hoc-option-type required' id="+id+" name="+name+" value="+value+"><span class='variant-description'> "+target_option.text+"</span><span class='price diff'> "+target_option.price+"</span></label></li>")
          );
        } else {
          if (legalCombination(triggering_select, triggering_value, current_target, target_option)) {
            var target_value = target_option.value;
            var target_id = $(current_target).attr("id") + '__' + target_value;
            var target_name = $(current_target).data("form-name") + "[]";

            $(current_target).append(
              $("<li><label><input type='radio' class='ad-hoc-option-type required' id="+target_id+" name="+target_name+" value="+target_value+"><span class='variant-description'> "+target_option.text+"</span><span class='price diff'> "+target_option.price+"</span></label></li>")
            );
          }
        }
      });

      if($(current_target).hasClass("slide_toggle")){
        $(current_target).hide();
        $(current_target).slideToggle();
      }

      $(current_target).find('input[value='+current_target_option_value+']').attr('checked', 'checked');
    }); //  .not().each()
  }); // .change()
}); // ready
