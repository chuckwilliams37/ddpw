$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Controllers.BuilderPanelController
 */
$.Controller('Level3_ddpw_administration.Controllers.BuilderPanelController',
/** @Static */
{
	defaults : {
		model : Level3_ddpw_administration.Models.PromptTree
		,promptTreeCollection:null
		,sortableProperties : {
			connectWith : 'ul.builder-panel-prompt-list-container',
			disableNesting: 'div.level3_ddpw_administration_builder_panel_item',
			placeholder : 'ui-state-highlight level3_ddpw_administration_builder_panel_item',
			forcePlaceholderSize: false,
			forceHelperSize: true,
			cursorAt: 'top',
			//handle: 'div',
			//noJumpFix : 1,
			helper:	'clone',
			items: '> li.prompt',
			opacity: .6,
			revert: 250,
			tabSize: 15,//I think the nestedSortable is using this to calculate position...causes jumping... simplify  the renderer!
			tolerance: 'pointer',
			//tolerance: 'intersect',
			toleranceElement: '> div',
			listType: 'ul',
			distance : 5
			//,update : this.sortupdate
			//start : this.sortStart,
			//,beforeStop : this.sortBeforeStop
			//stop : this.sortStop
		},
		selectedModel : null,
		selectedTree : null
	},
	listensTo : ["treeSelected","promptSelected","addTool","promptAdded"]
	/*
	MOVE_PROMPT_OUT: "movePromptOut",
	MOVE_PROMPT_IN: "movePromptIn",
	MOVE_PROMPT_UP: "movePromptUp",
	MOVE_PROMPT_DOWN: "movePromptDown",
	DELETE_PROMPT: "deletePrompt",
	*/
},
/** @Prototype */
{
	_isActive : true,
	init : function(){
		console.debug(this.Class.fullName + ".init()");
		if (! this.options.selectedTree){
			this.element.html(
					$.View("./application/admin_controllers/application_controller/views/application_welcome_dialog.ejs",this.options.promptTreeCollection)
			);
		} else {
			//this._unbind();
			this.refresh ( this.options.selectedTree );
			//this.bind();
		}
		
	},
	isActive : function () {
		var $thisController = $("#builderPanel").controller();
		return $thisController._isActive;
	},
	selectedElement : null,
	"#builderPanelTreeTitle click" : function (element, event) {
		var selectedTree = this.options.selectedTree ? this.options.selectedTree :  $(event.target).closest("#builderPanelTreeContainer").model();
		var treeSelectedEvent = $.Event ("treeSelected", {promptTree:selectedTree});
		$("#builderPanel").trigger(treeSelectedEvent);
		
		$("#builderPanelTreeContainer > ul").toggleClass("ui-state-active");
	},
	treeHoverIn : function (event){
		//console.debug("treeHoverIn");
		$(this).addClass ("ui-state-hover");
	},
	treeHoverOut : function (event){
		//console.debug("treeHoverOut");
		$(this).removeClass ("ui-state-hover");
	},
	"{window} treeSelected" : function (element, event) {
		console.log ("BuilderPanelController: treeSelected", arguments);
		var selectedTree = this.options.selectedTree = this.options.selectedModel = event.promptTree ? event.promptTree : $(event.target).model();
		this.options.selectedElement =  $(".prompt_tree:first", this.element);
		
		if ( this.isActive() ) {
			this.init();
			//$("#builderPanelTreeContainer > ul").addClass("ui-state-active");
		}
	},
	"{selectedTree} prompts" : function () {//happens within the scope of the prompt Tree model (e.g. "this" = PromptTree)
		console.debug ( "builder_panel_controller.{selectedTree} prompts" , arguments , this );
		this.init();
		if (this.options.selectedModel != null ) {
			var scrollToTarget = this.options.selectedModel.elements( $('#builderPanel') ).closest (".prompt");
			console.debug ( "scrolling to : ", scrollToTarget );
			this.scrollContainerToElement( "ul.builder-panel-prompt-list-container" , scrollToTarget );
		}
		//this.refresh( this.options.selectedTree );
		//$("#builderPanel").controller().refresh( this );
		//this.delegate ( selectedTree , "prompts", this.init );
	},
	clearLocalTreeReference : Level3_ddpw_administration.Controllers.ApplicationController.clearLocalTreeReference, 
    
    "{window} treeUnselected" : function ( element, event ) { 	
                this.clearLocalTreeReference(); 
        },	
	"{window} responseOptionSelected" : function (windowObj, event, responseOption) {
		console.log ("BuilderPanelController: responseOptionSelected", arguments);
		this.clearAllSelections();
		var selectedModel = this.options.selectedModel = responseOption ? responseOption : event.responseOption ? event.responseOption : $(event.target).model();
		this.options.selectedElement =  $(event.target);
	},
	"{window} promptSelected" : function (element, event, selectedPrompt) {
		if ( this.isActive() ) {
			var target = $(event.target);
			this.clearAllSelections();
			target.addClass("ui-state-active");
			//TODO: the selected prompt should be standardized across the app - this happens a lot
			selectedPrompt = selectedPrompt ? selectedPrompt : event.prompt ? event.prompt :  target.model() ?  target.model() : null;
			this.options.selectedElement = target;
			this.options.selectedModel = target.model();
		}
	},
	"{model} destroyed" :function (PromptTree, event, promptTree) { 
		promptTree.elements( this.element ).remove();
	},
	"{model} created" :function (PromptTree, event, promptTree) { 
	},
	clearAllSelections : function  () {
		console.debug ( this.Class.shortName + ".clearAllSelections()");
		$(".ui-state-active",this.element)
		.removeClass("ui-state-active");
	},
	"{model} updated" : function (PromptTree, event, promptTree) {
		if (this.isActive() && this.options.selectedTree && this.options.selectedTree.identity() == promptTree.identity()) {
			console.log("BuilderPanelController.updated: " , [PromptTree, event, promptTree]);
			this.refresh( promptTree );
		}
	},
	refresh : function (selectedTree) {
		console.debug ( this.Class.shortName + ".refresh()", selectedTree );
		selectedTree = selectedTree ? selectedTree : this.options.selectedTree ? this.options.selectedTree : null;
		if ( selectedTree ){
			this._unbind();
			console.debug( "builder_panel_controller refresh()" ,arguments);
			var renderedView = $.View("./application/admin_controllers/builder_panel_controller/views/init.ejs", selectedTree);
			this.element.html(renderedView);
			//root level hover
			//$(this.element).find("ul").first().hover (this.treeHoverIn, this.treeHoverOut);
			this.updateSortables();
			if ( this.options.selectedModel ) {
				this.options.selectedModel.elements(this.element).addClass("ui-state-active");
			}
			this.bind();
		} else {
			console.debug ("***********NO tree available for rendering in builder panel***********");
			//silent fail
		}
	},
	updateSortables : function ( $targetSet ) {
		/*
		//disabled 20120127_0945MST
		if (!$targetSet) {
			$targetSet = $("ul.builder-panel--list-container", this.element);
		}
		var sortables = $targetSet.nestedSortable(
			this.options.sortableProperties
		).disableSelection();
		var sortables = $targetSet.sortable(
			this.options.sortableProperties
		);
		*/
	},
	"{window} promptAdded" : function (windowObj, event, prompt) {
		//NOTE: Moved to application_level
		
		var addedPrompt = prompt ? prompt : event.prompt ? event.prompt : null;
		var $modelElement = $(addedPrompt.elements(this.element)[0]);
		this.scrollContainerToElement( "ul.builder-panel-prompt-list-container" , $modelElement );
		//this.scrollToElement($modelElement);
		$modelElement.trigger($.Event( "promptSelected" , {prompt : addedPrompt}));
		/* 
		*/
		
	},
	scrollContainerToElement : function ( container, target ) {
		if ( $(target).position(container) ) {
			var offsetParent = $(target).offsetParent(),
				objectHeight = $(target)[0].scrollHeight,
				offsetTop = $(target)[0].offsetTop,
				//var scrollToPosition = ($(target).position(container).top-objectHeight);
				scrollToPosition = offsetTop-objectHeight;
			$(container).animate({scrollTop: scrollToPosition},500,"easeOutExpo");
		} else {
			//first element 
			$(container).animate({scrollTop: 0},500,"easeOutExpo");
		}
	},
	/*
	scrollToElement : function (targetElement) {
		if ( targetElement.position() ) {
			var scrollToPosition = targetElement.position().top;	
			$(this.element).animate({scrollTop: scrollToPosition},500,"easeOutExpo");
		} else {
			//first element 
			$(this.element).animate({scrollTop: 0},500,"easeOutExpo");
		}
	},
	*/
	"sortStart" : function (event, ui) {
		var itemIndex = ui.item.index();
		var parentPath = ui.item.parents(".level3_ddpw_administration_builder_panel_item, .prompt_tree > ul");
		var parentModel = $(parentPath[0]).model();
		parentModel.prompts.splice(itemIndex,1);
		console.debug ("sortstart", arguments);
	},
	"sortStop" : function (event, ui) {
		var itemModel = ui.item.model();
		var itemIndex = ui.item.index();
		var parentPath = ui.item.parents(".level3_ddpw_administration_builder_panel_item, .prompt_tree > ul");
		var parentModel = $(parentPath[0]).model();
		parentModel.prompts.splice(itemIndex,0,itemModel);
		console.debug ("sortStop", arguments);
	},
	"{window} tabsselect" : function (windowObj, event, selectedPanel ) {
		console.debug (this.Class.shortName +".tabsselect", arguments);
		if (selectedPanel.panel.id == "builderPanel") 
		{
			this._isActive = true;
			this.refresh();
		} else if (
			selectedPanel.panel.id == "previewPanel"
			||
			selectedPanel.panel.id == "outlinePanel"
		){
			this._isActive = false;
		}
	},
})

});