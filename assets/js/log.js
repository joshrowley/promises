var $ = require('jquery')
  , _ = require('underscore')
  ;

module.exports = {
  success: function() {
    _.each(arguments, function(arg) {
      console.log(arg)
      var str = JSON.stringify(arg, null, 2);
      $('.log').append('<li><pre>' + str + '</pre></li>');
    });
  },

  error: function() {
    _.each(arguments, function(arg) {
      console.error(arg)
      var str = JSON.stringify(arg, null, 2);
      $('.log').append('<li class="error">' + arg + '</li>');
    });
  }
}
