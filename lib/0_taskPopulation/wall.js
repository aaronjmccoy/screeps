StructureWall.prototype.report = function () {
 CM.set(this.pos.x, this.pos.y, 255);
 if (this.hits < 1000) {
  this.room.memory.jobs.fix.push(this.id);
 }
};
