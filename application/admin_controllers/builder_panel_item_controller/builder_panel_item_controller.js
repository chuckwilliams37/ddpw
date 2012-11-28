$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Controllers.BuilderPanelItemController
 */
$.Controller('Level3_ddpw_administration.Controllers.BuilderPanelItemController',
/** @Static */
{
	defaults : {itemModel:null, selectedTree:null},
	listensTo : [ "refresh", "treeSelected"]
},
/** @Prototype */
{
	init : function(){
		if (this.element) {
			this._unbind();
		}
		//console.debug (this.Class.shortName + ".init()", this);
		var itemModel = this.options.itemModel = $(this.element).model();
		//add in the children using the same renderer
		this.refreshView();
		$(".builderPanelItemResponseOptionContainer, .builderPanelItemResponseOptionContainer > *", this.element).hover (this.onResponseOptionItemHoverIn, this.onResponseOptionItemHoverOut);
		if (this.element) {
			this.bind();
		}
	},
	setupBindings : function () {
		for (var i = 0; i < this.options.itemModel.responseOptions.length; i++) {
			var responseOption =  this.options.itemModel.responseOptions[i];
			this.bind ( responseOption , "prompts" , "onPromptsChange" );
		}
		this.element.hover (this.hoverIn, this.hoverOut);
		
		//console.debug(itemModel.id);
		//
		/*
			this.bind (this.options.itemModel, "responseOptions", "onPromptsChange");
			this.bind (this.element, "refresh", this.refreshView);
			
			*/
	},
	"{itemModel} prompts" : function () {
		this.onPromptsChange();
	},
	"{itemModel} responseOptions" : function () {
		this.onPromptsChange();
	},
	refreshView :function () {
		//console.debug (this.Class.shortName + ".refreshView()");
		var $thisElement = typeof ( this.element ) == 'undefined' ? $(this) : this.element;
		if ( $thisElement ) {
			var $thisController = $thisElement.controller();
			var itemRenderer = $thisController.getItemRenderer($thisController.options.itemModel);
			$thisElement.html( itemRenderer );
			$thisController.setupBindings();
		}
	},
	hoverIn : function (event) {
		//console.debug ("HOVERIN", this);
		$(this).controller().element.addClass ("ui-state-hover");
	},
	hoverOut : function (event) {
		//console.debug ("HOVEROUT", this);
		$(this).controller().element.removeClass ("ui-state-hover");
	},
	onResponseOptionItemHoverIn : function (event) {
		//console.debug ("R.O: HOVERIN", this);
		$(event.target).closest(".builderPanelItemResponseOptionContainer").addClass ("ui-state-hover");
	},
	onResponseOptionItemHoverOut : function (event) {
		//console.debug ("R.O: HOVEROUT", this);
		$(event.target).closest(".builderPanelItemResponseOptionContainer").removeClass ("ui-state-hover");
	},
	".builderPanelItemResponseOptionContainer,.builderPanelItemResponseOptionContainer button click" : function (element, event) {
		//console.debug (".builderPanelItemResponseOptionContainer click", arguments);
		event.stopImmediatePropagation();
		element = element.closest(".builderPanelItemResponseOptionContainer");
		element.trigger ("responseOptionSelected");
		$("#builderPanel .builderPanelItemResponseOptionContainer .ui-state-active").removeClass(".ui-state-active");
		element.addClass ("ui-state-active");
	},
	"click" : function (element, event) {
		//console.debug (this.Class.shortName + ".click()");
		$(this.element).trigger("promptSelected",$(this.element).model());
		event.stopPropagation();
		event.stopImmediatePropagation();
		event.preventDefault();
	},
	getItemRenderer : function (itemModel) {
		var itemRenderer = Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.getToolItemRenderer(itemModel.type,"builder_panel");
		var itemRendererView = $.View(itemRenderer, itemModel);
		return itemRendererView;
	},
	"onModelUpdate" : function (model, event) {
		//console.debug (this.Class.fullName + " onModelUpdate()", model, event);
		//this.refreshView();
		this.init();
	},
	"onPromptsChange" : function () {
		console.debug ("onPromptsChange");
		//this.refreshView();
		this.init();
	},
	"{window} treeSelected" : function () {
		//console.debug (" builder_panel_item_controller.{window} treeSelected ()") ;
		//console.debug (" builder_panel_item_controller.{window} treeSelected ()", this) ;
		//this.bind (itemModel,"updated","onModelUpdate");
	},
	"{window} promptSelected" : function ( window , event, prompt ) {
		/*
		prompt = prompt ? prompt : event.prompt ? event.prompt : $(event.target).model() ?  $(event.target).model() : null;
		if (prompt.identity() == this.options.itemModel.identity()) {
			this.element.addClass("ui-state-active");
		}
		being handled at the builder_panel_controller level.
		*/
		
	}
	
	
})

});