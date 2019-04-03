StructureStorage.prototype.report = function() {
  if (this.room.controller.my) {
    //if I control the storage
    if (this.store.energy >= 50) {
     var pushes = Math.min(Math.ceil(this.store.energy/1000), 8) ;
     for(var iStore = 0; iStore < pushes;iStore++){
        Memory.rooms[this.room.name].newt.collect.push(this.id);
        Memory.rooms[this.room.name].frog.collect.push(this.id);
     }
    }
    if (_.sum(this.store) < this.storeCapacity) {
      Memory.rooms[this.room.name].toad.deposit.push(this.id);
      Memory.rooms[this.room.name].minnow.deposit.push(this.id);
    }
    if (this.hits < this.hitsMax) {
      Memory.rooms[this.room.name].frog.fix.push(this.id);
      Memory.rooms[this.room.name].toad.fix.push(this.id);
      Memory.rooms[this.room.name].tower.fix.push(this.id);
    }
  } else {
    //if I do not control the storage
    if (this.energy > 0) {
      Memory.rooms[this.room.name].newt.collect.push(this.id);
    } else {
      Memory.rooms[this.room.name].frog.deconstruct.push(this.id);
    }
  }
};
