// http://backbonejs.org/#Router
(function(win, doc, App){

  /**
   * Router
   * @type {object}
   */
  App.Routers.Router = Backbone.Router.extend({

    routes: {
      ''         : 'root',
      'home'     : 'root',
      'form'     : 'form',
      'game'     : 'game',
      'lost'     : 'lost',
      'usb'      : 'usb',
      'register' : 'register',
      'end'      : 'end',
      '*path'    : 'redirect404' // ALWAYS MUST BE THE LAST ROUTE
    },

    /**
     * Router init
     * @return {void}
     */
    initialize: function() {

        App.Views.Instances.rootIndex = new App.Views.RootIndex();
        App.Views.Instances.formIndex = new App.Views.FormIndex(new App.Models.Registration());
        App.Views.Instances.registerIndex = new App.Views.RegisterIndex();
        App.Views.Instances.lostIndex = new App.Views.LostIndex();
        App.Views.Instances.usbIndex = new App.Views.UsbIndex();
        App.Views.Instances.gameIndex = new App.Views.GameIndex();
        App.Views.Instances.endIndex = new App.Views.EndIndex();

    },

    /**
     * Used before every action
     * @return {void}
     */
    before: function(page) {

        if('root' === page && Backbone.history.history.length > 1) {
            Kiwapp.session().end();
        }

        win.resetTimeout();

        Kiwapp.stats().page(page);
    },

    /**
     * Used after every action
     * @return {void}
     */
    after: function(page) {
        if('root' === page) {
            win.resetSyncTimeout();
            Kiwapp.session().start();
        }
    },

    /**
     * @return {void}
     */
    root: function() {
      this.before('root');
      App.Views.Instances.rootIndex.render();

      this.after('root');
    },
    form: function() {
      this.before('form');
       App.Views.Instances.formIndex.render();

      this.after('form');
    },
    register: function() {
      this.before('register');

      App.Views.Instances.registerIndex.render();

      this.after('register');
    },

    lost: function() {
      this.before('lost');

      App.Views.Instances.lostIndex.render();

      this.after('lost');
    },
    usb: function() {
      this.before('usb');

      App.Views.Instances.usbIndex.render();

      this.after('usb');
    },
    game: function() {
      this.before('game');

      App.Views.Instances.gameIndex.render();

      this.after('game');
    },
    end: function() {
      this.before('end');

      App.Views.Instances.endIndex.render();

      this.after('end');
    },

    //==route==//

    /**
     * Used when a page isn't found
     * @return {void}
     */
    redirect404: function() {
      console.log('Oops, 404!');
    }

  });

})(window, window.document, window.app || (window.app = {}));
