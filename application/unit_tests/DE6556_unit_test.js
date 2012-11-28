steal("funcunit").then(function(){
	module("DE6556",{
		setup : function(){
	
		}
		,
		teardown : function(){
		
		}
	});
	
	test("preview_panel_next", function(){
		//create new prompt tree with date picker and set it active
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
			datePickerValue1 = null,
			datePickerValue2 = null
			;
		S("#invoke_create span.ui-button-text").exists()
		.click();
		S("#name").exists();
		S("#name").type('[shift]DE[shift-up]6556 unit test: ' + dateTime);
		S("#alwaysEffective").exists()
		.click();
		S("#saveButton").exists()
		.click();
		S("form[class*='level3_ddpw_administration_models_prompt_tree_']").visible ( function () {
			promptTreeId = this[0].classList[1];
			console.debug (" promptTreeId: " + promptTreeId );
		});
		S.wait(850);
		//add date picker
		S("#tools_panel").exists().click();
		S("#tools_panel span.ui-button-text:eq(5)").exists().click();
		//select preview panel and test value
		S.wait(500);
		S("#saveButton").visible()
		.click();
		S("#centerPanelTabContainer a:eq(1)").exists().click();
		S("#previewPanelTreeTitle span.ui-button-text").exists();
		S("#classificationsSelectionContainer select.classification-components-select:eq(0)").exists();
		S("#promptListOuterContainer input.date_picker").exists();
		S("#promptListOuterContainer img.ui-datepicker-trigger").exists()
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
		S("#promptListOuterContainer input.date_picker").exists();
		S("#promptListOuterContainer img.ui-datepicker-trigger").exists()
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
});
