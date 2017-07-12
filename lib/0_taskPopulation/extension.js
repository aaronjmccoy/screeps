StructureExtension.prototype.report = function () {
 CM.set(this.pos.x, this.pos.y, 255);
 if (this.room.controller.my) {
  if (this.energy < this.energyCapacity) {
   Memory.rooms[this.room.name].jobs.deposit.push(this.id);
  }
  if (this.hits < this.hitsMax) {
   Memory.rooms[this.room.name].memory.jobs.fix.push(this.id);
  }
 } else {
  if (this.energy > 0) {
   Memory.rooms[this.room.name].jobs.collect.push(this.id);
  } else {
   Memory.rooms[this.room.name].jobs.deconstruct.push(this.id);
  }
 }
};
