$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Controllers.PromptPanelItemController
 */
$.Controller('Level3_ddpw_administration.Controllers.PromptItemController',
/** @Static */
{
	defaults : {itemModel:null}

},
/** @Prototype */
{
	init : function(){
		var itemModel = this.options.itemModel = $(this.element).model();
		for (var i = 0; i < itemModel.responseOptions.length; i++) {
			var responseOption =  itemModel.responseOptions[i];
			if ( responseOption.prompts.length ) {
				this.bind ( responseOption , "prompts" , "onPromptsChange" );				
			}
		}
		this.bind (itemModel, "prompts", "onPromptsChange");
		this.bind (this.element, "refresh", this.refreshView);
		//console.debug(itemModel.id);
		//add in the children using the same renderer
		this.refreshView();
	},
	activatePrompt : function ( buttonLabel ) {
		buttonLabel = buttonLabel ? buttonLabel : "Next";
		$("> .promptActions button",this.element).button({label:buttonLabel});
		$("> .promptActions",this.element).show();
		$(this.element).addClass("is_active");
	},
	deactivatePrompt : function () {
		$("> .promptActions",this.element).hide();
		$(this.element).removeClass("is_active");
	},

	refreshView :function () {
		var $thisElement = typeof ( this.element ) == 'undefined' ? $(this) : this.element,
			$thisController = $thisElement.controller(),
			itemModel = $thisController.options.itemModel = $thisElement.model(),
			itemRenderer = $thisController.getItemRenderer($thisController.options.itemModel),
			promptContainer = $thisElement.find(".promptItemRenderer");
		
		promptContainer.html( itemRenderer );
		
		console.debug ("itemModel.hasSelectedResponse(): " , itemModel.hasSelectedResponse() );
		if (itemModel.hasSelectedResponse()) {
			$thisController.deactivatePrompt();
		} else {
			$thisController.activatePrompt();
		}
		/*
		this.bind ($thisController.options.itemModel, "selectedResponse", "onSelectedResponseChange");
		for (var i = 0; i < itemModel.responseOptions.length; i++) {
			var responseOption =  itemModel.responseOptions[i];
			if ( responseOption.prompts.length ) {
				this.bind ( responseOption , "prompts" , "onPromptsChange" );
			}
		//this.bind(itemModel,"updated","onModelUpdate");
		}
		*/
		//this.bind (itemModel, "prompts", "onPromptsChange");
		//this.bind (this.element, "refresh", this.refreshView);
	
		/*	
		var $thisElement = typeof ( this.element ) == 'undefined' ? $(this) : this.element;
		var $thisController = $thisElement.controller();
		var itemRenderer = $thisController.getItemRenderer($thisController.options.itemModel);
		
		$thisElement.find(".promptItemRenderer").html( itemRenderer );
		if ($thisController.options.itemModel.hasSelectedResponse()) {
			$thisController.deactivatePrompt();
		} else {
			$thisController.activatePrompt();
		}
		*/
	},
	"button.executionNextButton click" : function (element, event) {
		console.debug (this.Class.shortName + ".click()");
		var value = this.getUiResponse( event ); //returns an array - choose 
		if ( this.validate( value ) ) {
			this.setResponseSelected( value );
		}
		event.stopPropagation();
		event.stopImmediatePropagation();
		event.preventDefault();
		/*
		this.setResponseSelected();
		$("div#ddpw_main").scrollTop(1500);
		//this.setResponseSelected( this.getUiResponse() );
		event.stopPropagation();
		event.stopImmediatePropagation();
		event.preventDefault();
		*/
	},
	reactivatePrompt : function () { 
		//reactivates prompt when changed, 
		// returns true if change can be accepted as final (e.g. should be "set" on model from UI)
		// false if "Next" or "Update" button should invoke finalization
		var acceptCurrentValue = false,
			$thisElement = $(this.element)
			isPromptActive = $thisElement.hasClass("is_active"),
			uiValue = this.getUiResponse(),
			modelValue = this.options.itemModel.getSelectedResponse(),
			$thisController = this,
			isSelectedResponse = this.options.itemModel.isResponseOptionSelected ( uiValue ),
			$lastActivePromptController = $(".promptActions:last").closest(".prompt").controller(),
			doActivation = function () {
				//if the interface doesn't match the model (in terms of options selected) - show 'next' button, and hide existing
				if ( modelValue && !isPromptActive ){
					$lastActivePromptController.deactivatePrompt();
					$thisController.activatePrompt( "Update" );
				} else {
					//do nothing - user must click next
				}
			};
			
		//TODO: This is probably worthy of a custom event.
		switch ( this.options.itemModel.type ) {
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTINPUT:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTAREA:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.CHECKBOXGROUP:
				if ( !isSelectedResponse && !isPromptActive) {
					console.debug ("Prompt is NOT active - reactivate!" );
					doActivation();
				}
			break;
			default:
				acceptCurrentValue = true;
			break;
		}
		return acceptCurrentValue;
	},
	".promptItemRenderer input, .promptItemRenderer textarea keyup" : function () {
		console.debug ( "************KEYUP");
		this.reactivatePrompt();
	},
	".promptItemRenderer input, .promptItemRenderer select, .promptItemRenderer textarea change" :function ( element, event ) {
		console.debug ( "VALUE CHANGED");
		var value = this.getUiResponse( event );
		if ( this.reactivatePrompt() && this.validate( value ) ) {
			this.setResponseSelected( value );
		}
	},
	/*
	".promptItemRenderer input[type|='radio'], .promptItemRenderer input[type|='checkbox'], .promptItemRenderer select change" :function ( element, event ) {
		
		console.debug ( "VALUE CHANGED");
		var value = element.val();
		switch ( this.options.itemModel.type ) {
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.CHECKBOXGROUP:
				//if the interface doesn't match the model (in terms of options selected) - show 'next' button, and hide existing
				var uiValues = this.getUiResponse();
				var modelValues = this.options.itemModel.selectedResponse;//TODO: This needs to be reworked for the getSelectedResponse function which returns an array
				
				if ( modelValues && !$(this.element).hasClass("is_active") ){
					$(".promptActions:last").closest(".prompt").controller().deactivatePrompt();
					this.activatePrompt( "Update" );
				} else {
					//do nothing - user must click next
				}
			break;
			default:
			if ( this.validate( value ) ) {
				this.setResponseSelected( value );
			}
			break;
		}
	},
	*/
	"onSelectedResponseChange" : function ( prompt, event, value ) {
		//console.debug ( "onSelectedResponseChange" , arguments );
		this.element.trigger ( "responseSelected" );
	},
	setResponseSelected : function ( value ) {
		//console.debug (this.Class.shortName + ".setResponseSelected()");	
		value = value ? value : this.getUiResponse( value );	
		this.options.itemModel.attr( "selectedResponse", value );
	},
	getUiResponse : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.promptModelGetUiSelectionsFunction,
	/*
	function ( value ) {
		//console.debug (this.Class.shortName + ".getUiResponse()");
		var selectedResponse = null;
		var value = value ? value : $("> .promptItemRenderer input,> .promptItemRenderer textarea,> .promptItemRenderer select", this.element ).val();
		
		switch ( this.options.itemModel.type ) {
		
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTINPUT:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTAREA:
				selectedResponse = value;	
			break;			
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.DATEPICKER:
				this.options.itemModel.responseOptions[0].value = value;
				selectedResponse = this.options.itemModel.responseOptions[0];				
			break;
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.MULTISELECTDATAGRIDWITHFILTER:
				var $msdgwfController = $('.level3_ddpw_administration_library_level3_ddpw_utilities_tools_execution_view_multi_select_data_grid_with_filter', this.element).controller(),
				selectedRows = [],
				dataTable = $msdgwfController.options.dataTableTarget;
				$(".row_selected", this.element).each ( function ( index, element ) {
					selectedRows.push ( dataTable.fnGetData ( element ) );
				});
				this.options.itemModel.responseOptions[0].value = selectedRows;
				selectedResponse = this.options.itemModel.responseOptions[0];
			break;

			default : 
				var comparisonFunction = function ( index, responseOption ) {
					//console.debug ("looking for:" + value +" in RO: " + index +": " + responseOption.value , responseOption );
					if ( value == responseOption.value ) {
						selectedResponse = responseOption		
					}
				};
				this.options.itemModel.responseOptions.each ( comparisonFunction );
			break;
		}
		
	return selectedResponse;
	},
	*/
	getItemRenderer : function (itemModel) {
	    var itemRenderer = Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.getToolItemRenderer(itemModel.type,"execution_view");
		var itemRendererView = $.View (itemRenderer, itemModel);
		return itemRendererView;
	},
	"onModelUpdate" : function (model, event) {
		//console.debug (this.Class.fullName + " onModelUpdate()", model, event);
		//this.refreshView();
		this.init();
	},
	"onPromptsChange" : function () {
		//console.debug ("the item model has changed");
		//this.refreshView();
		this.init();
	},
	validate : function ( value ) {
		//TODO: implement validation function 
		return true;
	}
	
	
})

});