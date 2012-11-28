$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Models.CreateTicketCommand
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend classification services.  
 */
Level3_ddpw_administration.Library.Level3.Ddpw.Commands.AbstractCommand('Level3_ddpw_administration.Library.Level3.Ddpw.Commands.SetEnvironmentVariableCommand',
/* @Static */
{
	defaults : {
		id : Level3_ddpw_administration.Models.PromptTree.getGuid(),
		ticketModel : new Level3_ddpw_administration.Models.ClarifyTicketProxy(),
		type : "SetEnvironmentVariableCommand",
		domain : "com.level3.ssmadmin",
		label : "Set Environment Variable Command",
		description : "The Set Environment Variable Command is used to store & retrieve runtime variables (data used during the end-user's interaction)."
					+  " Select the variable to set, and the value to which you'd like to set it. "
					+"  These set values may then retrieved for later use in other commands, etc...",
		commandData : {},
		environmentVarList : null	
	},		
	getEnvironmentVarList : function(){
    //these named variables must match incoming variables at runtime
	//these three won't match because - at runtime these are arrays - and are "underscored"
	//this will need to be addressed - 

    var index=0;
    this.environmentVarList = new Array();
	this.environmentVarList[index++] = "accountId";
	this.environmentVarList[index++] = "serviceId";
	this.environmentVarList[index++] = "segment";
	this.environmentVarList[index++] = "product";
	this.environmentVarList[index++] = "bandwidth";
	this.environmentVarList[index++] = "portalUserName";
	this.environmentVarList[index++] = "portalUserPhone";
	this.environmentVarList[index++] = "portalUserEmail";	
	this.environmentVarList[index++] = "variable1";
	this.environmentVarList[index++] = "variable2";
	this.environmentVarList[index++] = "variable3";
	this.environmentVarList[index++] = "variable4";
	this.environmentVarList[index++] = "variable5";
	this.environmentVarList[index++] = "variable6";
	this.environmentVarList[index++] = "variable7";
	this.environmentVarList[index++] = "variable8";
	this.environmentVarList[index++] = "variable9";
	this.environmentVarList[index++] = "variable10";
	this.environmentVarList[index++] = "variable11";
	this.environmentVarList[index++] = "variable12";	
	return this.environmentVarList;
      }			
	,
	attributes : { 
		ticketModel : "Level3_ddpw_administration.Models.ClarifyTicketProxy.model",
		commandData : "commandData"
  	}, 
  	convert : {
  		commandData : function ( rawData ) {
  		//rawData *should* be an object with two properties: formParams & ticketProxy
  			var returnData = { },
  			proxyInitParams = {};
  			returnData.runtimeEnvValues = {};
  			if ( typeof ( rawData.formParams ) != 'undefined' ){
  				returnData.formParams = rawData.formParams;
	  			if ( typeof ( rawData.environmentVariables ) != 'undefined' &&
		  			typeof ( rawData.formParams.ticketValueSource ) != 'undefined' 
	  				){
	  				//iterate the existing command settings for values to be set
		  			$.each(rawData.formParams.ticketValueSource, function(key,val) {	
			  			var propertyToSet = null,
			  			propertyValue = null;
			  			switch ( val ) {
			  				case 'EnvironmentVariable':
				  				var envPropertySource = rawData.formParams.envProperties[key],
			  					propertyToSet = rawData.formParams.ticketProperties[key],
					  			//here we jsut need to make sure that the command-create dialogue int he administrative view names them the same as the command-controller....
					  			// HERE we need to modify to check for existing env var...
					  			// if NOT exists - we can conclude that the environmentVariable "propertyToSet" is instantiated with THIS command....
					  			// THEREFORE - propertyToSet AND propertyValue should BOTH come from THIS command's 
					  			// rawData.formParams RATHER THAN rawData.environmentVariables
					  			// ALSO - we must count on the Execute statement to modify 
					  							  							  			
					  			
			  					propertyValue = rawData.environmentVariables[ envPropertySource ] ;
								//setEnvVarEvent = $.Event ( "setEnvironmentVariables" , {environmentVariables : {propertyToSet : this.commandData.ticketProxy}});
								//$("body").trigger ( setEnvVarEvent );
			  				break;
			  				case 'UsersSelectedResponse':
			  					propertyToSet =  rawData.formParams.ticketProperties[key];
				  				if ( typeof (rawData.userSelectedResponse) == 'string' ) {
				  					propertyValue = rawData.userSelectedResponse;
						        } else if ( typeof (rawData.userSelectedResponse) != 'undefined' ){	
						        	//this case covers all "single select" inputs (e.g., textinputs, textareas, selects, radios)				        
				  					propertyValue = rawData.userSelectedResponse[0].value;
						        }
			  				break;
			  				case 'Custom':
			  					propertyToSet =  rawData.formParams.ticketProperties[key];
			  					propertyValue = rawData.formParams.ticketCustomValue[key];
			  				break;
			  			}
			  			//now we'll check for external notes and append vs set
						if ( propertyToSet == "externalNote" ) {
							if ( 
			  					typeof ( rawData.environmentVariables ) != 'undefined' && 
			  					typeof ( rawData.environmentVariables.ticketProxy ) != 'undefined' && 
			  					typeof ( rawData.environmentVariables.ticketProxy.externalNote ) != 'undefined' ) {
									propertyValue = rawData.environmentVariables.ticketProxy.externalNote + "\r\n" + propertyValue;
							}
				  		}
				  		rawData.environmentVariables[ propertyToSet ] = propertyValue  ? propertyValue :null ;
			  			returnData.runtimeEnvValues[propertyToSet] = propertyValue; 	
			  			var x;			  		
				  	});
	  			}
  			}
  			
  			return returnData; //returnData becomes this.commandData;
  		}
  	}
},
/* @Prototype */
{
	execute : function (  ) {
			var $thisCommand = this;
			var environmentVariables = {};
			$.each ( $thisCommand.commandData.runtimeEnvValues , function  ( key , value ) { 
				environmentVariables[key]= value;
				//within this loop, some values that have been set by this function may not have been passed in by the 
				// " this.getCommandRuntimeInitParams ( command.serialize() );" statement within the command-controller...
				// this situation is only expected to occur when variables that reference one another are set within
				// *this* command (as opposed to OTHER commands - in which case the "this.commandData.environmentVariables" should contain
				// the values to be overwritten.
				//therefore we may need to:
				//  1) check if the variable exists in the environmentVariables that were passed in
				//  2) if exists - it should be fine to just throw the event...
				//  3) if not exists - then new property should be added to environmentVariabls 
				//		- the issue is that the $thisCommand.commandData.runtimeEnvValues
				this.commandData
			});
			var setEnvVarEvent = $.Event ( "setEnvironmentVariables" , {environmentVariables : environmentVariables});
			$("body").trigger ( setEnvVarEvent );
		
			this.commandComplete();
	}
});
})