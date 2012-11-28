$(document).ready(function() {
/**
 * @class Level3_ddpw_execution.Controllers.CommandController
 */
$.Controller('Level3_ddpw_execution.Controllers.CommandController',
/** @Static */
{
	defaults : {
		commandQueue : [],
		queuePosition : -1,
		currentCommand : null,
		environmentVariables : {}
	},
	listensTo : ["interviewComplete" ,"executeNextCommand" , "commandQueueBegin","setEnvironmentVariables"]
},
/** @Prototype */
{
	init : function(){
		//console.debug ( this.Class.shortName + ".init()" );
		//alert ( this.Class.shortName + ".init()"  );
	},
	"{window} interviewComplete" : function ( element, event ) {
		//console.debug ( this.Class.shortName + ".{window} interviewComplete()", arguments );
		var tree = event.tree,
		filters = ["hasSelections","prompts"],
		cursor = tree.getCursor().setFilters( filters ).moveTo ( "start" ),
		instance = null;
		this.options.queuePosition = -1;
		//iterate the tree and collect commands from selected responses
		do {
			instance = cursor.getInstance();
			if ( instance ) {
				var selectedResponseCommands = instance.getSelectedResponseCommands();
				if ( selectedResponseCommands.length ){
					this.appendToQueue ( selectedResponseCommands, instance.attr("selectedResponse") ) ;
				}
			}
		} while ( cursor.next() );
		
		var startEvent = $.Event ( "commandQueueBegin" ,  { commandQueue : this.options.commandQueue } );
		
		this.element.trigger (startEvent);
		
		this.executeCommandQueue();
		
	},
	"{window} executeNextCommand" : function ( element, event) {
		this.executeCommandQueue();
	},
	"{window} executeNonQueuedCommand" : function ( element, event) {
		var command = event.command;
		var selectedResponse = event.selectedResponse;
		var runtimeVars =  this.getCommandRuntimeInitParams ( command.serialize() );
		var serializedCommand = command.serialize();
		var commandInitParams = {};
		commandInitParams.commandData = {userSelectedResponse : selectedResponse};
		
		
		$.extend ( true, commandInitParams , runtimeVars , serializedCommand );
		
		var runtimeCommand = Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.createCommandInstance ( command.type , commandInitParams );
		runtimeCommand.userSelectedResponse = selectedResponse;
		runtimeCommand.bind ( "isCommandComplete", function () {
			//Command Complete Alert
		});
		runtimeCommand["execute"].apply ( runtimeCommand );
			
	},
	appendToQueue : function ( commands , selectedResponse ) {
		//console.debug ("appendToQueue : " , commands );
		var commandQueue = this.options.commandQueue;
		if ( (typeof ( commands ) ==  'object' || typeof ( commands ) ==  'array')&& commands.length >= 0 ){
			for ( var i = 0; i < commands.length; i++ ) {
				var command = commands[i];
				commandQueue.push ( { command : command, selectedResponse : selectedResponse });
			};
		} else {
			throw new Error ( "Commands must be passed to 'appendToQueue' as an array" );
		}
		this.options.commandQueue = commandQueue;
		//console.debug ("commandQueue : " , commandQueue );
	},
	getCommandRuntimeInitParams : function ( command ) {
		
		var commandRuntimeParams = {};
		
		switch ( command.type ) {
			case Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.EXIT_COMMAND:
				commandRuntimeParams.commandData = {};
			break;
			case Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.CREATE_TICKET_COMMAND:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.SET_ENVIRONMENT_VARIABLE_COMMAND:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.SET_TICKET_ATTRIBUTES_COMMAND:
				commandRuntimeParams.commandData = {
					environmentVariables : this.getEnvironmentVariables()
				};
			break;
			default : 
				commandRuntimeParams.commandData = {};
			break;
		}
		return commandRuntimeParams;	
		
	},
	getEnvironmentVariables : function () {
		var environmentVariables = typeof ( this.options.environmentVariables ) != 'undefined' ? this.options.environmentVariables : {};
		
		
		
		if ( typeof ( parameters ) != 'undefined' ) {
			//here these variable names should match how they are set in the commands-dialogue in the administrative view...
			$applicationController = $("#ddpw_main").controller();
			environmentVariables.accountId = environmentVariables.accountId ? environmentVariables.accountId : parameters.accountId;

			environmentVariables.serviceId = environmentVariables.serviceId ? environmentVariables.serviceId:  parameters.serviceId;
			
			environmentVariables.domain = environmentVariables.domain? environmentVariables.domain : parameters.domain;
			
			//classifications may grow to be more than 1... so this will need to be changed in the future to handle multiple classifications within a group
			//...and also additional classfication groups (e.g. more than product, segment, bandwidth, and non-hardcoded...
			
			environmentVariables.product = environmentVariables.product ? environmentVariables.product : $applicationController.options.selectedClassifications.product[0];
			
			environmentVariables.segment = environmentVariables.segment ? environmentVariables.segment : $applicationController.options.selectedClassifications.segment[0];
		
			environmentVariables.bandwidth = environmentVariables.bandwidth ? environmentVariables.bandwidth : $applicationController.options.selectedClassifications.bandwidth[0];			
			
			environmentVariables.portalUserName = typeof(environmentVariables.portalUserName) != "undefined" ? environmentVariables.portalUserName : $applicationController.options.userInfo.portalUserName; 			
						
			environmentVariables.portalUserEmail = typeof(environmentVariables.portalUserEmail) != "undefined" ? environmentVariables.portalUserEmail : $applicationController.options.userInfo.portalUserEmail;	
					
			environmentVariables.portalUserPhone =  typeof(environmentVariables.portalUserPhone) != "undefined" ? environmentVariables.portalUserPhone : $applicationController.options.userInfo.portalUserPhone;			
						
		}
		
		this.options.environmentVariables = environmentVariables;
		return this.options.environmentVariables;
	},
	setEnvironmentVariables : function ( valuesObject ) {
		var environmentVariables = typeof ( this.options.environmentVariables ) != 'undefined' ? this.options.environmentVariables : {};
  		var $applicationController = typeof  ( $("#main").controller() ) == 'undefined' ? $("#ddpw_main").controller() :  $("#main").controller();
		//handle the ticket proxy different than the rest
		if ( typeof (environmentVariables.ticketProxy) != 'undefined' &&
				typeof (valuesObject.ticketProxy) != 'undefined'
			) {
			var dummyTicketProxy = new Level3_ddpw_administration.Models.ClarifyTicketProxy();
			$.each ( valuesObject.ticketProxy , function ( key , value ) {
				if ( dummyTicketProxy[key] != value ) {
					if ( key == "externalNote" ) {
						environmentVariables.ticketProxy[key] += "\r\n" + value;
					} else {
						environmentVariables.ticketProxy[key] = value;
					}
				}
			});
			delete valuesObject.ticketProxy;
		}
		$.extend ( true, environmentVariables , valuesObject );
		
		this.options.environmentVariables = environmentVariables;
		$.extend ( true, $applicationController.options.environmentVarList , environmentVariables );
		return this.options.environmentVariables;
	},
	executeCommandQueue : function ( event, isCommandComplete ) {
		this.options.queuePosition++;
		
		if ( this.options.queuePosition < this.options.commandQueue.length && typeof (this.options.commandQueue [this.options.queuePosition ] ) != 'undefined' ) {
			var command = this.options.commandQueue[this.options.queuePosition ].command;
			//var selectedResponse = this.options.commandQueue[this.options.queuePosition ].attr ("selectedResponse");//TODO: selected response needs to be treated for array results
			//commented the above line just for testing. need to work on it.
			var selectedResponse = this.options.commandQueue[this.options.queuePosition ].selectedResponse;
			
			
			var runtimeVars =  this.getCommandRuntimeInitParams ( command.serialize() );
			var serializedCommand = command.serialize();
			var commandInitParams = {};
			$.extend ( true, commandInitParams , runtimeVars , serializedCommand );
			commandInitParams.commandData.userSelectedResponse = selectedResponse;
			
			var runtimeCommand = Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.createCommandInstance ( command.type , commandInitParams );
			runtimeCommand.bind ( "isCommandComplete", function () {
				$(".command-controller").trigger ( "executeNextCommand" );
			});
			runtimeCommand["execute"].apply ( runtimeCommand );
			
			/*
			this.options.commandQueue [this.options.queuePosition ].bind ( "isCommandComplete", function () {
				$(".command-controller").trigger ( "executeNextCommand" );
			});
			var runtimeVars =  this.getCommandRuntimeInitParams ( command.serialize() );
			var serializedCommand = command.serialize();
			var commandInitParams = {};
			$.extend ( true, commandInitParams , runtimeVars , serializedCommand );
			commandInitParams.commandData.userSelectedResponse = selectedResponse;
			
			var runtimeCommand = Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.createCommandInstance ( command.type , commandInitParams );
				
			
			
			this.options.commandQueue [this.options.queuePosition ]["execute"].apply (this.options.commandQueue [this.options.queuePosition ] );
			*/
		}	
	},
	"{window} setEnvironmentVariables" : function ( element, event ) {
		//event should declare property and value - expecting to be "merged" (extended) into existing environment variables object
		this.setEnvironmentVariables ( event.environmentVariables );
	}
});
});