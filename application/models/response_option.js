$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Models.ResponseOption
 * @parent index
 * @inherits jQuery.Model
 * Wraps backend classification services.  
 */
$.Model('Level3_ddpw_administration.Models.ResponseOption',
/* @Static */
{	
/*
	findAll: "/classifications.json",
  	findOne : "/classifications/{id}.json", 
  	create : "/classifications.json",
 	update : "/classifications/{id}.json",
  	destroy : "/classifications/{id}.json"
  	*/
  	// Level3_ddpw_administration.Models.ResponseOption.getDisplayLabel ( responseOptionInstance , promptType);
  	getDisplayLabel : function ( responseOptionInstance , promptType ) {
		var displayLabel = "";
  		switch ( promptType ) {
  			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTINPUT:	
  			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTAREA:
  				displayLabel = "(User input)";
  			break;
  			
  			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SELECT:
  			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.RADIOGROUP:
  			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.CHECKBOXGROUP:
  			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.DATEPICKER:
  				displayLabel = responseOptionInstance.label +" ( "+ responseOptionInstance.value +" ) ";
  			break;
  		}
		return displayLabel;		
  	},
  	model : function ( rawData ) {
  		return new Level3_ddpw_administration.Models.ResponseOption ( rawData );
  	},
  	models : function (rawData) {
		rawData = rawData == null ? [] : rawData;
		
		try {
			//validate incoming rawData:
			if ( typeof ( rawData.length ) == 'undefined' ) { //looks like an object not an array
				//it's probably a class that was stored incorrectly as an object instead of an array - so let's convert...
				rawData = [rawData];
				console.debug ("rawData converted in response_option.js to: " , rawData);
			}
			
			var responseOptions = new Level3_ddpw_administration.Models.ResponseOption.List();
			
			for (var i = 0; i < rawData.length; i++) {
				var responseOption = rawData[i];
				if (typeof (responseOption.Class) != 'undefined' && responseOption.Class.shortName == "ResponseOption") {
					responseOptions.push ( responseOption );
				} else {
					
					var realizedResponseOption =  Level3_ddpw_administration.Models.ResponseOption.model ( responseOption );
					
					responseOptions.push ( realizedResponseOption );
				}
				/*
				*/
			}
			
			if ( responseOptions.length > 0 ) {
				if ( typeof ( responseOptions[0] ) == 'undefined' 
						&& 	typeof ( responseOptions[0].hasPrompts  ) == 'undefined' 
					){
					throw new Error ("Fail in responseOption.models processing");
				}
			} 		
		} catch ( e ) {
			console.debug ("Data fail in response_option.models(): " , e );
	    	if ( typeof (e) != 'undefined') {
	    		console.debug ( e.stack , e.message );
	    	} else {
	    		alert ("an unknown error has occured in response_option models(): " );
	    	}
		}
		return responseOptions;
	},
	movePrompt : Level3_ddpw_administration.Models.PromptTree.movePrompt,
  	attributes : {
		  prompts : "Level3_ddpw_administration.Models.Prompt.models"
		  ,commands : "Level3_ddpw_administration.Library.Level3.Ddpw.Commands.AbstractCommand.models"
		  ,classifications : "Level3_ddpw_administration.Models.Classification.models"
	}
},
/* @Prototype */
{		
			id : null,
			prompts : [],
			classifications : [],
			commands : [],
			init : function () {
				//console.debug ("responseOption.init() " , this );
				this.prompts = this.prompts.length > 0 ? this.prompts : [];
				this.id ? this.id : this.id = Level3_ddpw_administration.Models.PromptTree.getGuid();
				this.prompts.length ? null : this.prompts = Level3_ddpw_administration.Models.Prompt.models([]);
			},
			getCommandNamesList : function () {
				var commandNamesArray = [];
				if (this.commands && this.commands.each ) {
					this.commands.each ( function (index, command) {
						commandNamesArray.push ( command.name) ;
					});
				}
				return commandNamesArray.join();
			},
			addPrompt : Level3_ddpw_administration.Models.PromptTree.prototype.addPrompt,
			deletePrompt : Level3_ddpw_administration.Models.Prompt.prototype.deletePrompt,
			addCommand : function ( command , targetIndex ) {
				console.debug (this.Class.shortName +".addCommand", arguments);
				var itemCommands = this.commands.slice(0);
				if (typeof(itemCommands)=='undefined' || itemCommands == null){
					itemCommands = [];
				}
				
				if (	
					typeof (targetIndex) != 'undefined' 
					&& targetIndex != null 
					&& targetIndex >= 0
					)
				{
					itemCommands[targetIndex] = command;
				} else {
					itemCommands.push ( command ); 
				}
				this.attr ( "commands" , itemCommands );
				
				return this;
			},
			removeCommand : function ( targetIndex ) {
				console.debug (this.Class.shortName +".removeCommand", arguments);
				var responseCommands = this.responseOptions[targetResponseOptionIndex].commands.slice(0);
				responseCommands[targetResponseOptionIndex].splice ( commandIndex , 1 ); 
				this.attr ( "commands" , responseCommands );
				return this;
			},
			label: "Response Option Label",
			value: "responseOptionValue",
			hasPrompts : Level3_ddpw_administration.Models.PromptTree.prototype.hasPrompts,
			hasResponseOptions : Level3_ddpw_administration.Models.PromptTree.prototype.hasResponseOptions,
			_isSelected : null,
			isSelected : function () {
				var returnVal = this._isSelected;
				if ( returnVal == null ) { 
					this._isSelected = returnVal = false;
				}
				return returnVal;
				/*
				return this.getParent().isResponseOptionSelected(this);
				
				if ( this._isSelected != null ) {
					//do nothing if _isSelected is not null
				} else {
					// but if it IS null - check the parent
					this.getParent().attr( "selectedResponse" );
					//but this means looking to the parent prompt at it's selectedResponse container - which is variable by promptType.
					//this really belongs as a configured factory function.
					//going to start moving ....
				}
				return this._isSelected;
				*/
			},
			setSelected : function ( value ) {
				this._isSelected = value;
			},
			hasPrompts : Level3_ddpw_administration.Models.PromptTree.prototype.hasPrompts,
			hasResponseOptions : Level3_ddpw_administration.Models.PromptTree.prototype.hasResponseOptions,
			hasChildren : Level3_ddpw_administration.Models.PromptTree.prototype.hasChildren,
			getParent : Level3_ddpw_administration.Models.PromptTree.prototype.getParent,
			getChildren : Level3_ddpw_administration.Models.PromptTree.prototype.getChildren,
			getIndex : Level3_ddpw_administration.Models.PromptTree.prototype.getIndex
			
});

