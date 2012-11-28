$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Controllers.ClassificationPanelController
 */
$.Controller('Level3_ddpw_administration.Controllers.ClassificationDialogController',
/** @Static */
{
	defaults : {
					classifications : null, 
					classificationsGroupOrder : null,
					dialogButtonSettings : {
					},
					selectedModel : null,
					classificationsLastRetrievedDateTime : null,
					classificationsTimeoutMs : 24*60*60*1000
				},
	listensTo : []
},
/** @Prototype */
{
	init : function(){
		console.debug (this.Class.shortName + ".init()" , this);
		this.getClassifications();
		this.setupDialogButtons();
	},
	setupEveryoneBehavior : function () {
		//enable & disable for "Everyone" option
		console.debug ("enable/disable everyone option");
  		$("input.everyoneSelection").change ( function () {
  			$(this).attr("checked") ? $(".classificationGroup input").attr("checked", false) : null;
  		});
  		$(".classificationGroup input").change ( function ()  {
  			console.debug ($(".classificationGroup input:checked").length);
  			$("input.everyoneSelection").attr("checked", !($(".classificationGroup input:checked").length > 0));
  		});
	},
	getClassifications : function () {
		  	
	    var $applicationAdminController = $("#main").controller();
	  	var url2 = "?callingApp=TICKETING_PORTAL&userName="+$applicationAdminController.options.userInfo.portalUserName
	
		var classificationsServiceUrl = Level3_ddpw_administration.Controllers.ApplicationController.ROOT_PROMPT_TREE_DATA_SERVICE_PATH +"/classifications/Ticketing/"+url2,
		now = new Date(),
		lastRetrieved = this.options.classificationsLastRetrievedDateTime,
		timoutMs = this.options.classificationsTimeoutMs;
		if ( lastRetrieved == null || ( lastRetrieved && lastRetrieved.getTime() > 0 && ( now.getTime() - lastRetrieved.getTime() ) > timoutMs ) ) {
			$.ajax ({
	  			type: "GET",
	  			url: classificationsServiceUrl,
	  			success: this.onGetClassificationsComplete,
	  			error : function (jqXHR, textStatus, errorThrown) {
	  				alert ("error");
	  				console.debug (arguments);
	  			}
	  		});
	  	} else {
	  		this.refreshClassificationsList();
	  	}
	},	
	onGetClassificationsComplete : function(data, textStatus, jqXHR){
  		console.debug("onGetClassificationsComplete: " , arguments);
		var classifications = {};
  		var classificationsGroupOrder = [];
		
  		$("TroubleTicketClassification", data).children().each( function (index, element) {
  			if (!classifications.hasOwnProperty(element.nodeName)) {
  				classifications[element.nodeName] = []; 
		  		//node order indicates which classification types **should** be rendered first.
  				classificationsGroupOrder.push(element.nodeName); 
  			}
  			classifications[element.nodeName].push( element.textContent );
  		} );
  		
  		var $classificationDialogController = $("#classificationDialog").controller();
  		
  		$classificationDialogController.options.classificationsLastRetrievedDateTime = new Date();
  		$classificationDialogController.options.classifications = classifications;
  		$classificationDialogController.options.classificationsGroupOrder = classificationsGroupOrder;
  		$classificationDialogController.refreshClassificationsList();
  	},
  	refreshClassificationsList : function () { 
  		console.debug ("refreshClassificationsList()");
  		var classificationGroupLists = [];
  		var $renderedHtml = $("<tr/>");
  		for (var groupKey in this.options.classificationsGroupOrder) {
  			var groupName = this.options.classificationsGroupOrder[groupKey];
  			 $renderedHtml.append( $.View( "./application/admin_controllers/classification_dialog_controller/views/classification_group_container.ejs", {groupName : groupName, items : this.options.classifications[groupName]} ));
  		}
  		$("#classificationGroupsTable tr").replaceWith ( $renderedHtml );
  		var classificationGroupElement = $(".classificationGroup");
  		var calculatedPixelWidthValue =  (classificationGroupElement.width() + parseInt(classificationGroupElement.css("margin-left")) +  parseInt(classificationGroupElement.css("margin-right"))) * this.options.classificationsGroupOrder.length;
  		$("#classificationGroupsTable").width(calculatedPixelWidthValue);
  		this.setClassificationSelections();
  	},
  	setClassificationSelections : function () {
  		var modelClassificationValues = [];
  		var selectedClassifications = this.options.selectedModel.classifications;
  		for (var classificationKey = 0; classificationKey < selectedClassifications.length; classificationKey ++) {
  			modelClassificationValues.push (selectedClassifications[classificationKey].name);
  		};
  		
  		console.debug ("modelClassificationValues: " , modelClassificationValues);
  		
  		var inputCollection = $("#classificationDialog input");
  		inputCollection.each(function (i, el) {
			if ($.inArray( $(this).val() , modelClassificationValues) >=0 ) {
				$(this).attr ("checked" , true);
			}
  		});
  		
		this.setupEveryoneBehavior();
  	},
	getActiveTree :function () {
		return $("#main").controller().options.selectedTree;
	},
	setupDialogButtons : function () {
		$("#classificationsControlsContainer button.cancelButton", this.element).button(this.options.dialogButtonSettings);
		$("#classificationsControlsContainer button.saveButton", this.element).button(this.options.dialogButtonSettings);
	},
	".cancelButton click" : function () {
		console.debug (this + ".click()", arguments);
		this.element.dialog("close");
		return false;
	},
	".saveButton click"  : function () {
		console.debug (this + ".click() ", arguments);
		//get selected classifications
		var selections = $("form", this.element).formParams();
		//assign selected classifications to prompt model
		var treeDomain = this.getActiveTree().domain;
		var selectedModel = this.options.selectedModel;
		var assignedClassifications =  [];
		for (var classificationType in selections) {
			for (var classification in selections[classificationType]) {
				var newClassification = new Level3_ddpw_administration.Models.Classification({
						domain : treeDomain
						, name : selections[classificationType][classification]
						, type : classificationType
					});
				assignedClassifications.push(newClassification);
			}
		}
		if (assignedClassifications.length == 0) {
			alert ("No selections made, defaulting to Everyone...");
		}
		selectedModel.attr("classifications", assignedClassifications);
		
		try {
		
			var $propertiesPanelControlController = $("#propertiesPanel").controller();
			selectedModel.attrs( $propertiesPanelControlController.updateCurrentModelFromForm ( $propertiesPanelControlController.element.find("form") ) );
		}
		catch (e) {
			console.debug (e );
		}
		
		this.element.trigger ("saveTree");
		this.element.dialog("close");
		
		
		return false;
	},
	".classificationGroup .check-all change" : function ( element, event ) {
		console.log ( ".classificationGroup .check-all change" , arguments );
		var targetGroup = $(element).closest(".classificationGroup").find("input:checkbox:not(.check-all)");
		targetGroup.attr("checked", $(element).is(":checked"));
	}
	
	
});

});