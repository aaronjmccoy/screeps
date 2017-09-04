StructureLab.prototype.report = function () {
 if (this.room.controller.my) {
  //if I control the lab
  if (this.energy < this.energyCapacity) {
   Memory.rooms[this.room.name].newt.deposit.push(this.id);
  }
  //lab logic here later
  if (this.hits < this.hitsMax) {
   Memory.rooms[this.room.name].frog.fix.push(this.id);
   Memory.rooms[this.room.name].tower.fix.push(this.id);
  }
 } else {
  //if I do not control the lab
  if (this.energy > 0) {
   if (Memory.rooms[this.room.name].parentRoom) {
    Memory.rooms[Memory.rooms[this.room.name].parentRoom].minnow.collect.push(this.id);
   }
  } else {
   if (Memory.rooms[this.room.name].parentRoom) {
    Memory.rooms[Memory.rooms[this.room.name].parentRoom].frog.deconstruct.push(this.id);
   }
  }
 }
};
