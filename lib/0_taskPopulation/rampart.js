StructureRampart.prototype.report = function () {
 if (this.room.controller.my) {
  if (this.hits < this.room.controller.level * 150000) {
   this.room.memory.jobs.fix.push(this.id);
  }
  if ([...this.room.lookAt(this.pos.x, this.pos.y)].length > 2) {
   this.setPublic(false);
  } else {
   this.setPublic(true);
  }
  if (this.room.memory.jobs.whack.length > 0) {
   for (let e in this.room.memory.jobs.whack) {
    let enemy = Game.getObjectById(this.room.memory.jobs.whack[e]);
    if (this.pos.inRangeTo(enemy, 1)) {
     this.setPublic(false);
    }
   }
  }
 } else {
  Memory.rooms[this.room.name].jobs.deconstruct.push(this.id);
 }
};
