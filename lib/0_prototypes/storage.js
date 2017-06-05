StructureStorage.prototype.report = function () {
 if (this.store.energy >= 50) {
   this.createTask('withdraw');
 }
 if(this.hits < this.hitsMax){
   this.createTask('repair');
 }
};
StructureStorage.prototype.debrief = function () {
  if (this.store.energy === 0) {
   this.deleteTask('withdraw');
  }
  if (this.hits === this.hitsMax) {
   this.deleteTask('repair');
  }
};
