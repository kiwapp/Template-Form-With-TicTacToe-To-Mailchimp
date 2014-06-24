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
