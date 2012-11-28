$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.MultiSelectDataGridWithFilter
 * @parent index
 * @inherits jQuery.Model
 */
$.Class('Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.MultiSelectDataGridWithFilter',
/* @Static */
{
	attributes : {
		entitySelectionOptions : "object"
	}
},
/* @Prototype */
{	
	text: "Please select entit(y|ies)...",
	responseOptions: [{value:null}], //filled dynamically by controller ?? the whole grid is the singular "responseOption" whose output is managed by controllers (is this the right approach?)
	allowMultiple: true,
	selectedEntity : null,
	selectedFilters : null,
	selectedFilterValues : null,
	tableData : [],
	getEntityDummyData : function ( entityType , minVal , maxVal ) {
		var returnDummyData = {
			"aoColumns" : [],
			"aaData" : []
		},
		randEntityCount = Math.round( minVal+(Math.random()*(maxVal-minVal)) );
		
		switch ( entityType ) {
			case "service":
				returnDummyData.columns = [
					{ "sTitle" : "Service ID" },
					{ "sTitle" : "Service ID" },
					{ "sTitle" : "BusOrg" },
					{ "sTitle" : "BusOrg" },
					{ "sTitle" : "BusOrg" },
					{ "sTitle" : "BusOrg" },
					{ "sTitle" : "BusOrg" },
					
					"BusOrg",
					"BusOrg",
					"BusOrg",
					"BusOrg",
					"BusOrg",
					"BusOrg",
					"BusOrg",
					"BusOrg",
				
				]
			break;	
			case "invoice":
			break;	
			case "charge":
			break;	
			case "ban":
			break;	
		}
		
		for ( var i=0; i < randEntityCount; i++) {
			switch ( entityType ) {
				case "service":
					returnDummyData.data.push ( serviceEntityObject );
				break;	
				case "invoice":
				break;	
				case "charge":
				break;	
				case "ban":
				break;	
			}
		}
	},
	getDummyServiceEntity : function () {
		var busOrgsArray = getPatternStringCollection ( 10,50,"xxxxxx" ),
		serviceIDsArray = getPatternStringCollection ( 10,50,"LL/LLLL/xxxxxx/Lxxx/LLL" ),
		serviceProductNamesArray = getPatternStringCollection ( 10,50,"LLLLLLLL" ),
		serviceBandwidthArray = getPatternStringCollection ( 10,50,"LLx" ),
		serviceAddressArray = getPatternStringCollection ( 10,50,"xxxx LLLLLLL xxx, LLLLLLL LL xxxxx" ),
		servicePiidSciidArray = getPatternStringCollection ( 10,50,"xxxxx-LLxxxxx" ),
		customerPOArray = getPatternStringCollection ( 10,50,"LLxxx-xxxxx" ),
		serviceOESystemArray = getPatternStringCollection ( 10,50,"LL-LL-LL-LL" ),
		createdDates = [];
		
		
		for (var i=0; i<=20; i++) {
			var randomDate = new Date();
			daysToAdd = -350+(Math.round(Math.random()*700));
			randomDate.setDate(randomDate.getDate()+daysToAdd);
			createdDates.push(randomDate);
		}
		var serviceEntityObject =  [
			$.fixture.rand( busOrgsArray , 1)[0], 				//busOrg: 
			$.fixture.rand( serviceIDsArray , 1)[0], 			//serviceId: 
			$.fixture.rand( serviceProductNamesArray , 1)[0], 	//productName: 
			$.fixture.rand( serviceBandwidthArray , 1)[0], 		//bandWidth: 
			$.fixture.rand( serviceAddressArray , 1)[0], 		//aLocation: 
			$.fixture.rand( serviceAddressArray , 1)[0], 		//zLocation: 
			$.fixture.rand( servicePiidSciidArray , 1)[0], 		//piid: 
			$.fixture.rand( servicePiidSciidArray , 1)[0], 		//scid: 
			$.fixture.rand( createdDates , 1)[0], 				//billStart: 
			$.fixture.rand( createdDates , 1)[0], 				//billStop: 
			$.fixture.rand( serviceProductNamesArray , 1)[0], 	//productFamily :
			$.fixture.rand( servicePiidSciidArray , 1)[0], 		//altSvcId :
			$.fixture.rand( servicePiidSciidArray , 1)[0], 		//altSvcId :
			$.fixture.rand( customerPOArray , 1)[0], 			//customerPO : 
			$.fixture.rand( serviceOESystemArray , 1)[0], 		//oeSystem : 
			$.fixture.rand( busOrgsArray , 1)[0] 				//orderNumber :
		];
		return serviceEntityObject;
	},
	getPatternStringCollection : function ( min, max, pattern ) {
		var collection = [],
		limit = rand ( min, max );
		
		for ( var i = 0; i <= limit; i++) {
			collection.push ( generateStringFromPattern ( pattern ) );
		}
		
		return collection;
	},
	rand : function ( low, high) {
		Math.floor((Math.random()*high)+low);
	},
	generateString : function ( stringLength )
	{
		var returnString = "";
		for (var i = 0; i < stringLength ; i++) {
			returnString += this.rand(0,1) ? String.fromCharCode((rand(48, 57))) : String.fromCharCode(rand(97, 122));
		}
		return returnString;
	},
	generateStringFromPattern : function ( pattern )
	{
		var returnString = "",
		x = "";
		for (var i = 0; i < stringLength ; i++) {
			x = pattern.charAt ( i );
			switch ( x ) {
				case "L" :
					returnString += String.fromCharCode(this.rand(97, 122));
				break;
				case "x" :
					returnString += String.fromCharCode(this.rand(48, 57));
				break;
				default:
					returnString += x;
				break;
			}
		}
		return returnString;
	}
	
	
	
});
})