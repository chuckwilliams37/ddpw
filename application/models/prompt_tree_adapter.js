$(document).ready(function() {

/**
 * @class Level3_ddpw_administration.Models.PromptTreeAdapter
 * @inherits jQuery.Model
 * Wraps backend prompt_tree services. Provides cursor functionality.  Manages node movement and crud internally 
 */
$.Model('Level3_ddpw_administration.Models.PromptTreeAdapter',
/* @Static */
{
	convertFromPromptTree : function ( promptTree ) {
		var initParams = {
			key: promptTree.id,
			domain: promptTree.domain,
			name: promptTree.name,
			state: promptTree.isAlwaysEffective ? "active" : "inactive",
			description: promptTree.description,
			effective_date: new Date( promptTree.effectiveDate ),
			expiration_date: new Date ( promptTree.expirationDate ),
			expiration_date: new Date ( promptTree.modifiedDate ),
			tq_text: escape(JSON.stringify(promptTree.serialize()))
		}
		var promptTreeAdapter = this.model(initParams);
		return promptTreeAdapter;
	},
	convertToPromptTree : function ( tq_steps ) {
		var promptTreeAdapter =  Level3_ddpw_administration.Models.PromptTreeAdapter.model ( tq_steps );
		var treeInitParams = {};
		if ( typeof ( promptTreeAdapter.tq_text ) != 'undefined' && $.trim( promptTreeAdapter.tq_text ).length  > 0 ) {
			//all data is available for conversion
			treeInitParams = JSON.parse(unescape(promptTreeAdapter.tq_text));
		} else {
			//we'll assume only partial data is available
			//for prompt trees that don't have their sub-questions (tq_text)
			var treeInitParams = {
					id : promptTreeAdapter.key,
					name : promptTreeAdapter.name,
					description : promptTreeAdapter.description,
					domain : promptTreeAdapter.domain,
					isAlwaysEffective :  promptTreeAdapter.state == "active",
					effectiveDate : promptTreeAdapter.effective_date,
					expirationDate : promptTreeAdapter.expiration_date
			};			
		}
		var tree = Level3_ddpw_administration.Models.PromptTree.model ( treeInitParams );
		return tree;
	}, 
	attributes : {
		key: 'string',
		domain: 'string',
		name: 'string',
		state:'string',
		description: 'string',
		effective_date: 'date',
		expiration_date: 'date',
		expiration_date: 'date',
		tq_text: 'string'
	},
	convert : {
	    date : function(raw){
	    	if ( new Date (raw) instanceof Date ) {
	    		return new Date( raw );
	    	} else if(typeof raw == 'string'){
	        var matches = raw.match(/(\d+)\/(\d+)\/(\d+)/)
	        return matches ? new Date( matches[3],(+matches[1])-1,matches[2] ) : null;
	      }else if(raw instanceof Date){
	          return raw;
	      }
	    }
	},
	serialize : {
	    date : function(val, type){
	      return new Date(val).toISOString();
	      }
	}
},
/* @Prototype */
{	
    key : "prompt.tree.adapter.key",
    domain : "prompt.tree.adapter.domain",
    name : "Prompt Tree Adapter Name",
    state : "inactive", 
    description : "adapter description",
    effective_date : new Date(),
    expiration_date : new Date(),
    tq_text : "" //will be a serialized object of self.
})
});