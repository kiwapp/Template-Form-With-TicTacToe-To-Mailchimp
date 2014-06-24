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
