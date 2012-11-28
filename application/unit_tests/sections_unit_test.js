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

steal("funcunit").then(function(){

	module("Sections",{
		setup : function(){
		}
		,
		teardown : function(){
		
		}
	});
	

		
	test("createTree", function(){
		//create new prompt tree 
		S.open('../application/level3_ddpw_administration.html');

		S("#invoke_create span.ui-button-text").exists()
		.click();
		

		
		
		
		
		/*
		//set it active
		S("#alwaysEffective").exists()
		.click();
		*/
		S("form[class*='level3_ddpw_administration_models_prompt_tree_']").visible ( function () {
		
			S("#name").exists( 850, function () { 
				if ( S("#ui-dialog-title-1").length > 0 ) {
					S("#ui-dialog-title-1").exists(100, function () {
						ok( /Some objects/.test( this.text() ) , "Unrealized trees detected..." );
						this.closest(".ui-dialog").find("span.ui-button-text:eq(0)").click();
					});
				}
				var treeTitle = 'Sections unit test: ' + dateTime.toString();
				S(this).type( selectAllString + treeTitle, function () {
					ok ( this.val() == 'Sections unit test: ' + dateTime , " Sections unit test tree name set " );
					S("#saveButton").exists()
					.click();
				} );
			} );
		
		
			promptTreeId = this[0].classList[1];
			ok ( promptTreeId , "Prompt Tree ID: " + promptTreeId );
			console.debug (" promptTreeId: " + promptTreeId );
			
					
			if ( S("#ui-dialog-title-1").length > 0 ) {
				S("#ui-dialog-title-1").exists(100, function () {
					ok( /Some objects/.test( this.text() ) , "Unrealized trees detected..." );
					this.closest(".ui-dialog").find("span.ui-button-text:eq(0)").click();
				});
			}
			
			//add one of each kind of prompt (first 7 types) as a parent-child chain (twice)
			
			S.wait(1200, function () {
				var promptSuffix, promptModel, promptLabel, selectedTree, i=1;
				selectedTree = S.win.$("#main").controller().options.selectedTree;
				cursor = selectedTree.createCursor();
				promptSuffix = selectedTree.prompts.length;
				S("#builderPanelTreeTitle").exists().click();					
				S("#tools_panel").exists().click();
				S("#tools_panel span.ui-button-text:eq(0)").exists().click();
				S("[name='text']", "#propertiesPanel" ).exists( 500, function () {
					promptModel = S.win.$("#propertiesPanel .prompt").model();
					promptLabel = promptModel.Class.shortName +"1";
					
					this.type( ( selectAllString + promptLabel ) , function () {
						console.debug (this , promptModel, promptLabel);
						ok (this.val() == promptLabel ,"Prompt Name Set");
					});
				});
				S("#saveButton").exists()
				.click();
				
				
				S("#tools_panel").exists().click();
				S("#tools_panel span.ui-button-text:eq(1)").exists().click();
				S("[name='text']", "#propertiesPanel" ).exists( 500, function () {
					promptModel = S.win.$("#propertiesPanel .prompt").model();
					promptLabel = promptModel.Class.shortName +"1:1" ;
					
					this.type( selectAllString + promptLabel  , function () {
						console.debug (this , promptModel, promptLabel);
						ok (this.val() == promptLabel ,"Prompt Name Set");
					});
				});
				S("#saveButton").exists()
				.click();
				S.wait(850);
				promptSuffix += ".1";
				
				S("#tools_panel").exists().click();
				S("#tools_panel span.ui-button-text:eq(2)").exists().click();
				S("[name='text']", "#propertiesPanel" ).exists( 500, function () {
					promptModel = S.win.$("#propertiesPanel .prompt").model();
					promptLabel = promptModel.Class.shortName +"1:1:1" ;
					
					this.type( ( selectAllString + promptLabel ) , function () {
						console.debug (this , promptModel, promptLabel);
						ok (this.val() == promptLabel ,"Prompt Name Set");
					});
				});
				S("#saveButton").exists()
				.click();
				S.wait(850);
				promptSuffix += ".1";
				
				S("#tools_panel").exists().click();
				S("#tools_panel span.ui-button-text:eq(3)").exists().click();
				S("[name='text']", "#propertiesPanel" ).exists( 500, function () {
					promptModel = S.win.$("#propertiesPanel .prompt").model();
					promptLabel = promptModel.Class.shortName +"1:1:1:1" ;
					
					this.type( ( selectAllString + promptLabel ) , function () {
						console.debug (this , promptModel, promptLabel);
						ok (this.val() == promptLabel ,"Prompt Name Set");
					});
				});
				S("#saveButton").exists()
				.click();
				S.wait(850);
				promptSuffix += ".1";
				
				S("#tools_panel").exists().click();
				S("#tools_panel span.ui-button-text:eq(4)").exists().click();
				S("[name='text']", "#propertiesPanel" ).exists( 500, function () {
					promptModel = S.win.$("#propertiesPanel .prompt").model();
					promptLabel = promptModel.Class.shortName +"1:1:1:1:1" ;
					
					this.type( ( selectAllString + promptLabel ) , function () {
						console.debug (this , promptModel, promptLabel);
						ok (this.val() == promptLabel ,"Prompt Name Set");
					});
				});
				S("#saveButton").exists()
				.click();
				S.wait(850);
				promptSuffix += ".1";
				
				S("#tools_panel").exists().click();
				S("#tools_panel span.ui-button-text:eq(5)").exists().click();
				S("[name='text']", "#propertiesPanel" ).exists( 500, function () {
					promptModel = S.win.$("#propertiesPanel .prompt").model();
					promptLabel = promptModel.Class.shortName +"1:1:1:1:1:1";
					
					this.type( ( selectAllString + promptLabel ) , function () {
						console.debug (this , promptModel, promptLabel);
						ok (this.val() == promptLabel ,"Prompt Name Set");
					});
				});
				S("#saveButton").exists()
				.click();
				S.wait(850);
				
				S("#builderPanelTreeTitle").exists().click();	
				S("#tools_panel").exists().click();
				S("#tools_panel span.ui-button-text:eq(1)").exists().click();
				S("[name='text']", "#propertiesPanel" ).exists( 500, function () {
					promptModel = S.win.$("#propertiesPanel .prompt").model();
					promptLabel = promptModel.Class.shortName + " 2";
					
					this.type( ( selectAllString + promptLabel ) , function () {
						console.debug (this , promptModel, promptLabel);
						S.wait(500);
						ok (this.val() == promptLabel ,"Prompt Name Set");
					});
				});
				S("#saveButton").exists()
				.click();
				S.wait(850);
				S("#builderPanelTreeTitle").exists().click();	
				S("#tools_panel").exists().click();
				S("#tools_panel span.ui-button-text:eq(2)").exists().click();
				S("[name='text']", "#propertiesPanel" ).exists( 500, function () {
					promptModel = S.win.$("#propertiesPanel .prompt").model();
					promptLabel = promptModel.Class.shortName + " 3";
					
					this.type( ( selectAllString + promptLabel ) , function () {
						console.debug (this , promptModel, promptLabel);
						S.wait(500);
						ok (this.val() == promptLabel ,"Prompt Name Set");
					});
				});
				S("#saveButton").exists()
				.click();
				S.wait(850);
				S.wait(850);
				S("#builderPanelTreeTitle").exists().click();	
				S("#tools_panel").exists().click();
				S("#tools_panel span.ui-button-text:eq(3)").exists().click();
				S("[name='text']", "#propertiesPanel" ).exists( 500, function () {
					promptModel = S.win.$("#propertiesPanel .prompt").model();
					promptLabel = promptModel.Class.shortName + " 4";
					
					this.type( ( selectAllString + promptLabel ) , function () {
						console.debug (this , promptModel, promptLabel);
						S.wait(500);
						ok (this.val() == promptLabel ,"Prompt Name Set");
					});
				});
				S("#saveButton").exists()
				.click();
				S.wait(850);
				S("#builderPanelTreeTitle").exists().click();	
				S("#tools_panel").exists().click();
				S("#tools_panel span.ui-button-text:eq(4)").exists().click();
				S("[name='text']", "#propertiesPanel" ).exists( 500, function () {
					promptModel = S.win.$("#propertiesPanel .prompt").model();
					promptLabel = promptModel.Class.shortName + " 5";
					
					this.type( ( selectAllString + promptLabel ) , function () {
						console.debug (this , promptModel, promptLabel);
						S.wait(500);
						ok (this.val() == promptLabel ,"Prompt Name Set");
					});
				});
				S("#saveButton").exists()
				.click();
				S.wait(850);
				S("#builderPanelTreeTitle").exists().click();	
				S("#tools_panel").exists().click();
				S("#tools_panel span.ui-button-text:eq(5)").exists().click();
				S("[name='text']", "#propertiesPanel" ).exists( 500, function () {
					promptModel = S.win.$("#propertiesPanel .prompt").model();
					promptLabel = promptModel.Class.shortName + " 6";
					
					this.type( ( selectAllString + promptLabel ) , function () {
						console.debug (this , promptModel, promptLabel);
						S.wait(500);
						ok (this.val() == promptLabel ,"Prompt Name Set");
					});
				});
				S("#saveButton").exists()
				.click();
				S.wait(850);
				S("#builderPanelTreeTitle").exists().click();	
				S("#tools_panel").exists().click();
				S("#tools_panel span.ui-button-text:eq(6)").exists().click();
				S("[name='text']", "#propertiesPanel" ).exists( 500, function () {
					promptModel = S.win.$("#propertiesPanel .prompt").model();
					promptLabel = promptModel.Class.shortName + " 7";
					
					this.type( ( selectAllString + promptLabel ) , function () {
						console.debug (this , promptModel, promptLabel);
						S.wait(500);
						ok (this.val() == promptLabel ,"Prompt Name Set");
					});
				});
				S("#saveButton").exists()
				.click();
				S.wait(850);
			

			});
		});
		
	test("testPreviewPanel", function(){
	
		//select preview panel and test values
		S.wait(500);
		S("#centerPanelTabContainer a:eq(1)").exists().click();
		
		//check for error feedback
		S(".section_actions .action_button").exists().click();
		
		
		//correct the errored fields - fields without default selections 
		S.wait (1500);
		S("#previewPanel .prompt:eq(1) input:eq(0)").exists().type(selectAllString + "bob");
		S("#previewPanel .prompt:eq(2) textarea:eq(0)").exists().type(selectAllString + "fred");
		S("#previewPanel .prompt:eq(4) input:eq(0)").exists().click();
		S("#previewPanel .prompt:eq(5) input:eq(1)").exists().click();
		S("#previewPanel .prompt:eq(5) input:eq(3)").exists().click();
		S("#previewPanel .prompt:eq(7) .response_option:eq(2)").exists().click();
		
		//resubmit section 1
		S(".section_actions .action_button").exists().click();
		
		S("#previewPanel .prompt:eq(0) input:eq(0)").exists( 500 , function () {
			ok ( this.val() == "bob" , "Text Input 1 set OK by section submission." );
		});
		S("#previewPanel .prompt:eq(2) textarea:eq(0)").exists( 500 , function () {
			ok ( this.val() == "fred" , "Text Input 2 set OK by section submission." );
		});
		
		//check for second section
		S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section").exists( 850, function () {
			ok ( S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section").length == 2 , "Two sections have rendered");
			ok ( S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(0) .prompt").length == 7, "7 prompts in first section");
			ok ( S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(1) .prompt").length == 1, "1 prompt in second section");
		});
		
		//submit section 2		
		S("#previewPanel .level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(1) .prompt:eq(0) textarea").exists().type(selectAllString + "chino");
		S(".section_actions .action_button:last").visible().exists().click();
		
		S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(2)").exists( 850, function () {
			ok ( S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section").length == 3 , "three sections have rendered");
			ok ( S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(0) .prompt").length == 7, "7 prompts in first section");
			ok ( S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(1) .prompt").length == 1, "1 prompt in second section");
			ok ( S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(2) .prompt").length == 1, "1 prompt in third section");
			
			S("#previewPanel .prompt:eq(0) input:eq(0)").exists( 500 , function () {
				ok ( this.val() == "bob" , "Text Input 1 set OK selectedResponse Storage (from previous section submission)." );
			});
			S("#previewPanel .prompt:eq(2) textarea:eq(0)").exists( 500 , function () {
				ok ( this.val() == "fred" , "Text Input 2 set OK selectedResponse Storage (from previous section submission" );
			});
			S("#previewPanel .level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(1) .prompt:eq(0) textarea").exists( 500 , function () {
				ok ( this.val() == "chino" , "Text Input 3 set OK from section submission" );
			});
			S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(2) select option:eq(2)").exists().click();
			S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(2) .section_actions button").exists().click();
			//this will auto-submit
			//and interview may be "complete"...
		});
		/*
		S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(3)").exists( 850, function () {
			ok ( S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section").length == 3 , "three sections have rendered");
			ok ( S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(0) .prompt").length == 7, "7 prompts in first section");
			ok ( S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(1) .prompt").length == 1, "1 prompt in second section");
			ok ( S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(2) .prompt").length == 1, "1 prompt in third section");
			ok ( S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(3) .prompt").length == 1, "1 prompt in fourth section");
			
			S("#previewPanel .prompt:eq(0) input:eq(0)").exists( 500 , function () {
				ok ( this.val() == "bob" , "Text Input 1 set OK selectedResponse Storage (from previous section submission)." );
			});
			S("#previewPanel .prompt:eq(2) textarea:eq(0)").exists( 500 , function () {
				ok ( this.val() == "fred" , "Text Input 2 set OK selectedResponse Storage (from previous section submission" );
			});
			S("#previewPanel .level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(1) .prompt:eq(0) textarea").exists( 500 , function () {
				ok ( this.val() == "chino" , "Text Input 3 set OK from storage submission" );
			});
			ok (
				S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(2) .prompt select").val() 
				== S(".level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_section:eq(2) .prompt select option:eq(2)").val()
				, "option 2 selection stored from section 3 select"
			);
			
			this.find (".section_actions button").exists().click();//should invoke incomplete error or radio
		});
		*/
		
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
