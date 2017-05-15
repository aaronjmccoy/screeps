/**
 * Add a reportFlag to all structures
 *
 * reportFlags indicate a structure requires creep interaction
 *
 */
Object.defineProperty(OwnedStructure.prototype, 'reportFlag', {
	set: function(value) {
		this.memory.reportFlag = value;
	},
	get: function() {
		if(this.memory.reportFlag){
			return this.memory.reportFlag;
    }else{
      return 0;
    }
	},
	configurable: true,
	enumerable: false
});
