$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Models.ExitCommand
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend classification services.  
 */
Level3_ddpw_administration.Library.Level3.Ddpw.Commands.AbstractCommand('Level3_ddpw_administration.Library.Level3.Ddpw.Commands.ExitCommand',
/* @Static */
{  	
	defaults : { 
		id : Level3_ddpw_administration.Models.PromptTree.getGuid(),
		type : "ExitCommand",
		label : "Exit Command",
		customNote: "Exit Command Custom Note",
		domain : "com.level3.ssmadmin",
		description : "The Exit command is used to cause a 'clean' exit of the end-user's interaction."
						+" This may include closing a window, exiting dialogs, saving outstanding information, and executing pending commands.",
		commandData : {}
  	}
},
/* @Prototype */
{
	execute : function () {
		//console.debug (this.Class.shortName + ".execute()");
		//console.debug ( this );
		if ( typeof ( this.commandData.displayExitMessage ) !=  'undefined' && ( this.commandData.displayExitMessage == true || this.commandData.displayExitMessage == "true" )) {
			this.displayMessage();
		} else {
			this.redirectToUrl();
		}
	},
	displayMessage : function ( ){
		var $thisCommand = this;
		var messageBox = $("<div>"+ $thisCommand.commandData.exitMessage +"</div>").dialog ( {
			title : $thisCommand.commandData.exitMessageTitle,
			modal : true,
			buttons : {
				"OK" : function ( ) {
					$(this).dialog ( "close" );
					$thisCommand.redirectToUrl();
				}
				
			}
		});
	},
	redirectToUrl : function ( ) {
		if ( typeof ( this.commandData.exitUrlOption ) != 'undefined' ) {
			switch ( this.commandData.exitUrlOption ) {
				case "ticketSummaryScreen":
					document.location.href = "/portalWeb/mylevel3?_nfpb=true&_nfls=false&_pageLabel=L3PPNov2008MyServicesBookDefLabel&ORIG_PAGELABEL=&ORIG_TIER=1";
				break;
				case "custom":
					document.location.href = this.commandData.exitUrl;
				break;
			}
		}	
		this.commandComplete();
	}
});
})