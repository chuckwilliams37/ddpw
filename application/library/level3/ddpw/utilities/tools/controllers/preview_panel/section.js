$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Controllers.PreviewPanel.Section
 */
$.Controller('Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Controllers.PreviewPanel.Section',
	/** @Static */
	{
		defaults : {
			toolType : null,
			sectionModel : null,
			_isMarkedComplete : false,
			_isSavingSelections : false
		},
		listensTo : [ "reactivateSection" , "markSectionComplete" , "markSectionIncomplete"]
	},
	/** @Prototype */
	{
		init : function ( element, options ){
			console.debug (this.Class.shortName +".init(): at index: " + this.getSectionIndex() + ": of :" + this.getSectionCount() );
			console.debug (" this.options._isMarkedComplete:" + this.options._isMarkedComplete  );
			$(".promptActions").hide();
			this.options._isMarkedComplete = typeof ( this.options.sectionModel._isMarkedComplete ) != 'undefined' ? this.options.sectionModel._isMarkedComplete : false ;
			
			this.enableSectionActions ( !this.isMarkedComplete() )
			
			this.options.sectionModel.prompts.each ( $.proxy ( function ( index , prompt ) {
					prompt.bind ( "selectedResponse" , $.proxy ( this.onSelectedResponseChange , this ) );
				} , this  )
			);
			
		},
		".section_actions click" : function ( element, event ) {
			console.debug ( "Section Submit");
			event.stopPropagation();
			event.stopImmediatePropagation();
			event.preventDefault();
			this.saveAndCompleteSection( event );
		},			
		saveAndCompleteSection : function ( event ) {
			console.debug ("savingSection");
			this.saveSectionSelections( event );
			if ( this.checkSectionComplete() ) {
				console.debug ("section " +( this.getSectionIndex()+1 )+" complete.");
				this.element.trigger ("markSectionComplete");
				
				this.options._isMarkedComplete = true;
				this.triggerSectionSelectedEvent()
			} else {
				console.debug ("section " +( this.getSectionIndex()+1 )+" NOT complete.");
				this.element.trigger ("markSectionIncomplete");
				this.triggerSectionIncompleteEvent();
			}
		},
		"reactivateSection" : function ( element , event ) {
			console.debug ("REACTIVATING SECTION", this.element );
			
			this.setSectionEnabled( true );
		},
		".prompt responseSelected" : function ( element , event ) {
			console.debug ("one of my prompts responseSelected changed...", this.element );
			this.enableSectionActions( !this.checkSectionComplete() );
		},
		getSectionIndex : function () {
			return this.element.closest("li.prompt").index();
		},
		getSectionCount : function () {
			return this.element.closest("li.prompt").parent().find(".section_container").length;
		},
		"markSectionComplete" : function (element, event) {
			console.debug ("markSectionComplete : " , arguments );
			this.options._isMarkedComplete = true;
		},
		"markSectionIncomplete" : function (element, event) {
			console.debug ("markSectionComplete : " , arguments );
			this.options._isMarkedComplete = false;
		},
		isMarkedComplete : function () {
			console.debug ("isMarkedComplete: " + this.options._isMarkedComplete);
			return this.options._isMarkedComplete;
		},
		checkSectionComplete : function () {
			var promptsWithSelectionsOrDefaults = this.options.sectionModel.prompts.grep ( function ( prompt , index ){ return prompt.hasSelectedResponse()  || prompt.hasDefaultResponse()  } );
			return promptsWithSelectionsOrDefaults.length ==  this.options.sectionModel.prompts.length;
		},
		hasUserSelections : function () {
			var promptsWithSelections = this.options.sectionModel.prompts.grep ( function ( prompt , index ){ return prompt.hasSelectedResponse() } );
			return promptsWithSelections.length > 0;
		},
		setSectionEnabled : function ( isEnabled )  {
			isEnabled = Boolean( isEnabled )
		    this.enableSectionActions ( isEnabled );
		    $(".prompt", this.element).find ( "input, textarea, select" ).attr('disabled',!isEnabled );
		    $(this.element).animate({opacity: (isEnabled ? 1 : .3 )}).toggleClass ( "ui-state-active" , isEnabled );
		},
		enableSectionActions : function ( isEnabled ) {
			if ( isEnabled ) {
				$( ".section_actions", this.element).show();
				$( ".section_actions button" , this.element ).button();
			} else {
				$( ".section_actions", this.element).hide();
			}
		},
		getAllPromptControllers : function () {
			var sectionPromptControllers = $(".prompt", this.element).controllers();
			return sectionPromptControllers;
		},
		saveSectionSelections : function ( event ) {
			
			var sectionPromptControllers = this.getAllPromptControllers(),				 
				$applicationController = typeof  ( $("#main").controller() ) == 'undefined' ? $("#ddpw_main").controller() :  $("#main").controller();
				cursor = $("#previewPanel").controller().options.selectedTree.createCursor(),
				sectionPromptIds = $.map ( sectionPromptControllers , ( function ( promptController , index ) {
					return promptController.options.itemModel.identity();
				}));
				
			this.options._isSavingSelections = true; //flag to prevent selectedResponse events from firing checkSectionComplete
				
				$.each ( sectionPromptControllers , function ( index , promptController ) {
					var value = promptController.getUiResponse( event ); //returns an array 
					//if ( promptController.validate( value ) ) { //not functioning at this time
					
					//for last prompt in section - turn off saving flag
					if ( index >= sectionPromptIds.length ) {
						this.options._isSavingSelections = false;
					}
					
					var promptModel = $("."+promptController.options.itemModel.identity()).model()
					promptModel.attr ( "selectedResponse" , value );
					
					
					//execute inline commans
					var	selectedResponseCommands = promptModel.getSelectedResponseCommands();
					$.proxy (
						$.each ( selectedResponseCommands,  function ( commandIndex, command ) {
						switch ( command.type ) {
							case "SetEnvironmentVariableCommand":
								var executeNonQueuedCommandEvent = $.Event( "executeNonQueuedCommand" , { command : command, selectedResponse : value });
								$applicationController.element.trigger ( executeNonQueuedCommandEvent );
							break;
							default:
								//do nothing.
							break;
						}
					}), this );
				});
			 //flag to prevent selectedResponse events from firing checkSectionComplete checks 
		},
		triggerSectionSelectedEvent : function (){
			this.element.trigger ("markSectionComplete");
			var sectionSelectedEvent = $.Event ( "sectionSelected" );
			this.element.trigger ( sectionSelectedEvent );
		},
		triggerSectionIncompleteEvent : function () {
			this.element.trigger ("markSectionIncomplete");
			this.options._isMarkedComplete = false;
			var sectionIncompleteEvent = $.Event ("sectionIncomplete"),
				sectionPromptControllers = this.getAllPromptControllers();

			$.each ( sectionPromptControllers , function ( index , promptController ) {
				var value = promptController.getUiResponse( event ); //returns an array - choose 
				if ( ! promptController.options.itemModel.hasSelectedResponse() ) {
					promptController.element.switchClass ("","ui-state-error",125);
				}
			});
		},
		onSelectedResponseChange : function ( event , selectedResponse ) {
			console.debug ("selectedResponse Changed within section", arguments );
			
			var isLastPromptInSection = $(this.element).find(".prompt").length == event.target.elements(this).index() + 1,
				isSectionBeingUpdated = $(this.element).hasClass ("ui-state-active");
			if (
					(
					this.isMarkedComplete() 
					&& !this.options._isSavingSelections
					&& selectedResponse != null //values are being cleared
					)
				||(
					!this.options._isSavingSelections
					&& ( 
						//only fire also for last prompt in a section
						isLastPromptInSection
						//or sections that are being updated
						||
						isSectionBeingUpdated
					)
					&& this.checkSectionComplete() 
					&& selectedResponse != null
					&& selectedResponse.getAllSelected
					&& selectedResponse.getAllSelected().length >0
					
					)
				){
				this.triggerSectionSelectedEvent();
			} else {
				this.enableSectionActions ( !this.isMarkedComplete() );
			}
			
		},
		"destroy" : function () {
			console.debug ( "destroy section: " , arguments );
			this.options.sectionModel.prompts.each ( $.proxy ( function ( index , prompt ) {
					prompt.unbind ( "selectedResponse" , $.proxy ( this.onSelectedResponseChange , this ) );
				} , this  )
			);
		}
		
	}
);
});