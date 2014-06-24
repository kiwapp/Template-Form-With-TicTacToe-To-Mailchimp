// http://backbonejs.org/#View
(function(win, doc, App){

  /**
   * Root View
   * @type {object}
   */
  App.Views.RegisterIndex = Backbone.View.extend({

    el: '#wrapper',

    template: tpl('register'),

    events: {
        "click #backhome" : 'stateChange'
    },

    initialize: function() {
    },

    stateChange : function() {
        App.Routers.Instances.router.navigate('',{trigger: true});
    },

    render: function() {
        win.setTimeoutPage('',10);
      this.$el.html(this.template);

      return this;
    }
  });


})(window, window.document, window.app || (window.app = {}));
