StructureStorage.prototype.report = function () {
 if (this.store.energy >= 50) {
  this.createTask('collect');
 }
 if (this.hits < this.hitsMax) {
  this.createTask('fix');
 }
};
StructureStorage.prototype.debrief = function () {
 if (this.store.energy === 0) {
  this.deleteTask('collect');
 }
 if (this.hits === this.hitsMax) {
  this.deleteTask('fix');
 }
};
