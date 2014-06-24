;(function() {
    "use strict";

    /**
     * Connect service to MailChimp
     * It sends email from form to mailChimp
     * @param {String} apiKey Your API key
     * @param {String} listName The list you want to add every email's
     * @param {Bool} welcomeEmail Send Welcome Email to every new subscribers 
     * @return {void}
     */
    function MailChimpConnector(apiKey, listName, welcomeEmail) {

        this.API_KEY  = apiKey || '';
        this.LIST_NAME = listName || '';
        this.WELCOME_EMAIL = welcomeEmail || '';
        
        var apiArray = apiKey.split("-");

        this.DATA_CENTER = apiArray[apiArray.length-1];

    }
    /**
     * Give you list id from the LIST_NAME you pass at init or pass as second argument a different list name.
     * @param  {Function} callback List data pass as parameter
     * @param  {String}   listName Search specific list name or use LIST_NAME by default
     * @return {void}
     */
    MailChimpConnector.prototype.getList = function getList(callback,listName){
        var url="/lists/list.json";
        var jsonData = {
                    "apikey": this.API_KEY,
                    "filters": {
                        "list_name": listName || this.LIST_NAME,
                        "exact": true
                    }
                };

        this.request(url,jsonData,callback);
    };
    /**
     * Push to your list new subscriber or uptade if email already exist.
     * @param {Function} callback Used when ajax.send is success
     * @param {[type]}   listId   ID of the list targeted before.
     * @param {[type]}   json     Data containing Email Key
     * @return {void}
     */
    MailChimpConnector.prototype.addSubscriber = function addSubscriber(callback,listId,json){
        var url="/lists/subscribe.json";
        var jsonData = {
                    "apikey":this.API_KEY,
                    "id": listId,
                    "merge_vars": {
                        "LNAME": json.surname,
                        "FNAME": json.name
                    },
                    "email": {
                        "email": json.email
                    },
                    "double_optin": false,
                    "update_existing": true,
                    "replace_interests": true,
                    "send_welcome": this.WELCOME_EMAIL
                };
     
        this.request(url,jsonData,callback);
    };

    /**
     * Check the validity for your credentials
     * @throws {Error} If it's invalid
     * @return {void}
     */
    MailChimpConnector.prototype.checkCredentials = function checkCredentials() {

        if(!this.API_KEY.length) {
            throw new Error('You must set your MailChimp API key\'s');
        }

        if(!this.LIST_NAME.length) {
            throw new Error('You must set your MailChimp List name ');
        }
    };

    /**
     * Send request to a specifiq mailChimp URL
     * @param  {String}   url      api Path to specific functions
     * @param  {Json}   jsonData Json Config with mandatory key's depend from url api path
     * @param  {Function} callback Used when ajax.send is success
     * @return {void}
     */
    MailChimpConnector.prototype.request = function request(url,jsonData,callback) {

        this.checkCredentials();

        var customHeaders = {
            "Content-Type"           : "application/json"
        },
            urlPost = "https://"+this.DATA_CENTER+".api.mailchimp.com/2.0/"+url+"/";

        $.ajax({
            headers: customHeaders,

            url    : urlPost ,
            method : "POST",
            data   : JSON.stringify(jsonData),

            error : function error(request,statusText,err) {
                Kiwapp.log('[mailChimpConnector@send] : ' + err +" "+ statusText);

                Kiwapp.session().store(jsonData,{
                    url     : urlPost,
                    headers : customHeaders,
                    method  : "POST"
                }).send();
            },

            success : function success(data){
                callback(data);
                Kiwapp.log('[mailChimpConnector@send] : Send success');
            }
        });

    };

    window.MailChimpConnector = MailChimpConnector;

})();