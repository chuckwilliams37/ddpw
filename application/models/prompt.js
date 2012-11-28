$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Models.Prompt
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend prompt services.  
 */
$.Model('Level3_ddpw_administration.Models.Prompt',
/* @Static */
{
	/*
	setup : function () {
	
		return ;
	},
	findAll: "/prompts.json",
  	findOne : "/prompts/{id}.json", 
  	create : "/prompts.json",
 	update : "/prompts/",
  	destroy : "/prompts/{id}.json",
	*/
  	getGuid: Level3_ddpw_administration.Models.PromptTree.getGuid,
	attributes : {
		prompts : "Level3_ddpw_administration.Models.Prompt.models",
		classifications : "Level3_ddpw_administration.Models.Classification.models",
		responseOptions : "Level3_ddpw_administration.Models.ResponseOption.models",
		
		prefillData : "Level3_ddpw_administration.Models.PrefillData.models",
		selectedResponse : "Level3_ddpw_administration.Models.ResponseOption.models",
		_defaultResponse : "Level3_ddpw_administration.Models.ResponseOption.models",
		promptMetaData : "promptMetaData",
		id : "string",
		isResponseRequired : "boolean",
		isResponseForced : "boolean"
	},
	model : function ( raw ) {
		if ( typeof ( raw.promptMetaData ) == 'undefined' || raw.promptMetaData == null ) {
			raw.promptMetaData = Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.getToolDataClass ( raw.type )
		}
		var prompt = new Level3_ddpw_administration.Models.Prompt ( raw );
		return prompt;
	},
	models : function (rawData) {
		//console.debug ("command.models() : " , rawData );
		var prompts = new Level3_ddpw_administration.Models.Prompt.List();
		try {
			for (var i = 0; i < rawData.length; i++) {
				var prompt = rawData[i];
				if (typeof (prompt.Class) != 'undefined' && prompt.Class.shortName == "Prompt") {
					prompts.push ( prompt );
				} else {
					if (typeof (prompt.classifications) == 'undefined' || prompt.classifications.length == 0)
					{
						prompt.classifications = Level3_ddpw_administration.Models.Classification.models([]);					
					}
					if (typeof (prompt.prefillData) == 'undefined' || prompt.prefillData.length == 0)
					{
						prompt.prefillData = Level3_ddpw_administration.Models.PrefillData.models([]);				
					}
					var realizedPrompt = Level3_ddpw_administration.Models.Prompt.model ( prompt );
					
					prompts.push ( realizedPrompt );
				}
			}
		} catch ( e ) {
			console.debug ("Data fail in prompt.models(): " , e );
	    	if ( typeof (e) != 'undefined') {
	    		console.debug ( e.stack , e.message );
	    	} else {
	    		alert ("an unknown error has occured in prompt.models(): " );
	    	}
		}
		return prompts;
	},
	movePrompt : Level3_ddpw_administration.Models.PromptTree.movePrompt,
	convert : {
	},
	listensTo : []
},
/* @Prototype */
{
	init : function () {
		this.id = this.id ? this.id : Level3_ddpw_administration.Models.Prompt.getGuid();
		this.responseOptions.length ? null : this.responseOptions = Level3_ddpw_administration.Models.ResponseOption.List([]);
		/*
		this.prefillData.length ? 0 : this.prefillData = Level3_ddpw_administration.Models.PrefillData.List([]);

		this.prompts = isListClass (this.prompts) ? this.prompts : new Level3_ddpw_administration.Models.Prompt.List( this.prompts );
		this.commands = isListClass (this.commands) ? this.commands : new Level3_ddpw_administration.Models.Command.List( this.commands );
		this.classifications = isListClass (this.classifications) ? this.classifications : Level3_ddpw_administration.Models.Classification.List ( this.classifications );
		*/
		/***************************************************
		*
		*CONSIDERATION: pulling out response options - placing them consistently in the promptMetaData....
		... this means that commands and subPrompts may not necessarily be children of the promptMetaData Object 
		... maybe Prompt meta data should be read-only?
		
		-- as here - we're copying them out to locally accessible data.
		if (this.responseOptions.length == 0) {
			this.attr ("responseOptions", this.promptMetaData.options);
		}
		*/
		/*
		Is this a good pattern? -- I'm thinking not.
		
		//maybe the 'this.attr' above should be merged with the top-level prompt data - rather than making it so type-driven.
		
		then all objects returned by: 
			Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.getToolDataClass(this.type)
		
		will become properties of the prompt..
		 - I like that.
		 
		 Mixin?  Is that what that is?
		 dirty/clean?
		 -- it would need to happen in the "setup" I think.... rather than "init".
		 
		 -- NO "setup" breaks - there's no _super in the setup, we need to have the properties set in init after all
		*/
		
		///here's a handler to copy everything from promptMetaData into properties of this object.
		this.initPromptMetaData();
		//console.debug(this.Class.shortName + ".init()", this);
		//console.debug (this.Class.shortName + ".init()", this);
	},
	onCommandsChange : function () {
		console.debug ( " onCommandsChange () ", arguments ) ;
		//this.parentTreeReference.save();
	},
	hasSelectedResponse : function () {
		var returnVal = this._hasSelectedResponse; //set in setter "setSelectedResponse"
		/*
		var returnVal = false;
		if (this.selectedResponse != null) {
			returnVal = true;
		}
		*/
		return returnVal;
	},
	hasDefaultResponse : function () {
		var returnVal = this.attr("defaultResponse").length > 0;
		return returnVal;
	},
	setSelectedResponse : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.promptModelSetSelectedFunction,
	getSelectedResponse :  Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.promptModelGetSelectedFunction,
	isResponseOptionSelected : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.promptModelIsResponseOptionSelectedFunction,
	getDefaultResponse : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.promptModelGetDefaultFunction,
	setDefaultResponse : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.promptModelSetDefaultFunction,
	getSelectedResponseCommands : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.promptGetSelectedResponseCommands,
	addResponseCommand : function (command, targetResponseOptionIndex, targetCommandIndex ) {
		console.debug (this.Class.shortName +".addCommand", arguments);
		var targetResponse = null,
		$elements = [];
		if ( typeof (targetCommandIndex) != 'undefined' && targetCommandIndex >= 0 ) {
			targetResponse = this.responseOptions[targetResponseOptionIndex].addCommand( command , targetCommandIndex);
		} else {
			targetResponse = this.responseOptions[targetResponseOptionIndex].addCommand( command );		
		}
		$elements = this.elements().trigger ("commandAdded");
		return targetResponse;
	},
	removeResponseCommand : function ( commandIndex, targetResponseOptionIndex ) {
		console.debug (this.Class.shortName +".removeCommand", arguments);
		var targetResponse = this.responseOptions[targetResponseOptionIndex].removeCommand( commandIndex );
		return targetResponse;
	},
	addResponseOption : function ( newResponseOption , index ) {
		if (!newResponseOption) {
			newResponseOption = new Level3_ddpw_administration.Models.ResponseOption();
		}
		
		if (!index) {
			index = this.responseOptions.length
		}
		this.responseOptions.splice ( index, 0, newResponseOption);
		this.attr ( "responseOptions" , this.responseOptions );
		return newResponseOption;
	}, 
	deleteResponseOption : function ( index ) {
		if (index >= 0) {
		} else {
			index = this.responseOptions.length		
		}
		var deletedResponseOption = this.responseOptions.splice ( index, 1);
		
		this.attr ( "responseOptions" , this.responseOptions );
		return deletedResponseOption;
	}, 
	deletePrompt : Level3_ddpw_administration.Models.PromptTree.prototype.deletePrompt,
	addPrompt : Level3_ddpw_administration.Models.PromptTree.prototype.addPrompt,
	_hasSelectedResponse : false,
	_selectedResponse : [], 
	_defaultResponse : [],
	initPromptMetaData : function () {
		//$.extend ( this, this.promptMetaData );
		for (var key in this.promptMetaData) {
			var property = this.promptMetaData[key];
			var propertyType = typeof (this.promptMetaData[key]);
			switch (propertyType) {
				case "function":
					//do nothing;
				break;
				
				default:
					switch (key) {
						case "responseOptions" :
							if (this.responseOptions.length > 0) {
								//convert incoming data
								this[key] = Level3_ddpw_administration.Models.ResponseOption.models ( this.responseOptions );			
								//console.debug ("initPromptMetaData () : this.responseOptions : " + this.responseOptions);
							} else {
								//this[key] = []
								//console.debug ("defaultResponseOptions BEFORE : " , this.attr ("defaultResponse") );
								//setup defaults and initial values
								//this.attr ("defaultResponse" , property );
								this.attr ("responseOptions" , property );
								//console.debug ("defaultResponseOptions AFTER: " , this.attr ("defaultResponse") );
								//this[key] = defaultResponseOptions;
							}
						break;
						case "prefillData" :
								this.attr ("prefillData" , property );
						break;
						default :
							//this should not be happening indiscriminantly - incoming values may exist
							this[key] = property;
						break;
					}
				break;
			}
		}	
	},
	getValidationRules : function () {
		return Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.getValidationRule ( this );
	},
	id : null,
	uid: null,
	isActive: false,
	text: "Prompt Text",
	type : "textInput",
	promptMetaData : {},
	isResponseRequired : true, //this should notify prompts that a user response of some kind is required
	isResponseForced : false, //this should notify prompts that user engagement should be forced by the interface so that user selection is unequivocal
	responseOptions : [], //each position in the response options should contain the corresponding commands in an array object
	commands : [], //{DEPRECATED - commands are contained in responseOptions } each responseOption should execute the corresponding command 
	classifications : [], //classifications are used to filter whether or not this prompt should be rendered/displayed
	hasPrompts : Level3_ddpw_administration.Models.PromptTree.prototype.hasPrompts,
	hasResponseOptions : Level3_ddpw_administration.Models.PromptTree.prototype.hasResponseOptions,
	hasChildren : Level3_ddpw_administration.Models.PromptTree.prototype.hasChildren,
	getParent : Level3_ddpw_administration.Models.PromptTree.prototype.getParent,
	getChildren : Level3_ddpw_administration.Models.PromptTree.prototype.getChildren,
	getIndex : Level3_ddpw_administration.Models.PromptTree.prototype.getIndex,
	prefillData: Level3_ddpw_administration.Models.PrefillData.models ( [new Level3_ddpw_administration.Models.PrefillData ({prefillType:"Custom",prefillValue:""})] )
	
});

});