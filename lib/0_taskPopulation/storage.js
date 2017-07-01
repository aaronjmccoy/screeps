StructureStorage.prototype.report = function () {
  if (this.energy >= 50) {
    this.room.memory.jobs.collect.tasks.push(this.id);
  }
  if (this.hits < this.hitsMax) {
    this.room.memory.jobs.fix.tasks.push(this.id);
  }
};
