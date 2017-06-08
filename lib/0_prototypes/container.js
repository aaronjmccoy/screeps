StructureContainer.prototype.report = function () {
 if (this.store.energy >= 50) {
  this.createTask('collect');
 }
 if (this.hits < 10000) {
  this.createTask('fix');
 }
};
StructureContainer.prototype.debrief = function () {
 if (this.store.energy === 0) {
  this.deleteTask('collect');
 }
 if (this.hits > 10000) {
  this.deleteTask('fix');
 }
};
