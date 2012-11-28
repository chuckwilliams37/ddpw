$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Models.Classification
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend classification services.  
 */
$.Model('Level3_ddpw_administration.Models.Classification',
/* @Static */
{
	_classificationHierarchy : {},
	_classificationGroups : [],	
	findAll: function ( params, success, error ) {
		var $applicationAdminController = typeof  ( $("#main").controller() ) == 'undefined' ? $("#ddpw_main").controller() :  $("#main").controller();
		
		var domainName = params.domain;		
		var url2 = domainName+"?callingApp=TICKETING_PORTAL&userName="+$applicationAdminController.options.userInfo.portalUserName,
		classificationsServiceUrl = Level3_ddpw_administration.Controllers.ApplicationController.ROOT_PROMPT_TREE_DATA_SERVICE_PATH +"/classifications/"+url2;
		
		//console.debug ("Classification.findAll()",arguments );
		return $.ajax ({
  			type: "GET",
  			converters : {
				"xml classificationModels" : Level3_ddpw_administration.Models.Classification.models
			},
			dataType : "xml classificationModels",
  			/*
			*/
  			url: classificationsServiceUrl,
  			success: success,
  			error : error
  		});
  	},
  	findByServiceId : function ( params, success, error ) {
//  		alert("Begining of getClassificationsByServiceId");
	    var serviceId = params.serviceId;
	    var $applicationAdminController = typeof  ( $("#main").controller() ) == 'undefined' ? $("#ddpw_main").controller() :  $("#main").controller();
		var domainName = params.domain;		
		var url2 = "&callingApp=TICKETING_PORTAL&userName="+$applicationAdminController.options.userInfo.portalUserName;
		var classificationsServiceUrl = Level3_ddpw_administration.Controllers.ApplicationController.ROOT_PROMPT_TREE_DATA_SERVICE_PATH +"/classificationsPerSid/"+domainName+"?serviceId="+serviceId+url2;

		return $.ajax ({
  			type: "GET",
  			url: classificationsServiceUrl,
  			success: success,
  			error : function (jqXHR, textStatus, errorThrown) {
  				alert ("error");
  				//console.debug (arguments);
  			}
  		});

	},
	/*
  	findOne : "/classifications/{id}.json", 
  	create : "/classifications.json",
 	update : "/classifications/{id}.json",
  	destroy : "/classifications/{id}.json"
  	*/
  	models : function ( rawData ) {
		//console.debug ("Level3_ddpw_administration.Models.Classification.models()" , arguments);
		var classifications = null;
  		if ( $("TroubleTicketClassification", rawData).length > 0 ) {
			//console.debug ("TroubleTicketClassification processing...");
			
			var classificationHierarchy = {}
	  		var classificationGroupNames = [];
	  		
	  		$("TroubleTicketClassification", rawData).children().each( function (index, element) {
	  			if (!classificationHierarchy.hasOwnProperty(element.nodeName)) {
	  				classificationHierarchy[element.nodeName] = []; 
			  		//node order indicates which classification types **should** be rendered first.
	  				classificationGroupNames.push(element.nodeName); 
	  			}
	  			var classificationText = element.textContent ? element.textContent : element.text ? element.text :  null ;
	  			classificationHierarchy[element.nodeName].push( classificationText );
	  		} );
	  		Level3_ddpw_administration.Models.Classification._classificationHierarchy = classificationHierarchy;
	  		Level3_ddpw_administration.Models.Classification._classificationGroupNames = classificationGroupNames;
	  		
  			this._super ( );
			//return _classificationHierarchy;
  		} else {
  			//throw new Error ("No TroubleTicketClassification node exists in response from classifications data service");
  			classifications = this._super ( rawData );
  		}
  		return classifications;
	},
	getClassificationHierarchy : function () { 
		return this._classificationHierarchy;
	},
	getClassificationGroupNames : function () { 
		return this._classificationGroupNames;
	}
},
/* @Prototype */
{
	name: "classification name"
	,domain: "level3.subdomain.applicationDomain"
	,type: "classificationType"
});

})