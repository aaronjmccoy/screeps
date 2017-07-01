Resource.prototype.report = function () {
  this.room.memory.jobs.sweep.tasks.push(this.id);
};
