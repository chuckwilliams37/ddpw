$(document).ready(function() {
/**
 * @class Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.AddAttachments
 * @parent index
 * @inherits jQuery.Model
 */
$.Class('Level3_ddpw_administration.Library.Level3.Ddpw.Utilities.Tools.Models.AddAttachments',
/* @Static */
{},
/* @Prototype */
{	
	
	responseOptions : [
						{label:"BrowseMe",value:{
								fileName: "fileName1",
								dataStream: {}
							}},
						{label:"BrowseYou",value:{
								fileName: "fileName2",
								dataStream: {}
							}},
						{label:"BrowseHim",value:{
								fileName: "fileName3",
								dataStream: {}
							}}						
						],
	isPopup : true,
	offerChange : true,
	title : "Add Attchment Title"
});
})