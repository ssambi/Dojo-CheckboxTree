define(["dijit/tree/ForestStoreModel"], function(ForestStoreModel) {
	return dojo.declare(ForestStoreModel, {
		onChange: function(/*dojo.data.Item*/ item){
			this.inherited(arguments);
		
			var currStore = this.store;
			var newValue = currStore.getValue(item,"checked");

			this.getChildren(item,function(children){     
				dojo.forEach(children,function(child){
					currStore.setValue(child,"checked",newValue);
				});
			});   
		}
	});
});
