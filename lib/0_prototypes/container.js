StructureContainer.prototype.report = function () {
 if (this.store.energy >= 50) {
   this.createTask('withdraw');
 }
 if(this.hits < 10000){
   this.createTask('repair');
 }
};
StructureContainer.prototype.debrief = function () {
 if (this.store.energy === 0) {
  this.deleteTask('withdraw')
 }
 if (this.hits > 10000) {
  this.deleteTask('repair')
 }
};
