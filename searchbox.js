// Author: Ryan Heath, xEasy
// http://rpheath.com

(function($) {
  $.searchbox = function(eles, config){
    this.settings = $.extend(true, $.searchbox.settings, config || {})

    $(document).trigger('init.searchbox')
    this.idle()
    var _this = this;

    return eles.each(function() {
      var $input = $(this)

      $input
      .focus()
      .ajaxStart(function() { _this.start(); })
      .ajaxStop(function() { _this.stop() })
      .keyup(function() {
        if ($input.val() != this.previousValue) {
          _this.resetTimer(this.timer)

          this.timer = setTimeout(function() {
            _this.process($input.val())
          }, _this.settings.delay)

          this.previousValue = $input.val()
        }
      })
    })
  }

  $.searchbox.prototype = {
    constructor: $.searchbox,

    settings: {
      url: '/search',
      param: 'query',
      callback: function(data){ console.log(data); },
      delay: 100,
      loading_css: '#loading'
    },

    loading: function() {
      $(this.settings.loading_css).show()
    },

    resetTimer: function(timer) {
      if (timer) clearTimeout(timer)
    },

    idle: function() {
      $(this.settings.loading_css).hide()
    },

    process: function(terms) {
      var path  = this.settings.url.split('?'),
          query = [this.settings.param, '=', terms].join(''),
          base  = path[0], params = path[1], query_string = query,
          _this = this;

      if (params) query_string = [params.replace('&amp;', '&'), query].join('&')

      this.loading()
      $.get([base, '?', query_string].join(''), function(data) {
        _this.settings.callback(data)
        _this.idle()
      })
    },

    start: function() {
      $(document).trigger('before.searchbox')
      this.loading()
    },

    stop: function() {
      this.idle()
      $(document).trigger('after.searchbox')
    }
  }

  $.fn.searchbox = function(config) {
    new $.searchbox(this, config);
    return this;
  }
})(jQuery);
