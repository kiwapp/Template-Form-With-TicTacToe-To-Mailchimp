(function(win, doc, App){

    "use strict";

    App.Models = {};
    App.Models.Instances = {};
    App.Collections = {};
    App.Collections.Instances = {};
    App.Views = {};
    App.Views.Instances = {};
    App.Routers = {};
    App.Routers.Instances = {};
    App.Events = {};
    App.Languages = {};
    App.Languages.Instances = {};
    App.Languages.available = [];


    // Store each timeouts ID
    win.appTimesout  = [];
    win.syncTimesout = [];

    // Default time before we return to the home page in seconds
    win.TIMEOUT_BEFORE_HOME = 50;

    // Display App's debug if it's 1, 0 to hide them
    win.VERBOSE = 1;

    /**
     * Find our template inside the application
     * @param  {String} view Your partial name
     * @return {Object}      Your view for backbone. Parse by lodash
     * @throws {Error} If The application cannot find the requested view
     */
    win.tpl = function tpl(view) {

        var $view = document.getElementById(view.toLowerCase() + '-viewtpl');

        if(!$view) {
            throw new Error('Cannot find the requested view : ' + view);
        }
        return _.template($view.innerHTML);
    };

    /**
     * Clean each timesout
     * It's also set a new timeout to the home page.
     * The delay before the home page is defined in TIMEOUT_BEFORE_HOME
     */
    win.resetTimeout = function resetTimeout() {
        if(win.appTimesout.length) {
            console.debug('[App@resetTimeout] Clear timeouts');
            win.appTimesout.forEach(win.clearTimeout);
            win.appTimesout.length = 0;
        }

        win.setTimeoutPage();
    };

    win.resetSyncTimeout = function resetSyncTimeout() {
        if(win.syncTimesout.length) {
            win.syncTimesout.forEach(win.clearTimeout);
        }
    };


    /**
     * Open a page after a custom delay
     * @param {String} page  Page name
     * @param {Integer} delay How many seconds ?
     */
    win.setTimeoutPage = function setTimeoutPage(page,delay) {

        page = page || '';
        delay = delay || win.TIMEOUT_BEFORE_HOME;

        var _page = page || 'root';
        console.debug('[App@setTimeoutPage] Open page ' + _page + ' in ' + delay + 's');

        win.appTimesout.push(setTimeout(function() {
            App.Routers.Instances.router.navigate(page,{trigger: true});
        },delay * 1000));
    };

    /**
     * Helper to open a page
     * It can also open a page after a custom delay if you specify one.
     * It sends log informations to the driver
     * @param  {String} page  Page name
     * @param  {Integer} delay Delay in seconds
     * @return {void}
     */
    win.openPage = function openPage(page,delay) {

        var _page = page || 'root';

        if(delay) {
            Kiwapp.log("[App@openPage] : Open the page - " + _page + " - with a delay of " + delay + "s");
            return win.setTimeoutPage(page, delay);
        }

        Kiwapp.log("[App@openPage] : Open the page - " + _page);
        App.Routers.Instances.router.navigate(page,{trigger: true});
    };

    /**
     * Send logs to the driver
     * @param  {String} msg Your log
     * @return {void}
     */
    win.log = function log(msg) {
        Kiwapp.log(msg || '[App@log]');
    };

    // Remove the App's debug message
    if(!win.VERBOSE) {
        console.debug = function(){};
    }

})(window, window.document, window.app || (window.app = {}));

// http://backbonejs.org/#Model
(function(win, doc, App){

  /**
   * Example model
   * @type {object}
   */
  App.Models.Registration = Backbone.Model.extend({
        defaults: {
            "appName" : "/SalonTicTacToe",
            "company"       : "",
            "country"       : "",
            "email"         : "",
            "mobile"        : "",
            "name"          : "",
            "surname"       : "",
            "current_date"  : ""
        },
        validate: function(attrs) {
            var msg = {};
            ['name','surname','email','mobile'].forEach(function(input) {
                if(!attrs[input].length) {
                    msg[input] = "This field cannot be empty";
                }

                if("email" === input && attrs.email.length) {
                    var email_filter    = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                    if(!email_filter.test(attrs.email)) {
                        msg[input] = "It is not a valid email.";
                    }
                }
            });

            if(Object.keys(msg).length) {
                return msg;
            }
        },
        // Method for sync the model to the server
       sync: function() {

           // Check if the model's currents values are differents of defaults values
           if (!this.modelIsDefault()) {
               this.attributes.current_date = new Date();
               var json = this.toJSON();
               this.clear().set(this.defaults);


                 if(APP_CONFIG.activeMailChimp) {

                    var mailChimpService = new MailChimpConnector(APP_CONFIG.MailChimp_API_Key, APP_CONFIG.MailChimp_List_Name,APP_CONFIG.MailChimp_Welcome_Email);

                    function addSubscriberCallback(data){
                      console.log(data);
                    }

                    function getListCallback(data){
                      var idList = data.data[0].id;
                      mailChimpService.addSubscriber(addSubscriberCallback,idList,json);
                    }

                    mailChimpService.getList(getListCallback);

                }

                if(APP_CONFIG.customUrl) {
                    Kiwapp.session().store(json,{
                        url    : APP_CONFIG.customUrl,
                        method : "POST"
                    }).send();
                }

           }

       },
       /**
         * Check if the currents values are differentes from defaults values for the model
         */
        modelIsDefault:function(){

            // Iterate over all object's properties
            // And conpare it to the defaults values
            for(var k in this.attributes) {
                var value = this.attributes[k];
                var defaultValue = this.defaults[k];
                if(value!==defaultValue){
                    return false;
                }
            }

            return true;
        }

  });

})(window, window.document, window.app || (window.app = {}));

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

