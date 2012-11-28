$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Library.Level3.Ddpw.Commands.AbstractCommand
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend classification services.  
 */
$.Model('Level3_ddpw_administration.Library.Level3.Ddpw.Commands.AbstractCommand',
/* @Static */
{
	/*
	findAll: "/commands.json",
  	findOne : "/commands/{id}.json", 
  	create : "/commands.json",
 	update : "/commands/{id}.json",
  	destroy : "/commands/{id}.json"
  	,
  	defaults : {
  		id : Level3_ddpw_administration.Models.Prompt.getGuid()
  	},
  	*/
  	defaultRendererContext : "create_command_dialog",
  	defaultControllerContext : "create_command_form",
  	attributes : { 
  		type : "string",
  		domain : "string",
  		label : "string",
  		description : "string",
  		customNote : "string",
  		commandData : "object",
  		isCommandComplete : "boolean"
  	},
  	models : function ( rawData ) {
//	  	console.debug (this.shortName +".models() : " , rawData );
		var commands = new Level3_ddpw_administration.Library.Level3.Ddpw.Commands.AbstractCommand.List(),
		commandFactory = Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory;
		if ( rawData ) {
			for (var i = 0; i < rawData.length; i++) {
				var commandData = rawData[i];
				if (typeof (commandData.Class) != 'undefined' ){//&& rawData[i].Class.shortName == "Command") {
					commands.push ( commandData  );
				} else {
					var commandType = commandData.name ? commandData.name : commandData.type ? commandData.type : null;//to convert legacy json data
					commands.push ( commandFactory.createCommandInstance ( commandType, commandData) );
				}
			}
			//console.debug ("command.models() : commands:  " , commands );
		}
		return commands;
  	}
},
/* @Prototype */
{
	id : null
	,type : "CommandClassName"
	,domain : "level3.subdomain.applicationDomain"
	,label : "Command Label"
	,description : "Command Description"
	,customNote : "Command Custom Note"
	,isCommandComplete : false
	,name : null//this should go away - but is being kept for legacy purposes (conversion, etc.)
	,commandData : {}
	,execute : function () {
		//each specific command should override this function.
		throw new Error ( this.Class.shortName + " execute not overridden." );
	}
	,commandComplete : function () {
		//console.debug ("commandComplete", arguments, this);
		this.attr ( "isCommandComplete" , true );
	}
	,getItemRenderer : function ( context ) {
		context = context ? context : Level3_ddpw_administration.Library.Level3.Ddpw.Commands.AbstractCommand.defaultRendererContext; //default context 
		return Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.getCommandRenderer ( this.type , context );
	}
	,getController : function ( context ) {
		context = context ? context : Level3_ddpw_administration.Library.Level3.Ddpw.Commands.AbstractCommand.defaultControllerContext; //default context 
		return Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.getCommandController ( this.type , context );
	},
	setupBindings : function () {
		//override in concrete classes to setup bindings
	}
});

})