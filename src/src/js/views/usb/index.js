// http://backbonejs.org/#View
(function(win, doc, App){

  /**
   * Root View
   * @type {object}
   */
  App.Views.UsbIndex = Backbone.View.extend({

    el: '#wrapper',

    template: tpl('usb'),

    events: {
        "click #openpage" : 'stateChange'
    },

    initialize: function() {

    },

    stateChange : function() {
        App.Routers.Instances.router.navigate('',{trigger: true});
    },

    render: function() {
      this.$el.html(this.template);
	  win.setTimeoutPage('',10);
      return this;
    }
  });


})(window, window.document, window.app || (window.app = {}));
