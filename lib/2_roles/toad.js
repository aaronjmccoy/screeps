Creep.prototype.toad = function () {
 //state flipper
 if (this.carry.energy < this.carryCapacity) {
  this.memory.state = 0;
 }
 if (this.carry.energy === this.carryCapacity) {
  this.memory.state = 1;
 }
 this.depositAura();
 this.sweepAura();
 this.eatAura();
 let roomMaxed = (EXTENSION_ENERGY_CAPACITY[this.room.controller.level] * CONTROLLER_STRUCTURES.extension[this.room.controller.level] <= this.room.energyAvailable);
 if (this.ticksToLive < 200 && roomMaxed) {
  this.memory.hungry = true;
 }
 if (this.ticksToLive > 1400) {
  this.memory.hungry = false;
 }
 if (this.memory.hungry) {
  this.requestTask('mine');
  if (this.requestTask('eat')) {
   return this.eat();
  }
 } else {
  if (roomMaxed) {
   this.upgradeAura();
  }
  //primary tasks in order of importance inside of state logic
  if (this.requestTask('mine')) {
   return this.mine();
  } else
  if (this.requestTask('construct')) {
   return this.construct();
  }
  return Memory.emoji.frog;
 }
};
