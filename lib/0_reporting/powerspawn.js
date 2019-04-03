StructurePowerSpawn.prototype.report = function() {
  if (this.room.controller.my) {
    //if I control the powerspawn
    if (this.energy < this.energyCapacity) {
      Memory.rooms[this.room.name].newt.deposit.push(this.id);
    }
    if (this.hits < this.hitsMax) {
      Memory.rooms[this.room.name].tower.fix.push(this.id);
      Memory.rooms[this.room.name].frog.fix.push(this.id);
    }
  } else {
    //if I do not control the powerspawn
    if (this.energy > 0) {
      Memory.rooms[this.room.name].newt.collect.push(this.id);
    } else {
      Memory.rooms[this.room.name].frog.deconstruct.push(this.id);
    }
  }
};
