// http://backbonejs.org/#View
(function(win, doc, App){

  /**
   * Root View
   * @type {object}
   */
  App.Views.LostIndex = Backbone.View.extend({

    el: '#wrapper',

    template: tpl('lost'),

    events: {
        "click #backtohome" : 'stateChange'
    },

    initialize: function() {
    },

    stateChange : function() {
        App.Routers.Instances.router.navigate('',{trigger: true});
    },

    render: function() {
      this.$el.html(this.template);

      return this;
    }
  });


})(window, window.document, window.app || (window.app = {}));
