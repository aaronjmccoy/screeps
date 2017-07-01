StructureRoad.prototype.report = function () {
  if (this.hits < this.hitsMax) {
    this.room.memory.jobs.fix.tasks.push(this.id);
  }
};
