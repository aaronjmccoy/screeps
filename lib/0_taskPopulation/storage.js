StructureStorage.prototype.report = function () {
 if (this.room.controller.my) {
  if (this.store.energy > 0) {
   this.room.memory.jobs.collect.push(this.id);
   if (this.room.memory.childRoom) {
    Memory.rooms[this.room.memory.childRoom].jobs.collect.push(this.id);
   }
  }
  if (this.hits < this.hitsMax) {
   this.room.memory.jobs.fix.push(this.id);
  }
 } else {
  if (this.store.energy > 0) {
   Memory.rooms[this.room.name].jobs.collect.push(this.id);
  } else {
   Memory.rooms[this.room.name].jobs.deconstruct.push(this.id);
  }
 }
};
