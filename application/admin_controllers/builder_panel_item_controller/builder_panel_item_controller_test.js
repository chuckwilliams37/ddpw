steal('funcunit').then(function(){

module("Level3_ddpw_administration.controllers.BuilderPanelItemController", { 
	setup: function(){
		S.open("./application/admin_controllers/builder_panel_item_controller/builder_panel_item_controller.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Level3_ddpw_administration.controllers.BuilderPanelItemController Demo","demo text");
});


});