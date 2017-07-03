Source.prototype.report = function () {
 if (this.energy > 0) {
  this.room.memory.jobs.mine.push(this.id);
 }
};
