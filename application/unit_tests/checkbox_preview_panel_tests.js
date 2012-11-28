steal("funcunit",'//../jquery-1.7.1.min.js').then( '//../jquerymx-3.2.custom.js').then(function(){
module("checkbox_preview_panel",{
	setup : function(){
		S.open('../application/level3_ddpw_administration.html');
	}
	,
	teardown : function(){
		//$("#main").controller().options.selectedTree.destroy();
	}
	/*
	*/
});

	test("multi_select_ok", function(){
		S("#invoke_create span.ui-button-text").exists()
		.click();
		S("#name").exists();
		S("#name").type('[shift]T[shift-up]est[shift]T[shift-up]ree[shift]+_[shift-up]unit test');
		S("#saveButton").exists()
		.click();
		S("#tools_panel").exists().click();
		S("#tools_panel span.ui-button-text:eq(4)").exists().click();
		S("#centerPanelTabContainer a:eq(1)").exists().click(); 
		S("#classificationComponents div.ui-widget:eq(0)").exists();
		S("#promptListOuterContainer input:eq(0)").exists()
		.click();
		S("#promptListOuterContainer input:eq(1)").exists()
		.click();
		S(".prompt .nextButton span.ui-button-text").exists()
		.click(
			{}, function () {
				var groupName = S("#promptListOuterContainer input:eq(1)").attr("name");
				 S("input[name="+groupName+"]:checked").each ( function ( index, element ) {
				 	console.debug ( S(element).val() );
				 });
			}
		);
	});
	
	test("multi_select_with_children", function(){
		S("#invoke_create span.ui-button-text").click();
		S("#name").type('[shift]M[shift-up]ulti[shift]_[shift-up]select[shift]_[shift-up]with[shift]_[shift-up]children');
		S("#saveButton").exists()
		.click();
		S.wait(850);
		S("#tools_panel span.ui-button-text:eq(4)").click();
		S("#builderPanelTreeContainer div.builderPanelItemResponseOptionContainer:eq(0)").exists()
		.click();
		S("#tools_panel span.ui-button-text:eq(0)").click();
		S("#text").exists().click().type('[ctrl]a[ctrl-up]box1[tab]');
		S("#saveButton").exists()
		.click();
		S.wait(850);
		S("#builderPanelTreeContainer div.builderPanelItemResponseOptionContainer:eq(2)").exists()
		.click();
		S("#tools_panel span.ui-button-text:eq(0)").click();
		S("#text").exists().click().type('[ctrl]a[ctrl-up]box2[tab]');
		S("#saveButton").exists()
		.click();
		S.wait(850);
		S("#centerPanelTabContainer a:eq(1)").click();
		S("#promptListOuterContainer input:eq(0)").exists()
		.click();
		S("#promptListOuterContainer input:eq(1)").exists()
		.click();
		S(".promptActions:last .nextButton").exists().click();
		S(".promptActions:last .nextButton").exists().click();
		S(".promptActions:last .nextButton").exists().click();
		S(".ui-dialog-title").exists().text("Interview Complete");
		S(".ui-dialog-buttonset button").exists().click();	
	});

	test("..._change", function(){
		S("#invoke_create span.ui-button-text").click();
		S("#name").type('[shift]M[shift-up]ulti[shift]_[shift-up]select[shift]_[shift-up]with[shift]_[shift-up]children');
		S("#saveButton").exists()
		.click();
		S.wait(850);
		S("#tools_panel span.ui-button-text:eq(4)").click();
		S("#builderPanelTreeContainer div.builderPanelItemResponseOptionContainer:eq(0)").exists()
		.click();
		S("#tools_panel span.ui-button-text:eq(0)").click();
		S("#text").exists().click().type('[ctrl]a[ctrl-up]box1[tab]');
		S("#saveButton").exists()
		.click();
		S.wait(850);
		S("#builderPanelTreeContainer div.builderPanelItemResponseOptionContainer:eq(2)").exists()
		.click();
		S("#tools_panel span.ui-button-text:eq(0)").click();
		S("#text").exists().click().type('[ctrl]a[ctrl-up]box2[tab]');
		S("#saveButton").exists()
		.click();
		S.wait(850);
		S("#centerPanelTabContainer a:eq(1)").click();
		S("#promptListOuterContainer input:eq(0)").exists()
		.click();
		S("#promptListOuterContainer input:eq(1)").exists()
		.click();
		S(".promptActions:last .nextButton").exists().click();
		S(".promptActions:last .nextButton").exists().click();
		S(".promptActions:last .nextButton").exists().click();
		S(".ui-dialog-title").exists().text("Interview Complete");
		S(".ui-dialog-buttonset button").exists().click();	
		S("#promptListOuterContainer input:eq(0)").exists()
		.click();
		S(".promptActions .nextButton").visible().click();
		S(".promptActions:last .nextButton").visible().click();
		S(".ui-dialog-title:last").visible().text("Interview Complete");
		S(".ui-dialog-buttonset:last button").visible().click();	
	});
});