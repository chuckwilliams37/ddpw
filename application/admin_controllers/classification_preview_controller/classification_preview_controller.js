$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Controllers.ClassificationPreviewController
 */
$.Controller('Level3_ddpw_administration.Controllers.ClassificationPreviewController',
/** @Static */
{
	defaults : {
		classificationNames : null, 
		classificationGroupNames : null,
		selectedClassifications : {
			segment : ["Unknown/Undefined"],
			product : ["Unknown/Undefined"],
			bandwidth : ["Unknown/Undefined"]
		}
	},
	listensTo : ["treeSelected"]
},
/** @Prototype */
{
	init : function(){
		console.debug("in init of classification controller", this);
		if ( !this.isReady() ) {
			this.getClassifications();
		} else {
			this.refreshView();
		}  
	},
	_isReady : false, 
	isReady : function () {
		if ((this.options.selectedClassifications) && (this.options.classificationNames) && (this.options.classificationGroupNames)){
			this._isReady = true;
		}
		return this._isReady;
	},
	//check the rest service code 
	getClassifications : function () {	
		Level3_ddpw_administration.Models.Classification.findAll( {domain : $.cookie("domain") }, this.onGetClassificationsComplete );
	},	
	onGetClassificationsComplete : function(  ){
		console.debug ("onGetClassificationsComplete " , arguments);
		var $classificationComponentsController = $("#classificationComponents").controller();
  		$classificationComponentsController.options.classificationNames = Level3_ddpw_administration.Models.Classification.getClassificationHierarchy();
  		$classificationComponentsController.options.classificationGroupNames = Level3_ddpw_administration.Models.Classification.getClassificationGroupNames();
        this._isReady = true;
    	$classificationComponentsController.refreshView();
        $classificationComponentsController.element.trigger( "classificationSelectionPanelIsReady" );
  	},
  	refreshView : function () {
  		console.debug ( this.Class.shortName + ".refreshView()" );
  		this.element.html( $.View ("./application/admin_controllers/classification_preview_controller/views/init.ejs",
  					{
  					classificationNames:this.options.classificationNames,
  					classificationGroupNames:this.options.classificationGroupNames,
  					selectedClassifications:this.options.selectedClassifications
  					}));
  	}
  			
})
});