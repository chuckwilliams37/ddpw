$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Controllers.ClassificationPanelController
 */
$.Controller('Level3_ddpw_administration.Controllers.ClassificationPanelController',
/** @Static */
{
	defaults : {
		selectedModel: null,
		classificationDialog: null
	},
	listensTo : ["promptSelected"]
},
/** @Prototype */
{
	init : function(){
		console.debug (this.Class.shortName + ".init()", this );
		var classificationGroups = this.getSelectedClassificationGroups();
		this.element.html( $.View ("./application/admin_controllers/classification_panel_controller/views/init.ejs",{classificationGroups : classificationGroups, selectedModel: this.options.selectedModel} ) );
		this.element.find(".selectClassificationsButton").button({label:this.element.find(".selectButton").html()});
		//hide delete button for "Everyone" option
		var isEveryone = $(".classificationPanelGroup li", this.element).text().match(/\bEveryone\b/) ? true : false;
		//"everyone" should be mutually exclusive so we shouldn't have to worry about multiple match opps 
		//(unless some classification has the word "Everyone" in it!!!)
		if (isEveryone) { 
			$(".delete", this.element).hide();
		} else {
			$(".delete", this.element).button({
				icons : {primary : "ui-icon-close"}
				,text:false
			});
		}
	},
	".selectClassificationsButton click" : function (element, event) {
		console.debug (".selectClassificationsButton click" , arguments);
		var $classificationDialogController = this.getClassificationDialogContainer().dialog("open").controller();
		if ( $classificationDialogController.options.selectedModel.identity() != this.options.selectedModel.identity() ) { 
			$classificationDialogController.options.selectedModel = this.options.selectedModel;
			$classificationDialogController.init (  );
		}
	},
	getClassificationDialogContainer : function () {
		var selectedModel = this.options.selectedModel;
		//dialogContainer = $("#classificationDialog");
		if ( this.options.classificationDialog != null ) {
			//dialogContainer = $("#classificationDialog");
			//dialogContainer
			dialogContainer = this.options.classificationDialog;
		} else {
			dialogContainer = this.options.classificationDialog = $($.View("./application/admin_controllers/classification_dialog_controller/views/init.ejs",{selectedModel : selectedModel}));
			dialogContainer.dialog({
				height: "450",
				width: "760",
				minHeight: "450",
				minWidth: "300",
				position: ["center","top"],
				resizable : true,
				draggable : true,
				dialogClass : "classificationDialog",
				closeText : "Cancel and close",
				autoOpen : false
			});
		}
		//this.options.classificationDialog = dialogContainer;;
		return dialogContainer;
	},
	getSelectedClassificationGroups : function () {
  		var classificationsGroupOrder = [];
  		if (this.options.selectedModel) {
  			$(this.options.selectedModel.classifications).each( function (index, element) {
	  			if ($.inArray(element.type, classificationsGroupOrder) < 0) {
	  				classificationsGroupOrder.push(element.type); 
	  			}
	  		});
	  		if (classificationsGroupOrder.length == 0) {
	  			//if there are no classifications then "everyone"
				classificationsGroupOrder.push("General"); 
				this.options.selectedModel.classifications.push(new Level3_ddpw_administration.Models.Classification({name:"Everyone",domain:"com.level3.ddpw",type:"General"}))
	  		}
  		}
  		return classificationsGroupOrder;
	},
	"{selectedModel} classifications" : function (element,event)  {
		console.debug("{selectedModel} classifications", event);
		this._unbind();
		this.init();
		this.bind();
	},
	"{window} promptSelected" : function (window, event, promptModel) {
		console.debug (this.Class.shortName + ".{window} promptSelected", arguments);
		this.options.selectedModel = promptModel ? promptModel : $(event.target).model();
		console.debug ("this.options.selectedModel", this.options.selectedModel);
		//since the model has changed - we need to update the bindings (for {selectedModel} implementations)
		this._unbind();
		this.init();
		this.bind();
	},
	".delete click" : function (element, event) {
		console.debug (this, arguments);
		var selectedModel = this.options.selectedModel;
		var removeKey = element.data("classification_key");
		selectedModel.classifications.splice(removeKey, 1);
		this.element.trigger ( "saveTree" );
		this.init();
	}
	
});

});