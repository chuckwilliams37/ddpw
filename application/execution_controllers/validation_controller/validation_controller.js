$(document).ready(function() {
/**
 * @class Level3_ddpw_execution.Controllers.ValidationController
 * depends on http://docs.jquery.com/Plugins/Validation/Methods
 * loaded in ../js/jquery.validate.min.js
 */
$.Controller('Level3_ddpw_execution.Controllers.ValidationController',
/** @Static */
{
	defaults : {
		formToValidate : null
	},
	listensTo : []
},
/** @Prototype */
{
	init : function(){
		//console.debug ( this.Class.shortName + ".init()" );
		this.options.formToValidate = this.element.closest("form");
		this.options.formToValidate.validate();//sets up form for validation - see http://docs.jquery.com/Plugins/Validation
	},
	validate : function ( prompt, value ) {
		//validation rules are defined in the tool factory
		this.setupRules();
		this.options.formToValidate.validate();
		return true;
	},
	setupRules : function ( form ) {
		if ( form == null) {
			form = this.options.formToValidate;
		}
		//builds name/value pairs per docs based on available fields in conjunction with the toolfactory
		var inputSelectors = ".prompt textarea, .prompt input",
		elementsToValidate = form.find ( inputSelectors );
		
		/*
		$.each (elementsToValidate, function ( index, element ) {
			element.rules("remove");
			element.rules("add", element.closest(".prompt").model().getValidationRules() );
		});
		*/
	}
});
});