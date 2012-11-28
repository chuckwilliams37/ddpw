steal('funcunit').then(function(){

module("Level3_ddpw_administration.Controllers.ApplicationController", { 
	setup: function(){
		S.open("./application/admin_controllers/application_controller/application_controller.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Level3_ddpw_administration.Controllers.ApplicationController Demo","demo text");
});


});