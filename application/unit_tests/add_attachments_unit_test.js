steal("funcunit").then(function(){
	module("add_attachments",{
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
		
	test("createTree", function(){
		//create new prompt tree with and set it active
		S.open('../application/level3_ddpw_administration.html');
		S("#invoke_create span.ui-button-text").exists(20000)
		.click();
		S("#name").exists();
		S("#name").type('add_attachments unit test: ');
		/*
		S("#alwaysEffective").exists()
		.click();
		*/
		S.wait(1000);
		S("#saveButton").exists()
		.click();

		
		S("form[class*='level3_ddpw_administration_models_prompt_tree_']").visible ( function () {
			promptTreeId = this[0].classList[1];
			ok ( promptTreeId , "Prompt Tree ID: " + promptTreeId );
			console.debug (" promptTreeId: " + promptTreeId );
			S("#builderPanelTreeTitle").exists().click();
			S.wait(850);
			//add "add_attachments" tool
			S("#tools_panel").exists().click();
			S("#tools_panel span.ui-button-text:eq(8)").exists().click();
			
			
			S.wait(1700);
			S("#saveButton").exists()
			.click();
			//add radio group
			/*
			S("#tools_panel").exists().click();
			S("#tools_panel span.ui-button-text:eq(3)").exists().click();
			//move radio group out to root
			S("#propertiesPanelMenuOutdent").exists().click();
			*/
		});
		
		
		
		
	test("testPreviewPanel", function(){
	
		//select preview panel and test values
		S.wait(500);
		S("#centerPanelTabContainer a:eq(1)").exists().click();
		
		S("button.file_upload").exists().click();
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
