$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Models.LaunchCommand
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend classification services.  
 */
Level3_ddpw_administration.Library.Level3.Ddpw.Commands.AbstractCommand('Level3_ddpw_administration.Library.Level3.Ddpw.Commands.LaunchCommand',
/* @Static */
{
},
/* @Prototype */
{
	init : function () {
		this._super();
	}
	,execute : function () {
		console.debug (this.Class.shortName + ".execute()");
		console.debug ( this );
	}
	,type : "LaunchCommand"
	,domain : "com.level3.ssmadmin"
	,label : "Launch Command"
	,description : "The Launch command is used to navigate to urls."
	,commandData : {}
	
});
})