Source.prototype.report = function () {
  if (this.energy > 0) {
    this.room.memory.jobs.mine.tasks.push(this.id);
  }
};
