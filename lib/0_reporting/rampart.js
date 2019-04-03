StructureRampart.prototype.report = function() {
  if (this.my) {
    //if I control the rampart
    if (this.hits < this.room.controller.level * 10000) {
      Memory.rooms[this.room.name].tower.fix.push(this.id);
      //Memory.rooms[this.room.name].frog.fix.push(this.id);
    }
    //auto-close when guarded
    if ([].concat(_toConsumableArray(this.room.lookAt(this.pos.x, this.pos.y))).length > 2) {
      this.setPublic(false);
    } else {
      this.setPublic(true);
    }
    //defensive close
    if (Memory.rooms[this.room.name].tower.whack.length > 0) {
      for (var e in Memory.rooms[this.room.name].tower.whack) {
        var enemy = Game.getObjectById(Memory.rooms[this.room.name].tower.whack[e]);
        if (this.pos.inRangeTo(enemy, 1)) {
          this.setPublic(false);
          return true;
        }
      }
    }
  } else {
    //if I do not control the rampart
    Memory.rooms[this.room.name].frog.deconstruct.push(this.id);
    Memory.rooms[this.room.name].shark.whack.push(this.id);
  }
};
