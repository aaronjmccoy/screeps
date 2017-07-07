Source.prototype.report = function () {
  CM.set(this.pos.x, this.pos.y, 255);
 if (this.energy > 0) {
  this.room.memory.jobs.mine.push(this.id);
 }
};
