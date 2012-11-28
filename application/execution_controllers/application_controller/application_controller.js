$(document).ready(function() {
/**
 * @class Level3_ddpw_execution.Controllers.ApplicationController
 */
$.Controller('Level3_ddpw_execution.Controllers.ApplicationController',
/** @Static */
{
	defaults : {
		 currentTree: null
		,model: Level3_ddpw_administration.Models.PromptTree
		,domain : ""
		,classifications : []
		,selectedClassifications: {
			segment : ["Unknown/Undefined"],
			product : ["Unknown/Undefined"],
			bandwidth : ["Unknown/Undefined"]
		}
		,classificationGroups:[]
		,classificationHierarchy:[]
		,cursor : null
		,readyStatus : []
		,readyStatusCheck : [
			"classificationExecutionViewReady",
			"executionViewIsReady",
			"onGetClassificationsComplete"
		]
		,userInfo : null
		,environmentVarList : new Level3_ddpw_administration.Models.EnvironmentVariables(),
		_sectionCompletedStates : []
	},
	listensTo : ["classificationExecutionViewReady","responseSelected","executionViewIsReady","readyComplete","sectionSelected","markSectionComplete" , "markSectionIncomplete" , "reactivateSection"
	
		//,"debug" //comment to switch on/off debug messages in the execution view
		]
	
},
/** @Prototype */
{ 
	init : function(){
		
		this.setDefaultVariables();
		this.element.html ( 
			$.View ( "./application/execution_controllers/application_controller/views/init.ejs" )
		);
		var $thisController = this;
		
		this.getUserInfo().then(
                  function () {
						$thisController.setEnvSystemVariables();
                        $thisController.getAllExecutionClassifications().then(
                              $thisController.getClassificationsByServiceId().then( 
                                    $thisController.retrieveAndSetTree())
                              )
                  }
            );
		/*
		var debugEvent = $.Event("debug",{message: "Application Start"});
		this.element.trigger (debugEvent);
		*/
		
		//console.debug ("options: " , JSON.stringify( this.options ));
	},
	"debug" : function ( element, event ){
		/************************************************************
		* Usage : 
		var debugEvent = $.Event("debug",{message: "Application Start"});
		this.element.trigger (debugEvent);
		**************************************************************/
		
		
		var debugLog = $("#debugLog").length == 0 ? $("<div id='debugLog' />"):  $("#debugLog");
		debugLog.append ( event.message ).dialog({
			modal:false,
			left: 600,
			width: 400
		});
		
	},
	readyCheck : function ( readyPoint ) {
		/*
		var debugEvent = $.Event("debug",{message: "<br/>readyCheck()"});
		this.element.trigger (debugEvent);
		*/
		if ( $.inArray ( readyPoint , this.options.readyStatus ) == -1 ) {
			this.options.readyStatus.push ( readyPoint );
		}
		var readyTargetCount = this.options.readyStatusCheck.length,
		readyCount = this.options.readyStatus.length,
		isReady = readyTargetCount == readyCount;
		
		if (isReady) {
			var readyEvent = $.Event ( "readyComplete" );
			this.element.trigger (readyEvent);
		} 
	},
	setDefaultVariables : function () {
		this.options.domain = this.getDomain();
		this.options.classifications = this.getClassifications();
	},
	getDomain : function () {
		return  "Ticketing";
	},
	getClassifications : function () {
		return [];
	},
	scrollToElement : function (targetElement) {
		if ( targetElement.position( $("html") ) ) {
			var scrollToPosition = targetElement.position().top*1.5;	
			$("html").animate({scrollTop: scrollToPosition},500,"easeOutExpo");
		} else {
			//first element 
			$("html").animate({scrollTop: 0},500,"easeOutExpo");
		}
	},
	//check the rest service code      
	getClassificationsByServiceId : function () {
	/*
		var debugEvent = $.Event("debug",{message: "<br/>getClassificationsByServiceId"});
		this.element.trigger (debugEvent);
		*/
		var onSuccess = function (data, textStatus, jqXHR) {
				var $applicationExecutionController = $("#ddpw_main").controller();
				var selectedClassifications = $applicationExecutionController.options.selectedClassifications;
				
				$.each ( $applicationExecutionController.options.selectedClassifications , function ( index, value ) {
					$applicationExecutionController.options.selectedClassifications[index] = [];
				});
				
				$("TroubleTicketClassification", data).children().each( function (index, element) {
					var classificationText = element.textContent ? element.textContent : element.text ? element.text :  "Unknown/Undefined" ;
					selectedClassifications[$.String.underscore(element.nodeName)].push( classificationText );
  				});
  				/*
  				var debugEvent = $.Event("debug",{message: "<br />getClassificationsByServiceId.onSuccess()<br/>classificationExecutionViewReady"});
				$applicationExecutionController.element.trigger (debugEvent);
				*/
				$applicationExecutionController.element.trigger( "classificationExecutionViewReady" );
  		};
  			
		return Level3_ddpw_administration.Models.Classification.findByServiceId( 
				{
					domain : parameters.domain,
					serviceId : parameters.serviceId 
				}, 
			onSuccess );
			
	},	
	//check the rest service code 
	getAllExecutionClassifications : function () {	
		/*
		var debugEvent = $.Event("debug",{message: "<br/>getAllExecutionClassifications"});
		this.element.trigger (debugEvent);
		*/
		return Level3_ddpw_administration.Models.Classification.findAll( {domain : parameters.domain }, this.onGetClassificationsComplete );
	},	
	onGetClassificationsComplete : function(data, textStatus, jqXHR){
		/*
		var debugEvent = $.Event("debug",{message: "<br/>onGetClassificationsComplete"});
		//console.debug ("onGetClassificationsComplete " , arguments);
		$applicationExecutionController.element.trigger (debugEvent);
   		*/
   		var $applicationExecutionController = $("#ddpw_main").controller();
  		$applicationExecutionController.options.classificationHierarchy = Level3_ddpw_administration.Models.Classification.getClassificationHierarchy();
  		$applicationExecutionController.options.classificationGroups = Level3_ddpw_administration.Models.Classification.getClassificationGroupNames();
  		$applicationExecutionController.readyCheck ( "onGetClassificationsComplete" );

  	}, 	
	retrieveAndSetTree : function ( ) {
		return this.options.model.findActive({domain:parameters.domain}).then (		
			function ( data ) {
				var $applicationExecutionController = $("#ddpw_main").controller();
				
				var	rawTreeData = 	data.level3Response.PromptTree[0];
				var unescapedJSON = unescape( rawTreeData.XMLDocument.replace(/\+/g, " ") );
				var treeDataObj = eval("(promptTreeObj=" + unescapedJSON + ")");
				if (String(rawTreeData.PromptTreeID) != String (treeDataObj.id))
		    		{
		    			treeDataObj.id = rawTreeData.PromptTreeID;
		    		}
		    		if((effStringDate = treeDataObj.effectiveDate) != null) {
			    		treeDataObj.effectiveDate = new Date(effStringDate);
		    		}
		    		if((expStringDate = treeDataObj.expirationDate) != null) {
			    		treeDataObj.expirationDate = new Date(expStringDate);			    		
		    		}
				$applicationExecutionController.options.currentTree = new Level3_ddpw_administration.Models.PromptTree ( treeDataObj ); 
				$applicationExecutionController.element.trigger( "executionViewIsReady" );                 
			}
		);
		
	},
	"classificationExecutionViewReady" : function ( element, event ) {
		this.readyCheck ( event.type );
	},
	"executionViewIsReady" : function ( element, event ) {
		
		this.resetSelections ( );
		this.readyCheck ( event.type );
		
	},
	"readyComplete" : function  ( element, event ) { 
		/*
		var debugEvent = $.Event("debug",{message: "<br/>readyComplete()"});
		this.element.trigger (debugEvent);
		*/
		this.refresh();
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
	
	//Commented for Sections
	
		/*var prompt = $(event.target).model();
		var $applicationController = this;
		
		prompt.attr("selectedResponse").each ( function ( index, responseOption ) {
			var	selectedResponseCommands = prompt.getSelectedResponseCommands();
			$.each ( selectedResponseCommands,  function ( commandIndex, command ) {
				switch ( command.type ) {
					case "SetEnvironmentVariableCommand":
						var executeNonQueuedCommandEvent = $.Event( "executeNonQueuedCommand" , { command : command, selectedResponse : responseOption });
						$applicationController.element.trigger ( executeNonQueuedCommandEvent );
					break;
					default:
						//do nothing.
					break;
				}
			});
		});
		
		
		
		
		
		this.options.currentTree.clearPromptSelections (  $(event.target).model().identity() );
		//let's consider adding necessary command inline processing here.
		
		
		
		//then let's set prompt defaults from prefillData
		this.refresh()$applicationExecutionController.options.currentTree
		*/
	},
	resetSelections : function(fromId){		
		var paramsObj = {};
		var initialFilters = ["prompts","hasSelections"];
	    var cursor = this.options.cursor = this.options.cursor ? 
			this.options.cursor.setFilters( initialFilters , paramsObj) : 
			this.options.currentTree.createCursor( initialFilters ,paramsObj );
		
		if ( fromId ) {
			cursor.moveTo ( fromId );
		} else {
			cursor.moveTo ("start");
		}
		var startDepth = cursor.getDepth();
		cursor.next();
		
		do {
			var instance = cursor.getInstance();
			if (instance && startDepth < cursor.getDepth() ){//will only reset "dependent" prompts 
				instance.attr ("selectedResponse", null);
			}
		} while ( cursor.next() ); 
	},
	collectAndFilterDisplayablePromptsInSections : function () {
			this.options.applicationExecutionController =  $applicationExecutionController = $("#ddpw_main").controller();
			this.options.commandController = $("#command_controller").controller();


			if (  typeof ($applicationExecutionController) !='undefined' )  {
				var	prompts = [], sections = [], promptSectionCollections = [],
					paramsObj = {
		        		classifications : $applicationExecutionController.options.selectedClassifications,
		        		classificationGroups : $applicationExecutionController.options.classificationGroups,
		        		classificationHierarchy : $applicationExecutionController.options.classificationHierarchy
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
			        		this.options.currentTree.createCursor( sectionFilters ,paramsObj ),
			        sectionCompletedStates = this.options._sectionCompletedStates;
			        		

				this.options.classificationGroups = $applicationExecutionController ? $applicationExecutionController.options.classificationGroupNames : this.options.classificationGroups;
		  		this.options.classificationHierarchy = $applicationExecutionController ? $applicationExecutionController.options.classificationNames : this.options.classificationNames;
				this.options.selectedClassifications= this.options.selectedClassifications;
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
							sectionPrompt = Level3_ddpw_administration.Models.Prompt.model ( {
								type: Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SECTIONCONTAINER,
								prompts: promptSectionCollection,
								_isMarkedComplete : sectionCompletedStates[sectionIndex] ? sectionCompletedStates[sectionIndex] : false
						});
						sections.push ( sectionPrompt );
					}
				});
			} else {
				//this.resetView();
			}
		return sections;
	},
	refresh : function() {
	
		
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
					renderedView = $.View("./application/execution_controllers/application_controller/views/execution_view_prompt_list_container.ejs",
						{
							selectedClassifications: this.options.selectedClassifications, 
							prompts:sectionedPrompts,
							treeName : this.options.currentTree.name
						}
					);
				$applicationExecutionController.element.html(renderedView);
//				$("#previewPanelListContainer", this.element).html(renderedView);
				
				if ( allSectionsComplete ) {
					this.displayCompleteMessage();
					var completeEvent = $.Event("interviewComplete", { tree : this.options.currentTree } ) ;
					$("body").trigger ( completeEvent );
				} else {
					$applicationExecutionController.scrollToElement ( $("li", this.element).filter(":last") );		
					//this.scrollContainerToElement ( "#previewPanelListContainer", $(".section_container", this.element).filter(":last") );				
					/*$(".reset-preview-panel").button({
						label : "Reset"
					});*/
				}
		
	
	},
	refresh_backupWOSections : function () {
			///we need to process environment variable commands encountered so far here.
			var $applicationExecutionController = $("#ddpw_main").controller();
			var interviewCompleteFlag = false;
			/*
			var debugEvent = $.Event("debug",{message: "<br/>refresh()"});
			$applicationExecutionController.element.trigger (debugEvent);
			*/
			if (  typeof ($applicationExecutionController) !='undefined' )  {
				var	prompts = [],
					paramsObj = {
			        		classifications : $applicationExecutionController.options.selectedClassifications,
			        		classificationGroups : $applicationExecutionController.options.classificationGroups,
			        		classificationHierarchy : $applicationExecutionController.options.classificationHierarchy
			        	},
					initialFilters = ["prompts","hasSelections","classifications"],
			          cursor = $applicationExecutionController.options.cursor = $applicationExecutionController.options.cursor ? 
			        	  $applicationExecutionController.options.cursor.setFilters( initialFilters , paramsObj) : 
			         	$applicationExecutionController.options.currentTree.createCursor( initialFilters ,paramsObj ),
					instance = cursor.getInstance();
					cursor.moveTo ("start");
				//get all prompts that have selections made
				do {
					//console.debug ( "INSTANCE:", this.options.cursor.instance );
					try {
						instance = cursor.getInstance();
						if (instance) {
							//console.debug ("adding " + instance.text + " to display list");
							prompts.push ( instance );
						}
					} catch (e) {
						//console.warn ("ERROR!!!!", e); 
					}
				} while ( cursor.next() );
				
				
				//then get the next unselected
				var nextItemFilters = ["prompts","classifications","isReadyForDisplay"];
				
				if (prompts.length > 0) {
					cursor.moveTo ( prompts[prompts.length-1].identity() );
				} else {
					cursor.moveTo ("start");
				}
				
				cursor.setFilters ( nextItemFilters , paramsObj ).next();
				instance = cursor.getInstance();
				
				if ( instance ) {
					
					var envValue;
					if ( instance.hasSelectedResponse() == false) {
						$.each ( instance.prefillData , function ( index, prefill ) {					
								if (prefill.prefillType == "Custom"){
				                     envValue = prefill.prefillValue;
				                     var tempResponseOptions = instance.attr("selectedResponse").serialize(); 
				                     //should return a default value because we should have already determined that there are no
				                     //user selections (  instance.hasSelectedResponse() == false )
				                     tempResponseOptions[0].value = envValue;
				                     instance.attr ("defaultResponse" , Level3_ddpw_administration.Models.ResponseOption.models ( tempResponseOptions ).setAllSelected( true ) );
				                    
			                     }
			                    else if($applicationExecutionController.options.environmentVarList.get(prefill.prefillType) != null){
									 envValue = $applicationExecutionController.options.environmentVarList.get(prefill.prefillType);//prefill.prefillValue;
									 instance.responseOptions[0].value = envValue;
				         			instance.defaultResponse[0].value =  instance.responseOptions[0].value;
	                     
									}
								else {
							//complete this for using responseOptions - when response option values have been set by admin (checkbox, radio, simpledialo
	                       var valuesArray = instance.prefillData.map ( function ( prefillDataObj, index ) {
	                                          //this logic should return actual prefill (default) value
	                                          return prefillDataObj.prefillType;
	                                    });
	                                    
	                       var newResponseOptions = instance.responseOptions.grep ( function ( responseOption, index ) {
	                                          return $.inArray ( responseOption.label , valuesArray ) >= 0
	                                    });
	                                    
	                       //use this in all cases
	                       instance.attr ("defaultResponse" , newResponseOptions.setAllSelected( true ) ); //newResponseOptions should be a list 
	                      
								}
								});
						   
	                              prompts.push ( instance );				
					} else {
						interviewCompleteFlag = true;
						//we've hit the end!
						
						//alert ( "END");			
					}
				}
					
				var renderedView = $.View("./application/execution_controllers/application_controller/views/execution_container.ejs",
					{
						selectedClassifications: $applicationExecutionController.options.selectedClassifications, 
						prompts:prompts,
						treeName : $applicationExecutionController.options.currentTree.name,
						tree : $applicationExecutionController.options.currentTree
					}
				);
								
				$applicationExecutionController.element.html(renderedView);
				
				if ( instance ) {
					var debugEvent = $.Event("debug",{message: "$applicationExecutionController.scrollToElement ( " + instance.identity() +") );"});
					$applicationExecutionController.element.trigger (debugEvent);
					$applicationExecutionController.scrollToElement ( instance.elements( $applicationExecutionController.element ) );
				} else {
					$applicationExecutionController.scrollToElement ( $("li", this.element).filter(":last") );				
				}
				
				if ( interviewCompleteFlag ) {	
					$applicationExecutionController.displayCompleteMessage();
					var completeEvent = $.Event("interviewComplete", { tree : cursor.tree } ) ;
					$("body").trigger ( completeEvent );				
				}
				
			} 
	},
	displayCompleteMessage : function () {
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
	setResponseSelected : function ( value ) {
		/*console.debug (this.Class.shortName + ".setResponseSelected()");
		this.options.itemModel.attr( "selectedResponse", this.getUiResponse( value ) );*/
	},
	getUiResponse : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.promptModelGetUiSelectionsFunction,
	getUserInfo : function (){
		return Level3_ddpw_administration.Models.UserInformation.getUserInfo(this.onUserInformationComplete)
	},
	onUserInformationComplete : function(obj, textStatus, jqXHR){
				var userInfo= {};
				    // fill the data model for feedback form
 					userInfo.portalUserName = obj.lastName+" "+obj.firstName;					
					// fill data model for incorrect data form
					userInfo.portalUserEmail = obj.email;
					userInfo.portalUserPhone  = obj.phone;			
					Level3_ddpw_administration.Models.UserInformation.userInfo		 = userInfo ; 		
					var $applicationExecutionController = $("#ddpw_main").controller();
		  		$applicationExecutionController.options.userInfo = Level3_ddpw_administration.Models.UserInformation.userInfo;  			
  	},
  	setEnvSystemVariables : function () {
		$applicationController	=	$("#ddpw_main").controller();
		 if ( typeof ( parameters ) != 'undefined' ) {			
			this.options.environmentVarList.accountId = this.options.environmentVarList.accountId ? this.options.environmentVarList.accountId : parameters.accountId;
			this.options.environmentVarList.serviceId = this.options.environmentVarList.serviceId ? this.options.environmentVarList.serviceId:  parameters.serviceId;			
			this.options.environmentVarList.domain = this.options.environmentVarList.domain? this.options.environmentVarList.domain : parameters.domain;			
			this.options.environmentVarList.product = this.options.environmentVarList.product ? this.options.environmentVarList.product : $applicationController.options.selectedClassifications.product[0];			
			this.options.environmentVarList.segment = this.options.environmentVarList.segment ? this.options.environmentVarList.segment : $applicationController.options.selectedClassifications.segment[0];		
			this.options.environmentVarList.bandwidth = this.options.environmentVarList.bandwidth ? this.options.environmentVarList.bandwidth : $applicationController.options.selectedClassifications.bandwidth[0];						
			this.options.environmentVarList.portalUserName = this.options.environmentVarList.portalUserName != "" ? this.options.environmentVarList.portalUserName : $applicationController.options.userInfo.portalUserName; 									
			this.options.environmentVarList.portalUserEmail = this.options.environmentVarList.portalUserEmail != "" ? this.options.environmentVarList.portalUserEmail : $applicationController.options.userInfo.portalUserEmail;						
			this.options.environmentVarList.portalUserPhone =  this.options.environmentVarList.portalUserPhone != "" ? this.options.environmentVarList.portalUserPhone : $applicationController.options.userInfo.portalUserPhone;			
					
		}		
	},
	"{window} sectionSelected" : function ( element, event ) {
		//console.debug ( "sectionSelected" );
		//reset from first responseOption with children of the first prompt found with them 
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
			//this.options._sectionCompletedStates[sectionController.getSectionIndex()] = true;

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
		}*/
		this.refresh();
	},		
	resetSelections : function ( fromId ) {
		var paramsObj = {};
		var initialFilters = ["prompts","hasSelections"];
	    var cursor = this.options.cursor = this.options.cursor ? 
			this.options.cursor.setFilters( initialFilters , paramsObj) : 
			this.options.currentTree.createCursor( initialFilters ,paramsObj );
		
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
	scrollContainerToElement : function ( container, target ) {
		if ( $(target).position(container) ) {
			var scrollToPosition = ($(target).position(container).top);
			$(container).animate({scrollTop: scrollToPosition},500,"easeOutExpo");
		} else {
			//first element 
			$(container).animate({scrollTop: 0},500,"easeOutExpo");
		}
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
	getNextPrompt : function ( selectedResponseOption, classificationsFilterArray ) { 
		console.debug("getNextPrompt() ", arguments );
		return this.options.cursor.next().instance;
	},
	"markSectionComplete" : function ( element , event ) {
		this.options._sectionCompletedStates [ $(event.target).closest("li.prompt").index() ] = true;
	},
	"markSectionIncomplete" : function ( element , event ) {
		this.options._sectionCompletedStates [ $(event.target).closest("li.prompt").index() ] = false;	
	},	
	
}
	);
});