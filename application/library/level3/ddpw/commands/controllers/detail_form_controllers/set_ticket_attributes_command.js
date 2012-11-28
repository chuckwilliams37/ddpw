$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Library.Level3.Ddpw.Commands.Controllers.DetailFormControllers.SetTicketAttributesCommand
 * @inherits jQuery.Controller
 * Wraps backend classification services.  
 */
$.Controller('Level3_ddpw_administration.Library.Level3.Ddpw.Commands.Controllers.DetailFormControllers.SetTicketAttributesCommand',
/* @Static */
{  	
	defaults : {
	//	createUrlOption : "",
	//	createUrl : "",
	//	customUrl : "",
		createMessage : "Thank you!  You will now be redirected.",
		displayCreateMessage : false,
		command : null,
		requiredProperties : null
	},
	listensTo : []
},
/* @Prototype */
{
	init : function () {
		console.debug ( this.Class.shortName + ".init()", this );
			
		
		var len = this.isEmpty(this.options.command.commandData);
	    var i =0;
		if( !len  && this.options.command.commandData.formParams != 'undefined' && this.options.command.commandData.formParams.ticketProperties != 'undefined')
		{
		i = this.objectSize(this.options.command.commandData.formParams.ticketProperties);
		}
		//		var i = this.options.command.data.formParams?this.options.command.data.formParams.ticketProperties?this.options.command.data.formParams.ticketProperties.length:0:0;//$(".createTicketItemContainer", this.element).length;
		var viewHtml = $.View ( "./application/library/level3/ddpw/commands/views/detail_form_renderers/set_ticket_attributes_command_details.ejs" , { command : this.options.command ,i:i,environmentVarList:Level3_ddpw_administration.Library.Level3.Ddpw.Commands.SetEnvironmentVariableCommand.getEnvironmentVarList()});
		this.element.html ( viewHtml );
		
		this.initFormControls ();
	//	this.showCustomTextField();
	
		$(".remove-command-option").button ({ 
			icons : {
				primary : 'ui-icon-close'
			}
		});     
		
	},
	objectSize : function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
},
// Get the size of an object

	isEmpty : function(ob){
	   for(var i in ob){ if(ob.hasOwnProperty(i)){return false;}}
	    return true;
	}
	,initFormControls : function () {
	
	//stubbed out - createTicket initFormControls go here
		
		if (typeof (this.options.command.commandData) != 'undefined' &&  typeof (this.options.command.commandData.formParams) != 'undefined' ) {
			var form = $("#commandDetailsForm");
			
			var $thisController = this;
			
			$.each ( $("#commandDetailsFormContainer .selectTicketValues") , function ( index, element ) {
				element.value == "Custom" ? $thisController.displayCustomValue ( index , true ) :  $thisController.displayCustomValue ( index , false );
				element.value == "EnvironmentVariable" ? $thisController.displayEnvironmentList ( index , true ) :  $thisController.displayEnvironmentList ( index , false );
			});
			
		} 
	
		displayCreateMessage = $("input[name='displayCreateMessage']:checked").val();
		
		if ( displayCreateMessage == "true" ) {
			$(".createMessageDetailsContainer").show();
		} else {
			$(".createMessageDetailsContainer").hide();		
		}	
	},
	
	 ".addAnotherCommandOption click" : function (element, event) {
	 		var i = $(".createTicketItemContainer", this.element).length;
	 		var attrlength = i+1,
            newRenderedView = $.View ( "./application/library/level3/ddpw/commands/views/detail_form_renderers/set_tkt_attr_container.ejs" , { command : this.options.command , i:i ,attrlength:attrlength,environmentVarList:Level3_ddpw_administration.Library.Level3.Ddpw.Commands.SetEnvironmentVariableCommand.getEnvironmentVarList()});
            $(newRenderedView).appendTo('.createTicketDetailsContainer');      
                  $('.createTicketDetailsContainer').scrollTop(1000);
            $(".remove-command-option").button ({ 
				icons : {
					primary : 'ui-icon-close'
				}
			});     
            return false;
      },
      ".remove-command-option click" : function (element, event) {
			//here the incoming formParms (defined in the form) must match the values tha the command-controller sets
			var targetContainer = element.closest(".createTicketItemContainer").remove()
			this.options.command.commandData.formParams = $("#commandDetailsForm", this.element).formParams();
			this.init();
			return false;
      },
      ".selectTicketValues change" : function (element, event) {
      
      var selectedIndex = $("#commandDetailsFormContainer .selectTicketValues").index(element);
      		console.debug ("selectedIndex: " + selectedIndex);      		

      		if(element.val() == "Custom")
      		{      					
	      		this.displayEnvironmentList ( selectedIndex , false );
      			this.displayCustomValue ( selectedIndex , true ) ;
      			}
			else		if(element.val() == "EnvironmentVariable")
			{
				this.displayCustomValue ( selectedIndex , false );
				this.displayEnvironmentList ( selectedIndex , true );
			}
			else{
				this.displayCustomValue ( selectedIndex , false );
				this.displayEnvironmentList ( selectedIndex , false );
			}
      },
      displayCustomValue : function ( selectedIndex , isDisplayed ) {
      		if ( isDisplayed ) {
	      		$("#commandDetailsFormContainer .customValue").eq(selectedIndex).show();      
	      	} else {
	      		$("#commandDetailsFormContainer .customValue").eq(selectedIndex).hide();      
	      	}
      },      
      displayEnvironmentList : function ( selectedIndex , isDisplayed ) {
      		if ( isDisplayed ) {
	      		$("#commandDetailsFormContainer .environmentVarList").eq(selectedIndex).show();      
	      	} else {
	      		$("#commandDetailsFormContainer .environmentVarList").eq(selectedIndex).hide();      
	      	}
      }, 
      
	processForm : function ( context ) {
		
    	/*
    	var incomingData = 
    	var custValues = incomingData.ticketCustomValue;
    	$.each(incomingData.ticketProperties, function(key,val) {
    		var targetValue = custValues[key];
			if(targetValue != null && targetValue != ""){
				newTicketPxy.set(val,targetValue);
			} else { 
				// Implementation to store Response Option - handled in execution view : Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CreateTicketCommand.execute();
			}
		});
		*/
		
		this.options.command.commandData.ticketProxy = new Level3_ddpw_administration.Models.ClarifyTicketProxy();;
		this.options.command.commandData.formParams = $("#commandDetailsForm", this.element).formParams();
		
		console.debug (this.Class.shortName + ".processForm () " , this );
	}
	});
})