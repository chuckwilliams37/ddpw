$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Models.Command
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend classification services.  */
$.Model('Level3_ddpw_administration.Models.EnvironmentVariables',
{
	defaults : {
	},
	attributes : { 
		
		
		accountId : "string",
		serviceId : "string",
		segment   : "string",
		product   : "string", 
		bandwidth : "string", 
		portalUserName : "string",
		portalUserPhone : "string",
		portalUserEmail : "string",
		variable1 : "string",
		variable2 : "string",
		variable3 : "string",
		variable4 : "string",
		variable5 : "string",
		variable6 : "string",
		variable7 : "string",
		variable8 : "string",
		variable9 : "string",
		variable10 : "string",
		variable11 : "string",
		variable12 : "string",	   
	}
},
{
	
  	  
  	set : function ( targetStringOrObj , value ) {
		if (  typeof (targetStringOrObj) !='undefined' )  {
  		var valueType = typeof ( targetStringOrObj ),
  		targetObj = {},
  		targetString = "";
  		switch ( valueType ) {
  			case "object":
  				targetObj = targetStringOrObj;
  				for ( var key in targetObj ) {
  					if ( typeof ( targetObj [ key ] ) != "function" ) {
	  					this[key] = targetObj[key];
	  				}
  				}
  			break;
  			case "string":
  			case "number":
  				targetString = targetStringOrObj;
  				this[targetString] = value;
  			break;  			 				
  			default:
  				throw new Error ( "Unhandled valueType:"+valueType+" in ClarifyTicketProxy."  );
  			break;
  		}
  		return this;
  		}
  		var xyz;
  		  		
  	},
  	get : function ( prop ) {
  	if (  typeof (prop) != 'undefined' )  {
  		var returnValue = null;
  		if ( typeof ( this[prop] ) != 'undefined') {
	  		returnValue = this[prop];
	  	}
	  	return returnValue;
	  	}
  	},
  	
   		accountId : "",
		serviceId : "",
		segment 	: "",
		product : "", 
		bandwidth : "", 
		portalUserName : "",
		portalUserPhone : "",
		portalUserEmail : "",
		variable1 : "",
		variable2 : "",
		variable3 : "",
		variable4 : "",
		variable5 : "",
		variable6 : "",
		variable7 : "",
		variable8 : "",
		variable9 : "",
		variable10 : "",
		variable11 : "",
		variable12 : "",	   
    
});

})
