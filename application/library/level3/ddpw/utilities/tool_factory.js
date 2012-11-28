$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory'
 */
$.Class('Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory',
	/** @Static */
	{
		TEXTINPUT : "textInput",
		TEXTAREA : "textArea",
		SELECT : "select",
		RADIOGROUP : "radioGroup",
		CHECKBOXGROUP : "checkboxGroup",
		DATEPICKER : "datePicker",
		SIMPLEDIALOG : "simpleDialog",
		MULTISELECTDATAGRIDWITHFILTER : "multiSelectDataGridWithFilter",
		ADDATTACHMENTS : "addAttachments",
		SECTIONCONTAINER : "sectionContainer",
		TOOLTYPES : [],
		BUILDER_PANEL_RENDERER_PATH: "./application/library/level3/ddpw/utilities/tools/views/builder_panel_item_renderers/",
		PREVIEW_PANEL_RENDERER_PATH: "./application/library/level3/ddpw/utilities/tools/views/preview_panel_item_renderers/",
		OUTLINE_PANEL_RENDERER_PATH: "./application/library/level3/ddpw/utilities/tools/views/outline_panel_item_renderers/",
		PROPERTIES_PANEL_RENDERER_PATH: "./application/library/level3/ddpw/utilities/tools/views/properties_panel_item_renderers/",
		TOOLS_PANEL_RENDERER_PATH: "./application/library/level3/ddpw/utilities/tools/views/tools_panel_item_renderers/",
		EXECUTION_VIEW_RENDERER_PATH: "./application/library/level3/ddpw/utilities/tools/views/execution_view_item_renderers/",
		setup : function () {//a tools presence here will add to the administrative selection menu
			Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLTYPES.push(Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTINPUT);
			Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLTYPES.push(Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTAREA);
			Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLTYPES.push(Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SELECT);
			Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLTYPES.push(Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.RADIOGROUP);
			Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLTYPES.push(Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.CHECKBOXGROUP);
			Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLTYPES.push(Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.DATEPICKER);
			Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLTYPES.push(Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SIMPLEDIALOG);
			Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLTYPES.push(Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.MULTISELECTDATAGRIDWITHFILTER);
			Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLTYPES.push(Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.ADDATTACHMENTS);
			//Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLTYPES.push(Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SECTIONCONTAINER);
		},
		getToolSelectionMenu : function () {
			//console.debug(this.shortName + ".getToolSelectionMenu()");
			var menu = $.View('./application/library/level3/ddpw/utilities/tools/views/tools_panel_selection_menu.ejs',
					{
						toolTypes:Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLTYPES
					});
	
			return menu;
		},
		getToolItemRenderer : function (toolType, context) {
			var toolItemRenderers = {};
			toolItemRenderers[Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTINPUT] = {
				"builder_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.BUILDER_PANEL_RENDERER_PATH + "text_input.ejs",
				"preview_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PREVIEW_PANEL_RENDERER_PATH + "text_input.ejs",
				"outline_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.OUTLINE_PANEL_RENDERER_PATH + "text_input.ejs",
				"properties_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PROPERTIES_PANEL_RENDERER_PATH + "text_input.ejs",
				"tools_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLS_PANEL_RENDERER_PATH + "text_input.ejs",
				"execution_view":Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.EXECUTION_VIEW_RENDERER_PATH+"text_input.ejs"
			};
			toolItemRenderers[Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTAREA] = {
					"builder_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.BUILDER_PANEL_RENDERER_PATH + "text_area.ejs",
					"preview_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PREVIEW_PANEL_RENDERER_PATH + "text_area.ejs",
					"outline_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.OUTLINE_PANEL_RENDERER_PATH + "text_area.ejs",
					"properties_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PROPERTIES_PANEL_RENDERER_PATH + "text_area.ejs",
					"tools_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLS_PANEL_RENDERER_PATH + "text_area.ejs",
					"execution_view":Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.EXECUTION_VIEW_RENDERER_PATH+"text_area.ejs"
			};
			toolItemRenderers[Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SELECT] = {
					"builder_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.BUILDER_PANEL_RENDERER_PATH + "select.ejs",
					"preview_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PREVIEW_PANEL_RENDERER_PATH + "select.ejs",
					"outline_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.OUTLINE_PANEL_RENDERER_PATH + "select.ejs",
					"properties_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PROPERTIES_PANEL_RENDERER_PATH + "select.ejs",
					"tools_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLS_PANEL_RENDERER_PATH + "select.ejs",
					"execution_view":Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.EXECUTION_VIEW_RENDERER_PATH+"select.ejs"
			};
			toolItemRenderers[Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.RADIOGROUP] = {
					"builder_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.BUILDER_PANEL_RENDERER_PATH + "radio_group.ejs",
					"preview_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PREVIEW_PANEL_RENDERER_PATH + "radio_group.ejs",
					"outline_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.OUTLINE_PANEL_RENDERER_PATH + "radio_group.ejs",
					"properties_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PROPERTIES_PANEL_RENDERER_PATH + "radio_group.ejs",
					"tools_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLS_PANEL_RENDERER_PATH + "radio_group.ejs",
					"execution_view":Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.EXECUTION_VIEW_RENDERER_PATH+"radio_group.ejs"
			};
			toolItemRenderers[Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.CHECKBOXGROUP] = {
					"builder_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.BUILDER_PANEL_RENDERER_PATH + "checkbox_group.ejs",
					"preview_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PREVIEW_PANEL_RENDERER_PATH + "checkbox_group.ejs",
					"outline_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.OUTLINE_PANEL_RENDERER_PATH + "checkbox_group.ejs",
					"properties_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PROPERTIES_PANEL_RENDERER_PATH + "checkbox_group.ejs",
					"tools_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLS_PANEL_RENDERER_PATH + "checkbox_group.ejs",
					"execution_view":Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.EXECUTION_VIEW_RENDERER_PATH+"checkbox_group.ejs"
			};
			toolItemRenderers[Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.DATEPICKER] = {
					"builder_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.BUILDER_PANEL_RENDERER_PATH + "date_picker.ejs",
					"preview_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PREVIEW_PANEL_RENDERER_PATH + "date_picker.ejs",
					"outline_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.OUTLINE_PANEL_RENDERER_PATH + "date_picker.ejs",
					"properties_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PROPERTIES_PANEL_RENDERER_PATH + "date_picker.ejs",
					"tools_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLS_PANEL_RENDERER_PATH + "date_picker.ejs",
					"execution_view":Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.EXECUTION_VIEW_RENDERER_PATH+"date_picker.ejs"
			};
			toolItemRenderers[Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SIMPLEDIALOG] = {
					"builder_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.BUILDER_PANEL_RENDERER_PATH + "simple_dialog.ejs",
					"preview_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PREVIEW_PANEL_RENDERER_PATH + "simple_dialog.ejs",
					"outline_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.OUTLINE_PANEL_RENDERER_PATH + "simple_dialog.ejs",
					"properties_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PROPERTIES_PANEL_RENDERER_PATH + "simple_dialog.ejs",
					"tools_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLS_PANEL_RENDERER_PATH + "simple_dialog.ejs",
					"execution_view":Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.EXECUTION_VIEW_RENDERER_PATH+"simple_dialog.ejs"
			};
			toolItemRenderers[Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.MULTISELECTDATAGRIDWITHFILTER] = {
					"builder_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.BUILDER_PANEL_RENDERER_PATH + "multi_select_dgwf.ejs",
					"preview_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PREVIEW_PANEL_RENDERER_PATH + "multi_select_dgwf.ejs",
					"outline_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.OUTLINE_PANEL_RENDERER_PATH + "multi_select_dgwf.ejs",
					"properties_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PROPERTIES_PANEL_RENDERER_PATH + "multi_select_dgwf.ejs",
					"tools_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLS_PANEL_RENDERER_PATH + "multi_select_dgwf.ejs",
					"execution_view":Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.EXECUTION_VIEW_RENDERER_PATH+"multi_select_dgwf.ejs"
			};
			toolItemRenderers[Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.ADDATTACHMENTS] = {
					"builder_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.BUILDER_PANEL_RENDERER_PATH + "add_attachments.ejs",
					"preview_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PREVIEW_PANEL_RENDERER_PATH + "add_attachments.ejs",
					"outline_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.OUTLINE_PANEL_RENDERER_PATH + "add_attachments.ejs",
					"properties_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PROPERTIES_PANEL_RENDERER_PATH + "add_attachments.ejs",
					"tools_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLS_PANEL_RENDERER_PATH + "add_attachments.ejs",
					"execution_view":Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.EXECUTION_VIEW_RENDERER_PATH+"add_attachments.ejs"
			};
			toolItemRenderers[Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SECTIONCONTAINER] = {
					"builder_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.BUILDER_PANEL_RENDERER_PATH + "section.ejs",
					"preview_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PREVIEW_PANEL_RENDERER_PATH + "section.ejs",
					"outline_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.OUTLINE_PANEL_RENDERER_PATH + "section.ejs",
					"properties_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.PROPERTIES_PANEL_RENDERER_PATH + "section.ejs",
					"tools_panel" : Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TOOLS_PANEL_RENDERER_PATH + "section.ejs",
					"execution_view":Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.EXECUTION_VIEW_RENDERER_PATH+"section.ejs"
			};
			
			var returnVal =  toolItemRenderers[toolType][context];
			//console.debug(arguments, returnVal);
			return returnVal;
		},
		getToolDataClasses : function ()
		{
			var commonModelPath = './application/library/level3/ddpw/utilities/tools/models/';
			var toolDataClasses= {};
			toolDataClasses [Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTINPUT] = Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.TextInput;
			toolDataClasses [Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTAREA] = Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.TextArea;
			toolDataClasses [Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SELECT] = Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.Select;
			toolDataClasses [Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.RADIOGROUP] = Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.RadioGroup;
			toolDataClasses [Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.CHECKBOXGROUP] = Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.CheckboxGroup;
			toolDataClasses [Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.DATEPICKER] = Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.DatePicker;
			toolDataClasses [Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SIMPLEDIALOG] = Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.SimpleDialog;
			toolDataClasses [Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.MULTISELECTDATAGRIDWITHFILTER] = Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.MultiSelectDataGridWithFilter;
			toolDataClasses [Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.ADDATTACHMENTS] = Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.AddAttachments;
			toolDataClasses [Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SECTIONCONTAINER] = Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.SectionContainer;
			
			return toolDataClasses;
		},
		getToolDataClass : function (toolType, params) {
			var initObj = params ? params : {},
			toolDataClasses= this.getToolDataClasses(),
			returnVal = new toolDataClasses[toolType](initObj);
			return returnVal;
		},
		promptModelSetSelectedFunction : function ( raw ) {
			//console.debug ("setSelectedResponse: ", raw );
			//using prototype method this function runs within the scope of the prompt itself - see prompt.js
			//** NOTE: as long as promptModelGetUiSelectionsFunction below is used in their respective controllers,
			//** then this raw value should be a $.Model.List
			
			//make sure there's a value to process
			var _selectedResponse = null,
			prompt = this;
			
			// if raw is null we should return null, I think
			// raw = raw == null || ( typeof ( raw.length ) != 'undefined' && raw.length == 0 ) ? prompt.getDefaultResponse() : raw;
			//convert the raw in other cases
			if ( raw != null 
					&& typeof ( raw ) == 'object' 
					&& typeof ( raw.length ) != 'undefined' 
					&& typeof ( raw.Class ) == 'undefined' 
					) {
				//we have a raw array
				raw = Level3_ddpw_administration.Models.ResponseOption.models ( raw );
			}
			
			if ( raw != null 
					&& typeof ( raw ) == 'object' 
					&& typeof ( raw.length ) != 'undefined' 
					&& typeof ( raw.Class ) != 'undefined' 
					&& raw.Class.shortName == 'List' 
					) {
				switch ( prompt.type ) {
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.DATEPICKER:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTINPUT:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTAREA:
							//cleanup - set all unselected ;
							prompt._selectedResponse = _selectedResponse = raw.setAllSelected( true );//expects an $.Model.List of ResponseOption Models to be set (from promptModelGetUiSelectionsFunction)
							prompt._hasSelectedResponse = ( _selectedResponse != null && typeof ( _selectedResponse.getAllSelected ) == 'function' ? _selectedResponse.getAllSelected().length > 0  : false );
							//prompt.attr("responseOptions" , _selectedResponse );
					break;
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.RADIOGROUP:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SIMPLEDIALOG:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.ADDATTACHMENTS:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.CHECKBOXGROUP:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SELECT:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.MULTISELECTDATAGRIDWITHFILTER:
							console.debug ("Setting " + prompt.type + "'s responseOptions using:" , raw);
							var promptResponseOptions = prompt.responseOptions.setSelectedByValue ( $.map ( raw , function ( responseOption, index ) { return responseOption.value }) );
							prompt._selectedResponse = _selectedResponse = promptResponseOptions.getAllSelected();//expects an $.Model.List of ResponseOption Models to be set (from promptModelGetUiSelectionsFunction)
							prompt._hasSelectedResponse = ( _selectedResponse != null && typeof ( _selectedResponse.getAllSelected ) == 'function' ? _selectedResponse.getAllSelected().length > 0  : false );
							prompt.attr("responseOptions").setSelectedByValue ( prompt._selectedResponse.getAllValues() );
							
							console.debug (prompt.type + "'s responseOptions set:" , prompt );
					break;
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SECTIONCONTAINER:
						///will need to handle all children of the section with a setSelected loop :)
						//throw new Error ("Set Selected Response commands not handled for prompt type: " + prompt.type);
						//we could set some values on the section prompt here if we wanted to, but no need...
					break;
					/*****************************************************************************************/
					 // TODO:under development for multi select datagrid: BLOCKED 201206081300MST
					/****************************************************************************************
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.MULTISELECTDATAGRIDWITHFILTER:
						var _selectedResponse = raw; //expects an array to be set
						if ( typeof ( _selectedResponse ) == 'object' && typeof ( _selectedResponse.length ) != 'undefined' ) {
							$.each ( _selectedResponse , function ( index , selectedResponse ) {
								if ( typeof ( selectedResponse.setSelected ) == 'function' ) {
									selectedResponse.setSelected ( true );//this only needs doing where it exists
								}
							});
						} else {
							throw new Error ("PromptSetSelected expects an array in checboxgroup and MultiSelectDataGridWithFilter...");
						} 
					break;
					/*****************************************************************************************/
					 // TODO:under development for multi select datagrid: BLOCKED 201206081300MST
					/*****************************************************************************************/
					default : 
						throw new Error ("Set Selected Response commands not handled for prompt type: " + prompt.type);
					break;
				}
			} else if ( raw == null ){ //null has been passed in an effort reset the selected responses
				//throw new Error ("PromptSetSelected expects a $.Model.List...");
				prompt.attr("responseOptions").getAllSelected().setAllSelected ( false );
				prompt._selectedResponse = null;
				prompt._hasSelectedResponse = false;
			}
			
			//console.debug ("setSelectedResponse returns: " , _selectedResponse);
			
			return _selectedResponse;
		},
		promptModelGetSelectedFunction : function (  ) { 
			//console.debug ("getSelectedResponse ", this);
			//using prototype method this function runs within the scope of the prompt itself - see prompt.js
			//returns an array of selected or default response options if null
			//using $.proxy - this function runs within the scope of the prompt itself
			var prompt = this,
			returnVal = null;
			if ( prompt._hasSelectedResponse ) {
				switch ( prompt.type ) {
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTINPUT:
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTAREA:
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.DATEPICKER:
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.MULTISELECTDATAGRIDWITHFILTER:
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.CHECKBOXGROUP:
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.RADIOGROUP:
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SELECT:
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SIMPLEDIALOG:
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.ADDATTACHMENTS:
							returnVal = prompt._selectedResponse;
						break;
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SECTIONCONTAINER:
							///will need to handle all children of the section with a setSelected loop :)
							throw new Error ("Set Selected Response commands not handled for prompt type: " + prompt.type);
						break;
						default : 						
							throw new Error ("Prompt Type : " + prompt.type + " Not handled in promptModelGetSelectedFunction ");
						break;
				}
			} else {
				//throw new Error ("Prompt Type : " + prompt.type + " Not handled in promptModelGetSelectedFunction ");
				returnVal = prompt.attr ("defaultResponse");
			}
			//console.debug ("getSelectedResponse returns: ", returnVal);
			return returnVal;
		},
		promptModelSetDefaultFunction : function ( defaultCollection ) { 
			//using prototype method this function runs within the scope of the prompt itself - see prompt.js
			//expects an array of default response options 			
			var prompt = this, _defaultResponse = null, isEmptyArray = ( typeof (defaultCollection.Class ) == 'undefined'
									&&  typeof (defaultCollection ) == 'object'
									&&  typeof (  defaultCollection.length ) != 'undefined'
									&&  defaultCollection.length == 0);
			
			if ( defaultCollection == null ) {
				defaultCollection = [];
			};
			switch ( prompt.type ) {
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTINPUT:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTAREA:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.DATEPICKER:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.MULTISELECTDATAGRIDWITHFILTER:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.CHECKBOXGROUP:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.RADIOGROUP:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SIMPLEDIALOG:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.ADDATTACHMENTS:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SELECT:
						_defaultResponse = prompt._defaultResponse = Level3_ddpw_administration.Models.ResponseOption.models ( defaultCollection );
						//throw console.debug ("defaultResponse : " , _defaultResponse );	
					break;		
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SECTIONCONTAINER:
					break;		
					default : 
						throw new Error ("Prompt Type : " + prompt.type + " Not handled in promptModelSetDefaultFunction ");	
					break;
			}			
			return _defaultResponse;
		},
		promptModelGetDefaultFunction : function ( ) { 
			//using prototype method this function runs within the scope of the prompt itself - see prompt.js
			//returns an array of default response options 
			//using $.proxy - this function runs within the scope of the prompt itself
			var prompt = this, 
				defaultVal, 
				isEmptyArray = ( typeof ( prompt._defaultResponse.Class ) == 'undefined'
									&&  typeof ( prompt._defaultResponse ) == 'object'
									&&  typeof (  prompt._defaultResponse.length ) != 'undefined'
									&&  prompt._defaultResponse.length == 0),
				isEmptyListClass = ( 
									typeof ( prompt._defaultResponse.Class ) != 'undefined'
									&&  prompt._defaultResponse.Class.shortName == 'List'
									&&  prompt._defaultResponse.length == 0);

			switch ( prompt.type ) {
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTINPUT:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTAREA:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.DATEPICKER:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.MULTISELECTDATAGRIDWITHFILTER:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SELECT:
						if ( prompt._defaultResponse == null 
								|| isEmptyArray || isEmptyListClass ){
							 prompt.attr ( "defaultResponse" , prompt.attr("responseOptions") );
						};
						defaultVal = prompt._defaultResponse 
					break;
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.RADIOGROUP:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.CHECKBOXGROUP:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SIMPLEDIALOG:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.ADDATTACHMENTS:
						if ( prompt._defaultResponse == null 
								|| isEmptyArray || isEmptyListClass ){
							 prompt.attr ( "defaultResponse" , prompt._defaultResponse );
						};
						defaultVal = prompt._defaultResponse 
					break;
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SECTIONCONTAINER:
					break;
					default :	
						throw new Error ("Prompt Type : " + prompt.type + " Not handled in promptModelGetDefaultFunction ");			
					break;
			}
			/*
			*/
			return defaultVal;
		},
		promptGetSelectedResponseCommands : function () {
			//using prototype method this function runs within the scope of the prompt itself - see prompt.js
			//return the array of command objects associated with the selected response.
			var prompt = this,
				selectedResponseCommands = [];
			if ( prompt.hasSelectedResponse ) {
				switch (prompt.type) {	
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTINPUT:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTAREA:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.DATEPICKER:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.CHECKBOXGROUP:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SELECT:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.RADIOGROUP:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SIMPLEDIALOG:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.ADDATTACHMENTS:
						var promptObj = prompt;
						selectedResponseCommands = $.map ( $.makeArray ( promptObj.attr ("selectedResponse") ), function ( responseOption , index ) { 
							var commands = [];
							if (typeof ( responseOption.commands.each ) != 'undefined'){
								responseOption.commands.each ( 
									function ( index, command ) { 
										commands.push ( command ) 
									} 
								);
							}
							return commands;
						} );
					break;
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SECTIONCONTAINER:
						throw new Error ("Selected Response commands not handled for type: " + prompt.type);						
					break;
					default:
						throw new Error ("Selected Response commands not handled for type: " + prompt.type);
					break;
				}
			}
			return selectedResponseCommands;
		},
		promptModelGetUiSelectionsFunction : function ( event ) { 
			//runs in scope of prompt ITEM CONTROLLER in preview and execution
			//this function is for getting from UI - not setting to model
			//using prototype method this function runs within the scope of the prompt ITEM CONTROLLER itself 
				//- see prompt_item_controller.js, preview_panel_item_controller.js
			//returns a $.Model.List (array-like) instance of selected response option models (response_option.js) in all cases 
			
			console.debug (this.Class.shortName + ".getUiSelections()");
			var uiResponse = null,
				//inputElement = $("> .promptItemRenderer input,> .promptItemRenderer textarea,> .promptItemRenderer select", htmlElement ),
				value = null,
				itemModel = this.options.itemModel,
				htmlElement = this.element ? this.element : null; 
					if (htmlElement == null) {
						throw (new Error ("this.element is null"));
					}
			
			switch ( itemModel.type ) {
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTINPUT:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTAREA:
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.DATEPICKER:
						value = value ? value : itemModel.elements().filter (":visible").find(".response_option input, .response_option textarea, .response_option select").val();
						var rawRO = null; 
						if ( typeof ( itemModel.responseOptions ) != 'undefined'
							&& typeof ( itemModel.responseOptions[0] )!= 'undefined'
							&& typeof ( itemModel.responseOptions[0].serialize )== 'function')
						{						
							rawRO = itemModel.responseOptions[0].serialize();
						} else {
							if ( typeof ( itemModel.responseOptions[0] ) == 'object' ) {
								rawRO =  Level3_ddpw_administration.Models.ResponseOption.models ( itemModel.attr("responseOptions")[0].serialize() ) ;
							} else {
								throw new Error ("itemModel.responseOptions[0] is broken for "+ itemModel.type );
							}
						}
						//text models get the straight 
						rawRO.value = value;
						uiResponse = Level3_ddpw_administration.Models.ResponseOption.models ( [ rawRO ] );
					break;
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.MULTISELECTDATAGRIDWITHFILTER:
						switch ( context ) {
							case "PreviewPanelItemController" : //preview panel
								var $msdgwfController = $('.level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_multi_select_data_grid_with_filter', htmlElement).controller();
							break;
							case "PromptItemController" : //execution view
							default :
								var $msdgwfController = $('.level3_ddpw_administration_library_level3_ddpw_utilities_tools_execution_view_multi_select_data_grid_with_filter', htmlElement).controller();
							break;
						}
						var selectedRows = [],
						dataTable = $msdgwfController.options.dataTableTarget;
						$(".row_selected", htmlElement).each ( function ( index, element ) {
							selectedRows.push ( dataTable.fnGetData ( element ) );
						});
						uiResponse = Level3_ddpw_administration.Models.ResponseOption.models ( selectedRows );
					break;
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.CHECKBOXGROUP:
						uiResponse = []; //ASSIGN array of response option models
						$("[name='"+itemModel.identity()+"_checkbox_group']", htmlElement).filter(":checked").each ( function ( index, element ) {
							uiResponse.push ( $(element).closest(".response_option").model() );
						});
						uiResponse = Level3_ddpw_administration.Models.ResponseOption.models ( uiResponse );
					break;
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.RADIOGROUP:
						uiResponse = []; //ASSIGN array of response option models
						$("[name='"+itemModel.identity()+"_radio_group']",htmlElement).filter(":checked").each ( function ( index, element ) {
							uiResponse.push ( $(element).closest(".response_option").model() );
						});
						uiResponse = Level3_ddpw_administration.Models.ResponseOption.models ( uiResponse );
					break;
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SIMPLEDIALOG:
						//simple dialog *can* have many set, but we're going to restrict to single select for now....
						var selectedResponses = $(".response_option", htmlElement).has("input:checked").models();
						uiResponse = Level3_ddpw_administration.Models.ResponseOption.models ( selectedResponses );
					break;
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.ADDATTACHMENTS:

						switch ( context ) {
							case "PreviewPanelItemController" : //preview panel
								//var $addAttachmentController = $('.level3_ddpw_administration_library_level3_ddpw_utilities_tools_preview_panel_add_attachments', this.element).controller();
							break;
							case "PromptItemController" : //execution view
							default :
								var $addAttachmentController = $('.level3_ddpw_administration_library_level3_ddpw_utilities_tools_execution_view_add_attachments', this.element).controller();
							break;
						}
						var selectedFiles = [],
						//get the FQN file name
						dataTable = $addAttachmentController.options.dataTableTarget;
						$(".row_selected", this.element).each ( function ( index, element ) {
							selectedFiles.push ( dataTable.fnGetData ( element ) );
						});
						uiResponse = Level3_ddpw_administration.Models.ResponseOption.models ( selectedFiles );
						
											
						
						//uiResponse = Level3_ddpw_administration.Models.ResponseOption.models ( [ $(event.srcElement).closest(".response_option").model() ] );
					break;
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SELECT:
						uiResponse = itemModel.responseOptions.match("value",htmlElement.find("select").val());
					break;
					case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SECTIONCONTAINER:
						///will need to handle all children of the section with a getUISelections loop :)
						//var sectionPromptModels = $(".prompt", htmlElement).models();
						//console.debug ("sectionPromptModels: " , sectionPromptModels );
						uiResponse = Level3_ddpw_administration.Models.ResponseOption.models ( [] ); //actual values are handled at the prompt level.
						//sections effectively have no responsees of their own.
					break;
					default : 
						value = value ? value : inputElement.val();
						var comparisonFunction = function ( index, responseOption ) {
							//console.debug ("looking for:" + value +" in RO: " + index +": " + responseOption.value , responseOption );
							if ( value == responseOption.value ) {
								uiResponse = responseOption;	//all others get sought for the right response option model
							}
						};
						itemModel.responseOptions.each ( comparisonFunction );
						uiResponse = Level3_ddpw_administration.Models.ResponseOption.models ( [uiResponse] );
					break;
			}	
			console.debug ("getUiResponseReturns : " , uiResponse);
			return uiResponse;
		},
		promptModelIsResponseOptionSelectedFunction : function ( uiValueArray ) { 
			//uiValueArray will be converted to an array if single object 
			//using prototype method this function runs within the scope of the prompt itself - see prompt.js
			var _isSelected = false,
				prompt = this;
				
			if (uiValueArray != null
				&& typeof ( uiValueArray ) == 'object' 
				&& typeof ( uiValueArray.length ) != 'undefined'){
				//it looks like an array 
				//(could be a $.Model.List (http://www.javascriptmvc.com/docs.html#!jQuery.Model.List) 
				//-- and still work ok )
			}else{
				//assume that this is an actual response option object, and array-ify it.
				uiValueArray = [uiValueArray];
			};
				
			if ( prompt.hasSelectedResponse() ) {
				switch ( prompt.type ) {
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTINPUT:
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTAREA:
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.DATEPICKER:
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SELECT:
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.RADIOGROUP:
							//these items selectedResponse is the raw value of the response option.
							_isSelected = prompt.attr ("selectedResponse")[0].value == uiValueArray[0].value ? true : false; 
						break;
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SIMPLEDIALOG:
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.ADDATTACHMENTS:						
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.CHECKBOXGROUP:
							//these items selectedResponse object allow multiple - and each is expected to be a responseOption model instance
							var selections  = uiValueArray,
								responseOptions = Level3_ddpw_administration.Models.ResponseOption.models ( prompt.responseOptions ),//make sure it's not referenced anywhere.
								_isSelected = responseOptions.isSelectionMatch ( selections );
						break;
						case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SECTIONCONTAINER:
							//may be N/A
						break;
						default:
							throw new Error ("Prompt type: " + prompt.type + "not handled in tool factory promptModelIsResponseOptionSelectedFunction");
						break;
				}
			}
			return _isSelected;
		},
		getValidationControllerHtmlTemplate : function ( context ) {
			try {
				var defaultTemplate = $.View ("./application/execution_controllers/validation_controller/views/init.ejs");
				
				switch ( context ) {
					case "preview_panel":
					case "execution_view":
						var validatorControllerHtmlTemplate = defaultTemplate;
					break;
					default:
						var validatorControllerHtmlTemplate = defaultTemplate;
					break;
				}
			} catch (e) {
				throw new Error ("Error with Validator type: " + validatorType +". " + e.message);
			}
			return validatorControllerHtmlTemplate;
		},
		
		getValidationRule : function ( promptModel ) {
			//this may be further modified within the prompt
			var rules = {};
			/*
			if (promptModel.isResponseRequired) {
				rules;
			}
			
			switch ( promptModel.type ) {
				case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTINPUT:
				case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.TEXTAREA:
				case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SELECT:
				case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.RADIOGROUP:
				case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.CHECKBOXGROUP:
				case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.DATEPICKER:
				case Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.ToolFactory.SIMPLEDIALOG:
				
				break;
			}
			
			{
			 required: true,
			 minlength: 2,
			 messages: {
			   required: "Required input",
			   minlength: jQuery.format("Please, at least {0} characters are necessary")
			 }
			}
			
			try {
				//validator = new validatorClasses ( toolType, validatorType, context );
			} catch (e) {
				throw new Error ("Error with Validator type: " + validatorType +". " + e.message);
			}
			*/ 
		}
	},
	/** @Prototype **/
	{
		
	});
});