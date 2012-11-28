$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Controllers.PropertiesPanelController
 */
$.Controller('Level3_ddpw_administration.Controllers.PropertiesPanelController',
/** @Static */
{
	defaults : {
		currentModel:null, 
		selectedTree:null, 
		commandsDialog : null,
		selectedTab:null,
		environmentVarList : new Level3_ddpw_administration.Models.EnvironmentVariables()
	},
	listensTo : ["treeSelected","promptSelected","commandAdded"]
},
/** @Prototype */
{
	init : function(){
		this.options.environmentVarList = this.options.environmentVarList.serialize();
		console.debug ("Level3_ddpw_administration.Controllers.PropertiesPanelController.init()");
		var viewResult = $.View(
				"./application/admin_controllers/properties_panel_controller/views/init.ejs" , {selectedModel : this.options.currentModel}						
		);
		//this._unbind () ;
		this.element.html(viewResult);
		this.setupPropertiesPanelMenu();
		//this.bind ();
	},
	
	"{window} treeSelected" : function (element, event, treeModel) {
		console.debug ("'Level3_ddpw_administration.Controllers.PropertiesPanelController {window} treeSelected", [element,event]);
		if((this.options.selectedTab==undefined)||(this.options.selectedTab!="undefined" && this.options.selectedTab.panel.id!="previewPanel")){
		var selectedTree = this.options.currentModel = this.options.selectedTree = event.promptTree ? event.promptTree : treeModel ? treeModel : $(event.target).model();;
		this.refresh(selectedTree);
		}
	},
	clearLocalTreeReference : Level3_ddpw_administration.Controllers.ApplicationController.clearLocalTreeReference, 
        "{window} treeUnselected" : function ( element, event ) { 
                this.clearLocalTreeReference(); 
        },	
	"{Level3_ddpw_administration.Models.PromptTree} destroyed" : function (PromptTree, event, model){
		console.debug (this.Class.shortName + ".{Level3_ddpw_administration.Models.PromptTree} destroyed()", arguments);
		if (this.options.currentModel && this.options.currentModel.identity() == model.identity()) {
			this.options.currentModel = null;
			this.refresh();
		}
	},
	"{Level3_ddpw_administration.Models.Prompt} destroyed" : function (PromptTree, event, model){
		console.debug (this.Class.shortName + ".{Level3_ddpw_administration.Models.Prompt} destroyed()", arguments);
		if (this.options.currentModel && this.options.currentModel.identity() == model.identity()) {
			this.options.currentModel = null;
			this.refresh();
		}
	},
	"{Level3_ddpw_administration.Models.PromptTree} updated" : function (PromptTree, event, promptTree) {
		console.debug ("{Level3_ddpw_administration.Models.PromptTree} updated", arguments);
		this.refresh(this.options.currentModel);
	},
	updateCurrentModelFromForm : function ( theForm ) {
		theForm = theForm ? theForm : $("form", this.element);
		var theModel = theForm.model(),
		attrs = theForm.formParams(),
		newResponseOptions = [];
		
		if ( theModel.hasResponseOptions() && typeof (attrs.responseOptions) != 'undefined') {
			theModel.responseOptions.each ( function ( responseIndex, responseOption ) {
				newResponseOptions.push ( $.extend ( responseOption, attrs.responseOptions[responseIndex] ) );
			});
		}
		if (typeof (attrs.responseOptions) != 'undefined') {
			attrs.responseOptions = Level3_ddpw_administration.Models.ResponseOption.models ( newResponseOptions );
		}
		attrs.isAlwaysEffective = attrs.alwaysEffective == "checked" ? true : false;
		attrs.isResponseForced = attrs.isResponseForced == "true" ? true : false;
		attrs.isResponseRequired = attrs.isResponseRequired == "true" ? true : false;
		attrs.isPopup = attrs.isPopup == "true" ? true : false;
		attrs.offerChange = attrs.offerChange == "true" ? true : false;
		
		theModel.attrs(attrs);
		
		return attrs;
	},
	"form submit" : function (theForm, event) {
	//"#saveButton click" : function (theForm, event) {		
		try {
			var attrs = this.updateCurrentModelFromForm ( theForm );
			/*
			var theModel = this.updateCurrentModelFromForm ( theForm );
			*/
			var theModel = theForm.model();
			//theModel.attrs(attrs);
			//$(theModel.elements()[0]).trigger ( "saveTree" ) //application_controller is listening;
			var selectedTree = this.getSelectedTree(),
				saveTreeEvent = $.Event ( "saveTree" );
				saveTreeEvent.tree = selectedTree;
			
			$(selectedTree.elements()[0]).trigger( saveTreeEvent );
			//theModel.elements().trigger ( "saveTree" ) //application_controller is listening;
			//theModel.elements().trigger ( "refresh" ) //application_controller is listening;
		} catch (e) {
			alert (e.message);
		}
	
		return false;
	},
	".addAnotherResponseOption click" : function (element, event) {
		this.updateCurrentModelFromForm ();
		this.options.currentModel.addResponseOption();
		this.refresh(this.options.currentModel);
		return false; //to prevent form submit;
	},
	"{window} promptSelected" : function (element, event, promptModel){
		console.log ("Level3_ddpw_administration.Controllers.PropertiesPanelController {window} promptSelected", arguments);
		if((this.options.selectedTab==undefined)||(this.options.selectedTab!="undefined" && this.options.selectedTab.panel.id!="previewPanel")){
			var selectedPromptModel = null
			if (this.options.currentModel != null ) {
				this.options.currentModel.unbind ( "commands" );
			}
			if ( typeof (event.prompt) != 'undefined' ) {
				selectedPromptModel = event.prompt;
			} else {
				selectedPromptModel = $(event.target).model();
			}
			this.options.currentModel = selectedPromptModel;
			this.refresh(selectedPromptModel);
		}
	},
	getActiveModel :function () {
		return this.element.find("form").model();
	},
	getSelectedTree :function () {
		return $("#main").controller().options.selectedTree;
	},
	activate : function () {
		$("#left_panel_container").tabs("enable",1);
		$("#left_panel_container").tabs("select","#propertiesPanel");
		$(".addAnotherResponseOption").button({
			icons : {primary : "ui-icon-plus"}
		}).width("100%");
		this.activateButtons();
	},
	activateButtons : function () {
		$(".addCommand", this.element).button({
			icons : {primary : "ui-icon-notice"}
			,text:false
		});
		$(".delete" , this.element).button({
			icons : {primary : "ui-icon-close"}
			,text:false
		});
	},
	setFocus : function () {
		//TODO: Make this more applicable & generalized
		$("#name").focus().select();
	},
	refresh : function (selectedModel) {
		console.debug ("refresh()");
		//this._unbind();
		
		var propertiesPanelItemRenderer = null;
		if (selectedModel != null) {
			
			console.debug (selectedModel.Class.shortName+".refresh()", selectedModel);
			switch (selectedModel.Class.shortName) {
				/*
				case "Level3_ddpw_administration.Models.Prompt" :
				case "Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.DatePicker" :
				case "Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.Select" :
				case "Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.TextArea" :
				case "Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.TextInput" :
				case "Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.RadioGroup" :
				case "Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.CheckboxGroup" :
				case "Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.SimpleDialog" :
				break;
				*/
				case "PromptTree" :
					propertiesPanelItemRenderer = './application/admin_controllers/properties_panel_controller/views/properties_panel_prompt_tree.ejs';
				break;
				default :
					propertiesPanelItemRenderer = this.getPromptTypeRenderer(selectedModel.type);
					//propertiesPanelItemRenderer = './application/admin_controllers/properties_panel_controller/views/properties_panel_prompt_default_container.ejs';
				break;
			};
		} else {
			//propertiesPanelItemRenderer =null;
			propertiesPanelItemRenderer = './application/admin_controllers/properties_panel_controller/views/properties_panel_null_container.ejs';;
		}
		
		this.setPropertiesMenu(selectedModel);
		this.setClassificationPanel(selectedModel);
		this.setPropertiesView($.View(
				propertiesPanelItemRenderer
				, { 
					selectedModel: selectedModel,
				 	environmentVarList:this.options.environmentVarList
				 	}));
		//new Level3_ddpw_administration.Controllers.ClassificationsPanelController("#propertiesPanelClassificationPanel", this.element);
		this.activate();
		//this.setupAdditionalBindings();
		this.updateSortables();
		this.setFocus();
		
		//this.bind();
	},
	updateSortables : function ( $targetSet ) {
		if (!$targetSet) {
			$targetSet = $(this.element).find(".responseOptionsListContainer ul");
		}
		var sortables = $targetSet.sortable (
			{
				placeholder : 'ui-state-highlight level3_ddpw_administration_commands_item',
				forcePlaceholderSize: true,
				//handle: 'div',
				helper:	'clone',
				items: '> li.level3_ddpw_administration_commands_item',
				opacity: .6,
				//revert: 100,
				//tabSize: 5,
				tolerance: 'pointer',
				//toleranceElement: '> ul',
				listType: 'ul',
				//distance : 5,
				//,update : this.sortupdate
				start : this.sortStart,
				//start : function () { console.debug ("sortstart", arguments); } ,
				//,beforeStop : this.sortBeforeStop
				stop : this.sortStop
			}
		);
	},
	"sortStart" : function (event, ui) {
		var responseOptionContainerIndex= ui.item.closest(".responseOptionItemContainer", ui.item).index()-1; //not 0 based?
		var selectedCommandIndex  = ui.item.index();
		var $propertiesPanelController = $("#propertiesPanel").controller();
		$.data( ui.item , "command" , $propertiesPanelController.options.currentModel.responseOptions[responseOptionContainerIndex].commands.splice ( selectedCommandIndex , 1 )[0]);
		console.debug ("sortstart", selectedCommandIndex, responseOptionContainerIndex, $propertiesPanelController.options.currentModel);
	},
	"sortStop" : function (event, ui) {
		var responseOptionContainerIndex= ui.item.closest(".responseOptionItemContainer", ui.item).index()-1; //not 0 based?
		var selectedCommandIndex  = ui.item.index();
		var $propertiesPanelController = $("#propertiesPanel").controller();
		$propertiesPanelController.options.currentModel.responseOptions[responseOptionContainerIndex].commands.splice ( selectedCommandIndex , 0 , $.data( ui.item , "command" ));
		console.debug ("sortStop", selectedCommandIndex, responseOptionContainerIndex, $propertiesPanelController.options.currentModel);
	},
	setPropertiesMenu : function (selectedModel) {
		var type = selectedModel ? selectedModel.Class.shortName : null;
		switch (type) {
			case "Prompt":
				$("#propertiesPanelMenuContainer").show();
			break;
			case "PromptTree":
				$("#propertiesPanelMenuContainer").hide();
			break;
			default :
				$("#propertiesPanelMenuContainer").hide();
			break;
		}
	},
	setClassificationPanel : function (selectedModel) {
		var type = selectedModel ? selectedModel.Class.shortName : null;
		
		switch (type) {
			case "Prompt":
				$("#propertiesPanelClassificationPanel").show();
			break;
			case "PromptTree":
				$("#propertiesPanelClassificationPanel").hide();
			break;
			default :
				$("#propertiesPanelClassificationPanel").hide();
			break;
		}
	},
	getPromptTypeRenderer : function (promptType) {
		var promptTypeRenderer = Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.getToolItemRenderer(promptType, "properties_panel" );
		return promptTypeRenderer;
	},
	setPropertiesView : function (view) {
		console.debug ("setPropertiesView");
		var propertiesView = $(this.element).find("#propertiesPanelSelectedItemControlsContainer");
		propertiesView.html(view);
	},
	setupPropertiesPanelMenu : function () {
		console.debug("setupPropertiesPanelMenu()");
		var $menuContainer = $("#propertiesPanelMenu");
		var buttonIcons = {
				"propertiesPanelMenuOutdent":"ui-icon-circle-arrow-w"
				,"propertiesPanelMenuIndent":"ui-icon-circle-arrow-e"
				,"propertiesPanelMenuMoveUp":"ui-icon-circle-arrow-n"
				,"propertiesPanelMenuMoveDown":"ui-icon-circle-arrow-s"
				,"propertiesPanelMenuDelete":"ui-icon-circle-close"
		};
		
		$menuContainer.find("button").each(function (i,element) {
			var id = $(this).attr("id");
			//$(element).attr ( "title" , $(element).html());
			$(element).button(
					{
						label: $(element).html()
						,icons : {primary:buttonIcons[id]}						
					}
			)
		});
		//this.bind ($menuContainer.find("button"), 'click', 'onPropertiesPanelMenuClick');
	},
	"#propertiesPanelMenuContainer button click" : function (element, event) {
		console.debug ("onPropertiesPanelMenuClick" , arguments );
		var buttonObj = $(event.target).closest("button");
		
		switch (buttonObj.attr("id")) {
			case "propertiesPanelMenuOutdent":
				action = Level3_ddpw_administration.Models.PromptTree.MOVE_PROMPT_OUT;
			break;
			case "propertiesPanelMenuIndent":
				action = Level3_ddpw_administration.Models.PromptTree.MOVE_PROMPT_IN;
			break;
			case "propertiesPanelMenuMoveUp":
				action = Level3_ddpw_administration.Models.PromptTree.MOVE_PROMPT_UP;
			break;
			case "propertiesPanelMenuMoveDown":
				action = Level3_ddpw_administration.Models.PromptTree.MOVE_PROMPT_DOWN;
			break;
			case "propertiesPanelMenuDelete":
				action = Level3_ddpw_administration.Models.PromptTree.DELETE_PROMPT;
				//grab the parent to select after delete
				var parentNode = this.options.selectedTree.getCursor().setFilters(["hasPrompts","prompts"],{}).moveTo ( this.options.currentModel.identity() ).parentNode;
			break;
		};
		Level3_ddpw_administration.Models.PromptTree.movePrompt ( this.options.selectedTree, this.options.currentModel , action );
		
		if (action == Level3_ddpw_administration.Models.PromptTree.DELETE_PROMPT ) {
			this.options.currentModel = null;
			//this.refresh();
			var eventObj = null;
			switch (parentNode.Class.shortName) {
				case "PromptTree":
					eventObj = $.Event ("treeSelected" , {promptTree: parentNode});
				break;
				case "Prompt":
					eventObj = $.Event ("promptSelected" , {prompt:parentNode});
				break;
				case "ResponseOption":
					eventObj = $.Event ("responseOptionSelected" , {responseOption:parentNode});				
				break;
			}
			this.element.trigger ( eventObj );
		} else {
			
		} 
	},
	"commandAdded" : function (element, event) {
		console.debug (this.Class.shortName + ".commandAdded()", arguments );
		this.refresh( this.options.currentModel );		
		
	},
	onAddOrModifyCommand : function ( element, event ) {
		console.debug ("addCommand click");
		
		this.updateCurrentModelFromForm();
		
		var responseItemContainer = $(element).closest(".responseOptionItemContainer", this.element),
		responseIndex = responseItemContainer.index(".responseOptionItemContainer"),
		responseOptionExists = typeof(this.options.currentModel.responseOptions[responseIndex]) != 'undefined',
		isCommandSelected = $(element).hasClass("modify-command-button"),
		selectedCommand = null,
		selectedCommandIndex = -1;
		
		
		if (isCommandSelected) {
			selectedCommandIndex = $(".modify-command-button", responseItemContainer ).index( element );
			selectedCommand = this.options.currentModel.responseOptions[responseIndex].commands[selectedCommandIndex]; //$.index() is 0 based
		}
		if (!responseOptionExists) {
			alert ("Please save the prompt before adding commands...");
			$("#saveButton", this.element).animate({
				borderColor: "#FF0000"
			});
			$("#saveButton", this.element).animate({borderColor: "#000000"});
		}
		var dialog = this.createCommandsDialog(responseItemContainer , selectedCommand,  selectedCommandIndex );
		//prevent the form submit
		event.stopPropagation();
		event.stopImmediatePropagation();
		event.preventDefault();
		return false;
	},
	".responseOptionItemContainer .addCommand click" : function (element, event) {
		this.onAddOrModifyCommand(element, event);
	},
	".modify-command-button click" : function (element, event) {
		//var responseOptionElement = element.prev(".responseOptionItemContainer");
		this.onAddOrModifyCommand(element, event);
	},
	".delete-command-button click" : function (element, event) {
		//prevent the form submit
		event.stopPropagation();
		event.stopImmediatePropagation();
		event.preventDefault();
		
		var responseItemContainer = $(element).closest(".responseOptionItemContainer", this.element),
		responseIndex = responseItemContainer.index(".responseOptionItemContainer"),
		responseOptionExists = typeof(this.options.currentModel.responseOptions[responseIndex]) != 'undefined',
		isCommandSelected = $(element).hasClass("modify-command-button");
		selectedCommandIndex = $(".delete-command-button", responseItemContainer ).index( element );
		
		this.updateCurrentModelFromForm ( );
		this.options.currentModel.responseOptions[responseIndex].commands.splice(selectedCommandIndex,1);
		this.element.trigger ("saveTree"); //application_controller is listening...
		
		this.refresh(this.options.currentModel);
		
		//prevent the form submit
		return false;
	},
	createCommandsDialog : function (selectedResponseElement , selectedCommand, selectedCommandIndex) {
		var selectedModel = this.options.currentModel,
		promptType = selectedModel.type,
		responseOptionInstance = selectedModel.responseOptions[selectedResponseElement.index()-1],
		displayLabel = Level3_ddpw_administration.Models.ResponseOption.getDisplayLabel ( responseOptionInstance , promptType);
		
		if ($("#commandsDialog").length) {
			var commandsDialogController = $("#commandsDialog").controller();
			commandsDialogController.options.selectedModel = selectedModel;
			commandsDialogController.options.selectedResponseElement = selectedResponseElement;
			commandsDialogController.options.selectedCommand = selectedCommand;
			commandsDialogController.options.selectedCommandIndex = selectedCommandIndex;
			commandsDialogController.init();
		} else {
			this.options.commandsDialog = $($.View("./application/admin_controllers/commands_dialog_controller/views/init.ejs",
				{
				selectedModel : selectedModel, 
				selectedResponseElement : selectedResponseElement,
				selectedCommand : selectedCommand,
				selectedCommandIndex : selectedCommandIndex
			}));
		} 
		console.debug ("selected position: " + (selectedResponseElement.index()-1));
		console.debug ("collection: " , selectedModel.responseOptions);
		
		this.options.commandsDialog.dialog({
			height: "450",
			width: "700",
			//position: ["center","top"],
			resizable : true,
			draggable : true,
			dialogClass : "commandsDialog",
			closeText : "Cancel and close",
			close : function (event, ui) {
				$(ui).trigger("destroy");
			},
			title: "Assign Commands to Response '" 
					+ displayLabel
					+"':"
		});
		return this.options.commandsDialog;
	},
	".responseOptionItemContainer .delete click" : function (element, event) {
		console.debug ("delete click", arguments, element.index());
		event.preventDefault();
		event.stopImmediatePropagation();
		//var currentModel = this.getActiveModel();
		var responseContainer = $(".responseOptionItemContainer", this.element).has(element),
		responseModel = responseContainer.model(),
		position = (responseContainer.index()-1);
		
		this.updateCurrentModelFromForm ( );
		this.options.currentModel.deleteResponseOption( position );
		this.refresh(this.options.currentModel);
		
		$(this.options.currentModel).trigger("updated");
		return false;//prevent the form submit
	}	
	,"{window} tabsselect" : function (windowObj, event, selectedPanel ) {
		console.debug (this.Class.shortName +".tabsselect", arguments);
		this.options.selectedTab = selectedPanel;
		if (selectedPanel.panel.id == "previewPanel") //the tab selected was "preview" 
		{
			var propertiesPanelItemRenderer='./application/admin_controllers/properties_panel_controller/views/properties_panel_preview_screen.ejs';
			this.setPropertiesView($.View(
				propertiesPanelItemRenderer
			, null));
		} else if(selectedPanel.panel.id=="builderPanel") {
		var selectedTree= this.options.currentModel = this.options.selectedTree;
			this.refresh(selectedTree);
		}
		
	},
	".popUpClass click" : function (element, event) {
	
		isPopup = $("input[name='isPopup']:checked").val();	    
		if(isPopup == "true")
		{
		$('.offChangeDiv').show();
		}
		else{
		$('.offChangeDiv').hide();
		}
		
	}
	
})

});