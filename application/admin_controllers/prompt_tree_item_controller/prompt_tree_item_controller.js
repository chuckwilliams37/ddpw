$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Controllers.PromptTreeItemController
 */
$.Controller('Level3_ddpw_administration.Controllers.PromptTreeItemController',
/** @Static */
{
	defaults : {
			model:Level3_ddpw_administration.Models.PromptTree
	},
	listensTo : ["treeSelected","isActive","name","effectiveDate","refreshView","change"]
	
},
/** @Prototype */
{
	
	init : function(){
		//console.debug("Level3_ddpw_administration.Controllers.PromptTreeItemController init()", this);
		
		this.bind(this.element.model(), "isActive","isActive");
		this.bind(this.element.model(), "change","change");
		//this.bind(this.element.model(), "updated","updated");
		
		this.element.button(
					{
						label:this.element.html()
					}
		);
		this.element.find(".destroy").button(
					{
						text:false
						,icons : {
							primary : "ui-icon-closethick"
						}
					}
		);
		this.element.addClass ("ui-state-error");
		this.element.switchClass ("ui-state-error","ui-state-default",500);
		
	//	$(this.element).hover(function(){$(this).find(".toolTip").fadeIn(250)},function(){$(this).find(".toolTip").fadeOut(500);});

	},
	fadeBg : function ( ) {
		this.element.switchClass ("ui-state-default","ui-state-error",125);
	},
	"{window} saveTree" : function ( windowObj, event ) {
		//whenever a tree is saved
		console.log ("prompt_tree_item_controller: {window} saveTree",arguments);
		if(this.element !=null){
			var thisTree = this.element.model(),
				eventTree = event.tree ? event.tree : $(event.target).model();
				
			if (typeof(eventTree) != 'undefined' && typeof(thisTree) != 'undefined'){
				if ( eventTree.id == thisTree.id){//for this tree				
					this.fadeBg();
					if ( thisTree.isAlwaysEffective ) { //is it supposed to be the effective one (that is saving already??)
						var controller = $("#main").controller(),
						collection = controller.options.promptTreeCollection;
						collection.setActiveTree( thisTree );//then make sure we're the only one in memory
					}					
				}
			}
		}
	},
	".destroy click" : function (element, event){
		console.debug (".destroy click", arguments);
		var dialogMessage = "Are you sure you want to delete this PromptTree?",
		$promptTreeItemController = this,
		model = this.element.model();
		
		$("<div></div>").html(dialogMessage).dialog ( {
			title : "Confirmation",
			buttons: {
			    	"Yes" : function() { 
							model.destroy();
					    	$(this).dialog("destroy");
			    			},
 				    "No" : function() { $(this).dialog("destroy"); }
			}
		});
		event.stopImmediatePropagation();
	},
	"click" : function (element, event ) {
		//console.debug ("click",[arguments, this.element.model()]);
		console.debug ("click",arguments,this);
		var $promptTreeItemController = this;
		var promptTree = this.element.model();
		var promptTreeDeferred = {};
		var invokeEvent = function () {
			var eventObj = $.Event ("treeSelected", {promptTree:promptTree});
			$(promptTree.elements()[0]).trigger(eventObj);			
		}
		
		//I want to insert a lazy-load detect & execution operation here.
		
		if ( promptTree.hasPrompts() ) {
			invokeEvent();
		} else {
			promptTreeDeferred = Level3_ddpw_administration.Models.PromptTree.findOne ( {id:promptTree.id} );
			$.when ( promptTreeDeferred ).done( function ( loadedPromptTree ) {
				promptTree = Level3_ddpw_administration.Models.PromptTreeAdapter.convertToPromptTree( loadedPromptTree.tq_steps );
				$promptTreeItemController.update ( {promptTree : promptTree } );
				invokeEvent();
			});
		}
	},
	update : function ( options ) {
		console.log ("prompt_tree_item_controller: update",arguments);
		this._super(options);
	    this.refreshView( options.promptTree );
	},
	"treeSelected" : function (element, event) {
		console.debug("prompt_tree_item.treeSelected()");
		if (element.model().identity() == this.element.model().identity()) {
			this.element.addClass("ui-state-active");
		} else {
			this.element.removeClass("ui-state-active");
		};
		
	},
	clearLocalTreeReference : Level3_ddpw_administration.Controllers.ApplicationController.clearLocalTreeReference,
    "{window} treeUnselected" : function ( element, event ) { 
            this.clearLocalTreeReference(); 
    },
	"isActive" : function (element, event) {
		var isActive = event.target.isActive;
		console.debug ("prompt_tree_item_controller: isActive",isActive );
		if (isActive) {
			this.element.model().elements().css({
					'background':'#0066ff'
					,'color':'#ffffff'
					,'border':'1px outset #000099'
			});
		} else{
			this.element.model().elements().css({'background':'','color':'','border':''});
		}
	},
	"name" : function (promptTree, event) {
		console.log ("prompt_tree_item_controller: name",promptTree);
	},
	"change" : function (promptTree, event) {
		console.log ("prompt_tree_item_controller: change",[promptTree,event]);
	},
	refreshView : function ( promptTree ) {
		console.log ("prompt_tree_item_controller: refreshView",arguments);
		//this.element.removeClass("ui-state-error");
		//this.element.queue("fadeBG",[]);
		//this call will destroy the existing Controller, and replace with a new one
		//(cuz controllers are bound in the ejs view template :) 
		this.element.replaceWith($.View("./application/admin_controllers/prompt_tree_controller/views/prompt_tree_item_renderer.ejs", promptTree));
	},
	"{model} updated" : function ( PromptTree, event ,promptTree ) {
		console.log ("prompt_tree_item_controller: updated",arguments);
		if ( this.element && this.element.model && promptTree.id == this.element.model().id ) {
			$( promptTree.elements().filter (".level3_ddpw_administration_prompt_tree_item") ).controller().refreshView( promptTree );
		}
	}
	
})

});