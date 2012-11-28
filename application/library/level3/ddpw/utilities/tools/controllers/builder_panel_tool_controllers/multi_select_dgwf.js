$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Controllers.BuilderPanelToolControllers.MultiSelectDataGridWithFilter
 */
$.Controller('Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Controllers.BuilderPanelToolControllers.MultiSelectDataGridWithFilter',
/** @Static */
{
	defaults : {
		toolType : null,
		prompt : null
	}
},
/** @Prototype */
{
	init : function ( element, options ){
		var dataTableTarget = $('.multiSelectDataGridTable', this.element);
		dataTableTarget.dataTable( {} );
	},
	getSampleData : function ( dataType ) {
		switch ( dataType ) {
			
		}
	},
	"{prompt} selectedEntity" : function ( ) {
		console.debug ( this.Class.fullName + " selectedEntity: " , arguments);
	}
});
});