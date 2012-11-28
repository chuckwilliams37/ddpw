$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Controllers.PropertiesPanel.MultiSelectDataGridWithFilter
 */
$.Controller('Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Controllers.PropertiesPanel.MultiSelectDataGridWithFilter',
	/** @Static */
	{
		defaults : {
			toolType : null,
			prompt : null,
			filterSelectionDialogHtml : $.View ( "./application/library/level3/ddpw/utilities/tools/views/properties_panel_item_renderers/msdgwf_filter_selection_dialog.ejs" ),
			filterSelectionDialog : null,
			entitySelectionOptions : [
				{ entityDisplayLabel : "Services" , entityValue : "service", entityInputFilters : [
					{ filterValue : "ban" , filterDisplayLabel: "BAN"},
					{ filterValue : "accountId" , filterDisplayLabel: "BusOrgID (Account ID)"},
					{ filterValue : "customerPo" , filterDisplayLabel: "Customer PO"}
				] },
				{ entityDisplayLabel : "Invoices" , entityValue : "invoice", entityInputFilters : [] },
				{ entityDisplayLabel : "Charges" , entityValue : "charge", entityInputFilters : [] },
				{ entityDisplayLabel : "Billing Accounts (BANs)" , entityValue : "ban", entityInputFilters : [] },
			]
		},
		listensTo : ["addFilter"]
	},
	/** @Prototype */
	{
		init : function ( ){
			console.debug ( this.Class.shortName + ".init()", prompt);
			this.setupAddFilterButton () ;
			this.setSelectionOptions ( "#entitySelection" );
			this.renderFilters();
		},
		setupAddFilterButton : function ( ) {
			var prompt = this.options.prompt,
			isEntitySelected = function ( ){
				var _isSelected = typeof ( prompt.selectedEntity ) != 'undefined' && prompt.selectedEntity != null && prompt.selectedEntity != '';
				return _isSelected;
			};
			
			$(".addFilterButton", this.element).button(
				{
					disabled: !isEntitySelected ()
				}
			);
		},
		".addFilterButton click" : function ( element , event ) {
			console.debug (".addFilterButton click");
			event.preventDefault();
			var selectedEntityDisplayLabel = "",
			prompt = this.options.prompt,
			filterSelectionDialog = null;
			
			$.each ( this.options.entitySelectionOptions , function ( index, entity ) {
				if ( entity.entityValue == prompt.selectedEntity ) {
					selectedEntityDisplayLabel = entity.entityDisplayLabel;
				}
			});
			
			var dialogExists = $("#multiSelectDGWF_filterSelectionDialogContainer").length > 0;
			
			if ( !dialogExists ) {
				this.options.filterSelectionDialog = $(this.options.filterSelectionDialogHtml).dialog({
					title : "Add New Input Filter For <em>'" + selectedEntityDisplayLabel + "'</em> Display:",
					width : 350,
					modal : true,
					autoOpen : false,
					buttons : [
								{
									text: "Ok",
					        		click: function() { 
					        			var addFilterEvent = $.Event ( "addFilter" , { filterParams : $("#multiSelectDGWF_filterSelectionForm" , this).formParams() } );
					        			prompt.elements().trigger ( addFilterEvent );
					        			$(this).dialog("close"); 
					        		}
					        	},
								{
									text: "Cancel",
					        		click: function() { $(this).dialog("close"); }
					        	}
					]
				});
			} else {
				this.options.filterSelectionDialog = $("#multiSelectDGWF_filterSelectionDialogContainer");
			}
			 
			filterSelectionDialog = this.options.filterSelectionDialog;
			this.setSelectionOptions ( "#filterSelection" ,prompt.selectedEntity, filterSelectionDialog.find ("#filterSelection") );
			this.setSelectionOptions ( "#filterValueSelection" , prompt.selectedFilters ,  filterSelectionDialog.find ("#filterValueSelection") );
			filterSelectionDialog.dialog( 'open' );
		},
		"addFilter" : function ( element, event ) {
			console.debug ("addFilter: " , event );
			var selectedFilters = this.options.prompt.attr ( "selectedFilters" ) ? this.options.prompt.attr ( "selectedFilters" ) : [];
			selectedFilters.push ( event.filterParams );
			this.options.prompt.attr ( "selectedFilters", selectedFilters);
			this.options.prompt.elements().trigger($.Event ( "promptSelected" , {prompt:this.options.prompt}));
		},
		".removeFilter click" : function ( element, event ) {
			console.debug ("removeFilter: " ,arguments );
			event.stopPropagation();
			event.preventDefault();
			var selectedFilters = this.options.prompt.attr ( "selectedFilters" ),
			removePosition = element.closest("li").index()-2;
			
			selectedFilters.splice ( removePosition, 1 );
			this.options.prompt.attr ( "selectedFilters", selectedFilters);
			element.closest("li").remove();
		},
		renderFilters : function () {
			console.debug ( "renderFilters" );
			var prompt = this.options.prompt;
			if ( prompt.selectedFilters && prompt.selectedFilters.length > 0 ) {
				this.element.find(".removeFilter").button(
							{
								text:false
								,icons : {
									primary : "ui-icon-close"
								}
							}
				);
				$(".filterSelectionsListContainer").show ( "blind", null, 250 );
			} else {
				$(".filterSelectionsListContainer").hide ( "blind", null, 250 );
			}
		},
		setSelectionOptions : function ( fieldSelector , selectedPredicateValues, $targetField ) {
			var options = this.getFieldOptions ( fieldSelector , selectedPredicateValues );
			if ( typeof ( $targetField ) != 'undefined' ) { 
				$targetField.html ( options.join('') );
			} else {
				$( fieldSelector ).html ( options.join('') );
			}
		},
		getFieldOptions : function ( fieldSelector, entity, selectedPredicateValues ) {
			var options = [],
			optionHtml = "",
			prompt = this.options.prompt,
			isEntitySelected = function ( entity ){
				return entity == prompt.selectedEntity;
			},
			isFilterSelected = function ( filter ) {
				return $.inArray( filter, prompt.selectedFilters ) > -1;
			},
			isFilterValueSelected = function ( filterValue ) {
				return $.inArray( filterValue, prompt.selectedFilterValues ) > -1;
			};
			switch ( fieldSelector ) {
				case "#entitySelection":
					options.push (  "<option value=''> Please Select </option>" );
					$.each ( this.options.entitySelectionOptions , function ( index, entitySelectionOption ) {
						options.push (  
							"<option value='"+
								entitySelectionOption.entityValue+
								"' " + (isEntitySelected( entitySelectionOption.entityValue ) ? "selected='selected' " : "") + 
								">"+ entitySelectionOption.entityDisplayLabel + "</option>"
						);
					});
				break;
				case "#filterSelection":
					$.each ( this.options.entitySelectionOptions , function ( entityIndex, entitySelectionOption ) {
						if ( isEntitySelected( entitySelectionOption.entityValue ) ) { 
							$.each ( entitySelectionOption.entityInputFilters,  function ( inputIndex , entityInputFilter )  {
								options.push (  "<option value='"+entityInputFilter.filterValue+"'"+
									(isFilterSelected( entityInputFilter.filterValue ) ? " selected='selected' " : "") + 
									">"+ 
									entityInputFilter.filterDisplayLabel + "</option>" );	
							});
						}
					});				

				break;
				case "#filterValueSelection":
					var envVarList = Level3_ddpw_administration.Library.Level3.Ddpw.Commands.SetEnvironmentVariableCommand.getEnvironmentVarList();
					$.each ( envVarList , function ( index, envVarName ) {
						options.push (  
							"<option value='"+
								envVarName+
								"' " + (isFilterValueSelected( envVarName ) ? "selected='selected'" : "") + 
								">"+ envVarName + "</option>" 
						);
					});
					
				break;
				default :
					alert ( fieldSelector )
				break;
			}
			console.debug ( "getFieldOptions : " , options );
			return options;
		},
		"#entitySelection change" : function ( element, event ) {
			var selectedValue = element.val(),
			selectedFilters = [];
			this.options.prompt.attr( "selectedEntity", selectedValue);
			this.options.prompt.attr ( "selectedFilters", selectedFilters);
			this.options.prompt.elements().trigger($.Event ( "promptSelected" , {prompt:this.options.prompt}));
		},
		"{prompt} selectedEntity" : function  ( ) {
			
		}
		
		/*
		showHideDependentControl : function ( targetContainerSelector, parentControlSelector, selectedValue ) {
			var targetFieldSelector = "";
			switch ( parentControlSelector ) {
				case "#entitySelection":
					targetFieldSelector = "#filterSelection";
				break;
				case "#filterSelection":
					targetFieldSelector = "#filterValueSelection";							
				break;
				case "#filterValueSelection":
					targetFieldSelector = null;
				break;
				default :
					alert ( fieldSelector )
				break;
			}
			
			if ( targetFieldSelector != null && selectedValue != null) {
				switch ( typeof ( selectedValue ) ) {
					case "object":
						if ( selectedValue.length > 0 ) {
							this.setSelectionOptions ( targetFieldSelector , selectedValue);
							if ( $(targetContainerSelector).filter(":hidden").length > 0 ) {
								$(targetContainerSelector).show ( "blind", null, 250);
							}
						} else {
							$(targetContainerSelector).hide( "blind", null, 250 );
						}
					break;
					case "string":
						switch ( selectedValue ) {
							case "service":
							case "invoice":
							case "charge":
							case "ban":
								this.setSelectionOptions ( targetFieldSelector , selectedValue);			
								$(targetContainerSelector).show ( "blind", null, 250);
							break;
							default:
								$(targetContainerSelector).hide( "blind", null, 250 );
							break;
						}
					break;
				} 
			} else {
				$(targetContainerSelector).hide( "blind", null, 250 );
			}
		}
		*/
	}
);
});