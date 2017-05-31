StructureSpawn.prototype.report = function () {
 if (this.energy < this.energyCapacity) {
  //add to deposit array
  this.room.memory.jobs.transfer.tasks[this.id] = this.id;
 }
};

StructureSpawn.prototype.debrief = function () {
 if (this.energy === this.energyCapacity) {
  delete this.room.memory.jobs.transfer.tasks[this.id];
 }
};
