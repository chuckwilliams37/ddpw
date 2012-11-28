steal('funcunit').then(function(){

module("Level3_ddpw_administration.Controllers.PromptTreeItemController", { 
	setup: function(){
		S.open("./application/admin_controllers/prompt_tree_item_controller/prompt_tree_item_controller.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Level3_ddpw_administration.Controllers.PromptTreeItemController Demo","demo text");
});


});