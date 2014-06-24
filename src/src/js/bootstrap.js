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
