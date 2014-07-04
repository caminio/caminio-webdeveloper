var country_numbers = {};

country_numbers.AT = function() {
  var values = {
    mobileLength: 3,
    regexp: new Regexp('^6\d\d'),
    codeLength: 4
  };
  return values;
};

module.exports = country_numbers;
 


  
