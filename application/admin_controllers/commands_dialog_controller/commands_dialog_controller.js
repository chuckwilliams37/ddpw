$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Controllers.CommandsDialogController
 */
$.Controller('Level3_ddpw_administration.Controllers.CommandsDialogController',
/** @Static */
{
	defaults : {
		selectedModel : null
		,selectedResponseElement : null
		,selectedResponseModel : null
		,selectedResponseIndex : null
		,selectedCommand : null
		,selectedCommandIndex : null
		},
	listensTo : []
},
/** @Prototype */
{
	init : function(){
		console.debug ( this.Class.shortName + ".init()");
		this.options.selectedResponseIndex = this.options.selectedResponseElement.index(".responseOptionItemContainer");//index() on DOM elements is "1 based" rather than "0 based"
		this.options.selectedResponseModel = this.options.selectedModel.responseOptions[this.options.selectedResponseIndex];
		console.debug (this.Class.shortName +".init()", this.options );
		this.initViews();
	},
	initViews : function () {
		this.initLeftPanel();
		this.initRightPanel();
	},
	initLeftPanel : function () {
		var $leftPanel = $("#commandsDialogLeftPanel").empty();
		$leftPanel.html(Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.getCommandsMenu());
		$(".command_dialog_selection").each( function ( index, element) {
			$(element).button(
				{label: $(this).model().label}
			).width("100%")
		});
	},
	initRightPanel : function () {
		if ( this.options.selectedCommand != null )  {
			this.refreshRightPanel( this.options.selectedCommand );	
		} else {
			this.refreshRightPanel();	
		}
	},
	resetCommandsDialog : function () {
		this.options.selectedCommand = null;
		this.options.selectedCommandIndex = -1;
		this.init();
	},
	saveCommandToPrompt : function () {
		var promptObj = this.options.selectedModel,
		command = this.options.selectedCommand,
		commandController = $("#commandDetailsFormContainer").controller();
		//form processing here
		commandController.processForm();
		//command.customNote = $("textarea[name='customNote']", this.element).val();
		promptObj.addResponseCommand( this.options.selectedCommand , this.options.selectedResponseIndex, this.options.selectedCommandIndex );
		
	},
	".save-command-close click" : function (event, element)  {
		//insert into the respective location in the selected model
		console.debug (".add-command-close click" , arguments);
		this.saveCommandToPrompt();
		this.resetCommandsDialog();
		$(this.element).dialog("close");
	},
	".save-command-new click" : function (event, element)  {
		//insert into the respective location in the selected model
		console.debug (".add-command-new click" , arguments);
		this.saveCommandToPrompt();
		this.resetCommandsDialog();
	},
	".cancel-command click" : function (event, element)  {
		console.debug (".cancel-command click" , arguments);
		$(this.element).dialog("close");
	},
	".command_dialog_selection click": function (element, event) { //happens within button scope
	//onCommandSelection : function (event, element) { //happens within button scope
		//var selectedCommand = $.extend({},$(this).data("command"));
		var selectedCommand = $(element).model(),
		$commandsDialogController = $("#commandsDialog").controller();
		
		//assign command if not already to controller.
		$commandsDialogController.options.selectedCommand = $commandsDialogController.options.selectedCommand != selectedCommand ? selectedCommand : $commandsDialogController.options.selectedCommand;
		console.debug ( "user selected command :" , selectedCommand);
		
		if ($commandsDialogController.options.selectedCommandIndex >=0 ) {
			var confirmMessage = "Would you like to replace the currently selected command '"
								+ $commandsDialogController.options.selectedCommand.label +"' with the '"
								+ selectedCommand.label + "', or append the command to the commands list?";
			
			var confirmReplaceDialog = $("<div>"+confirmMessage+"</div>").dialog({
				resizable: false,
				height:250,
				width: "33%",
				modal: true,
				title: "Replace or Append?",
				buttons: {
					"Replace Command" : function() {
						$( this ).dialog( "close" );
						$commandsDialogController.refreshRightPanel( selectedCommand );	
					},
					"Append Command" : function() {
						$( this ).dialog( "close" );
						$commandsDialogController.resetCommandsDialog();
					},
					Cancel: function() {
						$( this ).dialog( "close" );
					}
				}
			});	
		} else {
			$commandsDialogController.refreshRightPanel( selectedCommand );	
		}
	},
	refreshRightPanel : function ( selectedCommand ) {
		if ( selectedCommand != null ) {
			
			var rightPanelView = $.View( "./application/admin_controllers/commands_dialog_controller/views/command_details.ejs"
										,{command : selectedCommand}
									);
			//init buttons for right panel
			$("#commandsDialogRightPanel").html(rightPanelView).find(".command-controls-container button").each(function (i,el){
				var $el = $(el);
				$el.button(
					{label: $el.html()}
				);
			});
		} else {
			$("#commandsDialogRightPanel").html( "<div class='ui-widget ui-widget-content'>Select a command at left...</div>" );
		}
		
	}
	
})

});