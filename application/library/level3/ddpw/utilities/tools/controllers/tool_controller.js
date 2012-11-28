$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Controllers.ToolController
 */
$.Controller('Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Controllers.ToolController',
	/** @Static */
	{
		defaults : {
			toolType : null
		}
	},
	/** @Prototype */
	{
		init : function ( element, options ){
			//console.debug("Level3_ddpw_administration.Ddpw.Utilities.Tools.Controllers.ToolController.init()", arguments);
			$("button",this.element).button({
					label : $("button",this.element).html()
			});
		},
		"click" : function (element, event) {
			console.debug (this.Class.shortName + ".click() : "+ this.options.toolType);
			var addToolEvent = new $.Event("addTool");
			addToolEvent.toolType = this.options.toolType;
			this.element.trigger(addToolEvent);
		}
		
	}
);
});