$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Controllers.BuilderPanelToolControllers.DatePicker
 */
$.Controller('Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Controllers.BuilderPanelToolControllers.DatePicker',
	/** @Static */
	{
		defaults : {
			toolType : null
		}
	},
	/** @Prototype */
	{
		init : function ( element, options ){
			$(".date_picker",this.element).datepicker({
					showOn: "button",
					buttonImage: "./application/images/calendar.gif",
					buttonImageOnly: true
			});
		}
	}
);
});