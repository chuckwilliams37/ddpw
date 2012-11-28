$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Models.Classification
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend classification services.  
 */
$.Model('Level3_ddpw_administration.Models.Level3Service',
/* @Static */
{
	findAll: function ( params, success, error ) {
		var $applicationAdminController = typeof  ( $("#main").controller() ) == 'undefined' ? $("#ddpw_main").controller() :  $("#main").controller();
		var serviceUrl = Level3_ddpw_administration.Controllers.ApplicationController.ROOT_DATA_SERVICE_PATH +"/ServiceLookup/serviceIds";
		params.callingApp = "TICKETING_REST";
		params.userName = $applicationAdminController.options.userInfo.portalUserName;
		params.accounts = params.accounts  ? params.accounts : null;
		params.returnFormat = params.returnFormat ? params.returnFormat : 'models';
		if ( ! params.accounts ) {
			throw new Error ("Level 3 Service Model requires accounts.");
		}
		
		//console.debug ("Level3_ddpw_administration.Models.Level3Service.findAll()",arguments );
	
		var getConverter =	function () { 
							var fnConverter = null;
							
							switch ( params.returnFormat ) {
								case "dataTable":
									fnConverter =Level3_ddpw_administration.Models.Level3Service.modelsDataTable;
								break;
								case "models":
								default:
									fnConverter = Level3_ddpw_administration.Models.Level3Service.models;
								break;
							};
							
							return fnConverter;
						}
	
		return $.ajax ({
  			type: "GET",
  			converters : {
				"json services" : getConverter()
			},
			dataType : "json services",
			data : params , 
  			url: serviceUrl,
  			success: success,
  			error : error
  		});
  		
  	},
  	/*
  	findOne : "/classifications/{id}.json", 
  	create : "/classifications.json",
 	update : "/classifications/{id}.json",
  	destroy : "/classifications/{id}.json"
  	*/
  	models : function ( rawData ) {
		//console.debug ("Level3_ddpw_administration.Models.Level3Service.models()" , arguments);
		var services = [];
			$.each ( rawData.level3Response.ServiceData, function ( index, serviceData ) { 
				//console.debug ("serviceData" , serviceData);
				services.push ( new Level3_ddpw_administration.Models.Level3Service ( serviceData ) );
				if (serviceData.PIID == "BBRY9676") {
					console.debug ( "serviceData PIID = BBRY9676: " , serviceData );
				}
				for (var key in serviceData ) {
					if ( 
						key != "AccountId" 
						&& key != "AccountName" 
						&& key != "CnrJeopCode" 
						&& key != "ComponentName" 
						&& key != "Latitude" 
						&& key != "Longitude" 
						&& key != "MagmaSiteNum" 
						&& key != "PCSID" 
						&& key != "PIID" 
						&& key != "Product" 
						&& key != "ProductId" 
						&& key != "SCID" 
						&& key != "SID" 
						&& key != "ServiceLocation" )
						
						{
							console.debug ( "serviceData Anomolies: " , serviceData );
						}
				} 
			});
  		return services;
	},
  	modelsDataTable : function ( rawData ) {
		var services = {"aaData":[]};		
		for ( var i = 0; i < rawData.level3Response.ServiceData.length; i++) {
			var serviceData = rawData.level3Response.ServiceData[i];
			services.aaData.push ( new Level3_ddpw_administration.Models.Level3Service ( serviceData ) );
			if (serviceData.PIID == "BBRY9676") {
				console.debug ( "serviceData PIID = BBRY9676: " , serviceData );
			}
			for (var key in serviceData ) {
				if ( 
					key != "AccountId" 
					&& key != "AccountName" 
					&& key != "CnrJeopCode" 
					&& key != "ComponentName" 
					&& key != "Latitude" 
					&& key != "Longitude" 
					&& key != "MagmaSiteNum" 
					&& key != "PCSID" 
					&& key != "PIID" 
					&& key != "Product" 
					&& key != "ProductId" 
					&& key != "SCID" 
					&& key != "SID" 
					&& key != "ServiceLocation" )
					
					{
						console.debug ( "serviceData Anomolies: " , serviceData );
					}
			} 
			/*
			*/
		}
		console.debug ("Level3_ddpw_administration.Models.Level3Service.modelsDataTable()" , services);
  		return services;
	},
	attributes : {
		AccountId: "stringCleanup",
		AccountName: "stringCleanup",
		CnrJeopCode: "stringCleanup",
		ComponentName: "stringCleanup",
		Latitude: "stringCleanup",
		Longitude: "stringCleanup",
		MagmaSiteNum: "stringCleanup",
		BillingAccountNumber: "stringCleanup",
		PCSID: "stringCleanup",
		PIID: "stringCleanup",
		Product: "stringCleanup",
		ProductId: "stringCleanup",
		SCID: "stringCleanup",
		SID: "stringCleanup",
		ServiceLocation: "stringCleanup",
		ZCityName: "stringCleanup",
		ZCountryName: "stringCleanup",
		ZLine1Addr: "stringCleanup",
		ZPostalCd: "stringCleanup",
		ZStateCd: "stringCleanup"
	},
	convert : {
		stringCleanup : function(raw){
			switch ( typeof ( raw )  ) {
				case 'string' :
				    raw = raw.replace ( /(\bnull\b|[.]+[ ]{2,}[.]+||[^\w\d]+[ ]+[^\w\d]+)/gi , "");
				break;
				case 'number' :
					raw = raw.toString();
				break;
				default:
					raw = "";
				break;
			}
		return raw;
		}
	}
},
/* @Prototype */
{
	AccountId: "",
	AccountName: "",
	CnrJeopCode: "",
	ComponentName: "",
	Latitude: "",
	Longitude: "",
	MagmaSiteNum: "",
	BillingAccountNumber: "{BROKEN}",
	PCSID: "",
	PIID: "",
	Product: "",
	ProductId: "",
	SCID: "",
	SID: "",
	ServiceLocation: "",
	ZCityName: "",
	ZCountryName: "",
	ZLine1Addr: "",
	ZPostalCd: "",
	ZStateCd: ""
	
});

})