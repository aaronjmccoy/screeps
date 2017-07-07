Resource.prototype.report = function () {
  CM.set(this.pos.x, this.pos.y, 0);
 this.room.memory.jobs.sweep.push(this.id);
};
