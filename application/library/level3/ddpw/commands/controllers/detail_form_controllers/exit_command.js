$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Library.Level3.Ddpw.Commands.Controllers.DetailFormControllers.ExitCommand
 * @inherits jQuery.Controller
 * Wraps backend classification services.  
 */
$.Controller('Level3_ddpw_administration.Library.Level3.Ddpw.Commands.Controllers.DetailFormControllers.ExitCommand',
/* @Static */
{  	
	defaults : {
		exitUrlOption : "/portalWeb/mylevel3?_nfpb=true&_nfls=false&_pageLabel=L3PPNov2008MyServicesBookDefLabel&ORIG_PAGELABEL=&ORIG_TIER=1",
		exitUrl : "/portalWeb/mylevel3?_nfpb=true&_nfls=false&_pageLabel=L3PPNov2008MyServicesBookDefLabel&ORIG_PAGELABEL=&ORIG_TIER=1",
		customUrl : "",
		exitMessage : "Thank you!  You will now be redirected.",
		displayExitMessage : false,
		command : null
	},
	listensTo : []
},
/* @Prototype */
{
	init : function () {
		console.debug ( this.Class.shortName + ".init()", this );
		this.element.html ( $.View ( "./application/library/level3/ddpw/commands/views/detail_form_renderers/exit_command_details.ejs" , { command : this.options.command }) );
		this.initFormControls ();
	}
	,initFormControls : function () {
		var exitUrlOption = $("select[name='exitUrlOption']").val(),
		displayExitMessage = $("input[name='displayExitMessage']:checked").val();
		
		if ( exitUrlOption == "ticketSummaryScreen" ) {
			$("input[name='exitUrl']").hide();
		} else {
			$("input[name='exitUrl']").show();		
		}

		if ( displayExitMessage == "true" ) {
			$(".exitMessageDetailsContainer").show();
		} else {
			$(".exitMessageDetailsContainer").hide();		
		}
	}
	,processForm : function ( context ) {
		this.options.command.commandData = $("#commandDetailsForm", this.element).formParams();
		console.debug (this.Class.shortName + ".processForm () " , this );
	}
	,"select[name='exitUrlOption'], input[name='displayExitMessage'] change" : function ( element, event ) {
		console.debug ( arguments );
		this.initFormControls();
	}
	
});
})