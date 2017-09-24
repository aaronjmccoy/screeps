StructureRampart.prototype.report = function() {
  if (this.room.controller.my) {
    //if I control the rampart
    if (this.hits < ((this.hitsMax / 8) * this.room.controller.level)) {
      Memory.rooms[this.room.name].frog.fix.push(this.id);
    } else if (this.hits < (this.room.controller.level * 100000)) {
      Memory.rooms[this.room.name].tower.fix.push(this.id);
    }
    //auto-close when guarded
    if ([...this.room.lookAt(this.pos.x, this.pos.y)].length > 2) {
      this.setPublic(false);
    } else {
      this.setPublic(true);
    }
    //defensive close
    if (Memory.rooms[this.room.name].tower.whack.length > 0) {
      for (let e in Memory.rooms[this.room.name].tower.whack) {
        let enemy = Game.getObjectById(Memory.rooms[this.room.name].tower.whack[e]);
        if (this.pos.inRangeTo(enemy, 1)) {
          this.setPublic(false);
          return true;
        }
      }
    }
  } else {
    //if I do not control the rampart
    Memory.rooms[this.room.name].frog.deconstruct.push(this.id);
  }
};
