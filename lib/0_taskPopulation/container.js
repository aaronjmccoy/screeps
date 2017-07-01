StructureContainer.prototype.report = function () {
 if (this.store.energy >= 50) {
  this.room.memory.jobs.collect.tasks.push(this.id);
 }
 if (this.hits < 10000) {
   this.room.memory.jobs.fix.tasks.push(this.id);
 }
};
