// http://backbonejs.org/#View
(function(win, doc, App){

  /**
   * Root View
   * @type {object}
   */
  App.Views.RootIndex = Backbone.View.extend({

    el: '#wrapper',

    template: tpl('main'),

    events: {
        "click #playhome" : 'stateChange',
        "click #go-to-form" : 'stateChange'
    },

    initialize: function() {
        // Kiwapp.session().start();
    },

    stateChange : function() {
        App.Routers.Instances.router.navigate('form',{trigger: true});
        // App.Routers.Instances.router.navigate('game',{trigger: true})
    },

    render: function() {
      this.$el.html(this.template);

      return this;
    }
  });


})(window, window.document, window.app || (window.app = {}));
