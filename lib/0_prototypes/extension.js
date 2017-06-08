StructureExtension.prototype.report = function () {
 if (this.store.energy > this.energyCapacity) {
  this.createTask('deposit');
 }
 if (this.hits < this.hitsMax) {
  this.createTask('fix');
 }
};

StructureExtension.prototype.debrief = function () {
 if (this.store.energy === this.energyCapacity) {
  this.deleteTask('deposit');
 }
 if (this.hits === this.hitsMax) {
  this.deleteTask('fix');
 }
};
