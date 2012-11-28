steal('funcunit').then(function(){

module("Level3_ddpw_administration.Controllers.PropertiesPanelController", { 
	setup: function(){
		S.open("admin_controllers/properties_panel_controller/properties_panel_controller.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Level3_ddpw_administration.Controllers.PropertiesPanelController Demo","demo text");
});


});