function road(structure){
    if (structure.hits < 4000) {
    Memory.rooms[structure.room.name].frog.fix.push(structure.id);
    Memory.rooms[structure.room.name].toad.fix.push(structure.id);
    Memory.rooms[structure.room.name].tower.fix.push(structure.id);
  }
}
StructureRoad.prototype.report = function() {
  if (this.hits < 4000) {
    Memory.rooms[this.room.name].frog.fix.push(this.id);
    Memory.rooms[this.room.name].toad.fix.push(this.id);
    Memory.rooms[this.room.name].tower.fix.push(this.id);
  }
};
