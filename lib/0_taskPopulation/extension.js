StructureExtension.prototype.report = function () {
  CM.set(this.pos.x, this.pos.y, 255);
 if (this.energy < this.energyCapacity) {
  this.room.memory.jobs.deposit.push(this.id);
 }
 if (this.hits < this.hitsMax) {
  this.room.memory.jobs.fix.push(this.id);
 }
};
