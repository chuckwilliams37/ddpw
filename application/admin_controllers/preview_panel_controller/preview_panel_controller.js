$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Controllers.PreviewPanelController
 */
$.Controller('Level3_ddpw_administration.Controllers.PreviewPanelController',
/** @Static */
{
	defaults : {model : Level3_ddpw_administration.Models.PromptTree,
		treeName:null,
		selectedTab:null,
		selectedClassifications:{
			segment : ["Unknown/Undefined"],
			product : ["Unknown/Undefined"],
			bandwidth : ["Unknown/Undefined"]
		},
		classificationGroups:[],
		classificationHierarchy:[],
		selectedTree: null,
		cursor : null,
		validationController : null,
		formId : null,
		environmentVariables : null,
		_sectionCompletedStates : []
	},
	listensTo : ["treeSelected","responseSelected","sectionSelected","classificationSelectionPanelIsReady"
		,"markSectionComplete" , "markSectionIncomplete" , "reactivateSection"
	]
},
/** @Prototype */
{
	init : function(){
		console.debug (this.Class.shortName+".init()", this);
		this.options.validationController = $("#validation_controller").controller();			
	
	},
	_isActive : false,
	isActive : function () {
		var $thisController = $("#previewPanel").controller();
		return $thisController._isActive;
	},
	setEnvironmentVariables : function () {
		if ( this.isActive () ) {

			/*
			
			if ( this.options.commandController.length && this.options.commandController.getEnvironmentVariables().hasOwnProperty( "accountId" ) ) {
				this.options.environmentVariables = this.options.commandController.getEnvironmentVariables();
			} else {
				this.setEnvironmentVariables();
			}		
			*/
		}
		
		this.options.classificationComponentsController =  $("#classificationComponents").controller();
		
		var environmentVariablesObj = {
			accountId : $("#busOrgSelection").val(),
			serviceId : "",
			domain : $.cookie("domain")
			//classifications may grow to be more than 1... so this will need to be changed in the future to handle multiple classifications within a group
			//...and also additional classfication groups (e.g. more than product, segment, bandwidth, and non-hardcoded...
			
			//this needs dealing with
			/*
			environmentVariables = environmentVariables.portalUserName ? environmentVariables: this.loadUserAccountsJSON(environmentVariables);
			environmentVariables = environmentVariables.portalUserEmail ? environmentVariables : this.loadUserAccountsJSON(environmentVariables);
			environmentVariables = environmentVariables.portalUserPhone ? environmentVariables : this.loadUserAccountsJSON(environmentVariables);								
			*/
			
		}
		$.each ( this.options.classificationComponentsController.options.classificationGroupNames , function ( index, groupName ) {
			var underscoredGroupName = $.String.underscore( groupName )
			environmentVariablesObj [ underscoredGroupName ] = $("#"+underscoredGroupName+"dropdown").val();
		});
		
		this.options.environmentVariables = environmentVariablesObj;
		
		var envVarsEvent = $.Event ("setEnvironmentVariables", {environmentVariables : environmentVariablesObj});
		console.debug ( "setEnvironmentVariables: " , environmentVariablesObj );
		this.element.trigger ( envVarsEvent );		
	},
	getEnvironmentVariables : function () {
		return this.options.environmentVariables;
	},
	selectedElement : null,
	selectedTreePrompts:null,
	"{window} treeSelected" : function (element, event, tree) {
		console.debug (this.Class.fullName + " A Tree was Selected!!");
		tree = tree ? tree :  event.promptTree ? event.promptTree : $("#main").controller().options.selectedTree ? $("#main").controller().options.selectedTree :  null;
		this.options.formId = tree.identity()+"_form";			
		this.options.selectedTree = tree;
		this.options.cursor = tree.getCursor();
		$("#center_panel_container").tabs("enable",1);
		this.resetView();
		
		/*
		if (this.isActive()) {
			$("#previewPanelTreeContainer > ul").addClass("ui-state-active");
			//this.refresh();
		}
		*/
	},
	clearLocalTreeReference : Level3_ddpw_administration.Controllers.ApplicationController.clearLocalTreeReference,
        "{window} treeUnselected" : function ( element, event ) { 
                this.clearLocalTreeReference(); 
        },
    "reactivateSection" : function ( element , event ) {
    	var currentSections = this.element.find (".section_container");
    	var targetSection = $(event.target).closest(".section_container")
    	$(currentSections).each ( function  ( index, sectionElement ) {
    		if ( $(sectionElement).controller().options.sectionModel.identity()
    			 ==  
    			 $(targetSection).controller().options.sectionModel.identity()
    			 ) {
    			//the section activates itself
	    		//$(sectionElement).controller().setSectionEnabled ( true ); //so we sholdn't need to do this
    		} else {
    			//but we need to deactivate the others
	    		$(sectionElement).controller().setSectionEnabled ( false );
    		}
    	});
    	
    },
	"responseSelected" : function ( element, event ) {
		//handled at section level now....
		//console.debug ( "responseSelected" );
		//this.resetSelections(  $(event.target).model().identity() );
		//this.refresh();
	},
	"{window} sectionSelected" : function ( element, event ) {
		console.debug ( "sectionSelected" );
		//reset from last completed section -- AND CHANGED child (if happened - not from sectionSelected event ... but where?
		//!! 
		//we'll need to account for responses that have already been selected!!
		
		var sectionStates = this.options._sectionCompletedStates,
			lastCompletedSectionIndex = sectionStates.indexOf ( false ) == -1 ?  sectionStates.length - 1 : sectionStates.indexOf ( false ),
			lastCompletedSection = $(".section_container" ,this.element)[ lastCompletedSectionIndex ],
			lastPromptInLastCompletedSection = function ( section ) {
				var _lastPrompt = $(section).find(".prompt:last");
				return _lastPrompt
			},
			resetFromLastPrompt = $.proxy ( 
				function ( lastPrompt ) {
					//this won't run if the prompt has no selections
					lastPrompt.model().attr( "selectedResponse" ).each ( $.proxy ( 
						function ( ro_index , responseOption ) {
							if ( responseOption.hasChildren () ) {
								this.resetSelections ( lastPrompt.model().identity() );
							}
						}
					, this ));
				}
			, this )
			
		resetFromLastPrompt ( lastPromptInLastCompletedSection ( lastCompletedSection ) );
		
		/*		
		var sectionController = $(event.target).controller();
		
		if ( typeof (sectionController) != 'undefined') {
			//this.options._sectionCompletedStates[sectionController.getSectionIndex()] = true; //moved to events
			var firstPromptIdWithChildrenOfAResponseOptionInTheSelectedSection, itemModel,
				sectionPrompts = $(event.target).find (".prompt").models();
			$.each ( sectionPrompts , function ( index, prompt) {
				prompt.attr( "selectedResponse" ).each ( function ( ro_index , responseOption ) {
					if ( responseOption.hasChildren () ) {
						firstPromptIdWithChildrenOfAResponseOptionInTheSelectedSection = prompt.identity();
						return false;
					}
				});
				if ( firstPromptIdWithChildrenOfAResponseOptionInTheSelectedSection == null ) {
					return true;
				} else {
					return false;
				}
			});
		}
		
		if ( typeof ( firstPromptIdWithChildrenOfAResponseOptionInTheSelectedSection ) != 'undefined'
				&& firstPromptIdWithChildrenOfAResponseOptionInTheSelectedSection != null ){
			this.resetSelections ( firstPromptIdWithChildrenOfAResponseOptionInTheSelectedSection ); 
		}
		*/
		this.refresh();
	},
	".reset-preview-panel click" :function () {
		console.debug ( "RESET PREVIEW PANEL");
		this.resetSelections();
		this.refresh();
	},	
	resetSelections : function ( fromId ) {
		var paramsObj = {};
		var initialFilters = ["prompts","hasSelections"];
	    var cursor = this.options.cursor = this.options.cursor ? 
			this.options.cursor.setFilters( initialFilters , paramsObj) : 
			this.options.selectedTree.createCursor( initialFilters ,paramsObj );
		
		if ( fromId ) {
			cursor.moveTo ( fromId );
		} else {
			cursor.moveTo ("start");
			this.options._sectionCompletedStates = [];
		}
		var startDepth = cursor.getDepth();
		cursor.next();
		
		do {
			var instance = cursor.getInstance();
			if (
				instance 
				&& (
					startDepth < cursor.getDepth() //we need a way to restart back at 0 
					&& fromId != null
					// let's try when fromId is NOT set
					||
					fromId == null //we're assuming we want to wipe EVERYTHING.	
				)
			){//will only reset "dependent" prompts or EVERYTHING
				var sectionElement = instance.elements ( this.element ).closest ( ".section_container" ),
					sectionIndex = sectionElement.index(),
					sectionModel = sectionElement.model();
					isSectionComplete = typeof ( this.options._sectionCompletedStates [ sectionIndex ] ) != 'undefined' ? this.options._sectionCompletedStates [ sectionIndex ]  : false;
				if ( !isSectionComplete ) {
					 //with the exception of prompts inside containers marked complete
					 
					instance.attr ("selectedResponse", null);
				}
			}
		} while ( cursor.next() ); 
		
	},
	collectAndFilterDisplayablePromptsInSections : function () {
			this.options.classificationComponentsController =  $classificationComponentsController = $("#classificationComponents").controller();
			this.options.commandController = $("#command_controller").controller();
		
			if (  typeof ($classificationComponentsController) !='undefined' )  {
				var	prompts = [], sections = [], promptSectionCollections = [],
					paramsObj = {
		        		classifications : this.options.selectedClassifications,
		        		classificationGroups : this.options.classificationGroups,
		        		classificationHierarchy : this.options.classificationHierarchy
		        	},
					sectionFilters = [
						//all are prompts
						"prompts",  
						//in "parentResponseSelected" we're going to detect for response options / prompts parent/child relationship
						// and use those as section indicators for depth;
						// - parent response options are selected
						"parentResponseSelected" //this is critical for rendering follow-on sections after selections are made
						,"classifications"
						,"isReadyForDisplay"
					],
			        cursor = this.options.cursor = this.options.cursor ? 
			        		this.options.cursor.setFilters( sectionFilters , paramsObj) : 
			        		this.options.selectedTree.createCursor( sectionFilters ,paramsObj ),
			        sectionCompletedStates = this.options._sectionCompletedStates;
			        		
			        		
				this.options.classificationGroups = $classificationComponentsController ? $classificationComponentsController.options.classificationGroupNames : this.options.classificationGroups;
		  		this.options.classificationHierarchy = $classificationComponentsController ? $classificationComponentsController.options.classificationNames : this.options.classificationNames;
				this.options.selectedClassifications= this.getSelectedClassifications();
				/// we need to inject sections
				/// sections are render thusly:
				// section 1 get all root children of tree\
				// once section 1 is complete:
					// section 2 is all resulting children of section 1 selections
					/// once section 2 is complete ( all selections input by user):
							//section 3 is all resulting children of section 2
								//etc..
				cursor.setFilters( sectionFilters , paramsObj );
				cursor.moveTo ("start");
				promptSectionCollections = cursor.getFilteredCollectionByDepth();
				$.each ( promptSectionCollections , function ( index, promptSectionCollection) {  
					if ( typeof ( promptSectionCollection ) != 'undefined' ) {
						var sectionIndex = sections.length,
							sectionModel = Level3_ddpw_administration.Models.Prompt.model ( {
								type: Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SECTIONCONTAINER,
								prompts: promptSectionCollection,
								_isMarkedComplete : (
														typeof ( sectionCompletedStates  [ sectionIndex ] ) != 'undefined' ?
														sectionCompletedStates  [ sectionIndex ] :
														false
													)
						});
						sections.push ( sectionModel );
					}
				});
			} else {
				this.resetView();
			}
		return sections;
	},
	"markSectionComplete" : function ( element , event ) {
		this.options._sectionCompletedStates [ $(event.target).closest("li.prompt").index() ] = true;
	},
	"markSectionIncomplete" : function ( element , event ) {
		this.options._sectionCompletedStates [ $(event.target).closest("li.prompt").index() ] = false;	
	},	
	refresh : function () {
		console.debug ("**********preview panel refresh ****************");
		if ( this.isActive() ) {
				//MAKE SURE THAT PROMPTS HAVE responseOptions! that they might be rendered...
				var sectionedPrompts = this.collectAndFilterDisplayablePromptsInSections(),
					currentSections = this.element.find (".section_container");
				//considering checking here for section length and section completeness...
				
				// ... are they all complete?
				var allSectionsComplete = 
					currentSections.length > 0
					&& 
					$.grep ( this.options._sectionCompletedStates , function ( sectionState, index ) { return sectionState == true} ).length
					==
					sectionedPrompts.length ,
					renderedView = $.View("./application/admin_controllers/preview_panel_controller/views/preview_panel_prompt_list_container.ejs",
						{
							selectedClassifications: this.getSelectedClassifications(), 
							prompts:sectionedPrompts,
							treeName : this.options.selectedTree.name
						}
					);
				
				$("#previewPanelListContainer", this.element).html(renderedView);
				$(this.element).find(".section_contaner").each ( function (index, sectionContainer ) {
						switch ( this.options._sectionCompletedStates[sectionContainer.index()] ) {
							case true:
								sectionContainer.trigger ("markSectionComplete");
							break;
							case false:
							default:
								sectionContainer.trigger ("markSectionIncomplete");
							break;
						}
					});
				
				if ( allSectionsComplete ) {
					//
					var completeEvent = $.Event("interviewComplete", { tree : this.options.selectedTree  } ) ;
					$("body").trigger ( completeEvent );
				} else {
					this.scrollContainerToElement ( "#previewPanelListContainer", $(".section_container", this.element).filter(":last") );				
					$(".reset-preview-panel").button({
						label : "Reset"
					});
				}
		}
	},
	scrollContainerToElement : function ( container, target ) {
		if ( $(target).position(container) ) {
			var scrollToPosition = ($(target).position(container).top);
			$(container).animate({scrollTop: scrollToPosition},500,"easeOutExpo");
		} else {
			//first element 
			$(container).animate({scrollTop: 0},500,"easeOutExpo");
		}
	},
	resetView : function () {
		
		var renderedView = $.View("./application/admin_controllers/preview_panel_controller/views/init.ejs",
			{
				selectedClassifications: this.getSelectedClassifications(), 
				prompts:[],
				treeName : this.options.selectedTree.name,
				formId : this.options.formId,
				tree : this.options.selectedTree
			}
		);
		this.element.html(renderedView);
		new Level3_ddpw_administration.Controllers.ClassificationPreviewController ($("#classificationComponents"),{ selectedClassifications: this.options.selectedClassifications });
	},
	"{window} interviewComplete" : function () {
		var completeMessage = "You have completed the interview.",
		completeDialog = $("<div>"+completeMessage+"</div>").dialog (
			{
				title : "Interview Complete",
				modal : true,
				buttons : {
					"OK" : function () {
						$ ( this ).dialog ( "destroy" );
					}
				}
			}
		);
		
	},
	displayNoPromptsMessage : function () {
		var completeMessage = "There are no available prompts assigned to this tree that fulfill the selected classification filters.",
		completeDialog = $("<div>"+completeMessage+"</div>").dialog (
			{
				title : "No Prompts Available",
				modal : true,
				buttons : {
					"OK" : function () {
						$ ( this ).dialog ( "destroy" );
					}
				}
			}
		);
		
	},
	getSelectedClassifications : function  () {
		var selectedValues = {};
		if ( this.isActive() ) {
			var formElement = $("#classificationSelectionsForm",this.element);
			if ( formElement.length ) {
				selectedValues = formElement.formParams().classifications;			
			} else {			
				selectedValues = this.options.selectedClassifications;			
			} 
		} else {
			selectedValues = this.options.selectedClassifications;
		}
		return this.options.selectedClassifications = selectedValues ;
	},
	".classification-components-select change" : function (element,  event) {
		this.options.cursor.setClassifications ( this.getSelectedClassifications() );
		this.resetSelections();
		this.refresh();
	},
	getNextPrompt : function ( selectedResponseOption, classificationsFilterArray ) { 
		console.debug("getNextPrompt() ", arguments );
		return this.options.cursor.next().instance;
	},
	"{window} tabsselect" : function (windowObj, event, selectedPanel ) {
			console.debug (this.Class.shortName +".tabsselect", arguments);
			this.options.selectedTab = selectedPanel;
			if (selectedPanel.panel.id == "previewPanel") //the tab selected was "preview" 
			{	
				this._isActive = true;
				this.resetSelections();
				this.refresh();
			} else if (
				selectedPanel.panel.id == "outlinePanel"
				||
				selectedPanel.panel.id == "builderPanel"
			){
				this._isActive = false;
			}
	},
	"classificationSelectionPanelIsReady" : function () {
		console.debug ("classificationSelectionPanelIsReady");
		this.setEnvironmentVariables();
		this.refresh();
	}
	
	})
});