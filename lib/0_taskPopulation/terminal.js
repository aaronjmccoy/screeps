StructureTerminal.prototype.report = function () {
 if (this.room.controller.my) {
  //if I control the storage
  if (this.store.energy >= 50) {
   Memory.rooms[this.room.name].newt.collect.push(this.id);
   Memory.rooms[this.room.name].frog.collect.push(this.id);
  }
  if (_.sum(this.store) < this.storeCapacity) {
   Memory.rooms[this.room.name].toad.deposit.push(this.id);
   Memory.rooms[this.room.name].minnow.deposit.push(this.id);
  }
  if (this.hits < this.hitsMax) {
   Memory.rooms[this.room.name].frog.fix.push(this.id);
   Memory.rooms[this.room.name].toad.fix.push(this.id);
  }
 } else {
  //if I do not control the storage
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