$.Model.List('Level3_ddpw_administration.Models.ResponseOption.List',{
  // static properties
},{
	//prototype properties
	getAllSelected : function () {
		return Level3_ddpw_administration.Models.ResponseOption.models ( $.grep ( this, function ( responseOption, index ) { return responseOption._isSelected } ) );
	},
	setAllSelected : function ( value ) {
		$.each ( this , function ( index, responseOption ) { responseOption.setSelected ( value ) } );
		return this;
	},
	getAllValues : function ( ) {
		var valuesArray = this.map ( function  ( responseOption, index ) { return responseOption.value }); 
		return valuesArray;
	},
	setSelectedByValue : function  ( valueArray ) { 
		this.setAllSelected ( false );
		var valueMatches = $.grep ( this, function ( responseOption, index ) { return $.inArray ( responseOption.value , valueArray ) >= 0  } );
		var setValuesList = Level3_ddpw_administration.Models.ResponseOption.models ( valueMatches ).setAllSelected ( true );
		var returnVal = setValuesList;
		return returnVal ;
	},
	findResponseOptionsByValue : function ( value ) {
		return Level3_ddpw_administration.Models.ResponseOption.models ( $.grep ( this, function ( responseOption, index  ) { return responseOption.value == value } ) );
	},
	isSelectionMatch : function ( selections ) { //returns true if $.Model.List passed in matches *this*
			var 
			_responseOptions = this,
			matchCount = 0,
			selectionsExist = selections.length,
			selectionsMatch = false;
			if (selectionsExist != _responseOptions .getAllSelected().length
				&& _responseOptions .getAllSelected().length != 0
				&& selectionsExist != 0
			) {
				return false;
			} else {
				var uiValueArray = selections.getAllValues();//value comparisons will fail against complex data types ... may need something better here when that arises.
				selectionsMatch = _responseOptions .getAllSelected().grep ( function ( responseOption, index ) {
					//matching by value should work consistently when its called
					return $.inArray ( responseOption.value , uiValueArray );
				}).length == selections.length;
			}
		return selectionsMatch;
	}
});

})