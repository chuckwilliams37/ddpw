$(document).ready(function() {
	var commandsMasterList =  Level3_ddpw_administration.Library.Level3.Ddpw.Commands.CommandFactory.getAvailableCommands(); 

	var getRandomClassification = function (i,classification) {
		var types = ["segment", "product", "bandwidth", "usertype"];
		var classificationNames = [
		                           "segment1"
		                           ,"segment2"
		                           ,"segment3"
		                           ,"segment4"
		                           ,"segment5"
		                           ,"product1"
		                           ,"product2"
		                           ,"product3"
		                           ,"product4"
		                           , "product5"
		                           , "bandwidth1"
		                           ,"bandwidth2"
		                           , "bandwidth3"
		                           , "bandwidth4"
		                           , "bandwidth5"
		                           , "usertype1"
		                           ,"usertype2"
		                           , "usertype3"
		                           , "usertype4"
		                           , "usertype5"
		                           ];
		return {
			name: $.fixture.rand( classificationNames , 1)[0]
			,domain: "level3.subdomain.applicationDomain"
			,type: $.fixture.rand( types , 1)[0]
		}
	};
	
	var getRandomPrompt = function (i,prompt) {
		var texts = [
		             "Aliquam aliquet nisl non nulla viverra pulvinar interdum est pretium. Sed diam purus, scelerisque ut dignissim vel, gravida sit amet nibh."
		             , "Sed at nisl pretium arcu viverra varius sit amet id tellus. Suspendisse eu ultricies nulla. Curabitur vitae erat ipsum. Nunc vitae sagittis nunc."
		             , "Nulla varius pellentesque mattis. Nam ac vehicula neque. Vivamus et nisi mauris, id ullamcorper augue."
		             , "Cras vestibulum velit eget libero mollis sed facilisis lectus condimentum. Pellentesque sollicitudin, risus vitae accumsan congue, nunc velit porta libero, quis commodo augue nulla ut enim."
		             , "Sed sagittis lectus nec dolor elementum quis bibendum leo tincidunt. Cras interdum, tortor cursus eleifend suscipit, est erat tempus velit, ut hendrerit sapien magna sit amet erat. "
		             , "Proin mi nibh, tincidunt ut lobortis non, faucibus at arcu. "
		             , "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Maecenas et vestibulum felis."
		             , "Suspendisse a tempor risus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. In interdum suscipit tellus ut pretium. "
		             , "Donec nec lorem in dolor posuere elementum quis non dolor. Donec bibendum justo id libero tempus tempor."
		             ];
		
		var types = [
		             "textInput"
		             ,"textArea"
		             ,"select"
		             ,"radioGroup"
		             ,"checkboxGroup"
		             ,"datePicker"
		             /*
		             */
		             ];
		

		//var chanceForSubPrompts = 1/10;
		//var doSubPrompts = Math.random() <  chanceForSubPrompts;
		var promptType = $.fixture.rand( types , 1)[0];
		
		var promptObject = {
				text: $.fixture.rand( texts , 1)[0],
				type: promptType,
				classifications : getRandomClassifications(5),
				//promptMetaData : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.getToolDataClass ( promptType ),
				//prompts :  doSubPrompts ? getRandomPrompts(10) : [], //DO NOT USE
				responseOptions : getRandomPromptTypeData(promptType)
			}
		
		return promptObject;
	};
	var getRandomCommand = function (i,command) {
		var commands = commandsMasterList;
		var commandObject = $.fixture.rand( commands , 1)[0].serialize();;
		//console.debug ("commandObject: ", commandObject );
		return commandObject;
	};
	
	var getRandomPromptTypeData = function (promptType) {
		var returnData = {};
		var createdDates = [];
		var chanceForSubPrompts = 2/10;
		var chanceForSubCommands = 9/10;
		var doSubPrompts = Math.random() <  chanceForSubPrompts;
		var doSubCommands = Math.random() <  chanceForSubCommands;
	
		for (var i=0; i<=10; i++) {
			var randomDate = new Date();
			var daysToAdd = -180+(Math.round(Math.random()*365));
			randomDate.setDate(randomDate.getDate()+daysToAdd);
			createdDates.push(randomDate);
		}
		
		
		switch (promptType) {
			case "textInput":
			case "textArea":
				returnData = [getRandomResponseOption()];
			break;
			case "datePicker":
				returnData = [{
					value: $.fixture.rand( createdDates , 1)[0],
					prompts : doSubPrompts ? getRandomPrompts(3) : [],
					commands: doSubCommands ? getRandomCommands(7): []
					}];
			break;
			case  "select" :
			case  "radioGroup" :
			case  "checkboxGroup" :
				returnData = getRandomResponseOptions();
			break;
		}
		return returnData;
	}
	
	var getRandomPromptTree = function(i, prompt_tree){
		console.log ("getRandomPromptTree()");
		var names = ["Service Management - 001"
		             , "Service Management - 011"
		             , "Service Management - 101"
		             , "Billing  - 111"
		             , "Disconnect  - 001"
		             , "Disconnect  - 011"
		             ];
		
		var domains =  [
		                "com.level3.service_management.create"
						,"com.level3.service_management.update"
						,"com.level3.billing.create"
						,"com.level3.billing.update"
		                ];
		var createdDates = [];
	
		for (var i=0; i<=10; i++) {
			var randomDate = new Date();
			daysToAdd = -180+(Math.round(Math.random()*365));
			randomDate.setDate(randomDate.getDate()+daysToAdd);
			createdDates.push(randomDate);
		}
		var treeObject =  {
			name: $.fixture.rand( names , 1)[0],
			domain: $.fixture.rand( domains , 1)[0],
			createdDate : $.fixture.rand( createdDates , 1)[0],
			modifiedDate : $.fixture.rand( createdDates , 1)[0],
			effectiveDate : $.fixture.rand( createdDates , 1)[0],
			expirationDate : $.fixture.rand( createdDates , 1)[0],
			prompts : getRandomPrompts(5)
		};
		//console.debug ("treeObject: ", treeObject );
		
		return treeObject;
	};
	var getRandomResponseOption = function(i, response_option){
		var texts = [
		             "RO 1"
		             , "RO 2"
		             , "RO 3"
		             , "RO 4" 
		             , "RO 5" 
		             , "RO 6" 
		             , "RO 7" 
		             , "RO 8" 
		             ];
		
		var chanceForSubPrompts = 2/10;
		var doSubPrompts = Math.random() <  chanceForSubPrompts;
		var chanceForSubCommands = 9/10;
		var doSubCommands = Math.random() <  chanceForSubCommands;
		
		return {
			label: $.fixture.rand( texts , 1)[0],
			value: $.fixture.rand( texts , 1)[0],
			prompts : doSubPrompts ? getRandomPrompts(3) : [],
			//classifications : getRandomClassifications()
			classifications : [],
			commands: doSubCommands ? getRandomCommands(7): []
		}
	};
	
	var getRandomResponseOptions = function (maxCount) {
		var maxCount = maxCount ? maxCount : 4;
		var limit = Math.round(Math.random()*maxCount);
		var randomResponseOptions = [];
		for (var i = 0; i < limit; i++){
			randomResponseOptions.push(getRandomResponseOption(i));
		}
		return randomResponseOptions;
	};
	var getRandomPrompts = function (maxCount) {
		var maxCount = maxCount ? maxCount : 4;
		var limit = Math.round(Math.random()*maxCount);
		var randomPrompts = [];
		for (var i = 0; i < limit; i++){
			randomPrompts.push(getRandomPrompt(i));
		}
		return randomPrompts;
	};
	var getRandomCommands = function (maxCount) {
		var maxCount = maxCount ? maxCount : 4;
		var randomCommands = [];
		var limit = Math.round(Math.random()*maxCount);
		for (var i = 0; i < limit; i++){
			randomCommands.push(getRandomCommand(i));
		}
		return randomCommands;
	};
	var getRandomClassifications = function (maxCount) {
		var maxCount = maxCount ? maxCount : 20;
		var limit = Math.round(Math.random()*maxCount);
		var randomClassifications = [];
		for (var i = 0; i < limit; i++){
			randomClassifications.push(getRandomClassification(i));
		}
		return randomClassifications;
	};
	var getRandomPromptTrees = function (maxCount) {
		var maxCount = maxCount ? maxCount : 8;
		var limit = Math.round(Math.random()*maxCount);
		var randomPromptTrees = [];
		for (var i = 0; i < limit; i++){
			randomPromptTrees.push(getRandomPromptTree(i));
		}
		return randomPromptTrees;
	};
	
	$.fixture.make("prompt_tree",  1, getRandomPromptTree);
	$.fixture.make("prompt_tree_list", 5, getRandomPromptTrees);
	$.fixture.make("prompt", 5,getRandomPrompt);
	$.fixture.make("classification", Math.round(Math.random()*20), getRandomClassification);
	$.fixture.make("response_option", Math.round(Math.random()*4), getRandomResponseOption);

	
})