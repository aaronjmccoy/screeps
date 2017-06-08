StructureTower.prototype.report = function () {
 if (this.store.energy > this.energyCapacity) {
  this.createTask('deposit');
 }
 if (this.hits < this.hitsMax) {
  this.createTask('fix');
 }
};

StructureTower.prototype.debrief = function () {
 if (this.store.energy === this.energyCapacity) {
  this.deleteTask('deposit');
 }
 if (this.hits === this.hitsMax) {
  this.deleteTask('fix');
 }
};
