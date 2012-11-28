$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Controllers.CommandsItemController
 */
$.Controller('Level3_ddpw_administration.Controllers.CommandsItemController',
/** @Static */
{
	defaults : {
		command : null
	},
	listensTo : []
},
/** @Prototype */
{
	init : function(){
		console.debug (this.Class.shortName +".init()", this.options );
		$("button.modify-command-button", this.element).button(
			{
				text:false,
				icons: {primary : "ui-icon-plus"}
			});
		$("button.delete-command-button", this.element).button(
			{
				text:false,
				icons: {primary : "ui-icon-close"}
			});
		
		
	}
})

});