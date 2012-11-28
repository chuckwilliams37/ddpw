steal('funcunit').then(function(){

module("Level3_ddpw_administration.Controllers.PreviewPanelController", { 
	setup: function(){
		S.open("//level3_ddpw_administration/admin_controllers/preview_panel_controller/preview_panel_controller.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Level3_ddpw_administration.Controllers.PreviewPanelController Demo","demo text");
});


});