// http://backbonejs.org/#View
(function(win, doc, App){

  /**
   * Root View
   * @type {object}
   */
  App.Views.GameIndex = Backbone.View.extend({

    el: '#wrapper',

    template: tpl('game'),

    events: {
        "click .btn-back-form" : "returnBack"
    },

    initialize: function() {},

    returnBack: function() {
        win.setTimeoutPage('form',0.1);
//        win.location.href = win.location.origin + '/#form';
    },

    /**
     * Return the probability for an option
     * @param  {String} opt Name of this option
     * @return {Integer}     Value
     */
    getProbability : function(opt) {

        var day   = moment().format('ddddDDYYYY'),
            total = localStorage.getItem('totalgame' + day);

        var proba = {
            "win"    : 25,
            "lost-1" : 25,
            "lost-2" : 25,
            "lost-3" : 25
        };


        if(win.APP_CONFIG) {
            proba.win       = win.APP_CONFIG.probaWinner || 25;
            proba['lost-1'] = win.APP_CONFIG.probaLost1 || 25;
            proba['lost-2'] = win.APP_CONFIG.probaLost2 || 25;
            proba['lost-3'] = win.APP_CONFIG.probaLost3 || 25;
        }

        if(total == 0 ) {
            log("[GameIndex@getProbability] Probability to win set to 0");
            proba = {
                "win"    : 0,
                "lost-1" : proba['lost-1'] + Math.round(proba.win/3),
                "lost-2" : proba['lost-2'] + Math.round(proba.win/3),
                "lost-3" : proba['lost-3'] + Math.round(proba.win/3)
            };
        }

       return proba[opt];

    },

    render: function() {
        this.$el.html(this.template);

        var day   = moment().format('ddddDDYYYY'),
            total = localStorage.getItem('totalgame' + day);


        var widthRatio  = Math.round(499 * (window.innerWidth / 1024)),
            heightRatio = Math.round(474 * ( window.innerHeight / 768));

            if(heightRatio < 474) {
                heightRatio = 474;
            }

        var scracth = new ScratchCard(document.getElementById('scratchcard'),{
          "picture" : [
              {
                  "path" : "assets/images",
                  "file": "scratch-gagnant.jpg",
                  "luck" : this.getProbability('win'),
                  "event" : 'win',
              },{
                  "path" : "assets/images",
                  "file": "scratch-perdant-1.jpg",
                  "luck" : this.getProbability('lost-1'),
                  "event" : 'lost',
                  "details" : "case-1"
              },{
                  "path" : "assets/images",
                  "file": "scratch-perdant-2.jpg",
                  "luck" : this.getProbability('lost-2'),
                  "event" : 'lost',
                  "details" : "case-2"
              },{
                  "path" : "assets/images",
                  "file": "scratch-perdant-3.jpg",
                  "luck" : this.getProbability('lost-3'),
                  "event" : 'lost',
                  "details" : "case-3"
              }
          ],
          "foreground" : {
              "path" : "assets/images",
              "file" : "scratch.jpg"
          },
          "minCompletion" : this.getMinCompletion(),
          // "height" : window.innerHeight
          "width" : widthRatio,
          // "height" : 474 * ( window.innerHeight / 768)
          "height" : heightRatio
        });

        log("[GameIndex@render] We have now " + total + " to win");


        scracth.on('win', function() {
            Kiwapp.stats().event('win');
            localStorage.setItem('totalgame' + day, (total - 1));
			win.setTimeoutPage('usb',1);
        });
        scracth.on('lost', function(opt) {
            Kiwapp.stats().event(opt);
			win.setTimeoutPage('lost',1);
        });
        return this;
    },

    /**
     * Return the min Completion percent required to win or lose the game
     * @return {Integer}
     */
    getMinCompletion: function() {
        if(win.APP_CONFIG) {
            return win.APP_CONFIG.minCompletion || 90;
        }

        return 90;
    }
  });


})(window, window.document, window.app || (window.app = {}));

// http://backbonejs.org/#View
(function(win, doc, App){

  /**
   * Root View
   * @type {object}
   */
  App.Views.HomeIndex = Backbone.View.extend({

    el: '#wrapper',

    template: tpl('home'),

    events: {
    },

    initialize: function() {
    },

    render: function() {
      this.$el.html(this.template);

      return this;
    }
  });


})(window, window.document, window.app || (window.app = {}));

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

/**
 * This is where all begins
 */
(function(win, doc, App){

    var $doc    = $(doc);
        day     = moment().format('ddddDDYYYY'),
        total   = localStorage.getItem('totalgame' + day);


    $doc.ready(function() {

        var wrap = document.getElementById('wrapper');
        wrap.style.width     = window.innerWidth + "px";
        wrap.style.maxWidth  = window.innerWidth + "px";
        wrap.style.height    = window.innerHeight + "px";
        wrap.style.maxHeight = window.innerHeight + "px";


         Kiwapp("../config/kiwapp_config.js", function(){

            Kiwapp.driver().trigger('callApp', {call:'rotation', data:{
                "orientation" : 10
            }});

            win.APP_CONFIG = Kiwapp.get('shopParameters');

            if(total == null) {
                localStorage.setItem('totalgame' + day,4);
            }

            App.Routers.Instances.router = new App.Routers.Router();
            Backbone.history.start();
        });
    });

})(window, window.document, window.app || (window.app = {}));
