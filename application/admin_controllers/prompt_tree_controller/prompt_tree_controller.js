$(document).ready(function() {

/**
 * @class Level3DdpwAdministration.Controllers.PromptTreeController
 */
$.Controller('Level3_ddpw_administration.Controllers.PromptTreeController',
/** @Static */
{
	defaults : {
		promptTreeCollection: null //new Level3_ddpw_administration.Models.PromptTree.List()
		,model:Level3_ddpw_administration.Models.PromptTree
		,selectedTree : null
	},
	listensTo : ['treeSelected']
},
/** @Prototype */
{
	init : function(){
		console.debug (this.Class.shortName+".init()", this);
		if (!this.options.promptTreeCollection) {
			this.options.promptTreeCollection = new Level3_ddpw_administration.Models.PromptTree.List();
		}
		this.initModels();
		this.refresh();
	},
	initModels : function () {
	/*
		this.bind (this.options.model, "destroyed", this.destroyed); 
		this.options.model.bind ( "destroyed", this.destroyed ); 
		this.bind (this.options.model, "created", this.created); 
		this.bind (this.options.model, "updated", this.updated); 
		this.options.model.bind ( "updated", this.updated ); 
		this.bind (this.options.model, "saved", this.saved); 
		*/
		this.options.promptTreeCollection.bind ( "add", this.onPromptTreeCollectionAdded );
	},
	refresh : function () {
		this._unbind();
		console.debug(this.Class.shortName+".refresh()", this);
		this.element.html( $.View('./application/admin_controllers/prompt_tree_controller/views/init.ejs' , this ) );
		
		$("#invoke_create",this.element).button (
				{
					icons : {primary : "ui-icon-plusthick"}
				}
		);		
	//	$(".controls-container button.copy-tree-button").button({ disabled : true });		
	//	$(".controls-container button.export-tree-button").button({ disabled : true });
	
		$(".controls-container button").button({ disabled : true });
		$("#invoke_create",this.element).button ({ disabled : false});		
		$("#invoke_create, .import-tree-button",this.element).button ({ disabled : false});
		this.bind();
	},
	onPromptTreeCollectionAdded : function ( event, addedTreesArray ){
		console.debug("promptTree added", arguments);
		$("#prompt_trees",this.element).append( $.View('./application/admin_controllers/prompt_tree_controller/views/prompt_tree_item_renderer.ejs', addedTreesArray[0]) );
		var $addedElement = $(addedTreesArray[0].elements()[0]),
			selectedEvent = $.Event ( "treeSelected" );
		//saveEvent = $.Event ("saveTree"); //moving into create
		//selectedEvent.tree = saveEvent.tree = addedTreesArray[0];
		selectedEvent.tree = addedTreesArray[0];
		//$addedElement.trigger(selectedEvent).trigger(saveEvent);
	},
	"{model} destroyed" : function(PromptTree, event, promptTree) {
		console.debug("prompt_tree_controller.js {model} destroyed", this, arguments );
		promptTree.elements( this.element ).remove();
	},
	"{window} treeSelected, .level3_ddpw_administration_prompt_tree_item treeSelected" : function ( element, event , tree) {
		this.options.selectedTree = tree = tree ? tree : $("#main").controller().options.selectedTree;
		$(".controls-container button").button( "enable" );
	},
	clearLocalTreeReference : Level3_ddpw_administration.Controllers.ApplicationController.clearLocalTreeReference,
	"{window} treeUnselected" : function ( element, event ) {
        this.clearLocalTreeReference();
	},
	"{model} created" : function( promptTree , event){
		console.debug("{Level3_ddpw_administration.Models.PromptTree} created",promptTree );
	},
	"{model} updated" : function(PromptTree, ev, promptTree){
		console.debug("{Level3_ddpw_administration.Models.PromptTree} updated" , arguments);
	},
	"{model} saved" : function(PromptTree, ev, promptTree){
		console.debug("{Level3_ddpw_administration.Models.PromptTree} saved" );
	},
	"#invoke_create click" : function (element, event) {
		console.debug(this.Class.shortName+".invoke_create click()", arguments );
		console.debug("invoke_create click(): shifting to BuilderPanel...");
		$("#center_panel_container").tabs("select","#builderPanel");
		this.createNewTree();
		
	},
	cleanupActive : function ( targetTree , saveTarget) {
		this.options.promptTreeCollection.setActiveTree( targetTree, saveTarget );
		/*
		saveTarget = saveTarget == null ? false : saveTarget;
	
		$.each ( this.options.promptTreeCollection,
			function ( index, tree) {
				if (tree.identity() == targetIdentity ){
					tree.isAlwaysEffective = true;
					if ( saveTarget ) {
						tree.save();
					}
				} else if (tree.isAlwaysEffective != false){
					tree.isAlwaysEffective = false;
					tree.save();
				}
			}
		);
		*/
	},
	".is-in-effect change" : function ( element, event ) {
		console.debug ( "is-in-effect change: ", arguments);
		var promptTree = element.closest('.prompt_tree').model();
		this.cleanupActive( promptTree );
		//this.refresh();
	},
	".controls-container button.copy-tree-button click" : function (element, event) {
		if (this.options.selectedTree) {
			var clonedTree = this.options.selectedTree.cloneModel();
			this.createNewTree(clonedTree);
		}
	},
	".controls-container button.export-tree-button click" : function (element, event) {
		if (this.options.selectedTree) {
			var exportTree = this.options.selectedTree.exportJsonTree();
		}
	},
	".import-tree-button click" :function (element, event) {
		this.importToAdmin();
	},
	createNewTree :function ( initParams ) {
		if ( !initParams ) {
			initParams = {prompts:[]};
		}
		var options = this.options;
		var tree = {};
		Level3_ddpw_administration.Models.PromptTree.create( initParams , function ( response ) {
			console.debug ( "create response: " , response );
			tree = Level3_ddpw_administration.Models.PromptTreeAdapter.convertToPromptTree ( response.tq_steps );
			options.promptTreeCollection.push( tree  );
		}).then( function () { tree.created ( tree )} );
	},
	//For Import Tree Functionality.
	 importToAdmin:function(){	
	        var $promptTreeController = this;			
			$("#import_dialog" ).dialog({
				autoOpen: false,
				height: 200,
				width: 350,
				modal: true,
				buttons: {
			
	    		"Import": function() {
				    var S4 = function() { 
        	    	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		            };
          
          		var ids =  this.uid ? this.uid : (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());			
				var formData = new FormData($('form')[0]);
				
				if (window.File && window.FileReader && window.FileList && window.Blob) {
				    var files = $('input[type="file"]')[0].files;
					if (files) {
				        for (var i=0, f; f=files[i]; i++) {
					        var r = new FileReader();
				            r.onload = (function(f) {
				                return function(e) {
				                    var contents = JSON.parse( e.target.result );
				                    contents.id = ids;
				                    if (typeof ( contents.effectiveDate )!= "undefined") {
				                        contents.effectiveDate = new Date(contents.effectiveDate);
				                    }
				                    
				                    if ( typeof ( contents.expirationDate ) != "undefined") {
				                        contents.expirationDate = new Date(contents.expirationDate);
				                    }

				                    if (typeof ( contents.isActive ) != "undefined") {
				                        contents.isActive = false;
				                    }
				                    if (typeof ( contents.isAlwaysEffective ) != "undefined") {
				                        contents.isAlwaysEffective = false;
				                    }
				                    
				                    $promptTreeController.createNewTree( contents ); 
				                };
				            })(f);
				
				            r.readAsText(f);
        					}   
					    } else {
						    alert("Failed to load files"); 
					    }

				} else {
				  alert('The File APIs are not fully supported by your browser.');
				}
			   $( this ).dialog( "close" );	     
			}
			},
			"Import this file" : function() {
				allFields.val( "" ).removeClass( "ui-state-error" );
			}
		});
		
		function progressHandlingFunction(e){ 	
		
		}
		$( "#import_dialog" ).dialog( "open" );

	}
	
	
})});