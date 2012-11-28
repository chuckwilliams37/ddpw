$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Controllers.ExecutionViewItemController
 */
$.Controller('Level3_ddpw_execution.Controllers.ExecutionViewItemController',
/** @Static */
{
	defaults : {
		itemModel:null,
		validationController:null
	}

},
/** @Prototype */
{
	init : function(){
		//console.debug ("******************************execution panel ITEM INIT BEGIN****************************", this, arguments);
		var itemModel = this.options.itemModel = $(this.element).model();
		
		
		this.options.validationController = $("#validation_controller").controller();
		console.debug (this.Class.shortName, itemModel);
		//console.debug(itemModel.id);
		//add in the children using the same renderer
		this.refreshView();
	},
	getItemRenderer : function (itemModel) {
	    var itemRenderer = Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.getToolItemRenderer(itemModel.type,"execution_view");
		var itemRendererView = $.View (itemRenderer, itemModel);
		return itemRendererView;
	},	
	activatePrompt : function ( buttonLabel ) {
		console.debug ("ACTIVATE PROMPT");
		
		switch ( this.options.itemModel.type ) {
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTINPUT:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTAREA:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.CHECKBOXGROUP:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.DATEPICKER:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SELECT:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.RADIOGROUP:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SIMPLEDIALOG:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.ADDATTACHMENTS:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.MULTISELECTDATAGRIDWITHFILTER:
				buttonLabel = buttonLabel ? buttonLabel : "Next";
				$("> .promptActions button",this.element).button({label:buttonLabel});
				$("> .promptActions",this.element).show();
			break;
			default:
				$("> .promptActions",this.element).hide();//change events invoke continue for other prompt types
			break;
		}
		$(this.element).addClass("is_active");
		
	},
	deactivatePrompt : function () {
		switch ( this.options.itemModel.type ) {
			default:
				$("> .promptActions",this.element).hide();
				$(this.element).removeClass("is_active");
			break;
		}
	},
	refreshView :function () {
		//if ( $("#executionView").controller().isActive() ) { Commented for Execution view
			var $thisElement = typeof ( this.element ) == 'undefined' ? $(this) : this.element,
				$thisController = $thisElement.controller(),
				itemModel = $thisController.options.itemModel = $thisElement.model(),
				itemRenderer = $thisController.getItemRenderer($thisController.options.itemModel),
				promptContainer = $thisElement.find(".promptItemRenderer");
			promptContainer.html( itemRenderer );
			//this.bind ($thisController.options.itemModel, "selectedResponse", "onSelectedResponseChange");
		//}
	},
	"onSelectedResponseChange" : function ( prompt, event, value ) {
		if ( this.element && this.element.hasClass("ui-state-error") && ( prompt.hasSelectedResponse() || prompt.hasDefaultResponse() )) { 
			this.element.switchClass ("ui-state-error","",125);
		}
		
		if ( value != null ) {
			var responseSelectedEvent = $.Event ( "responseSelected" );
			responseSelectedEvent.value = value;
			this.deactivatePrompt();
			if ( this.element ) {	
				//this.element.trigger ( responseSelectedEvent );
			}
		}
		/*
		*** now handled by sections CCW 201207032035MST
		
		console.debug ( "onSelectedResponseChange" , arguments );
			event.stopPropagation();
			event.stopImmediatePropagation();
			event.preventDefault();
		//if the value is null we're presume in the middle of a reset  (users can't select "null")
		*/
	},
	"button click" : function (element, event) {
		console.debug (this.Class.shortName + ".click() 1");
		if ( element.hasClass ( "nextButton" ) ){
			var value = this.getUiResponse(); //returns an array - choose 
			if ( this.validate( value ) ) {
				this.setResponseSelected( value );
				//$("div#previewPanel").scrollTop(1000);
			}
		}
		event.stopPropagation();
		event.stopImmediatePropagation();
		event.preventDefault();
	},
	reactivatePrompt : function () { 
		//reactivates prompt when changed, 
		// returns true if change can be accepted as final (e.g. should be "set" on model from UI)
		// false if "Next" or "Update" button should invoke finalization
		var acceptCurrentValue = false,
			$thisElement = $(this.element)
			isPromptActive = $thisElement.hasClass("is_active"),
			isSectionMarkedComplete = $thisElement.closest(".section_container").controller().isMarkedComplete(),			
			uiValue = this.getUiResponse(),
			modelValueExists = this.options.itemModel.attr("selectedResponse") != null,
			$thisController = this,
			hasSelectedResponse = this.options.itemModel.hasSelectedResponse(),
			isSelectedResponse = this.options.itemModel.isResponseOptionSelected ( uiValue ),
			$lastActivePromptController = $(".promptActions:last").closest(".prompt").controller(),
			doActivation = function () {
				//if the interface doesn't match the model (in terms of options selected) - show action button, and hide existing
			if ( modelValueExists && !isPromptActive ){
					//$lastActivePromptController.deactivatePrompt();
					$thisController.element.trigger ( "reactivateSection" );
					$thisController.activatePrompt( "Update Only This Entry" );
				} else {
					//do nothing - user must click action button
				}
			};
			
		//TODO: This is probably worthy of a custom event.
		switch ( this.options.itemModel.type ) {
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTINPUT:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTAREA:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.CHECKBOXGROUP:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.DATEPICKER:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SELECT:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.RADIOGROUP:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SIMPLEDIALOG:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.ADDATTACHMENTS:
			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.MULTISELECTDATAGRIDWITHFILTER:
				if (  
						hasSelectedResponse && !isSelectedResponse && !isPromptActive && isSectionMarkedComplete
					) {
					console.debug ( "Prompt is NOT active - reactivate!" );
					
					doActivation();
				}
			break;
			default:
				acceptCurrentValue = true;
			break;
		}
		return acceptCurrentValue;
	},
	".promptItemRenderer input, .promptItemRenderer textarea keyup" : function (element, event) {
		console.debug ( "************KEYUP");
		event.stopPropagation();
		event.stopImmediatePropagation();
		event.preventDefault();
		
		this.reactivatePrompt();
	},
	".promptItemRenderer input, .promptItemRenderer select, .promptItemRenderer textarea change" :function ( element, event ) {
		var targetModel = $(element).closest(".prompt").model();
	
		console.debug ( "VALUE CHANGED: " + targetModel.id , arguments );
		console.debug ( " this.options.itemModel.type: " + this.options.itemModel.type);
		
		
		
		event.stopPropagation();
		event.stopImmediatePropagation();
		event.preventDefault();
		
		var value = this.getUiResponse( event );
		if ( this.reactivatePrompt() && this.validate( value ) ) {
			this.setResponseSelected( value );
		}
		
	},
	validate : function ( value ) {
		/*
		console.debug (this.Class.shortName + ".validate()");
		var value = value ? value : this.getUiResponse( value );
		return this.options.validationController.validate ( this.options.itemModel, value );
		*/
		return true;
	},
	setResponseSelected : function ( value ) {
		console.debug (this.Class.shortName + ".setResponseSelected()");
		value = value ? value : this.getUiResponse( value );

		this.options.itemModel.attr( "selectedResponse", value );
	},
	getUiResponse : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.promptModelGetUiSelectionsFunction,
	"onModelUpdate" : function (model, event) {
		console.debug (this.Class.fullName + " onModelUpdate()", model, event);
		//this.refreshView();
		//this.init();
	},
	"onPromptsChange" : function () {
		console.debug ("the item model has changed");
		//this.refreshView();
		//this.init();
	},
	"destroy" : function () {
		console.debug ( ".destroy()" , this.element );
	
			var $thisElement = typeof ( this.element ) == 'undefined' ? $(this) : this.element,
				$thisController = $thisElement.controller();
			$thisController.options.itemModel.unbind ("selectedResponse", this.onSelectedResponseChange);
			

	}
	
})

});