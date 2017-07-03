StructureRoad.prototype.report = function () {
  if (this.hits < 4000) {
    this.room.memory.jobs.fix.tasks.push(this.id);
  }
};
