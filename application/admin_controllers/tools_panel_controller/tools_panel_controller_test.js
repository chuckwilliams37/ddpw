steal('funcunit').then(function(){

module("Level3_ddpw_administration.Controllers.ToolsPanelController", { 
	setup: function(){
		S.open("./application/admin_controllers/tools_panel_controller/tools_panel_controller.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Level3_ddpw_administration.Controllers.ToolsPanelController Demo","demo text");
});


});