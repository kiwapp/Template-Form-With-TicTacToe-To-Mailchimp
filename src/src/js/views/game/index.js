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
