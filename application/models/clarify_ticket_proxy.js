$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Models.Command
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend classification services.  
 */
$.Model('Level3_ddpw_administration.Models.ClarifyTicketProxy',
/* @Static */
{
	defaults : {
	},
	attributes : { 
		
		
		
	    custTicketId : "string",
		escalation : "string",
		externalNote : "string",
		callerContactEmail : "string",
		callerContactPhone : "string",
		callerContactName : "string",		
	    secondaryContactEmail: "string",
	    secondaryContactPhone: "string",
	    secondaryContactName: "string",	    
	    serviceId: "string",//service_id
	    accountId : "string", //bus_org ID, customer company identifier	   
	    severity: "string",
	    testAuthorized: "string",
	    testAuthorizedBy: "string",
	    premiseAddress1: "string",
	    premiseAddress2: "string",
	    premiseContactName: "string",
	    premiseContactPhone: "string",
	    premiseCity: "string",
	    premiseState: "string",
	    premiseZip: "string",
	    premiseHoursAvailable: "string",
	    priority : "string",
	    title : "string",
	    caseType1 : "string",
	    caseType2 : "string",
	    caseType3 : "string",
	    status : "string",
	    internalNote : "string", //added for billing
	    originatingTN :"string", //added for billing
	    terminatingTN :"string", //added for billing
	    callDate : "string" //added for billing
	    //uploadedFiles : "array",		
		//diagnostics : "string",
		//dispatchAuthorized : "string",
		//dispatchAuthorizedByWhom : "string",
		//dummy : "string",
		//serviceImage: "string",
	    //subType: "string",
	     //symptom: "string",
	}
},
/* @Prototype */
{
	
  	/*
	init : function ( params ) {
		//console.debug (this.Class.shortName + ".init()");
		if ( params ) {
			this.set ( params );
		}
  	}
  	,
  	*/
  
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
  	
    custTicketId : "",
	escalation : "",
	externalNote : "",
	callerContactEmail : "",
	callerContactPhone : "",
	callerContactName : "",
    secondaryContactEmail: "",
    secondaryContactPhone: "",
    secondaryContactName: "",    
    serviceId: "",//service_id
    accountId : "", //bus_org ID, customer company identifier   
    severity: "",
    testAuthorized: "",
    testAuthorizedBy: "",
    premiseAddress1: "",
    premiseAddress2: "",
    premiseContactName: "",
    premiseContactPhone: "",
    premiseCity: "",
    premiseState: "",
    premiseZip: "",
    premiseHoursAvailable: "",
    priority : "",
    title : "",
    caseType1 : "",
    caseType2 : "",
    caseType3 : "",
    status : "",
    internalNote : "",
    originatingTN : "",
	terminatingTN : "",
	callDate : ""
    
    //uploadedFiles : [],	
	//diagnostics : "",
	//dispatchAuthorized : "",
	//dispatchAuthorizedByWhom : "",
	//dummy : "",
	//serviceImage: "",
    //subType: "",
     //symptom: "",    
    
});

})