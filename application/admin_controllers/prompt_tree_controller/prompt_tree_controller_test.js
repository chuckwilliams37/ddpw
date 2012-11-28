steal('funcunit').then(function(){

module("Level3_ddpw_administration.Controllers.PromptTreeController", { 
	setup: function(){
		S.open("admin_controllers/prompt_tree_controller/prompt_tree_controller.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Level3_ddpw_administration.Controllers.PromptTreeController Demo","demo text");
});


});