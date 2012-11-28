steal("funcunit").then(function(){
module("msdgwf_preview_panel",{
	setup : function(){
		S.open('../application/level3_ddpw_administration.html');

	}
	,
	teardown : function(){
	
	}
	/*
	*/
});

	test("preview_panel", function(){
		S("#invoke_create span.ui-button-text").exists().click();
		S("#classificationComponents div.ui-widget:eq(0)").exists();
		S("#name").exists();
		S("#leftPanelTabContainer a:eq(0)").exists().click();
		S("#tools_panel span.ui-button-text:eq(7)").exists().click();
		S("#centerPanelTabContainer a:eq(1)").exists().click(); 
		S("#DataTables_Table_1 td:eq(4)").text(/1350/); 
		S("#DataTables_Table_1_length select").exists()
		.click();
		S("#DataTables_Table_1_length option:eq(2)").click();
		S("#DataTables_Table_1_filter input").exists()
		.click()
		.type('santa');
		S("#DataTables_Table_1 th.sorting_asc").exists()
		.click();
		S("body").type('[shift]shift');
		S("#DataTables_Table_1 th.sorting:eq(1)").exists()
		.click();
		S("body").type('[shift-up]shift'); 
		S("#DataTables_Table_1 tr:eq(1)").exists()
		.click();
		S("#DataTables_Table_1 tr.row_selected:eq(0) ").exists();
		S("#DataTables_Table_1 tr:eq(3)").exists()
		.click();
		S("#DataTables_Table_1 tr.row_selected:eq(1) ").exists();
		S("#DataTables_Table_1 tr:eq(5)").exists()
		.click();
		S("#DataTables_Table_1 tr.row_selected:eq(2) ").exists();
	});
	
	test("builder_panel", function(){
		
		S("#invoke_create span.ui-button-text").click();
		S("#name").type('[shift]C[shift-up]hange the name');
		S("#saveButton").drag({"clientX":402,"clientY":206});
		S("#leftPanelTabContainer a:eq(0)").click();
		S("#tools_panel span.ui-button-text:eq(7)").click();
		S("#leftPanelTabContainer a:eq(0)").click();
		S("#tools_panel span.ui-button-text:eq(4)").click();
	});

});