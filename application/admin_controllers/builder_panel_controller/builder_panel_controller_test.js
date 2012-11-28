steal('funcunit').then(function(){

module("Level3_ddpw_administration.controllers.BuilderPanelController", { 
	setup: function(){
		S.open("./application/admin_controllers/builder_panel_controller/builder_panel_controller.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Level3_ddpw_administration.controllers.BuilderPanelController Demo","demo text");
});


});