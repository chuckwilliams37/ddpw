steal("funcunit").then(function(){
	var promptTreeId = null;
	module("DE6510",{
		setup : function(){
			
		}
		,
		teardown : function(){
		
		}
	});
	
	var currentTime = new Date(),
		month = currentTime.getMonth() + 1,
		day = currentTime.getDate(),
		year = currentTime.getFullYear(),
		hours = currentTime.getHours(),
		minutes = currentTime.getMinutes(),
		seconds = currentTime.getSeconds(),
		ampm = hours > 11 ? "PM" : "AM",
		dateTime = (month + "/" + day + "/" + year+ ": " + hours+ ":" + minutes + ":" + seconds + " " + ampm),
		selectAllString = '[ctrl]a[ctrl-up]',
		textInputString1 = 'DE6510 unit test: testValue1 : ' + dateTime,
		textInputString2 = 'DE6510 unit test: testValue2 ' + dateTime,
		textInputValue1 = null,
		textInputValue2 = null
		;
	test("preview_panel_next_and_change", function(){
		//create new prompt tree with text input and set it active
		S.open('../application/level3_ddpw_administration.html');
		S("#invoke_create span.ui-button-text").exists()
		.click();
		S("#name").exists();
		S("#name").type('DE6510 unit test: ' + dateTime);
		S("#alwaysEffective").exists()
		.click();
		S("#saveButton").exists()
		.click();
		S("form[class*='level3_ddpw_administration_models_prompt_tree_']").visible ( function () {
			promptTreeId = this[0].classList[1];
			console.debug (" promptTreeId: " + promptTreeId );
		});
		S.wait(850);
		//add text input
		S("#tools_panel").exists().click();
		S("#tools_panel span.ui-button-text:eq(0)").exists().click();
		//add text area
		S("#tools_panel").exists().click();
		S("#tools_panel span.ui-button-text:eq(1)").exists().click();
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
				S(".promptActions").find(".nextButton span.ui-button-text").exists().click( function () {
						S("span.ui-dialog-title:last").visible().text("Interview Complete");
						S("div.ui-dialog-buttonset button").exists().click( function () {
							textInputValue2 =  S("#promptListOuterContainer input[type='text']").val();
							console.debug (" textInputValue2: " + textInputValue2, "length: " + textInputValue2.length );
							ok( textInputValue2.length > 0 , "Text Input has a value with a string length > 0");
							ok( textInputValue2 == textInputString2 , "Text Input is expected CHANGED value");
							console.debug (" textInputString2: " + textInputString2);
							console.debug ("CHANGE LOGIC PREVIEW PANEL COMPLETE");
						});	
					});
			}
		);
		
		//save the tree
		S("#saveButton").exists()
		.click();
		/*
			selectAllString = '[ctrl]a[ctrl-up]',
			textInputString1 = 'String Test DE6614 Unit Test';
			
			*/
			
		/*
		*/	
		
	});
	test("execution_view_next_and_change", function(){
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
		
		var promptTreeId, treeFormSelector;

		S("form[id*='level3_ddpw_administration_models_prompt_tree_']").visible ( function () {
			promptTreeId = this[0].classList[1];
			console.debug (" promptTreeId: " + promptTreeId );
			treeFormSelector = "#"+promptTreeId+"_form";
			S.wait(850);
			
			S("span.ui-dialog-title:last").visible().text("Interview Complete");
			S("div.ui-dialog-buttonset button").exists().click( function () {
				var changeValue = "This is my string change test " + dateTime;
				S(".previewPanelItemResponseOptionContainer input[type='text']").exists().type ( selectAllString + changeValue , function () {
					console.debug (" *********CHANGE LOGIC SHOULD BE INVOKED - 'UPDATE' BUTTON SHOULD BE VISIBLE to click*************");
					ok ( S(".executionNextButton[role='button']").exists().find("span").text() == "Update", "Update Button #1 exists");
					S(".executionNextButton[role='button']").exists().click( function () {
						var model = S.win.$( ".previewPanelItemResponseOptionContainer input[type='text']").closest(".prompt").model();
						var modelValue =  model.getSelectedResponse()[0].value;
						console.debug ("modelValue: ", modelValue);
						S.wait(850);
						ok ( modelValue == changeValue , "Value has been set on model textInput 1");
						ok ( S("span.ui-dialog-title:last").visible().text( "Interview Complete" , 1000 , function () {
							this.closest("div[role='dialog']").find(".ui-dialog-buttonset button").exists().click();
							//S("div.ui-dialog-buttonset button").exists().click();
						}) , "Interview Complete Dialog Displayed");
					});
				}).blur();
				
				S(".previewPanelItemResponseOptionContainer textarea:eq(0)").exists( function () {	
					this.type( selectAllString ).wait(2000).type ( changeValue , function () {
						S(".executionNextButton[role='button']").exists().click( function () {
							var model = S.win.$( ".previewPanelItemResponseOptionContainer textarea:eq(0)").closest(".prompt").model();
							var modelValue =  model.getSelectedResponse()[0].value;
							console.debug ("modelValue: ", modelValue);
							S.wait(850);
							ok ( modelValue == changeValue , "Value has been set on model textArea - prompt 2");
							ok ( S("span.ui-dialog-title:last").visible().text( "Interview Complete" , 1000 , function () {
								this.closest("div[role='dialog']").find(".ui-dialog-buttonset button").exists().click();
								//S("div.ui-dialog-buttonset button").exists().click();
							}) , "Interview Complete Dialog post update #2 Displayed");
						});
					});
					/*
					this.type( selectAllString ).wait(2000).type ( changeValue , function () {
						ok ( S(".executionNextButton[role='button']").exists().find("span").text() == "Update", "Update Button exists");
						var model = S.win.$( ".previewPanelItemResponseOptionContainer textarea:eq(0)").closest(".prompt").model();
						var modelValue =  model.getSelectedResponse()[0].value;
						console.debug ("modelValue: ", modelValue);
						ok ( modelValue == changeValue , "Value has been set on model textArea 1");
						
						ok ( this.closest(".prompt").find("button span").text() == "Update", "Update Button #2 exists");
						//S(".executionNextButton[role='button']").exists().click();
					});
					*/
				});
				/*
				textInputValue2 =  S("#promptListOuterContainer input[type='text']").val();
				console.debug (" textInputValue2: " + textInputValue2, "length: " + textInputValue2.length );
				ok( textInputValue2.length > 0 , "Text Input has a value with a string length > 0");
				ok( textInputValue2 == textInputString2 , "Text Input is expected CHANGED value");
				console.debug (" textInputString2: " + textInputString2);
				console.debug ("CHANGE LOGIC PREVIEW PANEL COMPLETE");
				*/
			});	
			
			//Delete Tree
			/*
			S.open('../application/level3_ddpw_administration.html');
			S.wait(2000, null,  "Deleting tree in 2s");
			var treeSelector = "."+promptTreeId;
			S(treeSelector).find("button.destroy").exists().click();
			
			S("span.ui-dialog-title:last").visible().text("Confirmation");
			
			S("div.ui-dialog-buttonset button").exists().click();
			*/
		});
	});
	
	
});
