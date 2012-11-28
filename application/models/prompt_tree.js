$(document).ready(function() {

	if(!Object.keys) Object.keys = function(o){
		if (o !== Object(o))
		throw new TypeError('Object.keys called on non-object');
		var ret=[],p;
		for(p in o) if(Object.prototype.hasOwnProperty.call(o,p)) ret.push(p);
		return ret;
	}

/**
 * @class Level3_ddpw_administration.Models.PromptTree
 * @inherits jQuery.Model
 * Wraps backend prompt_tree services. Provides cursor functionality.  Manages node movement and crud internally 
 */
$.Model('Level3_ddpw_administration.Models.PromptTree',
/* @Static */
{

	/*
	findAll: "/prompt_trees.json",
	*/	
	findAll: function(params, success, error){ // {domain : "Billing or Ticketing"}
		
		//var domainName = params.domain;
	    return $.ajax ({
  			type: "GET",
  			url: Level3_ddpw_administration.Controllers.ApplicationController.ROOT_PROMPT_TREE_DATA_SERVICE_PATH +"/tqs" ,
  			//dataType: "json Level3_ddpw_administration.PromptTree.models",
			converters : {
				"json promptTreeModels" : Level3_ddpw_administration.Models.PromptTree.models
			},
  			dataType: "json promptTreeModels",
  			success: success,
  			error : error,
  			data : params
  		});
	},
	 models : function(data){ 
		//necessary because the data call doesn't return in the way JSMVC likes.
	    var trees = new Level3_ddpw_administration.Models.PromptTree.List();
	    var failedObjects = [];
	    
    	//process tq service response
	    if ( typeof ( data.tq_steps ) != 'undefined' ) {
	    	$.each ( data.tq_steps , function ( index, rawTqData ) {
	    		//convert responses into usable trees
	    		var realizedPromptTree = Level3_ddpw_administration.Models.PromptTreeAdapter.convertToPromptTree ( rawTqData ) ;
	    		trees.push ( realizedPromptTree );
	    	});
	    }
	    
	    /**** 
	     * This was used for ticketing service responses
	     * Removed 11/20/2012 -CCW 
	     * 
	     * 
    	if ( typeof ( data.level3Response ) != 'undefined' ) { //live server data from ticketing proxy service
	    	var promptTreeCount = data.level3Response.PromptTreeList[0].PromptTree.length;
	    	
	    	$.each ( data.level3Response.PromptTreeList[0].PromptTree , function ( index, rawTreeData ) {
		    	try {
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
		    		
		  			if(treeDataObj.isAlwaysEffective == true) {		    			
		    			treeDataObj.alwaysEffective = "checked";
		    		} else {
		    			treeDataObj.alwaysEffective = "";
		    		}
		    		var realizedPromptTree = new Level3_ddpw_administration.Models.PromptTree ( treeDataObj ) ;
		    		trees.push ( realizedPromptTree );
			    } catch (e){
			    	console.debug ("Data fail in prompt_tree.js models(): " , e );
			    	if ( typeof (e) != 'undefined') {
			    	console.debug ( e.stack , e.message );
			    	//failedObjects.push ( rawTreeData );
			    	failedObjects.push ( {message: e.message, data: rawTreeData} );
			    	} else {
			    	
			    	alert ("an unknown error has occured in prompt_tree models(): " );
			    	}
			    	
			    }
		    });
		}
		
		if (typeof ( data.data ) != 'undefined') {//dummy data from ticketing fixtures 
		   	$.each ( data.data , function ( index, promptTreeObj ) {
		    	try {
		    		//console.debug ( "promptTreeObj: " , promptTreeObj );
		    		var newItem = trees[ (trees.push ( Level3_ddpw_administration.Models.PromptTree.model ( promptTreeObj ) ))-1 ];
		    		//console.debug ( "newItem: " , newItem );
			    } catch (e){
			    	//console.debug ("Data fail in prompt_tree.js models(): " + e.message );
			    	failedObjects.push ( {message: e.message, stack: e.stack, data: promptTreeObj} );
			    }
		    });
		}
		
		if (failedObjects.length > 0) {
	    	var $failedDialog = $("<div></div>");	    	
	    	$failedDialog.html (
	    		failedObjects.length + " Prompt Trees appear to be corrupted.  " + trees.length + " of " + promptTreeCount + " were successfully loaded."
	    	);
	    	$failedDialog.dialog ({
	    		title : "Some objects failed to be loaded...", 
	    		modal: true,
	    		buttons : {
					"OK" : function() {
						$( this ).dialog( "close" );
					},
					"See Data" : function() {
						//console.debug ("See Data -> failedObjects: " , failedObjects );
						var rawData = $("<textarea cols='120' rows='30'/>").html(JSON.stringify(failedObjects));
						var parsedData = [];
						$.each ( failedObjects , function ( index, rawTreeData ) {
					    	try {
						    	var unescapedJSON = unescape( rawTreeData.data.XMLDocument.replace(/\+/g, " ") );
						    	parsedData.push (eval("(promptTreeObj=" + unescapedJSON + ")"));
						    } catch (e){
						    	parsedData.push ("ERROR reading index : (" + index +")");
						    }
					    });
					    var parsedDataHTML = $("<div>" + JSON.stringify(failedObjects) + "</div><textarea cols='120' rows='30'/>").html ( JSON.stringify(parsedData) ).append ();
					    
						$( "<div></div>" ).html( rawData ).append( parsedDataHTML ).dialog ( {
							title:"Failed Tree Data",
							height : "450",
							width : "100%",
							buttons : {
								"OK" : function() {
									$( this ).dialog( "close" );
								}
							}
						} ) ;
					}
				}
	    	});
	    }
     */
	    
		trees.bind("remove", function(ev, removed){
			console.debug ("List Bind Remove" );
			var activeTrees = this.getActiveTrees();
		});
		trees.bind("add", function(ev, added){
			console.debug ("List Bind Add" );
			var activeTrees = this.getActiveTrees();
		});
		trees.bind("update", function(ev, added){
			console.debug ("List Bind Update" );
			var activeTrees = this.getActiveTrees();
		});
	    return trees;
	 },
  	findOne : function(params, success, error){
	  	return $.ajax ({
  			type: "GET",
  			url: Level3_ddpw_administration.Controllers.ApplicationController.ROOT_PROMPT_TREE_DATA_SERVICE_PATH +"/tqs/"+params.id,
  			dataType: "json",
  			success: success,
  			error : error
  		});
	},
	findActive : function(params, success, error){  	
	  	var domainName =  params.domain;
  		var $applicationAdminController = typeof  ( $("#main").controller() ) == 'undefined' ? $("#ddpw_main").controller() :  $("#main").controller();
	  	var url2 = domainName+"?callingApp=TICKETING_PORTAL&userName="+$applicationAdminController.options.userInfo.portalUserName
	  	
	    return $.ajax ({
  			type: "GET",
  			url: Level3_ddpw_administration.Controllers.ApplicationController.ROOT_PROMPT_TREE_DATA_SERVICE_PATH + "/tqs",  	  			
  			dataType: "json",		  			
  			success: success,
  			error : error
  		});
	  },
    create : function(attrs, success, error){
    	var tree =  Level3_ddpw_administration.Models.PromptTree.model ( attrs );
    	var treeAdapter = Level3_ddpw_administration.Models.PromptTreeAdapter.convertFromPromptTree ( tree );
    	
    	return $.ajax ({
  			type: "POST",
  			url: Level3_ddpw_administration.Controllers.ApplicationController.ROOT_PROMPT_TREE_DATA_SERVICE_PATH +"/tqs",
  			//data: JSON.stringify(attrs),
  			data: treeAdapter.serialize(),
  			dataType: "json",
  			success: success,
  			error : error
  		});
  	},
 	update : function(id, attrs, success, error){
  		console.debug ("update: ", arguments, "Data String Length: " + JSON.stringify(attrs).length);
  		var tree =  Level3_ddpw_administration.Models.PromptTree.model ( attrs );
    	var treeAdapter = Level3_ddpw_administration.Models.PromptTreeAdapter.convertFromPromptTree ( tree );
    	
  		var doAjaxCall = function ( contentType, domainName ) {
  		    var $applicationAdminController = $("#main").controller();
		  	var ajaxParamsObj = {
		  			type: "POST",
		  			url: Level3_ddpw_administration.Controllers.ApplicationController.ROOT_PROMPT_TREE_DATA_SERVICE_PATH+"/tq_service/update/"+id,
		  			data: treeAdapter.serialize(),
		  			dataType: "json",
		  			contentType : contentType,
		  			success : success
		  	}
			 $.ajax (ajaxParamsObj);
	  	}
	  	var domainName = $.cookie("domain");
	  	doAjaxCall( "application/x-www-form-urlencoded", domainName );
  	},
  	destroy : function(id, success, error){
  		$.ajax ({
  			type: "POST",
  			url: Level3_ddpw_administration.Controllers.ApplicationController.ROOT_PROMPT_TREE_DATA_SERVICE_PATH +"/tq_service/delete/"+id,
  			dataType: "json",
  			contentType : "application/x-www-form-urlencoded",
  			success: success,
  			error : error
  		});
  	},
  	getGuid: function () {
	    var S4 = function() {
	        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	     };
	     return this.uid ? this.uid : (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	 },
	movePrompt : function ( tree, prompt, direction ) {
	
		//console.debug ("movePrompt", arguments);
	
		var findParentNode = Level3_ddpw_administration.Models.PromptTree.findParentNode;
		var findLeaf = Level3_ddpw_administration.Models.PromptTree.findLeaf;
		var promptIdentity = prompt.identity();
		var promptMoveFromInfo = findParentNode ( tree, promptIdentity );
		var previousPrompt = promptMoveFromInfo.parent.prompts[ promptMoveFromInfo.childIndex-1 ];
		var promptMoveToInfo = null;
		
		//console.debug ("promptMoveFromInfo " , promptMoveFromInfo );
		
		switch ( promptMoveFromInfo.parent.Class.shortName ) {
			case "ResponseOption":
				var promptOfResponseOptionInfo = findParentNode ( tree ,promptMoveFromInfo.parent.identity() );
				var promptOfResponseOption = promptOfResponseOptionInfo.parent;
			break;
			case "PromptTree":
			break;
			case "Prompt":
			break;
			break;
		}
		
		switch ( direction ) {
			case Level3_ddpw_administration.Models.PromptTree.MOVE_PROMPT_OUT:
				switch ( promptMoveFromInfo.parent.Class.shortName ) {
					case "ResponseOption":
						promptMoveToInfo = findParentNode ( tree, promptOfResponseOption.identity() );
					break;
					case "Prompt":
						promptMoveToInfo = findParentNode ( tree, promptMoveFromInfo.parent.identity() );
					break;
				}
				promptMoveToInfo.childIndex += 1;
			break;
			case Level3_ddpw_administration.Models.PromptTree.MOVE_PROMPT_IN:
				if (promptMoveFromInfo.childIndex > 0) {
					//moves to previous prompt's last response option's child prompt array's last position
					var targetParent = findLeaf ( previousPrompt, 1 );//should be a responseOption
					promptMoveToInfo = { 
						parent : targetParent ,
						childIndex : targetParent.prompts.length
					};
				}
			break;
			case Level3_ddpw_administration.Models.PromptTree.MOVE_PROMPT_UP:
				if (promptMoveFromInfo.childIndex == 0 
					&& promptMoveFromInfo.parent.Class.shortName == 'ResponseOption'
					&& promptOfResponseOptionInfo.childIndex > 0
					) {
					//bump up to last of previous response option prompts
					var targetParent = promptOfResponseOptionInfo.parent.responseOptions [ promptOfResponseOptionInfo.childIndex-1 ];
					promptMoveToInfo = { 
						parent : targetParent ,
						childIndex : targetParent.prompts.length
					};
				}
				if (promptMoveFromInfo.childIndex > 0) {
					//bump up within response Option
					var targetParent = promptMoveFromInfo.parent ;//should be a responseOption
					promptMoveToInfo = { 
						parent : targetParent ,
						childIndex : promptMoveFromInfo.childIndex - 1
					};
				}
				if (promptMoveFromInfo.parent.Class.shortName == 'PromptTree'
					&& promptMoveFromInfo.childIndex > 0
					) {
					//bump up to last of previous response option prompts
					promptMoveToInfo = { 	
						parent : promptMoveFromInfo.parent ,
						childIndex : promptMoveFromInfo.childIndex - 1
					};
				}
			break;
			case Level3_ddpw_administration.Models.PromptTree.MOVE_PROMPT_DOWN:
				if (promptMoveFromInfo.childIndex == promptMoveFromInfo.parent.prompts.length  - 1 
					&& promptMoveFromInfo.parent.Class.shortName == 'ResponseOption'
					) {
					//bump down to first of next response option prompts
					var targetParent = promptOfResponseOptionInfo.parent.responseOptions [ promptOfResponseOptionInfo.childIndex + 1 ];
					promptMoveToInfo = { 
						parent : targetParent ,
						childIndex : 0
					};
				}
				if (promptMoveFromInfo.childIndex < promptMoveFromInfo.parent.prompts.length  - 1) {
					//bump up within response Option
					var targetParent = promptMoveFromInfo.parent ;//should be a responseOption
					promptMoveToInfo = { 
						parent : targetParent ,
						childIndex : promptMoveFromInfo.childIndex + 1
					};
				}
			break;
			case Level3_ddpw_administration.Models.PromptTree.DELETE_PROMPT:
				promptMoveFromInfo.parent.deletePrompt ( promptMoveFromInfo.childIndex );  
			break;
		};
		
		if ( promptMoveToInfo != null && typeof (promptMoveToInfo.parent) != 'undefined' ) {
			promptMoveToInfo.parent.prompts.splice ( promptMoveToInfo.childIndex , 0, promptMoveFromInfo.parent.prompts.splice ( promptMoveFromInfo.childIndex , 1 )[0] );
			tree.attr ( "prompts" , tree.prompts );
		}
	},
	findParentNode : function ( tree , targetId ) {
		//console.debug ("Looking in '" + tree.Class.shortName +"' for the parent of : " +targetId);
		//var depth = 0;
		
		var returnObj = tree.identity() != targetId  ? {parent:null, childIndex:-1} : {parent:tree, childIndex:0}, child;
		
		var nodeIterator = function ( node ) {
			node.getChildren().each ( function ( index , child ) {
				if ( returnObj.parent != null ) {
					return false 
				};
				var isTarget = child.identity() == targetId
				if ( isTarget ) {
					returnObj.parent = node
					returnObj.childIndex = index
					return false;
				} else {
					nodeIterator ( child )
				}
			});
		};
		
		nodeIterator ( tree );
		
		//console.debug ("CHILD:" + targetId +": \n PARENT:" , returnObj.parent );
		
		/*
		var returnObj = tree.identity() != targetId  ? {parent:null, childIndex:-1} : {parent:tree, childIndex:0},
			grepTreeNodeObj = function ( obj ) {
				
				if ( returnObj.parent == null ) {
					
					depth ++;
					var childrenType = '';
					switch (obj.Class.shortName) {
						case "PromptTree":
						case "ResponseOption":
							childrenType = 'prompts';
						break;
						case "Prompt":
							//should be in the order you want to hunt!!!!
							//childrenTypes = ['selectedResponse','defaultResponse','responseOptions'];
							
							if ( obj.hasSelectedResponse() ) {
								console.debug ("Prompt.hasSelectedResponse: " + obj.text +": "+ obj.hasSelectedResponse() );
								childrenType = 'selectedResponse';
							} else if ( obj.hasDefaultResponse() ) {
								childrenType = 'defaultResponse';
							} else if ( obj.hasResponseOptions() ) {
								childrenType = 'responseOptions';
							}
							
						break;
					}
					
				console.debug ("LOOKING IN " + obj.Class.shortName + "'s " + childrenType +'');
					obj.attr(childrenType).grep ( function ( child, index ) {
						var isTarget = child.identity() == targetId
							depth = depth <= 0 ? 0 : depth;
							stringOut = (Array(depth*3+1).join("-"));
							console.debug ( stringOut + ":::" + obj.id + ':' + child.id);
						if ( isTarget ) {
							returnObj.parent = obj
							returnObj.childIndex = index
							//console.debug ("match("+childrenType+"): " , child, returnObj.parent );
							console.debug ( '*********************FOUND*************************');
							console.debug ( stringOut +'< coming back up!!!! -<');
							depth --;
							return false;
						} else {
							grepTreeNodeObj ( child )
						}
						
						depth --;
						
					});
					
				}	
				return returnObj;
			};
			
		returnObj = returnObj.parent == null ? grepTreeNodeObj ( tree ) : returnObj;
		console.debug ("CHILD:" + targetId +": \n PARENT:" , returnObj.parent );
		return returnObj
			
			/*
			cursor = tree.createCursor();
			nodeCollectionByDepth = cursor.getFilteredCollectionByDepth();
			*/
		
		/*
		var returnObj = returnObj ? returnObj : {};
		var isFound = isFound ? isFound : false;
		var isTheTarget = function ( obj ) { return obj.identity() == targetId; };
		var targetParent = {};
		var markerContainer = [];
		
		var stepIn = function ( intoObj ) {
			//console.debug ("stepIn");
			markerContainer.push (startObj);
			startObj = intoObj;
		}
		var stepOut = function () {
			//console.debug ("stepOut");
			return  startObj = markerContainer.pop ();
		}
		var checkFound = function ( target , index ) {
			if ( isTheTarget(target) && !isFound) {
				setTargetParentFound ( startObj, index );
			}
		}
		
		var setTargetParentFound = function ( parentObj , childIndex ) { 
				targetParent.parent = parentObj;
				targetParent.childIndex = childIndex;
				//console.debug ("*************************Found*********************" , targetParent );
				isFound= true; 
		}
		
		var responseOptionsIterator = function (responseIndex, responseModel) {
			//console.debug ("responseOptionsIterator : " + responseModel.Class.shortName + ": "+ responseIndex );
			checkFound ( responseModel , responseIndex );
			if (  responseModel.hasPrompts() && !isFound) {
				stepIn ( responseModel );
				responseModel.prompts.each ( promptsIterator );
				if (!isFound) {
					stepOut();
				}
			}
			//stop iterations by returning false
			return !isFound;
		}
		var promptsIterator = function ( promptIndex , promptContainerModel ) {
			//console.debug ("promptsIterator : " + promptContainerModel.Class.shortName + ": "+ promptIndex );
			checkFound ( promptContainerModel , promptIndex );
			if ( promptContainerModel.hasResponseOptions() && !isFound ) {
				stepIn ( promptContainerModel );
				promptContainerModel.responseOptions.each ( responseOptionsIterator );
				if (!isFound) {
					stepOut();
				}
			}
			//stop iterations by returning false
			return !isFound;
		}
		if ( isTheTarget( startObj ) && !isFound) {
			if ( startObj.Class.shortName == "PromptTree" ) {
				promptIndex = 0;
			}
			var targetObj = startObj.prompts.get(targetId); 
			setTargetParentFound ( startObj,  promptIndex);
		}
		if ( !isFound && startObj.hasPrompts() ) {
			startObj.prompts.each ( promptsIterator  );
		}
		if ( typeof (targetParent.childIndex) != 'undefined'
				&& targetParent.childIndex >= 0
				&& targetParent != returnObj) {
			returnObj = targetParent;		
		}
		*/
		
		return returnObj;
	},
	findLeaf : function ( startObj, depthLimit ) {
		var currentObj = startObj;
		if ( depthLimit == null ) {
			depthLimit = 0;
		}
		var depthCounter = 0;
		var hasBranches = function ( modelObj ) {
			if ( typeof ( modelObj.hasPrompts ) == 'undefined' ) {
				alert ("FAIL IN MODEL OBJ - missing hasPrompts function!");
			}
		
			return modelObj.hasPrompts() || modelObj.hasResponseOptions();
		} 
		while ( hasBranches ( currentObj ) && (depthLimit ? depthCounter < depthLimit : true) )
		  {
		  	switch ( currentObj.Class.shortName ) {
		  		case "ResponseOption" :
		  		case "PromptTree" :
					currentObj =  currentObj.prompts[currentObj.prompts.length-1];///this is undefined - the has checks need counts
					if ( typeof ( currentObj.hasPrompts ) == 'undefined' ) {
						console.warn ("FAIL IN MODEL OBJ - missing hasPrompts function!");
					}
		  		break;
		  		case "Prompt" :
					currentObj =  currentObj.responseOptions[currentObj.responseOptions.length-1];		  		
					depthCounter ++;
		  		break;
		  	}
		  }
		//console.debug ("lastLeaf ? : " , currentObj);
		
		return currentObj;
	},
	getChildren : function ( target ) {
		var children = null;
		switch (target.Class.shortName) {
			case "PromptTree":
			case "ResponseOption":
				children = target.attr ("prompts");
			break;
			case "Prompt":
				children = target.attr('responseOptions');
			break;
		}
		return children;
	},
	MOVE_PROMPT_OUT: "movePromptOut",
	MOVE_PROMPT_IN: "movePromptIn",
	MOVE_PROMPT_UP: "movePromptUp",
	MOVE_PROMPT_DOWN: "movePromptDown",
	DELETE_PROMPT: "deletePrompt",
	attributes : {
		  prompts : "Level3_ddpw_administration.Models.Prompt.models"
		  //prompts : "promptModels"
		  ,id : 'string'
		  ,uid : 'string'
		  ,name : 'string'
		  ,description : 'string'
		  ,domain : 'string'
		  ,createdDate : 'date'
		  ,modifiedDate: 'date'
		  ,modifiedBy: 'string'
		  ,isAlwaysEffective: 'boolean'
		  ,effectiveDate: 'date'
		  ,expirationDate: 'date'
		  ,promptMetaData : 'object'
		  ,callingApp : 'string'
		  ,userName : 'string'
		  
	},
	convert : {
	    date : function(raw){
	    	if ( new Date (raw) instanceof Date ) {
	    		return new Date( raw );
	    	} else if(typeof raw == 'string'){
	        var matches = raw.match(/(\d+)\/(\d+)\/(\d+)/)
	        return matches ? new Date( matches[3],(+matches[1])-1,matches[2] ) : null;
	      }else if(raw instanceof Date){
	          return raw;
	      }
	    }
	  },
	listensTo : ["moveItem"]
	
},
/* @Prototype */
{	
	init : function () {
		this.id = typeof ( this.id ) != 'undefined' && this.id != null ? this.id : Level3_ddpw_administration.Models.PromptTree.getGuid();
		this.prompts.length ? null : this.prompts = Level3_ddpw_administration.Models.Prompt.models([]);
		var $applicationAdminController = typeof  ( $("#main").controller() ) == 'undefined' ? $("#ddpw_main").controller() :  $("#main").controller();
		this.userName = $applicationAdminController.options.userInfo.portalUserName;
	},
	id : null,
	uid: null,
	isActive: false,
	name: "Prompt Tree Name",
	description : "Prompt Tree Description",
	domain : "com.level3.service_management.create",
	createdDate : new Date(),
	modifiedDate : new Date(),
	modifiedBy : "development user",
	isAlwaysEffective: false,
	effectiveDate : new Date(),
	expirationDate : null,
	callingApp : "TICKETING_REST",
	userName : "",
	prompts : [],
	classifications : [],
	hasResponseOptions : function ( ) {
				return typeof ( this.responseOptions ) != 'undefined' 
				&& typeof ( this.responseOptions.each ) == 'function'
				&& this.responseOptions.length;
	},
	hasPrompts : function (  ) { 
			return typeof ( this.prompts ) != 'undefined' 
			&& typeof ( this.prompts.each ) == 'function' 
			&& this.prompts.length;
	},
	hasChildren : function (  ) {
		return ( this.hasResponseOptions() || this.hasPrompts() );
	},
	addPrompt : function ( promptInitParams, promptIndex, responseOptionIndex ) { //this function is replicated for Prompts and ResponseOption entities using the prototype method.
		var newPrompt = new Level3_ddpw_administration.Models.Prompt ( promptInitParams );
		//console.debug ("newPrompt - id: " + newPrompt.id);
		switch (this.Class.shortName) {
			case "PromptTree":
				if ( promptIndex != null && promptIndex >= 0) {
					this.prompts.splice ( promptIndex, 0, newPrompt);
				} else {
					this.prompts.push(newPrompt);
				}
			break;
			case "Prompt":
				if ( promptIndex != null && promptIndex >= 0 && responseOptionIndex && responseOptionIndex >= 0 ) {
					this.responseOptions[responseOptionIndex].prompts.splice ( promptIndex, 0, newPrompt);
				} else if ( promptIndex && promptIndex >= 0) {
					this.responseOptions[0].prompts[promptIndex].splice ( promptIndex, 0, newPrompt);
				} else {
					this.responseOptions[0].prompts.push(newPrompt);
				}
				this.attr ( "responseOptions" , this.responseOptions );
				//console.debug ("attr responseOptions: ", this);
			break;
			
			case "ResponseOption":
				if ( promptIndex && promptIndex >= 0 ) {
					this.prompts[promptIndex].splice ( responseOptionIndex, 0, newPrompt);
				} else {
					this.prompts.push ( newPrompt );
				}
			break;
			
		}
		/*
		*/
		this.attr ( "prompts" , this.prompts );
		
		return newPrompt;
	},
	deletePrompt : function ( promptIndex , responseOptionIndex ) {//this function is replicated for Prompts and ResponseOption entities using the prototype method.
		var removedPrompt = {};
	
		switch (this.Class.shortName) {
			case "PromptTree":
				if ( promptIndex >= 0) {
					removedPrompt = this.prompts.splice ( promptIndex, 1 )[0];
				} 
			break;
			case "Prompt":
				if ( promptIndex >= 0 && responseOptionIndex && responseOptionIndex >= 0 ) {
					removedPrompt = this.responseOptions[responseOptionIndex].prompts.splice ( promptIndex, 1 )[0];
				} else if ( promptIndex && promptIndex >= 0) {
					removedPrompt = this.responseOptions[0].prompts[promptIndex].splice ( promptIndex, 1 )[0];
				} 
			break;
			case "ResponseOption":
				if ( promptIndex >= 0) {
					removedPrompt = this.prompts.splice ( promptIndex, 1 )[0];
				}
			break;
		}
		removedPrompt.elements().remove();
		//this.attr ( "prompts" , this.prompts );
		return removedPrompt;
	},
	cloneModel : function () {
		var treeObj = this.serialize();
		var currentObj = treeObj;  
				
	   		
		var treeObjIterator = function ( key, obj ) {
			if ( key == "id" ) {
		    currentObj[key]=null;
			}
			if (  typeof (obj) == "array" || typeof (obj) == "object" ) {
				if(obj != null){
				$.each ( obj , treeObjIterator );
				}
			}
		}
		$.each ( currentObj , treeObjIterator );      
      	//at this point we should have a serialized prompt_tree object that is not a real instance.
      	currentObj.name = currentObj.name + "_copy";
      	//currentObj.alwaysEffective = false;
      	currentObj.isAlwaysEffective = false;
      	//all the references above should modify the treeObj as it drills down
		return currentObj;
	},
	getParent : function () {//not reliable and is broken for children -should be addressed.
		return Level3_ddpw_administration.Models.PromptTree.findParentNode ( this, this.identity() ).parent;
	},
	getIndex : function () {
		return Level3_ddpw_administration.Models.PromptTree.findParentNode ( this, this.identity() ).childIndex;
	},
	getChildren : function () {
		return Level3_ddpw_administration.Models.PromptTree.getChildren (this);		
	},
	getCursor : function () {
		var returnCursor =  this._cursor ? this._cursor : this.createCursor();
		return returnCursor;
	},
	createCursor : function ( filters , params ) {
		var parentNodeInfo = Level3_ddpw_administration.Models.PromptTree.findParentNode ( this, this.identity() );
		
		var _cursor = {
			getInstance : function () {
				returnVar = null;
				if (this._instance) {
					if ( ( this._filterFunction && this._filterFunction ( this.index, this._instance ) )|| !this._filterFunction ) {
						returnVar = this._instance;
					}
				}
				return returnVar;
			}, 
			_instance : this,
			tree : this,
			isAtEnd : function () { 
				var _isAtEnd = false;
				if (
					(this._instance 
					&& this.tree.hasChildren()
					//is the current instance the last leaf of the last prompt?
					&& this._instance.identity() == Level3_ddpw_administration.Models.PromptTree.findLeaf ( 
							this.tree.getChildren()[this.tree.getChildren().length-1] 
						).identity()
					)
					||
					( !this.tree.hasChildren() )
					){
					_isAtEnd = true;
				}
				
				return _isAtEnd;
			},
			isAtBeginning : function () { 
				var _isAtBeginning = false;
				if (this._instance 
					&&
					 this._instance.identity() == this.tree.identity()){
					_isAtBeginning = true;
				}
				return _isAtBeginning;
			},
			isLastSibling : function () { 
				var _isLastSibling = false;
				if (this._instance
					&&
					this.tree.identity() == this._instance.identity()
					||
					this.parentNode && this.index >= this.parentNode.getChildren().length - 1 
					){
					_isLastSibling = true;
				}
				return _isLastSibling; 
			},
			parentNode : parentNodeInfo.parent,
			index : parentNodeInfo.childIndex,
			getChildren : function (){ return this._instance.getChildren();},
			setClassifications : function ( classificationsArray ) {
				this._filterClassifications = classificationsArray;
			},
			setFilters : function ( filters , params) {
				this._filters = filters;
				this._filterParams = params;
				return this;
			},
			getDepth : function () { return this._currentDepth },
			_filters : [],
			_filterFunction : function ( index, obj) {
				//might be worth considering caching filterfunction results for speed's sake.
				var cursorRef = this;
				var include = true;
				$.each ( this._filters , $.proxy (  function ( index, filter) {
				//using proxy to have filter functions run within the scope of the cursor.
					switch (typeof (filter)) { //filters run within the scope of the cursor.
						case "string":
							include = include && cursorRef._filterFunctions[filter].apply( cursorRef, [index, obj] );
						break;
						case "function":
							filter =  $.proxy ( filter , this );
							include = include && filter( index, obj ); 
						break;
					}
					if (!include) {
						include = false;
					}
					//console.debug (obj.text +": " + (include ? "passes " : "fails ") + filter);
					return include;
				} , this ));
				
				return include;
			},
			_filterFunctions : {
						"promptOrPromptTree" : function ( index , obj ) {
										return this._filterFunctions['prompts']( index , obj ) || obj.Class.shortName == "PromptTree"
									},
						"prompts" : function ( index , obj ) {
										if (obj.Class.shortName == "Prompt"){
											return true;
										} else {
											return false;
										}
									},
						"responseOptions" : function ( index , obj ) {
										if (obj.Class.shortName == "ResponseOption"){
											return true;
										} else {
											return false;
										}
									},
						"hasSelections" : function ( index , obj ) {
								return typeof (obj.hasSelectedResponse) != 'undefined' && obj.hasSelectedResponse();
						},
						"parentResponseSelected" : function ( index, obj ) {
							var parentROSelected = false;
						
							if (obj.Class.shortName == "PromptTree"){
								parentROSelected = true;
							} else if (obj.Class.shortName != "ResponseOption"){
							 	//var parentNode = Level3_ddpw_administration.Models.PromptTree.findParentNode ( this.tree, obj.identity() ).parent;
							 	parentNode = this.parentNode;
							 	
							 	parentROSelected = parentNode.Class.shortName == "PromptTree" 
													|| ( 
															typeof ( parentNode.isSelected ) != 'undefined' 
															&& parentNode.isSelected() 
														);
							}
							
							//console.debug ("filtering: " + obj.text + " by parentResponseSelected: include = " + parentROSelected);
							return parentROSelected;
						},
						"isReadyForDisplay" : function ( index , obj ) { 
							//parent node has a selection, and the selectedResponse is "this one", OR is a root node of the tree
							var currentObj = Level3_ddpw_administration.Models.PromptTree.findParentNode ( this.tree, obj.identity() ).parent;
							if ( currentObj.Class.shortName == 'ResponseOption' ) {
								var parentResponseOption = currentObj;
							}
							
							while ( currentObj.identity() != this.tree.identity() && currentObj.Class.shortName != 'Prompt') {
								currentObj = Level3_ddpw_administration.Models.PromptTree.findParentNode ( this.tree, currentObj.identity() ).parent;									
							}
							var parentPrompt = currentObj;
							
							var isPromptWithinSelectedOfParent = function  ( parentPrompt, prompt) {
								var returnVal = false;
								var parentPromptSelectedResponsePromptsCollection = new Level3_ddpw_administration.Models.Prompt.List();
								
								parentPrompt.attr("selectedResponse").each ( function ( index, response) { 
									parentPromptSelectedResponsePromptsCollection.push ( response.prompts )
								});
								
								returnVal = parentPromptSelectedResponsePromptsCollection.match ( 'id' , prompt.id ).length > 0;
								
								return  returnVal; 
							};
							
							var isReadyForDisplay = (
									typeof (parentPrompt.hasSelectedResponse) != 'undefined' 
									&& parentPrompt.hasSelectedResponse()) 
									//confirm the prompt is within the selected response options prompts
									&& ( isPromptWithinSelectedOfParent ( parentPrompt , obj ) ) 
								|| ( parentPrompt.identity() == this.tree.identity() );
							return isReadyForDisplay;
						},
						"classifications" : function(index, obj){

								//console.debug ("filtering: " + obj.text + " by classifications");
								var isIncluded = false,
								//ALL are REQUIRED
								desiredClassifications = this._filterParams.classifications,
								classificationGroups = this._filterParams.classificationGroups, //these must be compared as "AND's" across groups, and "OR's" within groups
								classificationHierarchy = this._filterParams.classificationHierarchy, 
								//Any number may be assigned, and all ALL DESIRED must be MATCHED (due to parent filtering principle)
								ancestralClassifications = this._getClassificationAncestry( obj ),
								//ANY number may be assigned, and any UNMATCHED ancestral classifications from DESIRED must be matched (personal filtering principle)
								ownedClassifications = obj.classifications,
								groupsToMatch = [],
								//console.debug ( "desiredClassifications: " , desiredClassifications );
								numberOfCriteriaToSatisfy = desiredClassifications.length,
								numberOfCriteriaSatisfied = 0,
								objClassificationPathCollection = $.merge ($.merge ([], ancestralClassifications), ownedClassifications),
								objGroupedFacets = {},
								desiredGroupedFacets = {},
								matchedGroups = [],
								objGroups = []
								;
								var isClassificationGroupAndNameMatch = function ( classificationA, classificationB, groupA, groupB ) {
									var classNameA = "",
									classNameB = "",
									groupNameA = "",
									groupNameB = "";
									
									if (typeof classificationA != "undefined" && typeof (classificationA.name) != 'undefined' && typeof classificationA != "string" ) {
										classNameA = classificationA.name;
										groupNameA = classificationA.type;
									} else {
									    if (typeof classificationA == "string") {
											classNameA = classificationA;	
											groupNameA = groupA;
										}								
									}
									if (typeof classificationB != "undefined" && typeof (classificationB.name) != 'undefined' && typeof classificationB != "string") {
										classNameB = classificationB.name;
										groupNameB = classificationB.type;
									} else {
									    if (typeof classificationB == "string") {
											classNameB = classificationB;
											groupNameB = groupB;
										}									
									}
									var isMatch = Boolean(classNameA.toLowerCase() == classNameB.toLowerCase() && groupNameA.toLowerCase() == groupNameB.toLowerCase());
									if (isMatch) {
										//console.debug ("MATCH: ", arguments , isMatch );
									} 
									return isMatch;
								}
								var classificationArrayIterator = function ( classificationArray, groupKey, callback ) {
									$.each ( classificationArray , function ( classificationIndex , classification ) {
										callback ( classificationIndex, groupKey, classification );
									});
								}
								var hierarchicalClassificationIterator = function  ( hierarchicalClassificationObj, callback ) {
									for (var classificationGroupKey in hierarchicalClassificationObj) {
										var classificationGroupArray = hierarchicalClassificationObj[classificationGroupKey];
										classificationArrayIterator ( classificationGroupArray, classificationGroupKey, callback );
									}
								}
								
								//this is supposed to create a grouped object that contans the objects classification facets
								hierarchicalClassificationIterator ( classificationHierarchy, function ( classificationIndex, groupKey , classification) {
									classificationArrayIterator ( objClassificationPathCollection , groupKey , function ( index, key, objClassificiation ) {
										if ( isClassificationGroupAndNameMatch ( classification , objClassificiation, groupKey, key ) ) {
											if ( typeof( objGroupedFacets[key] ) == 'undefined' ){
												objGroupedFacets[key] = [];
											}
											objGroupedFacets[key].push ( objClassificiation );
											//console.debug ( "creating a grouped object that contans the objects classification facetsfound in ", objGroupedFacets );
										}
									});
								});
								//console.debug ("desiredClassifications : " , desiredClassifications);
								//console.debug ("objGroupedFacets : " , objGroupedFacets);
								//first match desired
								var found = [];
								var foundGroups = [];
								hierarchicalClassificationIterator ( objGroupedFacets, function ( classificationIndex, groupKey , objClassification ){
									//console.debug ( "iterating objGroupedFacets", objClassification );
									hierarchicalClassificationIterator ( desiredClassifications, function ( index, key, desiredClassification ){
										//console.debug ( "iterating desiredClassifications", desiredClassification );
										if ( isClassificationGroupAndNameMatch ( objClassification , desiredClassification, groupKey, key ) ) {
											// here objClassification is the  full model
											// and desiredClassification is the name (String) only
											
											//console.debug ( "looking in foundGroups for groupKey: ", {foundGroups : foundGroups, groupKey : groupKey });
											if ( $.inArray ( groupKey, foundGroups ) == -1 ) {
												//console.debug ( groupKey + " found in ", foundGroups );
												foundGroups.push ( groupKey );
											} else {
												//console.debug ( groupKey + "NOT found in ", foundGroups );											
											}
											var isAlreadyFound = false;
											for ( foundKey in found ) {
												var foundClassification = found[foundKey];
												if ( isClassificationGroupAndNameMatch ( objClassification, foundClassification , objClassification.type, foundClassification.type ) ) {
													isAlreadyFound = true;
												}
											}
											if ( !isAlreadyFound ){
												found.push( objClassification );
											}
										}
									});	
								});
								//console.debug ("found : " , found);
								var unfoundGroups = [];
								var unfoundClassifications = [];
								var desiredClassificationCount = function (desiredClassifications) {
									var count = 0;
									$.each ( desiredClassifications , function  ( key, value ) {
										if ( Object.keys(value).length > 0 ) {
											$.each ( value , function ( key2, value2 ) {
												if ( typeof ( value2 ) != 'undefined' ) {
													if ( $.trim(value2.toLowerCase()) != "unknown/undefined" ) {
														count ++;
													}
												}
											});
										} 
									});
									return count;
								} 
								
								if (found.length >= desiredClassificationCount(desiredClassifications) ) {
									//ok so we found enough matches to qualify for display 
									//- but now we need to make sure that we don't have any extra 
									//  classifications leftover that would restrict this from 
									//  being displayed
									//  so we look for leftovers by within unfound groups
									// that is - for each of the grouped classifications found on the obj, 
									// we iterate at the group level for surplus 
									//( each "group" must exist in "found"  - because all matches are "OR" comparisons within groups.)
									hierarchicalClassificationIterator ( objGroupedFacets, function ( classificationIndex, groupKey , classification ){
										classificationArrayIterator ( found, groupKey, function ( index, key, _classification ){
											//console.debug (classification.type.toLowerCase() + " != " + _classification.type.toLowerCase() + " ? ");
											if ( classification.type.toLowerCase() != _classification.type.toLowerCase() ) {
												// here both classification & _classification are full models
												if ( $.inArray ( groupKey, foundGroups ) == -1 ) {
													unfoundGroups.push ( groupKey );
												}												
											}
										});	
									});
								}
								//console.debug ("unfoundGroups : " , unfoundGroups);
								var objHasUnfoundGroups = unfoundGroups.length > 0,								
								//we found everything we need & there's nothing leftover
								
								isEverythingFound = desiredClassificationCount(desiredClassifications)
											&& found.length >=  desiredClassificationCount(desiredClassifications) 
											&& !objHasUnfoundGroups,
								//...or there is 1 classification that is 'everyone'
								isForEveryone = obj.classifications.length == 1
											&&
											obj.classifications[0].name.toLowerCase() == 'everyone' ,
								//... or there's no classification filters applied on this obj (should not be filtered)
								hasNoFilters = !obj.classifications.length;
								
								if (
									isEverythingFound 
									|| 
									isForEveryone 
									||
									hasNoFilters 
								){
									isIncluded = true;
								}
								//console.debug ("isIncluded: " + isIncluded);
								return isIncluded;
						}
			},
			_filterParams : {},
			_update : function ( forceToNull ) {
					if ( forceToNull ) {
						this._instance = null;
						this.index = null;
						this.parentNode = null;
						this._currentDepth = 0;
					} else {
						//TODO: this is failing
						var parentNodeInfo = Level3_ddpw_administration.Models.PromptTree.findParentNode ( this.tree, this._instance.identity() );//this is expensive and should probably be addressed
						this.parentNode = parentNodeInfo.parent;
						this.index = parentNodeInfo.childIndex; 
					}
				},
			_currentDepth : 0,
			_stepIn : function () {
					this._currentDepth ++;
					this._instance = this._instance.getChildren()[0];
					this._update();
			},
			_stepOut : function () {
					this._currentDepth --;
					this._instance = this.parentNode;
					this._update();
			},
			_stepNext : function () {
					this.index = this.index + 1;
					this._instance = this.parentNode ? this.parentNode.getChildren()[this.index] : null;
					this._update();
			},
			_findNextStep : function () {
				//TODO: Refactor so this doesn't cause breakage -- filters are being aplied in the last leaf 
				//such that the instance becomes null, ,rather than jumping to the next place from the root.
					var isLastSibling = this.isLastSibling();
					var hasChildren = this._instance ? this._instance.hasChildren() : false;
					if ( hasChildren ) {
						//if there are children, go deeper first
						this._stepIn();
					} else 	if (this._instance && !isLastSibling && !hasChildren){
						// if there are no children, but siblings, hit the next one
						this._stepNext();
						if ( this._instance == null) {
							throw new Error ("how can be null if nex sibling exists?");
						}
					} else if (this._instance && isLastSibling && !hasChildren ) {
						//there aren't any siblings or children - bounce out parent
						//parent (the grandparent) and look for the next siblings and children (aunts, uncles, cousins)
						do {
							this._stepOut();
							isLastSibling = this.isLastSibling();
						} while ( isLastSibling && !this.isAtEnd() );
						//once we're out - hit the next sibling if we haven't hit the last leaf
						if ( !this.isAtEnd() ) {
							this._stepNext();	
						} 
					}
					
			},
			_getClassificationAncestry : function ( startObj ) {
			//traverses from startObj to top of tree and returns an array of all found classifications
				var currentObj = Level3_ddpw_administration.Models.PromptTree.findParentNode ( this.tree, startObj.identity() ).parent;
				var classificationFilterChainCollection = [];
				while ( currentObj.identity() != this.tree.identity() ) {
					$.merge ( classificationFilterChainCollection, currentObj.classifications );
					currentObj = Level3_ddpw_administration.Models.PromptTree.findParentNode ( this.tree, currentObj.identity() ).parent;
				}
				//classificationFilterChainCollection.unique();
				return classificationFilterChainCollection;
			},
			next : function () {
				if ( this.isAtEnd() ){
					return false;
				} else if ( this._filterFunction ) {
					do {
						this._findNextStep();
					} while ( 
						this._instance && !this.isAtEnd() 
						//this:
						&& !this._filterFunction ( this.index, this._instance ) 
						//is preventing traversal to root prompts after hitting the last leaf being a response option 
						//(skips it out if the filter is "prompts"), and this._instance == null;
						//when the above is true ->  this._currentDepth == 0 && !this.isAtEnd() == true
						//so, the bottom line is we believe we're not at the end because !this.isAtEnd() returns true as well as being back at root level
						//so in cases where we're not at the end, but there isn't an instance ( because the filterfunction cleaned it out upon execution)
						//we'll give an or clause to continue finding the next step
						//so that sections can be built correctly while still enabling tree traversal.
						//||
						//this._currentDepth == 0 && !this.isAtEnd()
						// - no that fails - problem is elsewhere.
					);
					if ( !this._instance || !this._filterFunction ( this.index, this._instance ) ){
						this._update ( true );
						return false;
					}
				} else {
					this._findNextStep();				
				}
				return this;
			},
			prev : function () {
				//if there are siblings, hit last leaf of previous first
				
				// if there are no previous siblings, find the last leaf of the ancestral parent with children
				
				return this;
			},
			moveTo : function ( position ) {
//				console.debug ("moving to: " + position);
				switch (position) {
					case "start":
					case "beginning":
					case "first":
						this._instance = this.tree;
						this._update();
					break;
					case "end":
					case "ending":
					case "last":
						this._instance = Level3_ddpw_administration.Models.PromptTree.findLeaf ( this.tree.prompts[this.tree.prompts.length-1].identity() );
						this._update();
					break;
					default:
						this._instance = this.tree;//start at beginning
						this._update();
						while ( this._instance && this._instance.identity() != position && !this.isAtEnd()) {
							console.debug ("next: from : "+ this._instance.identity() );
							this._findNextStep();
						};
						if ( this._instance.identity() != position && this.isAtEnd()){
							//we didn't find the identity we were looking for.
							this._update ( true );
						} else {
							//identity found...
							this._update ();
						}
					break;
				}
			
				return this;
			},
			getFilteredCollectionByDepth : function ( depthStart , depthEnd ) {
			//depthStart = 0 for PromptTree, +n for each traversed parent -> child relationship
			//e.g. PromptTree (0) -> Prompt (1) -> ResponseOption (2) -> Prompt (3) = depth of 3
				//return all objects traversed through tree that pass filters in a single collection 
				var objCollection = [], instance, depth ;
				
				depthStart = depthStart == null ? 0 : depthStart;
				depthEnd = depthEnd == null ? -1 : depthEnd;
				
					do {
						//console.debug ( "INSTANCE:", this.options.cursor.instance );
						try {
							instance = this.getInstance();
							if (instance) {
								depth = this.getDepth();
								//console.debug ("adding " + instance.Class.shortName + " to collection at level " +depth);
								if ( typeof ( objCollection[depth] ) == 'undefined' ) {
									objCollection[depth] = [];
								} 
								if ( depth >= depthStart 
										&& ( 
											depth <= depthEnd 
											||
											depthEnd <= -1 // no depth limit
										) 
									){
											//*** this secetion is coupling the prompt_tree to the application controller
											//application controller varies from preview_panel to execution - topossibly more in the future
											
											//TODO: this shuold be address in the future
										var envValue;
										$applicationController = typeof  ( $("#main").controller() ) == 'undefined' ? $("#ddpw_main").controller() :  $("#main").controller();
										if ( instance.hasSelectedResponse() == false) {
											$.each ( instance.prefillData , function ( index, prefill ) {		
												if (prefill.prefillType == "Custom"){
													envValue = prefill.prefillValue;
				            			        	var tempResponseOptions = instance.attr("selectedResponse").serialize(); 
				                     				//should return a default value because we should have already determined that there are no
								                    //user selections (  instance.hasSelectedResponse() == false )
							                     	if ( tempResponseOptions.length ){ //section prompts are coming to here -- they don't have response options (the list is empty )
								                     	tempResponseOptions[0].value = envValue;
								                     }
							                     	instance.attr ("defaultResponse" , Level3_ddpw_administration.Models.ResponseOption.models ( tempResponseOptions ).setAllSelected( true ) );				        			         
												}
												else if ($applicationController.options.environmentVarList.get(prefill.prefillType) != null){
													envValue = $applicationController.options.environmentVarList.get(prefill.prefillType);//prefill.prefillValue;
												 	instance.attr("responseOptions")[0].value = envValue;
							         				instance.attr("defaultResponse")[0].value =  instance.attr("responseOptions")[0].value;													
												}												
												else {
													//complete this for using responseOptions - when response option values have been set by admin (checkbox, radio, simpledialo
						    	                   	var valuesArray = instance.prefillData.map ( function ( prefillDataObj, index ) {//this logic should return actual prefill (default) value	                    	                      	
	                                	          		return prefillDataObj.prefillType;
	                                    			});
	                                    
	                      							var newResponseOptions = instance.responseOptions.grep ( function ( responseOption, index ) {
	                                       				return $.inArray ( responseOption.label , valuesArray ) >= 0
	                                    			});
	                                     
	                       							instance.attr ("defaultResponse" , newResponseOptions.setAllSelected( true ) ); //newResponseOptions should be a list                     
												}												
											});
										}
										//END coupling addressing								
									objCollection[depth].push ( instance );
								}
							}
						} catch (e) {
							console.warn ("ERROR!!!!", e); 
						}
					} while (this.next() );
				return objCollection;
			}}
		
			if ( filters ) {
				_cursor.setFilters ( filters , params );
			}
		
		return _cursor;
	},
	// in prompt_tree
   exportJsonTree : function() {
  
         //busyAnimation(true);
         var frame = $("#downloader")[0].contentWindow.document;  
         frame.open();
         frame.write("<html><body>");
         frame.write("<form method=\"post\" action=\"/portalWeb/GenericDownloadServlet\" name=\"excelform\" id=\"excelform\">");
         frame.write("<input name=\"fileName\" id=\"fileName\">");
         frame.write("<input name=\"mime\" id=\"mime\">");
         frame.write("<textarea name=\"html\" id=\"html\"></textarea>");
         frame.write("</body></html>");
         frame.close();   
       
         var output = JSON.stringify ($.extend ( {}, this.serialize() ));	     

       $("#downloader").contents().find("#fileName").val(this.name+".json");
       $("#downloader").contents().find("#mime").val("text/json")
       $("#downloader").contents().find("#html").text(output)
       $("#downloader").contents().find("#excelform").submit();
       //busyAnimation(false);  	
  	},
  	clearPromptSelections : function ( beginningAtId ) { 
		var paramsObj = {},
			initialFilters = ["prompts","hasSelections"],
			cursor = this.getCursor().setFilters(initialFilters);
		if ( beginningAtId != null ) {
			cursor.moveTo ( beginningAtId ).next();
		} else {
			cursor.moveTo ("start");
		}
		
		return cursor;
		/*do {
			var instance = cursor.getInstance();
			if (instance){
				instance.attr ("selectedResponse" , null);
			}
		} while ( cursor.next() );*/	
  	}
	
})
$.Model.List('Level3_ddpw_administration.Models.PromptTree.List',{
  // static properties
},{
  setActiveTree : function( treeObj , saveTarget ){
  	console.debug ("setActiveTree", this, arguments);
  	saveTarget = saveTarget == null ? true : saveTarget;
  	var allTrees = this,
  		saveTreeEvent = new Event ( "saveTree" );
  	$.each ( allTrees , function ( index, tree) {
		if (tree.id != treeObj.id ){
			if ( tree.isAlwaysEffective == true ) {
			  	tree.isAlwaysEffective = false;
			  	saveTreeEvent.tree = tree;
				$(tree.elements()[0]).trigger (saveTreeEvent);
			}
		} else {
			if ( tree.isAlwaysEffective == false ) {
			  	tree.isAlwaysEffective = true;
			  	saveTreeEvent.tree = tree;
				$(tree.elements()[0]).trigger (saveTreeEvent);
			}		
		}
	});

   },
   getActiveTrees : function () {
	   var activeTrees = this.grep(function(tree){
			       return tree.isAlwaysEffective;
			     });
		console.debug ("Active Trees: " , activeTrees );
		return activeTrees;
	}
})


;
});