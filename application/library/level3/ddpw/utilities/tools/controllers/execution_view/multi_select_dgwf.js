$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Controllers.ExecutionView.MultiSelectDataGridWithFilter
 */
$.Controller('Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Controllers.ExecutionView.MultiSelectDataGridWithFilter',
/** @Static */
{
	defaults : {
		toolType : null,
		prompt : null,
		entitySelectionOptions : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Controllers.PropertiesPanel.MultiSelectDataGridWithFilter.defaults.entitySelectionOptions,
		commandController : null,
		tableData : [],
		dataTableTarget : null
	}
},
/** @Prototype */
{
	init : function ( element, options ){
		console.debug (this.Class.shortName + ".init()");
		
		this.options.dataTableTarget = $('.multiSelectDataGridTable', this.element),
		$thisController = this;
		
		this.options.commandController = $("#command_controller").controller();
		//this.options.previewPanelController = $("#previewPanel").controller();

		this.options.dataTableTarget.dataTable( {
			"bProcessing": true,
			"bAutoWidth": true,
			"aaData" : this.options.tableData,
			"aoColumns" : this.getColumnConfigs ()
		});
				
		if ( this.options.tableData.length > 0 ) {
			//we have data already?
		} else {
			this.getTableData ( $.proxy ( this.onGetTableDataSuccess , $thisController ) );			
		}
	},
	getColumnConfigs : function () {
		var columnConfigArray = [],
		dataType = this.options.prompt.selectedEntity ? this.options.prompt.selectedEntity : 'service';
		
		switch ( dataType ) {
			case "service":
				columnConfigArray = [
					{ "sTitle" : "Service ID", "mDataProp":"PIID" },
					{ "sTitle" : "Billing Account #", "mDataProp":"BillingAccountNumber" },
					{ "sTitle" : "Product", "mDataProp":"Product" },
					{ "sTitle" : "Bandwidth", "mDataProp":"Product" },
					{ "sTitle" : "Service Location A", "mDataProp":"ServiceLocation" },
					{ "sTitle" : "Service Location Z", "mDataProp": function ( data, type ) {
						return data.ZLine1Addr + "<br />" + data.ZCityName + " " + data.ZStateCd +", " + data.ZPostalCd + " <br/>" + data.ZCountryName;
					} }
				];
			break;
			/*
			case "invoice":
			
			break;
			case "charge":
			
			break;
			case "ban":
			
			break;
			*/
			default:
				throw new Error ("Unsupported dataType : " + dataType + " in getColumnConfigs for multi-select-data-grid.");
			break;		
		}
	
		return columnConfigArray;
	},
	getTableData : function ( fnCallback ) {
		console.debug ("getTableData " , arguments);
		var environmentVariables = this.options.commandController.getEnvironmentVariables(),
		tableDataCall = null,
		dataType = this.options.prompt.selectedEntity ? this.options.prompt.selectedEntity : 'service';
		
		switch ( dataType ) {
			case "service":
				tableDataCall = Level3_ddpw_administration.Models.Level3Service.findAll ({accounts:environmentVariables.accountId, returnFormat:"models" }, fnCallback );
			break;
			/*
			case "invoice":
			
			break;
			case "charge":
			
			break;
			case "ban":
			
			break;
			*/
			default:
				throw new Error ("Unsupported dataType : " + dataType + " in getTableData for multi-select-data-grid.");
			break;
		}
		
		return tableDataCall;
	},
	".multiSelectDataGridTable tbody tr click" : function ( element, event ) {
		element.toggleClass ('row_selected');
	},
	"{window} setEnvironmentVariables" : function ( ) {
		console.debug ( this.Class.fullName + " {window} setEnvironmentVariables: " , arguments);
	},
	"{prompt} selectedEntity" : function ( ) {
		console.debug ( this.Class.fullName + " selectedEntity: " , arguments);
	},
	".promptItemRenderer input, .promptItemRenderer select, .promptItemRenderer textarea change" : function (element, event) {
		//to keep from submitting the form (overrides preview_panel_item_controller)
		event.preventDefault();
		event.stopPropagation();
	},
	onGetTableDataSuccess : function ( data, textStatus, jqXHR ) {
		console.debug ("onGetTableDataSuccess " , arguments);
		
		this.options.tableData = data;
		
		this.options.dataTableTarget.fnAddData(this.options.tableData);
    	this.options.dataTableTarget.fnDraw();
		
		return data;
	
	}
});
});