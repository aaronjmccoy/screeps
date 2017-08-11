Creep.prototype.toad = function () {
 //state flipper
 if (this.carry.energy < this.carryCapacity) {
  this.memory.state = 0;
 }
 if (this.carry.energy === this.carryCapacity) {
  this.memory.state = 1;
 }
 if (!this.depositAura()) {
  this.dumpAura();
 };
 if (!this.constructAura()) {
  this.fixAura();
 }
 this.sweepAura();
 this.eatAura();
 this.mineAura();
 //this.collectAura();
 let roomMaxed = (EXTENSION_ENERGY_CAPACITY[this.room.controller.level] * CONTROLLER_STRUCTURES.extension[this.room.controller.level] <= this.room.energyAvailable);
 if (this.memory.hungry) {
  if (this.requestTask('eat')) {
   this.requestTask('mine');
   return this.eat();
  }
 } else {
  if (roomMaxed) {
   if (!this.constructAura()) {
    this.upgradeAura();
   }
  }
  //primary tasks in order of importance inside of state logic
  if (this.requestTask('mine')) {
   return this.mine();
  } else
  if (this.requestTask('eat')) {
   return this.eat();
  }
  return Memory.emoji.frog;
 }
};
