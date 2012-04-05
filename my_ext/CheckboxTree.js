define(["dijit/Tree", "dijit/form/CheckBox"], function(Tree, CheckBox) {

	// defining a CheckboxTreeNode as TreeNode extension
	var CheckboxTreeNode = dojo.declare([Tree._TreeNode], {

		// inner dijit.form.CheckBox
		_checkbox: null,
 
		
		setNodeCheckboxValue: function(value){ 
			this._checkbox.set('checked',value);
		},

		 
		postCreate: function(){
			this.inherited(arguments);
			
			// checkbox creation
			this._checkbox = new CheckBox({});
			dojo.place(this._checkbox.domNode, this.iconNode, "before");

			// preload
			// get value from the store (JSON) of the property "checked" and set the checkbox
			//  store.isItem to exclude dummy root in case of ForestStoreModel
			if (this.tree.model.store.isItem(this.item)) {
				if (this.tree.model.store.hasAttribute(this.item, 'checked')) {
					var attrValue = this.tree.model.store.getValue(this.item, 'checked');
					var val = (attrValue === true || (attrValue.toLowerCase && attrValue.toLowerCase() === 'true'));       
					this.setNodeCheckboxValue(val) ;
				}
			}
		   
		   
			if (this.tree.setCheckboxOnClick == false) {
				// connect onChange of the checkbox to alter the model of the tree
				dojo.connect(_checkbox, 'onChange', this,
						function(){
							var checkboxValue = this._checkbox.get('value');
							this.tree.model.store.setValue(this.item, "checked", (checkboxValue === true));
						});
			}
	   
		},
			 
		getCheckedNodesList: function(nodeArray){
			if ( this._checkbox.isChecked() ) {
				nodeArray.push(this.item.label);
			}
			   
			this.getChildren().forEach(getCheckedNodesList(nodeArray), this);           
		}           
		
	});
	
	return dojo.declare(Tree, {
	
		// setCheckboxOnClick: Boolean
		//        If true, clicking a node will change the checkbox state
		//        If true, openOnClick will be set to false
		setCheckboxOnClick: false,
	   
		postCreate: function(){
			this.inherited(arguments);
		   
			if (this.setCheckboxOnClick == true) {
				// if setCheckboxOnClick is true, openOnClick must be false
				this.set('openOnClick', false);
			   
				dojo.connect(this, "onClick", this, function(/* dojo.data */ item, /*TreeNode*/ node, /*Event*/ evt) {
					var isChecked = this.model.store.getValue(item, 'checked');
					isChecked = (isChecked != null && (isChecked === true || (isChecked.toLowerCase && isChecked.toLowerCase() === 'true')));
					this.model.store.setValue(item, 'checked', !isChecked);
				});
			}

			
		},

		_createTreeNode: function(/*Object*/ args){
			// summary:
			//        creates a TreeNode
			// description:
			//        Developers can override this method to define their own TreeNode class;
			//        However it will probably be removed in a future release in favor of a way
			//        of just specifying a widget for the label, rather than one that contains
			//        the children too.
			return new CheckboxTreeNode(args);
		},
	   
		_onItemChange: function(/*Item*/ item){
			this.inherited(arguments);
		   
			//---
			var model = this.model,
				identity = model.getIdentity(item),
				nodes = this._itemNodesMap[identity];

			if(nodes){
				var newValue = this.model.store.getValue(item,"checked");
				dojo.forEach(nodes,function(node){
					node.setNodeCheckboxValue(newValue);
				});
			}
		}

	});
});

