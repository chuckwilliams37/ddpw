$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory'
 */
$.Class('Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory',
	/** @Static */
	{
		EXIT_COMMAND : "ExitCommand",
		CREATE_TICKET_COMMAND : "CreateTicketCommand",
		SET_TICKET_ATTRIBUTES_COMMAND : "SetTicketAttributesCommand",
		SET_ENVIRONMENT_VARIABLE_COMMAND : "SetEnvironmentVariableCommand",
		LAUNCH_COMMAND : "LaunchCommand",
		COMMAND_TYPES : [],
		COMMAND_LIBRARY_PATH : "./application/library/level3/ddpw/commands/",
		COMMAND_LIBRARY_VIEWS_PATH : "./application/library/level3/ddpw/commands/views/",
		COMMAND_LIBRARY_CONTROLLERS_PATH : "./application/library/level3/ddpw/commands/controllers/",
		setup : function () {
			Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.COMMAND_TYPES.push(Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.EXIT_COMMAND);
			Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.COMMAND_TYPES.push(Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.CREATE_TICKET_COMMAND);
			Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.COMMAND_TYPES.push(Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.SET_TICKET_ATTRIBUTES_COMMAND);
			Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.COMMAND_TYPES.push(Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.SET_ENVIRONMENT_VARIABLE_COMMAND);
			//Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.COMMAND_TYPES.push(Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.LAUNCH_COMMAND);
		},
		getCommandsMenu : function () {
			console.debug(this.shortName + ".getCommandsMenu()");

			var menuHtml = $.View(Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.COMMAND_LIBRARY_VIEWS_PATH+"create_command_dialog_selection_menu.ejs",
					{
						commandTypes:Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.COMMAND_TYPES
					});
			return menuHtml;
		},
		getAvailableCommands : function () {
			console.debug(this.shortName + ".getAvailableCommands()");
			
			var commandTypes = Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.COMMAND_TYPES,
			commands =[],
			createCommand =  Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.createCommandInstance;
			
			$.each ( commandTypes, function ( index, commandType ) {
				commands.push ( createCommand ( commandType ) );
			});
			console.debug(this.shortName + ".getAvailableCommands() COMPLETE");
			return commands;
		},
		getCommandRenderer : function (commandType, context) {
			var commandRenderers = {},
			returnVal = null;
			var viewPath = Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.COMMAND_LIBRARY_VIEWS_PATH;
			
			commandRenderers[Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.EXIT_COMMAND] = {
				"create_command_dialog_menu_item" : viewPath + "/menu_item_renderers/default_item_renderer.ejs",
				"create_command_dialog_detail_form" : viewPath + "/detail_form_renderers/exit_command.ejs"
			};	
			commandRenderers[Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.CREATE_TICKET_COMMAND] = {
				"create_command_dialog_menu_item" : viewPath + "/menu_item_renderers/default_item_renderer.ejs",
				"create_command_dialog_detail_form" : viewPath + "/detail_form_renderers/create_ticket_command.ejs"
			};	
			commandRenderers[Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.SET_TICKET_ATTRIBUTES_COMMAND] = {
				"create_command_dialog_menu_item" : viewPath + "/menu_item_renderers/default_item_renderer.ejs",
				"create_command_dialog_detail_form" : viewPath + "/detail_form_renderers/set_ticket_attributes_command.ejs"
			};
			commandRenderers[Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.SET_ENVIRONMENT_VARIABLE_COMMAND] = {
				"create_command_dialog_menu_item" : viewPath + "/menu_item_renderers/default_item_renderer.ejs",
				"create_command_dialog_detail_form" : viewPath + "/detail_form_renderers/set_environment_variable_command.ejs"
			};
			commandRenderers[Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.LAUNCH_COMMAND] = {
				"create_command_dialog_menu_item" : viewPath + "/menu_item_renderers/default_item_renderer.ejs",
				"create_command_dialog_detail_form" : viewPath + "/detail_form_renderers/launch_command.ejs"
			};	
			
			returnVal =  commandRenderers[commandType][context];
			//console.debug(arguments, returnVal);
			return returnVal;
		},
		getCommandController : function (commandType, context) {
			console.debug ( "getCommandController()");
			var commandControllers = {},
			returnVal = null;
			
			commandControllers[Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.EXIT_COMMAND] = {
				"create_command_form" : Level3_ddpw_administration.Library.Level3.Ddpw.Commands.Controllers.DetailFormControllers.ExitCommand
			};	
			commandControllers[Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.CREATE_TICKET_COMMAND] = {
				"create_command_form" : Level3_ddpw_administration.Library.Level3.Ddpw.Commands.Controllers.DetailFormControllers.CreateTicketCommand
			};	
			commandControllers[Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.SET_TICKET_ATTRIBUTES_COMMAND] = {
				"create_command_form" : Level3_ddpw_administration.Library.Level3.Ddpw.Commands.Controllers.DetailFormControllers.SetTicketAttributesCommand
			};	
			commandControllers[Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.SET_ENVIRONMENT_VARIABLE_COMMAND] = {
				"create_command_form" : Level3_ddpw_administration.Library.Level3.Ddpw.Commands.Controllers.DetailFormControllers.SetEnvironmentVariableCommand
			};	
			commandControllers[Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.LAUNCH_COMMAND] = {
				"create_command_form" : Level3_ddpw_administration.Library.Level3.Ddpw.Commands.Controllers.DetailFormControllers.LaunchCommand
			};	
			
			returnVal =  commandControllers[commandType][context];
			console.debug(arguments, returnVal);
			return returnVal;
		},
		createCommandInstance : function ( type , initParams )
		{
			try {
				var command = null,
				commandFactory = Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory,
				initParams = initParams ? initParams : {};
			
				switch ( type ) {
					case commandFactory.EXIT_COMMAND:
						command = new Level3_ddpw_administration.Library.Level3.Ddpw.Commands.ExitCommand( initParams );
					break;
					case commandFactory.CREATE_TICKET_COMMAND:
						command = new Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CreateTicketCommand( initParams );
					break;
					case commandFactory.SET_TICKET_ATTRIBUTES_COMMAND:
						command = new Level3_ddpw_administration.Library.Level3.Ddpw.Commands.SetTicketAttributesCommand(  initParams);
					break;
					case commandFactory.SET_ENVIRONMENT_VARIABLE_COMMAND:
						command = new Level3_ddpw_administration.Library.Level3.Ddpw.Commands.SetEnvironmentVariableCommand(  initParams);
					break;
					case commandFactory.LAUNCH_COMMAND:
						command = new Level3_ddpw_administration.Library.Level3.Ddpw.Commands.LaunchCommand( initParams );
					break;
					default:
						throw new Error ("Command type : " + type +" not found in command factory.");
					break;
				}
			} catch (e) {
//				console.debug ( "Error creating "+ type +": " );
	//			console.debug ( e.message, e.stack );
			}
			return command;
		}
	},
	/** @Prototype **/
	{
		
	});
});