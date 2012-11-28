$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Models.SetTicketAttributesCommand
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend classification services.  
 */
Level3_ddpw_administration.Library.Level3.Ddpw.Commands.AbstractCommand('Level3_ddpw_administration.Library.Level3.Ddpw.Commands.SetTicketAttributesCommand',
/* @Static */
{
	defaults : {
		id : Level3_ddpw_administration.Models.PromptTree.getGuid(),
		ticketModel : new Level3_ddpw_administration.Models.ClarifyTicketProxy(),
		type : "SetTicketAttributesCommand",
		domain : "com.level3.ssmadmin",
		label : "Set Ticket Attributes Command",
		description : "The Set Ticket Attributes command is used to modify properties used in the creation of a ticket. "
						+ "This command will be used by the system to modify a ticket proxy (placeholder), "
						+" until that ticket data is actually sent to the 'Create Ticket Command'.  If a 'CreateTicketCommand' is not encountered, a "
						+"ticket will not be created - even in the presence of 'SetTicketAttributeCommand's...",
		commandData : {}
	},
	attributes : { 
		ticketModel : "Level3_ddpw_administration.Models.ClarifyTicketProxy.model",
		commandData : "commandData"
  	}, 
  	convert : {
  		commandData : function ( rawData ) {
  			//rawData *should* be an object with two properties: formParams & ticketProxy
  			var returnData = {};
  			if ( typeof ( rawData.ticketProxy ) != 'undefined' ){
  				if ( typeof  ( rawData.ticketProxy.Class ) != 'undefined'
  				 && rawData.ticketProxy.Class.shortName == 'ClarifyTicketProxy' ) {
  					returnData.ticketProxy = new Level3_ddpw_administration.Models.ClarifyTicketProxy ( rawData.ticketProxy.serialize() );
	  			} else {
  					returnData.ticketProxy = new Level3_ddpw_administration.Models.ClarifyTicketProxy ( rawData.ticketProxy );	  			
	  			}
  			}
  			if ( typeof ( rawData.formParams ) != 'undefined' ){
  				returnData.formParams = rawData.formParams;
	  			if ( typeof ( rawData.environmentVariables ) != 'undefined' ){
		  			$.each(rawData.formParams.ticketValueSource, function(key,val) {
		  				if(val == 'EnvironmentVariable'){
		  					var propertyName = rawData.formParams.ticketProperties[key];
		  					var envPropertySource = rawData.formParams.envProperties[key];
		  					//here we just need to make sure that the command-create dialogue in the administrative view names them the same as the command-controller....
				  			returnData.ticketProxy.attr( propertyName, rawData.environmentVariables[ envPropertySource ] ); 
				        }
				        if(val == 'UsersSelectedResponse'){
		  					if ( typeof (rawData.userSelectedResponse) == 'string' ) {
					            returnData.ticketProxy.attr( rawData.formParams.ticketProperties[key], rawData.userSelectedResponse );
					        } else if ( typeof (rawData.userSelectedResponse) != 'undefined' ){					        
					            returnData.ticketProxy.attr( rawData.formParams.ticketProperties[key], rawData.userSelectedResponse[0].value);
					        }
				        }
		  				if(val == 'Custom'){
				            returnData.ticketProxy.attr( rawData.formParams.ticketProperties[key], rawData.formParams.ticketCustomValue[key] );
				        }
				  	});
	  			}
  			}
  			return returnData;
  		}
  	}
},
/* @Prototype */
{
	execute : function () {
		var environmentVariables = {},
		setEnvVarEvent = $.Event ( "setEnvironmentVariables" , {environmentVariables : {ticketProxy : this.commandData.ticketProxy}});
		$("body").trigger ( setEnvVarEvent );
		
		this.commandComplete();
	}
});
})