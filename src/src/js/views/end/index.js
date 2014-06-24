// http://backbonejs.org/#View
(function(win, doc, App){

  /**
   * Root View
   * @type {object}
   */
  App.Views.EndIndex = Backbone.View.extend({

    el: '#wrapper',

    template: tpl('end'),

    events: {
        "click .page-end" : 'stateChange'
    },

    initialize: function() {
    },

    stateChange : function() {
        App.Routers.Instances.router.navigate('',{trigger: true});
    },

    render: function() {
        win.setTimeoutPage('',15);

        this.$el.html(this.template);

        return this;
    }
  });


})(window, window.document, window.app || (window.app = {}));
