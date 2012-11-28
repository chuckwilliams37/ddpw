steal('funcunit').then(function(){

module("Level3_ddpw_administration.Controllers.PreviewPanelItemController", { 
	setup: function(){
		S.open("//level3_ddpw_administration/./application/admin_controllers/preview_panel_item_controller/preview_panel_item_controller.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Level3_ddpw_administration.Controllers.PreviewPanelItemController Demo","demo text");
});


});