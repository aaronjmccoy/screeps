StructureStorage.prototype.report = function () {
 if (this.store.energy > 0) {
  this.room.memory.jobs.collect.push(this.id);
  if (this.room.memory.childRoom) {
   Memory.rooms[this.room.memory.childRoom].jobs.collect.push(this.id);
  }
 }

 if (this.hits < this.hitsMax) {
  this.room.memory.jobs.fix.push(this.id);
 }
};
