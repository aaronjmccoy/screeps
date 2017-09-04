StructureTower.prototype.report = function () {
 if (this.room.controller.my) {
  if (this.energy < this.energyCapacity) {
   Memory.rooms[this.room.name].newt.deposit.push(this.id);
  }
  if (this.hits < this.hitsMax) {
   Memory.rooms[this.room.name].memory.frog.fix.push(this.id);
   Memory.rooms[this.room.name].memory.tower.fix.push(this.id);
  }
 } else {
  if (this.energy > 0) {
   if (Memory.rooms[this.room.name].parentRoom) {
    Memory.rooms[Memory.rooms[this.room.name].parentRoom].newt.collect.push(this.id);
   }
  } else {
   if (Memory.rooms[this.room.name].parentRoom) {
    Memory.rooms[Memory.rooms[this.room.name].parentRoom].frog.deconstruct.push(this.id);
   }
  }
 }
};
