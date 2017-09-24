Creep.prototype.toad = function() {
  //state flipper
  if (this.carry.energy < this.carryCapacity) {
    this.memory.state = 0;
  }
  if (this.carry.energy === this.carryCapacity) {
    this.memory.state = 1;
  }
  if (!this.depositAura()) {
    this.transfer(this.room.storage, this.memory.resourceType);
    this.transfer(this.room.terminal, this.memory.resourceType);
  }
  this.sweepAura();
  this.eatAura();
  this.mineAura();
  var roomMaxed = (
    (CONTROLLER_STRUCTURES.spawn[this.room.controller.level] * SPAWN_ENERGY_CAPACITY) + (CONTROLLER_STRUCTURES.extension[this.room.controller.level] * EXTENSION_ENERGY_CAPACITY[this.room.controller.level])
  );
  if (this.memory.hungry) {
    if (this.requestTask('eat')) {
      //this.requestTask('mine');
      return this.eat();
    }
  } else {
    if (roomMaxed) {
      if (!this.constructAura()) {
        if (!this.fixAura()) {
          this.upgradeAura();
        }
      }
    }
    //primary tasks in order of importance inside of state logic
    if (this.requestTask('mine')) {
      return this.mine();
    } else if (this.requestTask('eat')) {
      return this.eat();
    }
    return Memory.emoji.frog;
  }
};
