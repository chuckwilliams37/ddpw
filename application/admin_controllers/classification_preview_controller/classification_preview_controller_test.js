steal('funcunit').then(function(){

module("Level3_ddpw_administration.Controllers.ClassificationPreviewController", { 
	setup: function(){
		S.open("//level3_ddpw_administration/admin_controllers/classification_preview_controller/classification_preview_controller.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Level3_ddpw_administration.Controllers.ClassificationPreviewController Demo","demo text");
});


});