steal("funcunit").then(function(){
	module("DE6643",{
		setup : function(){
	
		}
		,
		teardown : function(){
		
		}
	});
	
	test("Create_ConfirmOnlyActive", function(){
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
		S("#name").type('DE6643 unit test: ' + dateTime);
		S("#alwaysEffective").exists()
		.click();
		S("#saveButton").exists()
		.click();
		//should invoke change logic in collection
		S.wait(10000); //wait for all updates to come back?
		
		
		
		S("form[class*='level3_ddpw_administration_models_prompt_tree_']").visible ( function () {
		//confirm that get active trees function works
			ok ( typeof ( S.win.$(".level3_ddpw_administration_prompt_tree").controller ) == 'function' , "Controller Getter function exists");
			var controller = S.win.$(".level3_ddpw_administration_prompt_tree").controller();
			ok ( typeof ( controller.options.promptTreeCollection ) == 'object' , "promptTreeCollection object exists");
			var collection = controller.options.promptTreeCollection;
			ok ( collection.length , "Collection contains "+ collection.length + " trees:");
			ok ( typeof ( collection.getActiveTrees ) == 'function', "getActiveTrees function exists");
			var type = collection.getActiveTrees().Class.shortName;
			ok (type, "getActiveTrees returns a class of type: " + type);
			ok ( collection.getActiveTrees().length > 0 , "getActiveTrees length > 0: "  + collection.getActiveTrees().length);
			//confirm that set active trees was invoked (there should only be 1 active tree after above activity.
			ok ( collection.getActiveTrees().length == 1 , "... only 1 active: "  + ( Boolean(collection.getActiveTrees().length == 1) ) );
			promptTreeId = this[0].classList[1];
			ok ( promptTreeId , "Prompt Tree ID: " + promptTreeId );
			console.debug (" promptTreeId: " + promptTreeId );
			
			//add text input
			S("#tools_panel").exists().click();
			S("#tools_panel span.ui-button-text:eq(0)").exists().click();
			//add text area
			S("#tools_panel").exists().click();
			S("#tools_panel span.ui-button-text:eq(1)").exists().click();
				
			//save the tree
			S("#saveButton").exists()
			.click();
			//navigate to execution  
			//navigate to execution 
		/*
			S.open('http://localhost:9001/portalWeb/');
			S("#nav .msie6Tier1Nav:eq(2) a").exists().click();
			S("#servicelookupelm").exists();
			S("#servicelookupelm tbody tr:eq(0) span.this_linkText").exists(60000).click();
			S("#servicelookupelm tbody tr.details:eq(0) input.TicketCreateButton").exists().click();
*/
			//navigate to execution  COMPLETE
			//navigate to execution  COMPLETE
			
			//Delete Tree
			
			//S.open('../application/level3_ddpw_administration.html');
			S.wait(2000, null,  "Deleting tree in 2s");
			var treeSelector = "."+promptTreeId;
			S(treeSelector).find("button.destroy").exists().click();
			
			S("span.ui-dialog-title:last").visible().text("Confirmation");
			
			S("div.ui-dialog-buttonset button").exists().click();
			/*
			*/
			
		});
		
	});
	
	
});
