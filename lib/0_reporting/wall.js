StructureWall.prototype.report = function() {
  if (this.hits < 1000 * this.room.controller.level) {
    Memory.rooms[this.room.name].tower.fix.push(this.id);
    Memory.rooms[this.room.name].frog.fix.push(this.id);
  }
};
