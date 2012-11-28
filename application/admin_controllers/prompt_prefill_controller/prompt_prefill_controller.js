$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Controllers.PromptPrefillController
 */
$.Controller('Level3_ddpw_administration.Controllers.PromptPrefillController',
/** @Static */
{
	defaults : {
		selectedModel: null,		
		environmentVarList : new Level3_ddpw_administration.Models.EnvironmentVariables()
	},
	listensTo : ["promptSelected"]
},
/** @Prototype */
{
	init : function(){
		console.debug (this.Class.shortName + ".init()", this );
		this.options.environmentVarList = typeof ( this.options.environmentVarList.Class ) != 'undefined' ? this.options.environmentVarList.serialize() : this.options.environmentVarList;
		var prefillLength = typeof(this.options.selectedModel.prefillData) != 'undefinded' ? this.options.selectedModel.prefillData.length:0;
		for(var i=0;i<prefillLength;i++){
		var prefillType = typeof(this.options.selectedModel.prefillData[i].prefillType) != 'undefinded' ? this.options.selectedModel.prefillData[i].prefillType: "";
		if(prefillType =="Custom"){
			this.displayCustomValue (  true,i );
			this.displayEnvironmentList (  false,i );	
		}
		else if(prefillType =="EnvironmentVariable") {
			this.displayCustomValue (  false,i );
			this.displayEnvironmentList (  true,i );	
		}
		else {
			this.displayCustomValue (  false,i );
			this.displayEnvironmentList (  false,i );	
		
		}
	}
	$(".remove-prefill-option").button ({ 
			icons : {
				primary : 'ui-icon-close'
			}
		});
    $(".addPrefill").button({
			icons : {primary : "ui-icon-plus"}
		});	
	},
	"#prefillType change" : function (element, event) {      		
      		var selectedIndex = $("#left_panel_container .promptPrefillType").index(element);
      		if(selectedIndex != -1){
			this.options.selectedModel.prefillData[selectedIndex].prefillType =  element.val() ;
//      		this.options.selectedModel.prefillData[selectedIndex].prefillValue = ""; 
      		if(element.val() == "Custom")
      		{      					
	      		this.displayEnvironmentList ( false,selectedIndex );
      			this.displayCustomValue (   true,selectedIndex ) ;
      			}
			else if(element.val() == "EnvironmentVariable")
			{
				
				this.displayCustomValue (  false,selectedIndex );
				this.displayEnvironmentList (  true,selectedIndex );
			}
			else{
				this.displayCustomValue (  false,selectedIndex );
				this.displayEnvironmentList (  false,selectedIndex );
			}	
		}		
      }	,
      displayCustomValue : function (  isDisplayed ,selectedIndex) {
      		if ( isDisplayed ) {      				      		
	      		$("#left_panel_container .customValue").eq(selectedIndex).show();     
	      		
	      		 
	      	} else {
	      		$("#left_panel_container .customValue").eq(selectedIndex).hide();     
	      		
	      	}
      }
      ,displayEnvironmentList : function(isDisplayed,selectedIndex){
      		if ( isDisplayed ) {
	      		
	      		$("#left_panel_container .environmentVarList").eq(selectedIndex).show();     

	      	} else {
	      		$("#left_panel_container .environmentVarList").eq(selectedIndex).hide();  
	    
	      	}
      }
      ,
      "#envProperties change" : function (element,event){   
      var selectedIndex = $("#left_panel_container .environmentVarList").index(element);   
     if(selectedIndex != -1){
      this.options.selectedModel.prefillData[selectedIndex].prefillValue = element.val() ;//also call prompt.attr ("defaultResponse" , [responseObjects,...])
      //prompt.attr ("defaultResponse")  
      	}    
      }
      ,"#promptCustomVal change" : function(element,event){
	 	var selectedIndex = $("#left_panel_container .customValue").index(element);   
          if(selectedIndex != -1){
          this.options.selectedModel.prefillData[selectedIndex].prefillValue = element.val() ;
        this.options.selectedModel.defaultResponse[0].value =  element.val() ;      
        }
      },
       ".addPrefill click" : function (element, event) {
       var selectedIndex = $("#left_panel_container .addPrefill").index(element);
      	  if(selectedIndex != -1){
      	$("#left_panel_container .addPrefillOption").eq(3).hide();
      
       this.options.selectedModel.prefillData.push (new Level3_ddpw_administration.Models.PrefillData (  {prefillType : "Custom" , prefillValue : ""} ));        
       this.appendNew();
       }
       
         return false;
       
      },

      appendNew : function () {
      
      	  try {       
	       var i = this.options.selectedModel.prefillData.length;	     
	       var newRenderedView = $.View ( 
		            	"./application/admin_controllers/prompt_prefill_controller/views/prefill_prompt.ejs",
		            	 { 
		            	 	selectedModel: this.options.selectedModel , 	            	 	
		            	 	environmentVarList:this.options.environmentVarList,
		            	 	i: i-1	            	 	
		            });
		      
		     $("#left_panel_container .addPrefillOption").eq(i-2).hide();
	          $(newRenderedView).appendTo('#prefill'); 
	         responseOptions = this.options.selectedModel.responseOptions.length;
	          if(responseOptions == i){
	          $("#left_panel_container .addPrefillOption").eq(i-1).hide();
	          }
	          
	             } catch (e) {
	            	console.debug (e.message, e.stack)
            }
      },
       ".remove-prefill-option click" : function (element, event) {
			
			//here the incoming formParms (defined in the form) must match the values tha the command-controller sets
			var selectedIndex = $("#left_panel_container .remove-prefill-option").index(element);
     		  if(selectedIndex != -1){
				 var prefillLength = this.options.selectedModel.prefillData.length;					 
     		   $("#left_panel_container .addPrefillOption").eq(prefillLength-2).show();
	  			 this.options.selectedModel.prefillData.splice(selectedIndex+1,1);
				var targetContainer = element.closest(".prefillPromptContainer").remove();
				this.init();
			  }
			return false;
   
      }      
});

});