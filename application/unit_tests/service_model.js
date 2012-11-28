steal(
		 '//../jquery-1.7.1.min.js'
		, "funcunit"
		).then(
			'//../jquerymx-3.2.custom.js'
		).then(
			"//../../application/models/prompt_tree.js"
			,"//../../application/models/level3_service.js"
		).then (
			"//../../application/admin_controllers/application_controller/application_controller.js"
		)
		.then(function(){
				module("service_model",{
				setup : function(){
					var testerFunction = function () { return typeof (  Level3_ddpw_administration.Models.Level3Service ) != 'undefined' };
					
					do {
						S.wait (5);
						console.debug ("waiting for model to load...");
					} while ( !testerFunction )
				}
				,
				teardown : function(){
				
				}
			
			});
			/*
			*/

test("findAll-15182", function(){
  //prevents the next test from running
  expect (5);
  stop();
  //confirm our mnodel exists
	ok ( Level3_ddpw_administration.Models.Level3Service , "Level3_ddpw_administration.Models.Level3Service Model Exists");
  //requests services
  Level3_ddpw_administration.Models.Level3Service.findAll({accounts:"15182"}, function(services){
	//makes sure we have something
    ok(services, "Services retrieved");

    //makes sure we have at least 1 service
    ok(services.length, "Service Count: " + services.length );

    //makes sure a service looks right
    
    ok(services[0].AccountId, ("1st Service AccountId: " + services[0].AccountId));
    ok(services[0].ServiceLocation,("1st Service ServiceLocation: '" + services[0].ServiceLocation+ "'"));

    //allows the next test to start
    start();
  });
})
test("findAll-1-EWZMX", function(){
  //prevents the next test from running
  expect (5);
  stop();
  //confirm our mnodel exists
	ok ( Level3_ddpw_administration.Models.Level3Service , "Level3_ddpw_administration.Models.Level3Service Model Exists");
  //requests services
  
  Level3_ddpw_administration.Models.Level3Service.findAll({accounts:"1-EWZMX"}, function(services){
	//makes sure we have something
     ok(services, "Services retrieved");

    //makes sure we have at least 1 service
    ok(services.length, "Service Count: " + services.length );

    //makes sure a service looks right
    
    ok(services[0].AccountId, ("1st Service AccountId: " + services[0].AccountId));
    ok(services[0].ServiceLocation,("1st Service ServiceLocation: '" + services[0].ServiceLocation + "'"));
    //allows the next test to start
    start();
	QUnit.log()
  });
})
});