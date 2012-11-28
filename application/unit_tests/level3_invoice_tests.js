steal(
		 '//../jquery-1.7.1.min.js'
		, "funcunit"
		).then(
			'//../jquerymx-3.2.custom.js'
		).then(
			"//../../application/models/prompt_tree.js"
			,"//../../application/models/level3_invoice.js"
		).then (
			"//../../application/admin_controllers/application_controller/application_controller.js"
		)
		.then(function(){
				module("service_model",{
				setup : function(){
					var testerFunction = function () { return typeof (  Level3_ddpw_administration.Models.Level3Invoice ) != 'undefined' };
					
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

test("findAll-13888", function(){
  //prevents the next test from running
  expect (5);
  stop();
  //confirm our mnodel exists
	ok ( Level3_ddpw_administration.Models.Level3Invoice , "Level3_ddpw_administration.Models.Level3Invoice Model Exists");
  //requests services
  try {
  Level3_ddpw_administration.Models.Level3Invoice.findAll({billingAccountNumber:"13888"}, function(invoices){
	//makes sure we have something
    ok(invoices, "Invoices retrieved");

    //makes sure we have at least 1 service
    ok(invoices.length, "Invoice Count: " + invoices.length );

    //makes sure a service looks right
    
    /*
    ok(invoices[0].AccountId, ("1st Service AccountId: " + services[0].AccountId));
    ok(invoices[0].ServiceLocation,("1st Service ServiceLocation: '" + services[0].ServiceLocation+ "'"));
	*/
	
    //allows the next test to start
    start();
  });
   } catch (e) {
   	console.warn ( e );
   }
});

});