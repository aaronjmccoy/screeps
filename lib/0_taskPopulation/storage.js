StructureStorage.prototype.report = function() {
  let roomMaxed = (EXTENSION_ENERGY_CAPACITY[this.room.controller.level] * CONTROLLER_STRUCTURES.extension[this.room.controller.level] <= this.room.energyAvailable);
  if (roomMaxed && this.store.energy < this.storeCapacity && this.room.roleCount('frog') <= this.room.jobs.deposit.length) {
    this.room.memory.jobs.deposit.push(this.id);
  } else {
    this.room.memory.jobs.collect.push(this.id);
  }
  if (this.hits < this.hitsMax) {
    this.room.memory.jobs.fix.push(this.id);
  }

};
