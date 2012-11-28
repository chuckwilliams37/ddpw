$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Models.Classification
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend classification services.  
 */
$.Model('Level3_ddpw_administration.Models.UserInformation',
/* @Static */
{
	userInfo: {},
	
	getUserInfo: function (success, error ) {
		var USERINFORMATIONURL = "/portalWeb/rest/user";
		
		if ( error == null ) {
		    error = function() {
					alert("System Error: Unable to communicate with portal");
		    };
		};
		
		
		return $.ajax({ 
				url: USERINFORMATIONURL+"/json?callingApp=TICKETING_PORTAL&userName=tktrest_appuser",
				dataType: "json",
				error: error,
				success: success
			});
  	}, 	
	  	
},
/* @Prototype */
{
	portalUserName: ""
	,portalUserEmail: ""
	,portalUserPhone: ""
});

})