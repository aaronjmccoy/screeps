StructureContainer.prototype.report = function () {
 if (this.store.energy > 0) {
  this.room.memory.jobs.withdraw.tasks[this.id] = this.id;
 }
};
StructureContainer.prototype.debrief = function () {
 if (this.store.energy === 0) {
  delete this.room.memory.jobs.withdraw.tasks[this.id];
 }
};
