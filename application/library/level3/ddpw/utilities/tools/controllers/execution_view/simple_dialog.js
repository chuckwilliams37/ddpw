$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Controllers.ExecutionView.SimpleDialog
 */
$.Controller('Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Controllers.ExecutionView.SimpleDialog',
	/** @Static */
	{
		defaults : {
			toolType : null,
			prompt : null
		}
	},
	/** @Prototype */
	{
		init : function ( element, options ){
			//console.debug (this.Class.shortName + ".init()", this, arguments);
			if ( this.options.prompt.isPopup && !this.options.prompt.hasSelectedResponse() ) {
				this.removeDefaultButtons();
				this.getPopup();
				this.element.dialog ("open");
			} else if ( this.options.prompt.isPopup && this.options.prompt.hasSelectedResponse() ) {
				this.removeDefaultButtons();
				this.refresh();		
			} else if ( !this.options.prompt.isPopup ) {
				this.activateButtons();
				this.refresh();		
			}
		},
		removeDefaultButtons : function () {
			console.debug ( "remove default buttons" );
			$(".simple_dialog_button_container input", this.element).remove();
			$(".simple_dialog_button_container label", this.element).remove();
		},
		activateButtons : function () {
		
			var buttons = $(".simple_dialog_button_container input", this.element);
			/*
			,
			selectedResponse = this.options.prompt.getSelectedResponse();
			
			if ( this.options.prompt.hasSelectedResponse() ) {
				this.options.prompt.responseOptions.each ( function ( index , responseOption) {
					if ( responseOption.value == selectedResponse.value ) {
						buttons.eq(index).attr ( "checked" , "checked" );
					}
				});
			}
			*/
			
			$(".simple_dialog_button_container", this.element).buttonset();
			
		},
		getPopup : function () {
				var buttonOptions = {},
				prompt = this.options.prompt,
				onButtonClick = function ( responseOption ) {
					return function () { 
						//console.debug ("Simple Dialog on click: " + responseOption.label);
						prompt.attr( "selectedResponse", responseOption );
						$(this).dialog("close");
						$(".selection-container", this.element).show();
					}
				}
				this.options.prompt.responseOptions.each ( function (index, responseOption) {
					buttonOptions[responseOption.label] = onButtonClick(responseOption);
				});
				$(".selection-container", this.element).hide();
				this.element.dialog(
					{
						modal : true,
						title : this.options.prompt.title,
						buttons : buttonOptions,
						autoOpen : false,
						closeOnEscape : false,
						closeText : 'hide',
						open: function(event, ui) {
						  $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
						}
					}
				);
				
		},
		"[class*='level3_ddpw_administration_models_response_option'] click" : function ( element, event ) {
			console.debug ("CLICK!!!!: : " , arguments );
			event.stopImmediatePropagation();
			event.preventDefault();
			//set the model value
			var responseOption = element.closest ( ".response_option" ).model(),
				prompt = this.options.prompt;
			prompt.attr( "selectedResponse", [ responseOption ] );
			//clear all others:
			element.closest(".prompt").find(".response_option input").removeAttr ("checked");
			//set the non-visual checkbox to checked
			element.closest (".response_option").find ("input").attr ("checked" , true );
			//refresh the buttons
			$(".simple_dialog_button_container", this.element).buttonset("refresh");
			
		},
		".response_option > button click" : function ( element, event ) {
			var responseOption = element.closest ( ".response_option" ).model(),
			prompt = this.options.prompt;
			prompt.attr( "selectedResponse", responseOption );
			//this.refresh();
		},
		refresh : function  () {
			this.element.closest(".prompt").find(".promptActions").remove();//drop the "next" button
			if ( this.options.prompt.hasSelectedResponse() && this.options.prompt.isPopup ) {
				//this._unbind();
				var changeLink = "<a href='#' class='change-response'>Change</a>",
				selectionContainer = $("<div class='selection-container'> You selected: <span><em>"+this.options.prompt.attr ("selectedResponse")[0].label+"</em></span>&nbsp;"
										+
										(
											this.options.prompt.offerChange ? 
											changeLink : "" 
										)
										+"</div>");
				$(".simple-dialog-text", this.element).append(selectionContainer);
				//this.bind();
			}
		},
		".change-response click" : function () {
			this.options.prompt.setSelectedResponse ( null );
			this.init();
		}
		
	}
);
});