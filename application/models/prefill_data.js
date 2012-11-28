$(document).ready(function() {
/**
 * @Level3_ddpw_administration.Models.PrefillData
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend classification services.  
 */
$.Model('Level3_ddpw_administration.Models.PrefillData',
/* @Static */
{	
  	models : function (rawData) {
		var prefillDataList = new Level3_ddpw_administration.Models.PrefillData.List();
		if(typeof ( rawData ) == 'object' && typeof ( rawData.length )  != 'undefined' &&  rawData.length == 0 ) {
			prefillDataList.push (new Level3_ddpw_administration.Models.PrefillData ( {prefillType : "" , prefillValue : ""} )) ; //this is our default - when we confirm that there are no objects.... we add 1 eempty one		
		}
		
		for (var i = 0; i < rawData.length; i++) {
			var prefillData = rawData[i];
			if (typeof (prefillData.Class) != 'undefined' && prefillData.Class.shortName == "PrefillData") {
				prefillDataList.push ( prefillData );
			} else {				
				prefillDataList.push (new Level3_ddpw_administration.Models.PrefillData ( prefillData ) );
			}
		}
		return prefillDataList;
	},
	attributes : {
		prefillType : "string",
		prefillValue : "string",		
		  
	}
},
/* @Prototype */
{		
			prefillType : "",
			prefillValue: "",
			init : function () {
			}
});

})