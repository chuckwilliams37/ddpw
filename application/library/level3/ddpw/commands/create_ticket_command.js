$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Models.CreateTicketCommand
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend classification services.  
 */
Level3_ddpw_administration.Library.Level3.Ddpw.Commands.AbstractCommand('Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CreateTicketCommand',
/* @Static */
{

	defaults : {
		id : Level3_ddpw_administration.Models.PromptTree.getGuid(),
		ticketModel : new Level3_ddpw_administration.Models.ClarifyTicketProxy(),
		type : "CreateTicketCommand",
		domain : "com.level3.ssmadmin",
		label : "Create Ticket Command",
		description : "The Create Ticket command is used to initialize the creation of a ticket. "
					+ "This command will be used by the system to determine whether or not a ticket"
					+" should actually be created.  If a 'CreateTicketCommand' is not encountered, a "
					+"ticket will not be created - even in the presence of 'SetTicketAttributeCommand's.",
		commandData : {}
	},
	attributes : { 
		ticketModel : "Level3_ddpw_administration.Models.ClarifyTicketProxy.model",
		commandData : "commandData"
  	}, 
  	convert : {
  		commandData : function ( rawData ) {
  			//rawData *should* be an object with two properties: formParams & ticketProxy
  			var returnData = {},
  			proxyInitParams = {};
  			if ( typeof ( rawData.ticketProxy ) != 'undefined' ){
  				if ( typeof  ( rawData.ticketProxy.Class ) != 'undefined'
  				 && rawData.ticketProxy.Class.shortName == 'ClarifyTicketProxy' ) {
  				 	proxyInitParams = rawData.ticketProxy.serialize();
  				 } else {
  				 	proxyInitParams = rawData.ticketProxy;
  				 }
  				 //set existing values from the ticketProxy that may have been constructed from set ticket attribute commands
	  			if (  typeof ( rawData.environmentVariables ) != 'undefined' && typeof ( rawData.environmentVariables.ticketProxy ) != 'undefined' ) {
		  			
		  			if ( typeof  ( rawData.environmentVariables.ticketProxy.Class ) != 'undefined'
  					 && rawData.ticketProxy.Class.shortName == 'ClarifyTicketProxy' ) {
	  				 	proxyInitParams =  $.extend ( true, proxyInitParams , rawData.environmentVariables.ticketProxy.serialize() );
	  				 } else {
	  				 	proxyInitParams = $.extend ( true, proxyInitParams , rawData.environmentVariables.ticketProxy );
	  				 }
	  			}
	  			
	  			
  				returnData.ticketProxy = new Level3_ddpw_administration.Models.ClarifyTicketProxy ( proxyInitParams );
  			}
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
			  					propertyValue = rawData.environmentVariables[ envPropertySource ];
			  				break;
			  				case 'UsersSelectedResponse':
			  					propertyToSet =  rawData.formParams.ticketProperties[key];
				  				if ( typeof (rawData.userSelectedResponse) == 'string' ) {
				  					propertyValue = rawData.userSelectedResponse;
						        } else if ( typeof (rawData.userSelectedResponse) != 'undefined' ){					        
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
			  			returnData.ticketProxy.attr( propertyToSet, propertyValue ); 				  		
				  	});
	  			}
	  			
	  			
  			}
  			return returnData;
  		}
  	}
},
/* @Prototype */
{
	execute : function (  ) {
		
		var $thisCommand = this;
		
		if ( typeof ( busyAnimation ) == 'function' ) {
			busyAnimation (true);
		}

		
		var serializedTktData = $thisCommand.commandData.ticketProxy.serialize();
		 $.ajax({ 
				url: "/portalWeb/TicketingProxy/ticketingRestServices/v2.0/troubleTickets/createPortalTicket",
				type: "POST",
				dataType: "json",
				data:serializedTktData,
				beforeSend: function(xhr) { 
				   xhr.setRequestHeader('X-Level3-Application-Key', 'TICKETING_PORTAL'); 
				   xhr.setRequestHeader('X-Level3-Username', 'tktportal_ssmapp'); 
				},
				error: function() {					
				 	if ( typeof (busyAnimation) == 'function' ) {
				 		busyAnimation(false);
				 	}
					alert("System Error: Unable to communicate with portal");
				},
				success: function(json,ticket) {
				 	if ( typeof (busyAnimation) == 'function' ) {
				 		busyAnimation(false);
				 	}
				 	var case_id=null;						 	
					if(json.level3Response.TroubleTicketing){
				     case_id = json.level3Response.TroubleTicketing.IdNumber;				    				    
					var dialogMessage = 'Thank you.  This information has been submitted under ticket ID #<b style="color:#ff0000;">'+case_id+'</b>.  '+
										'You can view your ticket status at any time by going to <b>Support & Maintenance &gt; Trouble Tickets &gt; View Trouble Tickets</b>.';
										
					$("<div></div>").html(dialogMessage).dialog ( {
						title : "Ticket Information",
						buttons: {
					    	"Ok" : function() {
						    	$(this).dialog("close"); 
					    	}
						},
						close : function(){
							$thisCommand.commandComplete();
						}
					});
					}
				    else{
				    	alert("Unable to create ticket:"+"\n"+json.level3Response.message);
				    }
				}
			});
				
	}
});
})