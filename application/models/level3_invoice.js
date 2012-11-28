$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Models.Classification
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend classification services.  
 */
$.Model('Level3_ddpw_administration.Models.Level3Invoice',
/* @Static */
{
	findAll: function ( params, success, error ) {
		//var serviceUrl = Level3_ddpw_administration.Controllers.ApplicationController.ROOT_DATA_SERVICE_PATH +"/ServiceLookup/serviceIds";
		var $applicationAdminController = typeof  ( $("#main").controller() ) == 'undefined' ? $("#ddpw_main").controller() :  $("#main").controller();
		var serviceUrl = "http://idc1app1050.corp.global.level3.com/Billing/v3/Invoice/BilledInvoice/";
		params.callingApp = "TICKETING_REST";
		params.userName = $applicationAdminController.options.userInfo.portalUserName;
		params.billingAccountNumber = params.billingAccountNumber ? params.billingAccountNumber : "13888";
		
		//console.debug ("Level3_ddpw_administration.Models.Level3Service.findAll()",arguments );
	
		return $.ajax ({
  			type: "GET",
  			converters : {
				"json invoices" : Level3_ddpw_administration.Models.Level3Invoice.models
			},
			dataType : "json invoices",
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
		console.debug ("Level3_ddpw_administration.Models.Level3Invoice.models()" , arguments);
		var invoices = [];
		/*
			$.each ( rawData.level3Response.ServiceData, function ( index, serviceData ) { 
				//console.debug ("serviceData" , serviceData);
				services.push ( new Level3_ddpw_administration.Models.Level3Service ( serviceData ) );
		});
		*/	
  		return invoices;
	},
	attributes : {
	/*
		AccountId: "stringCleanup",
		AccountName: "stringCleanup",
		CnrJeopCode: "stringCleanup",
		ComponentName: "stringCleanup",
		Latitude: "stringCleanup",
		Longitude: "stringCleanup",
		MagmaSiteNum: "stringCleanup",
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
		*/
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
/*
	AccountId: "",
	AccountName: "",
	CnrJeopCode: "",
	ComponentName: "",
	Latitude: "",
	Longitude: "",
	MagmaSiteNum: "",
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
	*/
});

})