$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Controllers.ApplicationController
 */
$.Controller('Level3_ddpw_administration.Controllers.ApplicationController',
/** @Static */
{
	ROOT_DATA_SERVICE_PATH : "/portalWeb/TicketingProxy/ticketingRestServices/v2.0",
	//ROOT_PROMPT_TREE_DATA_SERVICE_PATH : "/portalWeb/TicketingProxy/ticketingRestServices/v2.0/promptTree",
	ROOT_PROMPT_TREE_DATA_SERVICE_PATH : "http://ingresos.dev1:8000/webservices",
	defaults : {
		promptTreeCollection:new Level3_ddpw_administration.Models.PromptTree.List()
		,model: Level3_ddpw_administration.Models.PromptTree
		,selectedTree : null
		,selectedPrompt : null
		,selectedResponseOption : null
		,selectedModel : null
		,environmentVarList : new Level3_ddpw_administration.Models.EnvironmentVariables()
	},
	listensTo : ["treeSelected","promptSelected","responseOptionSelected","saveTree"]
	
},
/** @Prototype */
{
	init : function(){
		if ( typeof (console) == 'undefined' || console == null ) {
			 
			 window.console = {
			 	debug : function () {},
			 	log : function () {},
			 	info : function () {}
			 }
		}
		//console.debug(this.Class.shortName + ".init()",this);
		//TODO: this.getPermissibleDomains() this is being called twice.  Need to cleanup and step -through with an event driven flow.
		var $thisController = this;
		this.getUserInfo().then ( $thisController.afterGetUserInfo );
	

	},
	afterGetUserInfo : function () { 
		var $thisController = this;
		$thisController.setEnvSystemVariables();
		$thisController.getPermissibleDomains();			//<-- add wrapper for login/confirm here before application starts
		$thisController.initAjaxSetup();
		$thisController.initModels(); 
		$thisController.initViews();
	},
	getPermissibleDomains : function() { 										
			/*	We're searching for the permission set for this user and looking for these values
				to trigger the tool:				  	
  					<permission>L3PP SSAdmin Ticket Admin</permission> 
  					<permission>L3PP SSAdmin Billing Admin</permission> 
  					<permission>L3PP SSAdmin</permission> 				
			*/
			//console.debug ( "getPermissableDomains");
			
			var jqXHR = $.ajax({ 
					type: "GET",
					url: '/portalWeb/rest/user/permissions?callingApp=TICKETING_PORTAL&userName='+this.options.userInfo.portalUserName,
					dataType: "xml"} )
  				.done (function( data, textStatus, jqXHR ) {
					var domain = ''; // we'll use var allDomains = []; when we'll have more than 2 to handle    			
					var permission='';						
    				$(jqXHR.responseXML).find("permission").each(function() {
    						permission=$(this).text();						

							if( 'L3PP SSAdmin Ticket Admin' == permission ) {
								domain = 'Ticketing';
								//console.debug("Current permission: " + permission);
							} else
							if( 'L3PP SSAdmin Billing Admin' == permission ) {
								domain = 'Billing';
								//console.debug("Current permission: " + permission);
							} 
	    			});

					if (domain == "") {
						//alert('This user is NOT allowed to access the DDPW tool! Defaulting to "Ticketing"');
					}
					else {
						//console.debug(" --> <name> " + permission + "found!");
					}    				
  				})
  				.fail (function() {
  					alert('Could not read permissions! Defaulting domain to "iComplete".');
  				});
						
			//console.debug('</group>');
			// force this one for now: (until permissions are in place in the March branch)
			
			
			/************************************/
			//HARDCODED USER /DOMAIN ACCESS!!!!!!
			/************************************/
		
			switch ( this.options.environmentVarList.portalUserEmail ) {
			
				case "williams.chuck2@level3.com":
				case "zeile.stephen@level3.com":
					domain = 'ServiceManagement';
				break;
				
				case "milholm.krista@level3.com":
				case "vanbuskirk.tom@level3.com":
					domain = 'Billing';
				break;
				
				default :
					//default permissionts
					//TODO: ask mustapha to update getAllPromptTrees call to accept more than 1 domain
					//guess we'll keep it to one for now... users will have to be added in switch statements to temporarily shortcircuit the 
					// standard permissiont process
					//domain = 'Ticketing'; // <-- 'Ticketing' won't be loaded anywhere in MyLevel3Portal by default (by July).  unknown people can play without risk to any live environments
					domain = 'iComplete'; // 
					//TODO: update the application execution environment so that this is in fact the case
				break;
			}
			// save this value for the session
			$.cookie("domain", domain);	
			
			
			/************************************/
			//END HARDCODED USER /DOMAIN ACCESS!!!!!!
			/************************************/	
			
								
		return domain;
	}, 
	initAjaxSetup : function () {
		//utility function definition - this is the only one, so don't really have a home
		jQuery.isJSON = function(str) {
		 if (jQuery.trim(str) == '') return false;
		 str = str.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
		 return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);
		}		
	},
	initModels : function () {
		console.debug(this.Class.shortName+".initModels()", this);
		var domain = this.getPermissibleDomains();
		var promptTrees = null;	// there must be a way of passing the domain values to findAll()
		
		switch ( domain ) {
			case "Billing":
				promptTrees = this.options.model.findAll({'domain':'Billing'}); 
			break;
			case "Ticketing":
				promptTrees = this.options.model.findAll({'domain':'Ticketing','callingApp':'TICKETING_PORTAL','userName':this.options.userInfo.portalUserName	}); 
			break;
			case "iComplete":
				promptTrees = this.options.model.findAll();			
			break;
		
		}
		
		return promptTrees.then ( this.onGetPromptTrees , this.onGetPromptTreesFail);
	},
	onGetPromptTrees : function (promptTreeCollection) {
		console.debug ("onGetPromptTrees()", arguments);
		var $thisController = $("#main").controller();
		$thisController.options.promptTreeCollection = promptTreeCollection;
		$thisController.checkForMultipleActive(promptTreeCollection);
		$thisController.loadPromptTreeViews (promptTreeCollection);			
	},
	onGetPromptTreesFail : function ( returnData , type, message ) {
		console.debug ("onGetPromptTreesFail()", arguments);
		var dialogMessage = "The server did not return any valid data.  Server message : '" + message + "'"
			+ "<p>Initializing application without any data... BE CAREFUL! If the database is messed up, your data may not save!</p>";
		
		$("<div></div>").html(dialogMessage).dialog ( {
			title : "Data Failed to Load",
			buttons: {
			    	"Ok" : function() { $(this).dialog("close"); }
			}
		});
		var promptTreeCollection = new Level3_ddpw_administration.Models.PromptTree.List ([]);
		$("#main").controller().loadPromptTreeViews (promptTreeCollection);
	},
	checkForMultipleActive : function ( promptTreeCollection ) {
		if ( promptTreeCollection.getActiveTrees().length > 1 ) {
			var warningDialogHtml = "<div> WARNING: More than 1 tree is set active! " 
					+ " Please select which tree should be active for the " 
					+ ($.cookie("domain").toString())
					+ " Domain. In some cases this is unavoidable, for instance, this may have occured by someone else using the system"
					+ " setting a tree to active state.</div>",
				$warningDialog = $(warningDialogHtml).dialog({
					title : "Warning: MULTIPLE ACTIVE TREES",
					modal: true,
					dialogClass : "ui-state-error",
					buttons: {
						Ok: function() {
							$( this ).dialog( "close" );
						}
					}
				});
		}
	},
	loadPromptTreeViews : function (promptTreeCollection) {
		new Level3_ddpw_administration.Controllers.PromptTreeController($("#right_panel_container"),{
			//will be an array of top-level objects (that have been parsed in the prompt_tree.models() method post ajax call through ajax conversion)
			promptTreeCollection:promptTreeCollection
			,model: Level3_ddpw_administration.Models.PromptTree
		});
		new Level3_ddpw_administration.Controllers.BuilderPanelController ($("#builderPanel"),{promptTreeCollection: promptTreeCollection});
	},
	initViews :  function (){
	
		this.element.html ( 
			$.View ( "./application/admin_controllers/application_controller/views/init.ejs" )
		);
	
		new Level3_ddpw_administration.Controllers.PropertiesPanelController ($("#propertiesPanel"),{});
		new Level3_ddpw_administration.Controllers.ToolsPanelController ($("#tools_panel"),{});
		new Level3_ddpw_administration.Controllers.PreviewPanelController ($("#previewPanel"),{});
		new Level3_ddpw_administration.Controllers.OutlinePanelController ($("#outlinePanel"),{});
		$("#left_panel_container").tabs(
				{
					disabled : [1],
					tabTemplate : '<li><a href="#"><span>#{label}</span></a></li>'
				}
		);
		$("#center_panel_container").tabs(
				{
					disabled : [1,2],
					tabTemplate : '<li><a href="#"><span>#{label}</span></a></li>'
				}
		);
	},
	"treeSelected" : function (element, event) {
		console.debug ("application: a tree was selected", arguments);
		this.options.selectedModel = this.options.selectedTree = event.promptTree ? event.promptTree : $(event.target).model();	
	},
	clearLocalTreeReference : function ( localRefName ) { 
                localRefName = localRefName ? localRefName : "selectedTree"; 
                this.options[localRefName] = null; 
     }, 
    "treeUnselected" : function ( element, event ) { 
                //do something here 
                console.debug ( this.Class.shortName +".treeUnselected()"); 
                this.clearLocalTreeReference(); 
    },
	"promptSelected" : function (element, event, promptModel) {
		console.debug ("application: a prompt was selected", arguments);
		this.options.selectedModel = this.options.selectedPrompt = promptModel ? promptModel : event.prompt ? event.prompt : $(event.target).model() ? $(event.target).model() : null;
	},
	"responseOptionSelected" : function (element, event, responseOptionModel) {
		console.debug ("application: a responseOption was selected", arguments);
		this.options.selectedModel = this.options.selectedResponseOption = responseOptionModel ? responseOptionModel : event.responseOption ? event.responseOption : $(event.target).model() ? $(event.target).model() : null;
	},
	"{window} saveTree" : function  (element,event) {
		console.debug ("saveTree" , arguments);
		var treeToSave = event.tree ? event.tree : this.options.selectedTree;
		treeToSave.save();
	},
	"{window} addTool" : function ( element, event ) {
		console.debug (this.Class.shortName + ".addTool()",arguments);
		var selectedModel = this.options.selectedModel ? this.options.selectedModel : this.options.selectedTree;
		var addedPrompt = selectedModel.addPrompt ({
			type:event.toolType,
			prompts:[],
			promptMetaData: Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.getToolDataClass ( event.toolType )
		});
		console.debug ("addedPrompt id: " + addedPrompt.id);

		var $modelElement = $(addedPrompt.elements()[0]);
		if (addedPrompt.Class.shortName == "Prompt"){
			$modelElement.trigger($.Event( "promptAdded" , {prompt : addedPrompt}));
		}
	},
	getUserInfo : function ( ){
				/*var $applicationAdminController = $("#main").controller();
					var userInfo= {};
				    // fill the data model for feedback form
 					userInfo.portalUserName = "EBPP All Access";					
					$applicationAdminController.options.userInfo		 = userInfo ; 	
		  			return	$applicationAdminController.options.userInfo;*/
		
		return Level3_ddpw_administration.Models.UserInformation.getUserInfo(this.onUserInformationComplete , this.onUserInformationFail );
	},
	onUserInformationComplete : function(obj, textStatus, jqXHR){
		
				var userInfo= {};
				    // fill the data model for feedback form
 					userInfo.portalUserName = obj.lastName+" "+obj.firstName;					
					// fill data model for incorrect data form
					userInfo.portalUserEmail = obj.email;
					userInfo.portalUserPhone  = obj.phone;			
					Level3_ddpw_administration.Models.UserInformation.userInfo		 = userInfo ; 		
					var $applicationAdminController = $("#main").controller();
			  		$applicationAdminController.options.userInfo = Level3_ddpw_administration.Models.UserInformation.userInfo;  			
	  	},
	onUserInformationFail : function(obj, textStatus, jqXHR){
	  		
	  		var userInfo= {};
	  		// fill the data model for feedback form
	  		userInfo.portalUserName = "Dummy user";					
	  		// fill data model for incorrect data form
	  		userInfo.portalUserEmail = "dummyUser@dummy.com";
	  		userInfo.portalUserPhone  = "999.999.9999";			
	  		Level3_ddpw_administration.Models.UserInformation.userInfo = userInfo; 		
	  		var $applicationAdminController = $("#main").controller();
	  		$applicationAdminController.options.userInfo = Level3_ddpw_administration.Models.UserInformation.userInfo;
	  		$applicationAdminController.afterGetUserInfo();
	  	},
	 setEnvSystemVariables : function () {	 
	 		var $applicationController = $("#main").controller();
			this.options.environmentVarList.portalUserName = $applicationController.options.userInfo.portalUserName; 			
			this.options.environmentVarList.portalUserEmail =  $applicationController.options.userInfo.portalUserEmail;	
			this.options.environmentVarList.portalUserPhone = $applicationController.options.userInfo.portalUserPhone;
			
			var setEnvVarsEvent = $.Event ( "setEnvironmentVariables" , {environmentVariables : this.options.environmentVariables} ) ;
			this.element.trigger ( setEnvVarsEvent ) ;
	}	
	
	
	
	
}); 

});