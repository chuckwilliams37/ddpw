$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Controllers.PreviewPanel.AddAttachments
 */
$.Controller('Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Controllers.PreviewPanel.AddAttachments',
	/** @Static */
	{

		defaults : {
			 model: Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.AddAttachments //this is a reference to the static model object
			,toolType : null
			,prompt : null //this is a reference to an instance of the model
		}
	},
	/** @Prototype */
	{
		init : function ( element, options ){
			console.debug (this.Class.shortName + ".init()", this, arguments);
			_thisController = this; // this becomes an instance global variable!
			//here we'll place some initialization code to actually wire in the blueimp file upload plugin
			// -- add doc URL here.
			
			this.element.append ( " <script> "
				+"		var isIe = false;"
				+" </script>"
				+"  <!--[if lt IE 10]> "
				+"  <script>"
				+"		isIe = true;"
				+"  </script>"
				+"  <![endif]-->"
			);			
			$("button.file_upload").button();			
			
		},
		"button.file_upload click" : function ( element, event ) {
			//event.stopImmediatePropagation();
			//event.preventDefault();
			
			var fileUploadDialog = this.getFileUploadPopup();
			
			// bind the buttons created in the fileUploadDialog context and pass the function name to handle resp. behavior
			//$("button.destroy", fileUploadDialog).bind ( "click" , this.destroyButton) ;
			$("button.continue_button", fileUploadDialog).bind ( "click" ,this.continueButton);

			fileUploadDialog.dialog({
				title :"Upload Files (Max 3) ",
				button: {
					text: "Browse"
					}
			});												
		},
		
		getFileUploadPopup : function (element, event ) {
			var thisPopup = this,
				fileUploadElement = $("<div></div>"),
				fileInputElement = $(''
					+ ' <div class="file_upload_element_container">'
					+ ' <input id="fileupload" type="file" name="File" class="fileInput" />'
					+ ' </div>'
				),
				actionCompleteElement = 
						$("<div class='ui-widget ui-widget-container'><button class='continue_button'> Done</button></div>");

			_thisController.options.prompt.responseOptions.each ( function ( index, responseOption ) {
					console.debug ("adding response option: ", responseOption );
					console.debug ("adding at index: ", index );
					fileUploadElement
						.append( fileInputElement.clone().attr("name","file[" + index + "]" ) );							
													
			});
				//let's see what happens with it wired up... 
				//It is commented out below. However, the attachmentURL is there too. Meaning that he does upload AND attach/send to s:drive.
				//ok - lt's take care of missing ars - then we'll undo our binding for the done button
				//because it looks likt eh fileupload plugin has these events... let's check the docs real quick

			fileUploadElement.append( actionCompleteElement.clone() );
			return fileUploadElement;			
		},
		
		continueButton: function(event, element) {//by the time this is clicked - the dat has already presumably been set on the fileupload plugin - so
		//we have to grab it from the plugin instance after the fact here -
		//or set it within the plugin event....
		//which would you rather?
		//1st
		//ok
			
			var fileNameObjectsArray = $.map( $(this).closest(".ui-widget-content")
											.find(".file_upload_element_container input"), 
													function ( element, index ) { 
														return { fileName: $(element).val() }
													} 
										);
			/*
			//will look like:			
			[
				Object
				fileName: "C:\fakepath\Koala.jpg"	// fakepath comes from Chrome as a security measure...
				, 
				Object
				fileName: "C:\fakepath\Hydrangeas.jpg"
				, 
				Object
				fileName: "C:\fakepath\Jellyfish.jpg"
			]						
			*/
				
			var thisPrompt = _thisController.options.prompt;//this grabs the instance
			// populate the filenames in responseOptions with filenames stripped of their 'fakepath':			
			thisPrompt.responseOptions.each ( function (index, responseOption ) {	
			
	            var pathStrippedFilename = fileNameObjectsArray[index].fileName; 
				pathStrippedFilename = pathStrippedFilename.substr(pathStrippedFilename.lastIndexOf('\\') + 1);								
				thisPrompt.responseOptions[index].value.fileName = pathStrippedFilename;					
				thisPrompt.responseOptions[index].label = pathStrippedFilename;				

				console.debug("file name: " + index + " - filename: " + thisPrompt.responseOptions[index].value.fileName);											
				console.debug("file name: " + index + " - label: " + thisPrompt.responseOptions[index].label);											
								
			});

			//TODO: Complete this section and below......
										
				//ticket ID will have to be added later - so AttachmentURL will have to be appended or calculated at final submit
				//ticket ID comes back after createTicketCommand - so we'll ahve to listen for the complete event.... sorry
				// comment: are you saying that we come back to this point once interview complete? and in hand a ticketID?
				// yes - not necessarylil to this positino in the code - we'll have to keep a reference to the fileupload plugin object
				/// so that we can retrieve at that time

			var	fileUploadElement = $("<div></div>"),
				fileInputElement = $(''
					+ ' <div class="file_upload_element_container">'
					+ ' <input id="fileupload" type="file" name="File" class="fileInput" />'
					+ ' </div>'
				),		
				ticketId = '2435944', //should NOT fail
				attachmentUrl = '/portalWeb/TicketingProxy/ticketingRestServices/v2.0/troubleTickets/'
								+ ticketId + '/attachment?callingApp=TICKETING_PORTAL';
     
			     // If this is IE than we need to tell portal proxy servlet 
			     // to set the forword accept header to "application/json" and 
			     // to set the returned content-type header to "text/html"
			     // we only need to do this for file attachment.
			     
		     if (isIe == true) {
		          //attachmentUrl += "&isBlueIeUpload=true"
		     }			
			_thisController.options.prompt.responseOptions.each ( function ( index, responseOption ) {

					console.debug ("responseOption at index " + index + " has filename: " + responseOption.value.fileName );

	
					fileUploadElement.append( fileInputElement.clone().attr("name",  responseOption.value.fileName) );

//					$('#fileupload').fileupload('add', {files: {responseOption.value.fileName} }  );
//					fileInputElement.fileupload('data').find("#fileupload") SAME as: $("#fileupload")

					// NOT WORKING: this does not get inside the fileupload. next thing executed is console.debug("DONE")
					var option = $("#fileupload").fileupload('option');
					console.debug(" Option: ", option);
					$("#fileupload")
						.fileupload({ 
							
					        url: "C:\temp",	//attachmentUrl,
					        dataType: 'text/plain',
					        formData: {
					            "Audience" : "external"
				        		},
					           
					        send: function (e, data) {
					        	 console.debug ( "fileEvent : send:  " , arguments );
					        	 console.debug ( "fileEvent : send: DATA " , data );
					        	 console.debug ( "fileEvent : send: e " , e );					        	 
					        	 
					        	 //return false; //to cancel send -- 'autoUpload' option is only for UI version
					        	
					            var file = e.srcElement.files[index].name;
					            var file = file.substr(file.lastIndexOf('\\') + 1);
					            
					            console.debug("Current file: ", file);
					            uploadNumber = index;
					             $("#file_upload_element_container").append('<tr><td width="200px">'+file+'</td><td id="FN'+uploadNumber+'"><span class="qq-upload-spinner">&nbsp;</span>&nbsp;&nbsp;uploading</td>');
					             
					        },
					        done: function (e, data) {
					        	 console.debug ( "fileEvent : done: " , arguments );
					        	
					            var docId = 0;
					            try {
					                docId = data.result.level3Response.Attachment.DocumentId;
					            } catch(e) {}
					            
					            if (docId > 0) {
					            	$("#FN"+uploadNumber).html('<span style="color: green">DONE</span>');
					            } else {
					                alert('unSuccess '+docId);
					            }
					            
					        }
			    		})		    		
			    		.bind('change', function (e) {			    		
					    		var fileName =  e.srcElement.value;
					    		console.debug("In change - filename is: " + fileName);
							    $(this).fileupload('add', {
							    	//console.debug("this: " + $(this));
							        fileInput: $(this)
							    });
								console.debug("filename index: " + index);							    
		   						console.debug("filename: " + fileName.substr(fileName.lastIndexOf('\\') + 1));
								var prompt = _thisController.options.prompt;
										
						}); // .bind
																							
				console.debug("DONE! ");								    										
				}); // .each
			
				//convert file inputs into response options list : DONE
				//where this.prompt.responseOptions[x].value= filedataobject - NOT doing this as you recommended
				//and   this.prompt.responseOptions[x].label= fileName
				
				// MISSING:
				//do some logic to call this.prompt.responseOptions[x].setSelectede ( treu/fabel
				
				// close dialog:
				$(event.srcElement).closest(".ui-dialog-content").closest("div").dialog("destroy");
	
			
			} // continue_button
		
}); // prototype	
}); // document ready
