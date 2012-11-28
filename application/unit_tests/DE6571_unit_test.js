steal("funcunit").then(function(){
	module("DE6571",{
		setup : function(){
	
		}
		,
		teardown : function(){
		
		}
	});
	
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
		
	test("createTreePromptTypes1_7", function(){
		//create new prompt tree with and set it active
		S.open('../application/level3_ddpw_administration.html');
		S("#invoke_create span.ui-button-text").exists()
		.click();
		S("#name").exists();
		S("#name").type('DE6571 unit test: ' + dateTime);
		S("#alwaysEffective").exists()
		.click();
		S("#saveButton").exists()
		.click();
		S("form[class*='level3_ddpw_administration_models_prompt_tree_']").visible ( function () {
			promptTreeId = this[0].classList[1];
			ok ( promptTreeId , "Prompt Tree ID: " + promptTreeId );
			console.debug (" promptTreeId: " + promptTreeId );
			S.wait(850);
			
			//check for failed trees notification
			/**
			<span class="ui-dialog-title" id="ui-dialog-title-1">Some objects failed to be loaded...</span>
			
			<span class="ui-button-text">OK</span>
			**/
			if ( S("#ui-dialog-title-1").length > 0 ) {
				S("#ui-dialog-title-1").exists(100, function () {
					ok( /Some objects/.test( this.text() ) , "Unrealized trees detected..." );
					this.closest(".ui-dialog").find("span.ui-button-text:eq(0)").click();
				});
			}
			
			//add simple dialog with children on each response option
			S("#tools_panel").exists().click();
			S("#tools_panel span.ui-button-text:eq(6)").exists().click();
			S(".prompt [name='text']").exists().type(selectAllString+"Dialog 1", function(){
				ok ( this.val() == "Dialog 1" , "Dialog 1 label set.");
			});
			//save the tree
			S("#saveButton").exists()
			.click();
			S("#tools_panel").exists().click();
			S("#tools_panel span.ui-button-text:eq(6)").exists().click();
			S(".prompt [name='text']").exists().type(selectAllString+"Dialog 1.1");
			//save the tree
			S("#saveButton").exists()
			.click();
			S("#tools_panel").exists().click();
			S("#tools_panel span.ui-button-text:eq(6)").exists().click();
			//move radio group out 
			S("#propertiesPanelMenuOutdent").exists().click();
			S(".prompt [name='text']").exists().type(selectAllString+"Dialog 1.2");
			//save the tree
			S("#saveButton").exists()
			.click();
			S("#tools_panel").exists().click();
			S("#tools_panel span.ui-button-text:eq(6)").exists().click();
			S(".prompt [name='text']").exists().type(selectAllString+"Dialog 1.2.1");
			
			//save the tree
			S("#saveButton").exists()
			.click();
			
			S.wait(2000);
		
			
			
			
			
			
			
			
		});
		
	test("testSelections_execution", function(){
		//navigate to execution  
		//navigate to execution 
	/*
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
			textInputString1 = 'String Test DE6571 Unit Test';
			
		S(treeFormSelector).exists( function () {
			S(".previewPanelItemResponseOptionContainer:eq(0) input[type='text']").type ( selectAllString + textInputString1 );
			S(".executionNextButton[role='button']").exists().click( function () {
				ok ( S(".previewPanelItemResponseOptionContainer:eq(0) input[type='text']").val() == textInputString1 , "String Set in Text input Correctly");
				S.wait(200);	
			});
			S(".previewPanelItemResponseOptionContainer:eq(1) textarea").type ( selectAllString + textInputString1 );
			S(".executionNextButton[role='button']").exists().click( function () {
				var textAreaValue = S(".previewPanelItemResponseOptionContainer:eq(1) textarea").val();
				ok ( textAreaValue == textInputString1 , "String Set Text Area Correctly");
				S.wait(200);	
			});

			S(".executionNextButton[role='button']").exists().click( function () {
				var selectValue = S("li.prompt:eq(2) select").val();
				var option1Value =  S("li.prompt:eq(2) select option:eq(0)").val();
				ok ( selectValue == option1Value, "Drop-down set to default (option 1): " +  option1Value);
				S.wait(200);	
			});
			S("li.prompt:eq(3) input[type='radio']:eq(0)").exists().click();// this should invoke change automatically... 
			
			S("li.prompt:eq(4) input[type='checkbox']:eq(1)").exists().click();
			S("li.prompt:eq(4) input[type='checkbox']:eq(0)").exists().click();
			S("li.prompt:eq(4) .executionNextButton[role='button']").exists().click( function () {
				ok ( S("li.prompt:eq(4) input[name$='_checkbox_group']").val() , "Checkboxes set to : " + S("li.prompt:eq(4) input[name$='_checkbox_group']").val() );
				S.wait(200);	
			});
			//select and change date picker
			var datePickerValue1, datePickerValue2;
			S(".execution-view-prompt-list-container input.date_picker").exists();
			S(".execution-view-prompt-list-container img.ui-datepicker-trigger").exists()
			.click();
			//select a couple mounths out.
			S("#ui-datepicker-div span.ui-icon:eq(1)").exists()
			.click()
			.exists()
			.click();
			S("#ui-datepicker-div a.ui-state-default:eq(16)").exists()
			.click( function () {
				datePickerValue1 =  S(".previewPanelItemResponseOptionContainer input.date_picker.hasDatepicker").val();
				console.debug (" datePickerValue: " + datePickerValue1, "length: " + datePickerValue1.length );
				ok( datePickerValue1.length > 0 , "Date picker has a value with a string length > 0 : " + datePickerValue1);
			});
			
			S("li.prompt:eq(6) label:eq(1)").exists().click(); //selects button 2
			//go through interview complete screen
			S(".ui-dialog-title").exists().text("Interview Complete");
			S(".ui-dialog-buttonset button").exists().click( function () {});
			
			//change the date value and see if it stores
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
			.click( function  () { 
				S.wait(500); //wait for refresh to complete.
				datePickerValue2 =  S(".previewPanelItemResponseOptionContainer input.date_picker.hasDatepicker").val();
				console.debug (" datePickerValue: " + datePickerValue2, " length: " + datePickerValue2.length );
				ok( datePickerValue2.length > 0 , "Date picker has a value with a string length > 0");
				ok( datePickerValue2 != datePickerValue1 , "Date picker value has changed to: " + datePickerValue2);
			});
			
			S("[id|=ui-dialog-title]:last").visible().text("Interview Complete");
			S(".ui-dialog-buttonset button").exists().click();
			
			//change the simple dialog value and see if it stores
			S("li.prompt:eq(6) label:eq(0)").exists().click(); //selects button 1 
			
			S("[id|=ui-dialog-title]:last").visible().text("Interview Complete");
			S(".ui-dialog-buttonset button").exists().click();
			
			S("li.prompt:eq(6) label:eq(3)").exists().click(); //selects button 4

			S("[id|=ui-dialog-title]:last").visible().text("Interview Complete");
			S(".ui-dialog-buttonset button").exists().click();
		/*
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
		*/
		});
		
		/*
			//Delete Tree
			
			S.open('../application/level3_ddpw_administration.html');
			S.wait(2000, null,  "Deleting tree in 2s");
			var treeSelector = "."+promptTreeId;
			S(treeSelector).find("button.destroy").exists().click();
			
			S("span.ui-dialog-title:last").visible().text("Confirmation");
			
			S("div.ui-dialog-buttonset button").exists().click();
			
			*/
	});
});
