steal("funcunit").then(function(){
	module("DE6614",{
		setup : function(){
	
		}
		,
		teardown : function(){
		
		}
	});
	
	test("CreateTicketCommand_Execution", function(){
		//create new prompt tree with and set it active
		S.open('../application/level3_ddpw_administration.html');
		var promptTreeId = null,
			currentTime = new Date(),
			month = currentTime.getMonth() + 1,
			day = currentTime.getDate(),
			year = currentTime.getFullYear(),
			hours = currentTime.getHours(),
			minutes = currentTime.getMinutes(),
			seconds = currentTime.getSeconds(),
			ampm = hours > 11 ? "PM" : "AM",
			dateTime = (month + "/" + day + "/" + year+ ": " + hours+ ":" + minutes + ":" + seconds + " " + ampm),
			selectAllString = '[ctrl]a[ctrl-up]',
			textInputString1 = '1: String Test' + dateTime,
			textInputString2 = '2: String Test' + dateTime,
			textInputValue1 = null,
			textInputValue2 = null
			;
		S("#invoke_create span.ui-button-text").exists()
		.click();
		S("#name").exists();
		S("#name").type('DE6614 unit test: ' + dateTime);
		S("#alwaysEffective").exists()
		.click();
		S("#saveButton").exists()
		.click();
		S("form[class*='level3_ddpw_administration_models_prompt_tree_']").visible ( function () {
			promptTreeId = this[0].classList[1];
			ok ( promptTreeId , "Prompt Tree ID: " + promptTreeId );
			console.debug (" promptTreeId: " + promptTreeId );
			S.wait(850);
			//add text input
			S("#tools_panel").exists().click();
			S("#tools_panel span.ui-button-text:eq(0)").exists().click();
			//add text area
			S("#tools_panel").exists().click();
			S("#tools_panel span.ui-button-text:eq(1)").exists().click();
			
			//add Command to text area
			//add command to text area
			
S("#propertiesPanelPromptTypeControlsContainer span.ui-button-icon-primary").exists()
.click();
S("#ui-dialog-title-commandsDialog").exists();
S("#commandsDialogLeftPanel span.ui-button-text:eq(1)").exists()
.click();
S("#commandDetailsForm select.createTicketPropetiesName").exists()
.click();
//add some ticket properties (casetype1, 2, 3, internal note, escalation "2", external note (user entered response)) 
S(".addAnotherCommandOption").exists().click(
	function (){ S.wait (500); }
).click(
).click(
).click(
	function () {
		S("#commandDetailsForm select.createTicketPropetiesName:eq(0) option:eq(24)").exists().click();
		S("#commandDetailsForm select.selectTicketValues:eq(0) option:eq(2)").click();
		S("#commandDetailsForm input.customValue:eq(0)").visible().type('CaseType1:',
			function () {
				ok(/CaseType1:/.test( this.val() ) ,"CaseType1 Set on Command OK.");
			}
		);
	}
).click(
	function () {
		S("#commandDetailsForm select.createTicketPropetiesName:eq(1) option:eq(25)").click();
		S("#commandDetailsForm select.selectTicketValues:eq(1) option:eq(2)").click();
		S("#commandDetailsForm input.customValue:eq(1)").visible().type('CaseType2:',
			function () {
				ok(/CaseType2:/.test( this.val() ) ,"CaseType2 Set on Command OK.");
			}
		);
	}
).click(
	function () {
		S("#commandDetailsForm select.createTicketPropetiesName:eq(2) option:eq(26)").click();
		S("#commandDetailsForm select.selectTicketValues:eq(2) option:eq(2)").click();
		S("#commandDetailsForm input.customValue:eq(2)").visible().type('CaseType3:',
			function () {
				ok(/CaseType3:/.test( this.val() ) ,"CaseType3 Set on Command OK.");
			}
		);
	}
).click(
	function () {
		S("#commandDetailsForm select.createTicketPropetiesName:eq(3) option:eq(28)").click();
		S("#commandDetailsForm select.selectTicketValues:eq(3) option:eq(2)").click();
		S("#commandDetailsForm input.customValue:eq(3)").visible().type(dateTime+': Unit Test note: DE6614 ',
			function () {
				ok(this.val() == dateTime+': Unit Test note: DE6614 ' ,"Custom internal note Set on Command OK.");
			}
		);
	}
);

S("#commandDetailsForm select.createTicketPropetiesName:eq(4) option:eq(2)").click(
	function () {
		ok(this.val() == 'externalNote' , "Custom external note Set ");
		ok(this.closest(".createTicketItemContainer").find(".createTicketValues .selectTicketValues").val() == 'UsersSelectedResponse' 
			, "...to UsersSelectedResponse.");
	}
);
S("button.save-command-close").exists().click();
			
			//add Command to text area COMPLETE
			//add command to text area COMPLETE
			
		//save the tree
		S("#saveButton").exists()
		.click();
		S.wait(2000);
		
			
			//navigate to execution  
			//navigate to execution 
		
			S.open('http://localhost:9001/portalWeb/');
			S("#nav .msie6Tier1Nav:eq(2) a").exists().click();
			S("#servicelookupelm").exists();
			S("#servicelookupelm tbody tr:eq(0) span.this_linkText").exists(60000).click();
			S("#servicelookupelm tbody tr.details:eq(0) input.TicketCreateButton").exists().click();

			//navigate to execution  COMPLETE
			//navigate to execution  COMPLETE
		
			//Enter text into field

			var treeFormSelector = "#"+promptTreeId+"_form",
				selectAllString = '[ctrl]a[ctrl-up]',
				textInputString1 = 'String Test DE6614 Unit Test';
				
			S(treeFormSelector).exists( function () {
				S(".previewPanelItemResponseOptionContainer input[type='text']").exists().type ( '[ctrl]a[ctrl-up]' + "This is my string test" ).blur();
				S(".executionNextButton[role='button']").exists().click();
				S(".previewPanelItemResponseOptionContainer textarea:eq(0)").exists( function () {
					this.type( selectAllString ).wait(1000).type ( textInputString1 );
				});
				S(".executionNextButton[role='button']").exists().click();
				S("span.ui-dialog-title:last").visible().text("Ticket Information", 20000, function () {
					ok (true, "Ticket Results Received" );
					var ticketId = this.closest("div[role='dialog']").find(".ui-dialog-content b").text();
					ok ( ticketId , "Ticket ID is: " + ticketId);
				});
			});
			
			
			
	
			//Delete Tree
			
			S.open('../application/level3_ddpw_administration.html');
			S.wait(2000, null,  "Deleting tree in 2s");
			var treeSelector = "."+promptTreeId;
			S(treeSelector).find("button.destroy").exists().click();
			
			S("span.ui-dialog-title:last").visible().text("Confirmation");
			
			S("div.ui-dialog-buttonset button").exists().click();
			/*
			*/
			
		});
		
		/*
		
		//select preview panel and test value
		S.wait(500);
		S("#saveButton").visible()
		.click();
		S("#centerPanelTabContainer a:eq(1)").exists().click();
		S("#previewPanelTreeTitle span.ui-button-text").exists();
		S("#classificationsSelectionContainer select.classification-components-select:eq(0)").exists();
		//text input entry
		S("#promptListOuterContainer input[type='text']").exists()
		.type(selectAllString+textInputString1);
		//submit response:
		S(".prompt .nextButton span.ui-button-text").exists()
		.click();
		//text area entry
		S("#promptListOuterContainer textarea").exists()
		.type(selectAllString+textInputString1);
		//submit response:
		S(".prompt .nextButton span.ui-button-text").exists()
		.click();
		
		S(".ui-dialog-title").exists().text("Interview Complete");
		S(".ui-dialog-buttonset button").visible().click( function () {
			textInputValue1 =  S("#promptListOuterContainer input[type='text']").val();
			console.debug (" textInputValue1: " + textInputValue1, "length: " + textInputValue1.length );
			ok( textInputValue1.length > 0 , "Text Input has a value with a string length > 0");
			ok( textInputValue1 == textInputString1 , "Text Input is expected value");
			console.debug (" textInputString1: " + textInputString1);
		});
		//change the value of the first text input and see if it stores
		S("#promptListOuterContainer input[type='text']").exists()
		.type(selectAllString+textInputString2);
		//submit response:
		//should invoke change logic
		S(".prompt input[type='text']").closest(".nextButton span.ui-button-text").exists()
		.click(
			function () {
				console.debug ("CHANGE LOGIC INVOKED??");
				S(".promptActions").find(".nextButton span.ui-button-text").exists().click(
					function () {
						S("span.ui-dialog-title:last").visible().text("Interview Complete");
						S("div.ui-dialog-buttonset button").exists().click( function () {
							textInputValue2 =  S("#promptListOuterContainer input[type='text']").val();
							console.debug (" textInputValue2: " + textInputValue2, "length: " + textInputValue2.length );
							ok( textInputValue2.length > 0 , "Text Input has a value with a string length > 0");
							ok( textInputValue2 == textInputString2 , "Text Input is expected CHANGED value");
							console.debug (" textInputString2: " + textInputString2);
							console.debug ("CHANGE LOGIC PREVIEW PANEL COMPLETE");
							console.debug ("Deleting tree in 5s");
							S.wait(5000);
							var treeSelector = "."+promptTreeId;
							S(treeSelector).find("button.destroy").exists().click();
							
							S("span.ui-dialog-title:last").visible().text("Confirmation");
							S("div.ui-dialog-buttonset button").exists().click( function () 
						});	
					}
				);
			}
		);
		
		
		/*
		S("#ui-datepicker-div a.ui-state-default:eq(8)").exists()
		.click();
		S(".ui-dialog-title").exists().text("Interview Complete");
		S(".ui-dialog-buttonset button").exists().click( function () {
			textInputValue2 =  S("#promptListOuterContainer input[type='text']").val();
			console.debug (" textInputValue2: " + textInputValue2, "length: " + textInputValue2.length );
			ok( textInputValue2.length > 0 , "Text Input 2 has a value with a string length > 0");
			ok( textInputValue2 == textInputString2 , "Text Input 2 is expected value");
		});
		*/
	});
	
	/*
	test("execution_view_next", function(){
		//navigate to execution
		S.open('http://localhost:9001/portalWeb/');
		S("#nav .msie6Tier1Nav:eq(2) a").exists().click();
		S("#servicelookupelm").exists();
		S("#servicelookupelm tbody tr:eq(0) span.this_linkText").exists(30000).click();
		S("#servicelookupelm tbody tr.details:eq(0) input.TicketCreateButton").exists().click();
		
		//test for input storage and 
		S(".execution-view-prompt-list-container input.date_picker").exists();
		S(".execution-view-prompt-list-container img.ui-datepicker-trigger").exists()
		.click();
		//select a couple mounths out.
		S("#ui-datepicker-div span.ui-icon:eq(1)").exists()
		.click()
		.exists()
		.click();
		S("#ui-datepicker-div a.ui-state-default:eq(16)").exists()
		.click();
		S(".ui-dialog-title").exists().text("Interview Complete");
		S(".ui-dialog-buttonset button").exists().click( function () {
			datePickerValue1 =  S(".previewPanelItemResponseOptionContainer input.date_picker.hasDatepicker").val();
			console.debug (" datePickerValue: " + datePickerValue1, "length: " + datePickerValue1.length );
			ok( datePickerValue1.length > 0 , "Date picker has a value with a string length > 0");
		});
		//change the value and see if it stores
		S(".execution-view-prompt-list-container input.date_picker").exists();
		S(".execution-view-prompt-list-container img.ui-datepicker-trigger").exists()
		.click();
		//select a couple mounths out.
		S("#ui-datepicker-div span.ui-icon:eq(1)").exists()
		.click()
		.exists()
		.click();
		//will invoke change logic
		S("#ui-datepicker-div a.ui-state-default:eq(8)").exists()
		.click();
		S(".ui-dialog-title").exists().text("Interview Complete");
		S(".ui-dialog-buttonset button").exists().click( function () {
			datePickerValue2 =  S(".previewPanelItemResponseOptionContainer input.date_picker.hasDatepicker").val();
			console.debug (" datePickerValue: " + datePickerValue2, "length: " + datePickerValue2.length );
			ok( datePickerValue2.length > 0 , "Date picker has a value with a string length > 0");
			ok( datePickerValue2 != datePickerValue1 , "Date picker value has changed");
		});
		
	});
	*/
});
