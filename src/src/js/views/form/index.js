// http://backbonejs.org/#View
(function(win, doc, App){

  /**
   * Root View
   * @type {object}
   */
  App.Views.FormIndex = Backbone.View.extend({

    el: '#wrapper',

    template: tpl('form'),

    events: {
        "click #play" : 'stateChange',
        "click .btn-back" : "returnBack",
        "click .error-field" : "clearField",
        "change input" : "changed",
        "keyup input" : "timeoutrestart"
    },

    initialize: function(model) {
        this.model = model;
    },

    returnBack: function() {
        win.syncTimesout.push(setTimeout(function() {
            App.Routers.Instances.router.navigate('',{trigger: true});
        },0));
    },

    clearField: function(evt) {
        evt.currentTarget.value             = '';
        evt.currentTarget.placeholder       = '';
        evt.currentTarget.style.color       = 'black';
        evt.currentTarget.style.fontStyle   = 'normal';
        evt.currentTarget.style.borderColor = 'black';
        return this;
    },

    stateChange : function() {

        var that = this;

        if (!that.model.isValid()) {

            that.$el.html(that.template({
               "data"     : _.extend(that.model.toJSON(), that.model.validationError),
               "error"    : that.model.validationError,
               "hasError" : true
            }));

        }else {

            win.syncTimesout.push(setTimeout(function() {
                that.model.sync();
            },0));

            App.Routers.Instances.router.navigate('game',{trigger: true});
        }
    },
    // reset the timeout before the home page
    timeoutrestart: function() {
        resetTimeout();
    },
    /**
     * Input values changed
     * @param {type} evt
     */
    changed: function(evt) {
        var changed = evt.currentTarget,
            value   = $(evt.currentTarget).val(),
            obj     = {};

        // Reset the timeout before home page
        resetTimeout();

        // We get the name of input and the value and we store it in the fomu
        obj[changed.name] = value;
        this.model.set(obj);
    },

    render: function() {
      this.$el.html(this.template({data: {}, error : {}, hasError: false}));

      return this;
    }
  });


})(window, window.document, window.app || (window.app = {}));
