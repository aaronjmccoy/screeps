StructureContainer.prototype.report = function () {
 CM.set(this.pos.x, this.pos.y, 0);
 if (_.sum(this.store) >= 50) {
  this.room.memory.jobs.collect.push(this.id);
 }
 if (this.hits < 10000) {
  this.room.memory.jobs.fix.push(this.id);
 }
};
