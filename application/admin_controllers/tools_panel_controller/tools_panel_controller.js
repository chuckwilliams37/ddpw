$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Controllers.ToolsPanelController
 */
$.Controller('Level3_ddpw_administration.Controllers.ToolsPanelController',
/** @Static */
{
	defaults : {selectedTab:null},
	listensTo : ["treeSelected","responseOptionSelected"]
},
/** @Prototype */
{
	init : function(){
		console.debug (this.Class.shortName + ".init()");
		var toolSelectionMenu = Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.getToolSelectionMenu();
		this.element.html(toolSelectionMenu);
		this.disabled(true);
	},
	disabled : function ( isDisabled ) {
		$("button", this.element).button("option","disabled",isDisabled);
	},
	"{window} treeSelected": function (event) {
		if((this.selectedTab==undefined)||(this.selectedTab!="undefined" && this.selectedTab.panel.id!="previewPanel")){
		this.disabled(false);
		}
		else{
		this.disabled(true);
		}
	},
	clearLocalTreeReference : Level3_ddpw_administration.Controllers.ApplicationController.clearLocalTreeReference, 
        "{window} treeUnselected" : function ( element, event ) { 
                this.clearLocalTreeReference(); 
        },	
	"{window} responseOptionSelected": function (event) {
		$("#left_panel_container").tabs( "select" , 0 ); //select this tab when a response option is selected.
	},
	"{Level3_ddpw_administration.Models.PromptTree} destroyed" : function (PromptTree, event, model) {
		console.debug (this.Class.shortName + "{Level3_ddpw_administration.Models.PromptTree} destroyed()", arguments);
		// disable if currently selected model is deleted, and the panel is already enabled
		var disable = (model.isActive ? (model.isActive && !$("button", this.element).button("option","disabled")) : true); 
		this.disabled(disable);
	}
	,
	"{window} tabsselect" : function (windowObj, event, selectedPanel ) {
		console.debug (this.Class.shortName +".tabsselect", arguments);
		console.debug("The selected panel is",selectedPanel.panel.id);
		
		var $applicationController = $("#main").controller();
		
		if (selectedPanel.panel.id == "previewPanel") //the tab selected was "preview" 
		{
				//disable all buttons
				this.disabled(true);
				this.selectedTab=selectedPanel;
		} else if(selectedPanel.panel.id=="builderPanel"){
				this.disabled(false);
				this.selectedTab=selectedPanel;
			
		}
		
	}
});

});