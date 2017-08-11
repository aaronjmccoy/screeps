StructureContainer.prototype.report = function () {
 CM.set(this.pos.x, this.pos.y, 0);
 if (_.sum(this.store) >= 50) {
  Memory.rooms[this.room.name].newt.collect.push(this.id);
  Memory.rooms[this.room.name].frog.collect.push(this.id);
 }
 if (_.sum(this.store) < this.storeCapacity) {
  Memory.rooms[this.room.name].toad.deposit.push(this.id);
  Memory.rooms[this.room.name].minnow.deposit.push(this.id);
 }
 if (this.hits < 10000) {
  Memory.rooms[this.room.name].frog.fix.push(this.id);
  Memory.rooms[this.room.name].toad.fix.push(this.id);
 }
};
