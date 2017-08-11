StructureRoad.prototype.report = function () {
 if (this.hits < 4000) {
  Memory.rooms[this.room.name].frog.fix.push(this.id);
 }
 if (this.hits < 1000) {
  Memory.rooms[this.room.name].tower.fix.push(this.id);
 }
};
