steal("funcunit").then(function(){
module("msdgwf_properties_panel",{
	setup : function(){
		S.open('../application/level3_ddpw_administration.html');
	}
	,
	teardown : function(){
	
	}
	/*
	*/
});

test("addRemoveFilters", function(){
	S("#prompt_trees_welcome_panel span.title:eq(1)").exists()
	.click();
	S("#leftPanelTabContainer a:eq(0)").click();
	S("#tools_panel span.ui-button-text:eq(7)").click();
	S("#propertiesPanelPromptTypeControlsContainer select").exists()
	.click();
	S("#entitySelection option:eq(1)").click();
	S("#propertiesPanelPromptTypeControlsContainer span.ui-button-text:eq(0)").exists()
	.click();
	S("#multiSelectDGWF_filterSelectionDialogContainer ~ div.ui-dialog-buttonpane span.ui-button-text:eq(0)").exists()
	.click();
	S("#propertiesPanelPromptTypeControlsContainer div.filterValueListItemLabel").exists().text("accountId", 2000); 
	S("#propertiesPanelPromptTypeControlsContainer span.ui-button-text:eq(0)").exists()
	.click();
	S("#filterSelection").exists()
	.click();
	S("#filterSelection option:eq(2)").click();
	S("#filterValueSelection").exists().visible()
	.click();
	S("#filterValueSelection option:eq(3)").click();
	S("#multiSelectDGWF_filterSelectionDialogContainer ~ div.ui-dialog-buttonpane span.ui-button-text:eq(0)").exists().visible()
	.click();
	S("#propertiesPanelPromptTypeControlsContainer div.filterValueListItemLabel:eq(1)").exists(1000).text("product");
	S("#propertiesPanelPromptTypeControlsContainer .filterSelectionListItem .removeFilter:eq(0)").exists()
	.click();
	S("#propertiesPanelPromptTypeControlsContainer div.filterValueListItemLabel:eq(1)").missing();
	S("#propertiesPanelPromptTypeControlsContainer div.filterValueListItemLabel:eq(0)").exists(1000).text("product");
	/*
	*/
})



});