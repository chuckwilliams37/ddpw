$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Controllers.OutlinePanelController
 */
$.Controller('Level3_ddpw_administration.Controllers.OutlinePanelController',
/** @Static */
{
	defaults : { selectedTree : null , selectedModel: null
	,classificationNames : null
	,classificationGroupNames : null
	,classificationHierarchy : []
	,selectedClassifications:{
			segment : ["Unknown/Undefined"],
			product : ["Unknown/Undefined"],
			bandwidth : ["Unknown/Undefined"]
		}
	,enableFilters : false
	,cursor : null
	,_pendingCallCount : 0
	,_isRefreshing : false
	},
	listensTo : [ "treeSelected", "open_node.jstree", "close_node.jstree" , "promptAdded"]
},
/** @Prototype */
{
	init : function () {
		console.debug (this.Class.shortName + ".init()");
		this.displayPanelWaitMessage();
		this.getClassifications();
		//this.refreshView();
	},
	_isActive : false,
	isActive : function () {
		var $thisController = $("#outlinePanel").controller();
		return $thisController._isActive;
	},
	getJsTreeRef : function () {
		return $.jstree._reference("#outlinePanelTreeContainer");
	},
	"{selectedTree} updated" : function (PromptTree, event, promptTree) {
		console.log("OutlinePanel updated: " , [PromptTree, event, promptTree]);
		this.refreshView();
	},
	"{Level3_ddpw_administration.Models.PromptTree} destroyed" : function (){
		console.debug (this.Class.fullName + ".{Level3_ddpw_administration.Models.PromptTree} destroyed()");
		this.refreshView();
	},
	"{Level3_ddpw_administration.Models.Prompt} destroyed" :function (){
		console.debug (this.Class.fullName + ".{Level3_ddpw_administration.Models.Prompt} destroyed()");
		this.refreshView();
	},
	"{Level3_ddpw_administration.Models.Prompt} created" :function (){
		console.debug (this.Class.fullName + ".{Level3_ddpw_administration.Models.Prompt} created()");
		this.refreshView();
	},
	getClassifications : function () {
		console.debug ("getClassifications () ");
		if ( this.options.classificationNames == null && this.options.classificationGroupNames == null ) {
			Level3_ddpw_administration.Models.Classification.findAll( {domain : $.cookie("domain") }, this.onGetClassificationsComplete );
			this.options._pendingCallCount ++;
		} else {
			this.refreshView();
		}
	},
	onGetClassificationsComplete : function(data, textStatus, jqXHR){
		console.debug ("onGetClassificationsComplete " , arguments);
		var $outlinePanelController = $("#outlinePanel").controller();
		$outlinePanelController.options._pendingCallCount --;
  		$outlinePanelController.options.classificationNames = Level3_ddpw_administration.Models.Classification.getClassificationHierarchy();
  		$outlinePanelController.options.classificationGroupNames = Level3_ddpw_administration.Models.Classification.getClassificationGroupNames();
    	$outlinePanelController.refreshView();
  	},
  	getSelectedClassifications : function  () {
		var selectedValues = {};
		if ( this.isActive() ) {
			var formElement = $("#outlineClassificationSelectionsForm",this.element);
			if ( formElement.length ) {
				selectedValues = formElement.formParams().classifications;			
			} else {			
				selectedValues = this.options.selectedClassifications;			
			} 
		}
		return this.options.selectedClassifications = selectedValues ;
	},
	".outline-classification-select change" : function (element,  event) {
		this.options.selectedClassifications = this.getSelectedClassifications();
		this.options.cursor.setClassifications ( this.options.selectedClassifications );
		
		this.resetSelections();
		this.refreshView();
	},
	resetSelections : function ( fromId ) {
		var paramsObj = {};
		var initialFilters = [];
	    var cursor = this.options.cursor = this.options.cursor ? 
			this.options.cursor.setFilters( initialFilters , paramsObj) : 
			this.options.selectedTree.createCursor( initialFilters ,paramsObj );
		
		if ( fromId ) {
			cursor.moveTo ( fromId ).next();
		} else {
			cursor.moveTo ("start");
		}
		
		do {
			var instance = cursor.getInstance();
			if (instance){
				instance.attr ("selectedResponse",null);
			}
		} while ( cursor.next() );
		
	},
	"#enableFilters change" : function ( element, event ) {
		this.options.enableFilters = $('#enableFilters ').is(':checked'); 
		this.refreshView();
	},
	refreshView : function () {
		
		if ( this.isActive() && this.options._pendingCallCount <= 0) {
			console.debug (this.Class.shortName+".refreshView()");
			this._unbind();
			var selectedTree = this.options.selectedTree;
		   		
			var renderedView = $($.View("./application/admin_controllers/outline_panel_controller/views/init.ejs", 
				{
					selectedTree : selectedTree,
					classificationNames:this.options.classificationNames,
		  			classificationGroupNames:this.options.classificationGroupNames,
		  			selectedClassifications:this.options.selectedClassifications,
		  			enableFilters : this.options.enableFilters
				}));
			
			console.debug ("adding classifications selection form");
			var listContainer = $($.View ( "./application/admin_controllers/outline_panel_controller/views/outline_classifications_list_container.ejs"
				,  {			classificationNames:this.options.classificationNames,
			  					classificationGroupNames:this.options.classificationGroupNames, 
			  					selectedClassifications : this.options.selectedClassifications
			  	} ));
			
			
			renderedView.find("#outlineClassificationSelectionsForm").html(listContainer);
			
		    this.element.empty().append(renderedView);
		    
			var targetTreeContainer = $("#outlinePanelTreeContainer", this.element);
			if ( typeof ( this.options.selectedTree ) != 'undefined' && this.options.selectedTree ) {
				var treeRootIdentity = this.options.selectedTree.identity();
			        // call `.jstree` with the options object
				console.debug ( "CALLING JSTREE "  );
				targetTreeContainer
					.bind("open_node.jstree", this.onJsTreeOpen)
					.bind("select_node.jstree", this.onJsTreeNodeSelect)
					.bind("loaded.jstree", function (event, data) {
						console.debug ( "loaded.jstree"  ) ; 
				        data.inst.open_all( -1 );
				        var $thisController = $("#outlinePanel").controller();
				        if ( $thisController.options.selectedModel ) {
				        	$thisController.selectJsTreeNode ( $thisController.options.selectedModel.identity() );
				        }
				    })
					.jstree(this.promptTreeDataToJsTreeData ( selectedTree ) )
				    ;        
			}
			
			
		    //console.debug ("Outline View Complete", this.options.selectedModel);
		    if ( this.options.enableFilters ) {
				$ ( "#outlineClassificationSelectionContainer" ).show( "blind" );
			} else {
				$ ( "#outlineClassificationSelectionContainer" ).hide( "blind" );			
			}
			
			this.bind();
		} if ( this.options._pendingCallCount > 0 ) {
			this.displayPanelWaitMessage();
		}
	},
	displayPanelWaitMessage : function () {
		this.element.html ("<p>One moment... loading data...</p>");	
	},
	"{window} treeSelected" : function (element, event) {
		/*
		event.stopPropagation();
		event.stopImmediatePropagation();
		event.preventDefault();
		*/
		$("#center_panel_container").tabs("enable",2);
		
		var latestSelectedTree = event.promptTree ? event.promptTree : $(event.target).model() ? $(event.target).model() : null;
		if ( typeof (latestSelectedTree) == 'undefined' || latestSelectedTree == null ) 
		{
			throw new Error ("Tree Selection is undefined in outline_panel_controller.");
		}
		if ( this.options.selectedTree && latestSelectedTree && latestSelectedTree.identity() != this.options.selectedTree.identity()  || this.options.selectedTree == null ) {
			this.options.selectedTree = latestSelectedTree;
			
			if ( this.isActive() ) {
				this._unbind ();
				this.options.cursor = this.options.selectedTree.getCursor();
				this.init();
				this.bind();
				/*
				this.refreshView();
				console.debug (this.Class.fullName + " A Tree was Selected!!");
				*/
			 }
		}
		
	},
	clearLocalTreeReference : Level3_ddpw_administration.Controllers.ApplicationController.clearLocalTreeReference,
        "{window} treeUnselected" : function ( element, event ) { 
                this.clearLocalTreeReference(); 
        },	
	setSelectedPrompt : function ( selectedPrompt ) {
		var $thisController = $("#outlinePanel").controller();
		$thisController.options.selectedModel =  selectedPrompt; //It's possible that this could come in a couple ways - due to the way it's being fired elsewhere...
		
		var jsTreeRef = $thisController.getJsTreeRef();
		if ( 
				$thisController.isActive() &&  
				!$thisController.isJsTreeNodeSelected( selectedPrompt.identity() ) ){
				$thisController.selectJsTreeNode ( selectedPrompt.identity() );
		}
		
	},
	"{window} promptSelected" : function (windowObj, event, selectedPrompt) {
		console.debug (this.Class.shortName +".{window} promptSelected", arguments);
		
		selectedPrompt = selectedPrompt ? selectedPrompt : event.prompt ? event.prompt : null;
		
		var $thisController = $("#outlinePanel").controller();
		$thisController.setSelectedPrompt ( selectedPrompt );
		/*
		*/
	},
	"{window} responseOptionSelected" : function (windowObj, event, selectedResponse) {
		console.debug (this.Class.shortName +".{window} responseOptionSelected", arguments);
		var $thisController = $("#outlinePanel").controller();
		$thisController.options.selectedModel = selectedResponse = selectedResponse ? selectedResponse : event.responseOption ? event.responseOption : null; //It's possible that this could come in a couple ways - due to the way it's being fired elsewhere...
		
		var jsTreeRef = $thisController.getJsTreeRef();
		if ( 
				$thisController.isActive() &&  
				!$thisController.isJsTreeNodeSelected( selectedResponse.identity() ) ){
				$thisController.selectJsTreeNode ( selectedResponse.identity() );
		}
	},
	"{window} tabsselect" : function (windowObj, event, selectedPanel ) {
		console.debug (this.Class.shortName +".tabsselect", arguments);
		if (selectedPanel.panel.id == "outlinePanel") 
		{
			this._isActive = true;
			this.init();
		} else if (
			selectedPanel.panel.id == "previewPanel"
			||
			selectedPanel.panel.id == "builderPanel"
		){
			this._isActive = false;
		}
	},
	selectJsTreeNode : function ( id ) { 
		var $thisController = $("#outlinePanel").controller(),
		treeRef = $thisController.getJsTreeRef();
		// select_node accpets a DOM node, jQuery node or selector pointing to an element within the tree.
		// This code is requiring an HTML id pointer (without the hash)
		// which are assigned at conversion time (from promptTree to jsTree data below)
		if ( treeRef.is_selected ( "#"+id ) ) {
			selectedNode = treeRef.get_selected ( );
		} else {
			treeRef.select_node( "#"+id , true );
		}
	},
	getSelectedJsTreeNode : function ( context ) { // context can be a DOM node, jQuery node or selector pointing to an element within the tree.
		var $thisController = $("#outlinePanel").controller();
		return $thisController.getJsTreeRef().get_selected ( context );
	},
	isJsTreeNodeSelected : function ( node  ) { //This can be a DOM node, jQuery node or selector pointing to an element within the tree.
		var $thisController = $("#outlinePanel").controller();
		return $thisController.getJsTreeRef().is_selected  ( node );
	},
	onJsTreeOpen : function ( event , nodeObj ) {
		//console.debug (".onJsTreeOpen()", arguments);
		//var nodeData = nodeObj.rslt.obj.data();
		//console.debug (".nodeData()", nodeData);
	},
	getTreeNodeInstance : function  ( identity ) {
		return this.options.selectedTree.getCursor().setFilters([],{}).moveTo( identity ).getInstance();
	},
	onJsTreeNodeSelect : function ( event , nodeObj ) { //happens within scope of HTMLDivElement
		console.debug (".onJsTreeNodeSelect()", arguments);
		var $thisController = $("#outlinePanel").controller();
		var nodeData = nodeObj.rslt.obj.data();
		var nodeModel = $thisController.getTreeNodeInstance ( nodeData.identity );
		
		event.stopPropagation();
		event.stopImmediatePropagation();
		event.preventDefault();
		
		if ( (
				$thisController.options.selectedModel != null 
				&& nodeData.identity != $thisController.options.selectedModel.identity()) 
				||  $thisController.options.selectedModel == null
			) {
			var nodeClass = typeof (nodeModel.Class) != 'undefined' ? nodeModel.Class.shortName : 'undefined';
			var eventObj = null;
			switch (nodeClass) {
				case "PromptTree":
					eventObj = $.Event( "treeSelected" , {promptTree : nodeModel} );
				break;
				case "Prompt":
					eventObj = $.Event( "promptSelected" , {prompt : nodeModel} );
				break;
				case "ResponseOption":
					eventObj = $.Event( "responseOptionSelected" , {responseOption : nodeModel} );
				break;
			}
			
			$(nodeModel.elements()[0]).trigger ( eventObj );
		}
	},
	promptTreeDataToJsTreeData : function ( promptTreeData )  {
		//this.options.selectedClassifications = this.getSelectedClassifications();
  		this.options.classificationHierarchy = this.options.classificationNames;
  		var paramsObj = {
		    		classifications : this.options.selectedClassifications,
	        		classificationGroups : this.options.classificationGroups,
	        		classificationHierarchy : this.options.classificationHierarchy
			},
			enableFilters = $('#enableFilters ').is(':checked'),
			currentParent = this.options.selectedTree,
			isAChildOfFilter = function ( index , obj ) {
				var isChild = false,
					currentParentChildren = currentParent.getChildren();
				
				currentParentChildren.each ( function ( parentChildIndex, child ) {
					if ( child.identity() == obj.identity() ){
						isChild = true;
						return false;
					}
				});
				//console.debug ( obj.identity() + ( isChild ? " is " : " is not " ) + " a child of " + currentParent.identity() );
				return isChild;
			},
			initialFilters = enableFilters ? ["classifications",isAChildOfFilter] : [isAChildOfFilter],
			cursor = this.options.cursor = this.options.cursor ? 
				this.options.cursor.setFilters( initialFilters , paramsObj).moveTo("start") : 
				this.options.selectedTree.createCursor( initialFilters ,paramsObj ),
			treeConfigData = {
				"json_data" : {
					"data" : []
				},
		        "plugins" : [ "themes", "json_data", "ui" ]
			},
			getNodesArray = function ( node ) {
				var childrenNodes = [],
				nodeChildren = node.getChildren(),
				instance = null;
				
				for (var i=0; i < nodeChildren.length; i++) {
					currentParent = node;
					instance = cursor.moveTo( nodeChildren[i].identity() ).getInstance() //will apply filters to the object;
					if ( instance ){
						childrenNodes.push ( getNodeData ( instance ) );
					}
					currentParent = node;
				};
				//console.debug ("childrenNodes: " , childrenNodes);
				return childrenNodes;
			},
			getNodeMetaData = function ( nodeItem ) {
				var nodeMetaData = 	nodeItem.serialize();
				nodeMetaData.Class = {};
				nodeMetaData.Class.shortName = nodeItem.Class.shortName;
				nodeMetaData.identity = nodeItem.identity();
				
				return nodeMetaData;
			},
			getNodeData = function ( nodeItem ) {
				var dataObj = null,
					nodeItemClassName = typeof (nodeItem.Class) != 'undefined' ? nodeItem.Class.shortName : 'undefined';
				switch ( nodeItemClassName ) {
					case "PromptTree":
						dataObj = {
							"data":	{
								"title" : nodeItem.name,
						        // omit when not needed
						        "attr" : {"class" : nodeItem.identity()},
						        // if `icon` contains a slash / it is treated as a file, used for background
						        // otherwise - it is added as a class to the <ins> node
						        "icon" : "./images/binary-tree-icon.png"
							},
					        "children" : getNodesArray ( nodeItem ),
							"metadata" : getNodeMetaData (nodeItem)
						};
					break;
					case "ResponseOption":
						dataObj = {
							"data":	{
								"title" : nodeItem.label + " ( "+ nodeItem.value +" ) ",
						        // omit when not needed
						        "attr" : {"id": nodeItem.identity() , "class" : nodeItem.identity()},
						        // if `icon` contains a slash / it is treated as a file, used for background
						        // otherwise - it is added as a class to the <ins> node
						        "icon" : "./images/response_option_icon.png"
							},
					        "children" : getNodesArray ( nodeItem ),
							"metadata" : getNodeMetaData (nodeItem)
						};
					break;
					case "Prompt":
						var promptType = nodeItem.type;
				  		switch ( promptType ) {
				  			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTINPUT:	
				  			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTAREA:
								dataObj = {
									"data":	{
										"title" : nodeItem.text,
								        "attr" : {"id": nodeItem.identity() , "class" : "prompt " + nodeItem.identity()},
								        "icon" : "./images/prompt_question_icon.png"
									},
							        "children" : getNodesArray ( nodeItem ),
									"metadata" : getNodeMetaData (nodeItem)
								};
				  			break;
				  			
				  			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SELECT:
				  			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.RADIOGROUP:
				  			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.CHECKBOXGROUP:
				  			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.DATEPICKER:
								dataObj = {
									"data":	{
										"title" : nodeItem.text,
								        "attr" : {id: nodeItem.identity() , "class" : "prompt " + nodeItem.identity()},
								        "icon" : "./images/prompt_question_icon.png"
									},
							        "children" : getNodesArray ( nodeItem ),
									"metadata" : getNodeMetaData (nodeItem)
								};
				  			break;
				  			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.MULTISELECTDATAGRIDWITHFILTER:
								dataObj = {
									"data":	{
										"title" : nodeItem.text,
								        "attr" : {id: nodeItem.identity() , "class" : "prompt " + nodeItem.identity()},
								        "icon" : "./images/advanced-data-grid-icon.png"
									},
							        "children" : getNodesArray ( nodeItem ),
									"metadata" : getNodeMetaData (nodeItem)
								};
				  			break;
				  			case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SIMPLEDIALOG:
								dataObj = {
									"data":	{
										"title" : nodeItem.text,
								        "attr" : {id: nodeItem.identity() , "class" : "prompt " + nodeItem.identity()},
								        "icon" : "./images/dialog_box_icon.png"
									},
							        "children" : getNodesArray ( nodeItem ),
									"metadata" : getNodeMetaData (nodeItem)
								};
				  			break;
				  		}
					break;
					default :
						//dataObj.metadata = nodeItem;
					break;
				}
				return dataObj;
			};
			
		treeConfigData.json_data.data = [getNodeData( promptTreeData )];
		
		//console.debug ("Generated Tree Data : " , treeConfigData );
		
		return treeConfigData;
	/**/
	},"{selectedTree} prompts" : function ( element, event  ) {//happens within the scope of the prompt Tree model (e.g. "this" = PromptTree)
		console.debug ( "outline_panel_controller.{selectedTree} prompts" , arguments , this );
		this.init();
	},"{window} promptAdded" : function ( windowObj, event , prompt ) {//happens within the scope of the prompt Tree model (e.g. "this" = PromptTree)
		console.debug ( "outline_panel_controller.{window} promptAdded" , arguments , this );
		
		selectedPrompt = prompt ? prompt : event.prompt ? event.prompt : null;
		var $thisController = $("#outlinePanel").controller();
		$thisController.setSelectedPrompt ( selectedPrompt );
		
		this.init();
		
	}
});

});