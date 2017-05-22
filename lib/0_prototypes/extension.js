StructureExtension.prototype.report = function () {
 if (this.energy < this.energyCapacity) {
  //add to deposit array
  this.room.memory.jobs.transfer.tasks[this.id] = this.energy;
 }
};
StructureExtension.prototype.debrief = function () {
 if (this.energy === this.energyCapacity) {
  delete this.room.memory.jobs.transfer.tasks[this.id];
 }
};
