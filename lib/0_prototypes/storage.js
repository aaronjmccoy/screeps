StructureStorage.prototype.report = function () {
 if (this.store.energy > 0) {
  //add to gather object
  this.room.memory.jobs.withdraw.tasks[this.id] = this.energy;
 }
};
StructureStorage.prototype.debrief = function () {
 if (this.store.energy === 0) {
  delete this.room.memory.jobs.withdraw.tasks[this.id];
 }
};
