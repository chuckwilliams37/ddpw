steal("funcunit").then(function(){
	module("msdgwf_execution",{
		setup : function(){
		
		},
		teardown : function(){
			
		}
	})

	test("nav_to_execution", function(){
		S.open('../application/level3_ddpw_administration.html');

		
		var promptTreeId = null;
		
		S("#invoke_create span.ui-button-text").exists().click();
		S("#name").exists();
		S("form[class*='level3_ddpw_administration_models_prompt_tree_']").visible ( function () {
			//var promptTreeId = S("form[class*='level3_ddpw_administration_models_prompt_tree_']").attr("class").split()[2];
			promptTreeId = this[0].classList[1];
			console.debug (" promptTreeId: " + promptTreeId );
		});
		
		S("#name").type('[shift]MSDGWF[shift-up] [shift]N[shift-up]av[shift]T[shift-up]o execution');
		S("#alwaysEffective").exists()
		.click();
		S("#saveButton").exists()
		.click();
		S("#classificationComponents div.ui-widget:eq(0)").exists();
		S("#name").exists();
		S("#leftPanelTabContainer a:eq(0)").exists().click();
		S("#tools_panel span.ui-button-text:eq(7)").exists().click();
		S("#saveButton").exists()
		.click();
		S.wait(850);
		S.open('http://localhost:9001/portalWeb/');
		S("#nav .msie6Tier1Nav:eq(2) a").exists().click();
		S("#servicelookupelm").exists();
		S("#servicelookupelm tbody tr:eq(0) span.this_linkText").exists(30000).click();
		S("#servicelookupelm tbody tr.details:eq(0) input.TicketCreateButton").exists().click();
		
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
		S("#ddpw_main li.prompt:eq(0) button.executionNextButton ").exists().click();
		
		S.open('../application/level3_ddpw_administration.html');
		S(".level3_ddpw_administration_prompt_tree_item."+promptTreeId).exists( function () {
			S(this[0].find(".destroy")).exists().click();
		});
	})

});