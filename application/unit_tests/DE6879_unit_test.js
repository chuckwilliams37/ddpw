steal("funcunit").then(function(){
	module("DE6879",{
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
		S("#invoke_create span.ui-button-text").exists()
		.click();
		S("#name").exists();
		S("#name").type('DE6879 unit test: ' + dateTime);
		S("#alwaysEffective").exists()
		.click();
		S("#saveButton").exists()
		.click();
		S("form[class*='level3_ddpw_administration_models_prompt_tree_']").visible ( function () {
			promptTreeId = this[0].classList[1];
			ok ( promptTreeId , "Prompt Tree ID: " + promptTreeId );
			console.debug (" promptTreeId: " + promptTreeId );
			S.wait(850);
			//add drop down list
			S("#tools_panel").exists().click();
			S("#tools_panel span.ui-button-text:eq(2)").exists().click();
			//add radio group
			S("#tools_panel").exists().click();
			S("#tools_panel span.ui-button-text:eq(3)").exists().click();
			//move radio group out to root
			S("#propertiesPanelMenuOutdent").exists().click();
		});
		
	test("testPreviewPanel", function(){
	
		//select preview panel and test values
		S.wait(500);
		S("#centerPanelTabContainer a:eq(1)").exists().click();
		//select second option in drop-down
		S("#promptListOuterContainer select").exists();
		S("#promptListOuterContainer select option:eq(1)").click( function () {
			S.wait(200);//wait for re-render to complete
			var valueSet =  S("#promptListOuterContainer select").val() == "selectValue2";
			ok ( valueSet , "Value for drop-down has been properly set in preview: " +  valueSet);
		});	
		//select third option in radio
		S("#promptListOuterContainer input[type='radio']").exists();
		S("#promptListOuterContainer input[type='radio']:eq(2)").click( function () {
			S.wait(200);//wait for re-render to complete
			var groupName = S("#promptListOuterContainer input[type='radio']:eq(2)").attr('name');
			ok ( groupName , "Radio group name: " +  groupName);
			var valueSet =  S("name='"+groupName+"'").val() == "radioValue3";
			ok ( valueSet , "Value for radio has been properly set in preview: " +  valueSet);
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
