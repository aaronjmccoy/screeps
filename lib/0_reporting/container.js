function container(structure) {
  Memory.rooms[structure.room.name].shark.defend.push(structure.id);
  if (structure.store.energy >= 50) {
    Memory.rooms[structure.room.name].newt.collect.push(structure.id);
    Memory.rooms[structure.room.name].frog.collect.push(structure.id);
  }
  if (structure.store.energy < structure.storeCapacity && structure.room.energyAvailable == structure.room.energyCapacityAvailable) {
    Memory.rooms[structure.room.name].toad.deposit.push(structure.id);
  } 

  if (structure.hits < 60000) {
    Memory.rooms[structure.room.name].frog.fix.push(structure.id);
    Memory.rooms[structure.room.name].toad.fix.push(structure.id);
    Memory.rooms[structure.room.name].tower.fix.push(structure.id);
  }
}

StructureContainer.prototype.report = function(){
  if (this.room.controller.reservation.ticksToEnd) {
    Memory.rooms[this.room.name].shark.defend.push(this.id);
  }
  if (this.store.energy >= 50) {
    Memory.rooms[this.room.name].newt.collect.push(this.id);
    Memory.rooms[this.room.name].frog.collect.push(this.id);
  }
  if (this.store.energy < this.storeCapacity) {
    Memory.rooms[this.room.name].toad.deposit.push(this.id);
  }

  if (this.hits < 60000) {
    Memory.rooms[this.room.name].frog.fix.push(this.id);
    Memory.rooms[this.room.name].toad.fix.push(this.id);
    Memory.rooms[this.room.name].tower.fix.push(this.id);
  }
};
