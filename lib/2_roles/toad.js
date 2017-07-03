Creep.prototype.toad = function() {
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
  if(this.ticksToLive < 200 && EXTENSION_ENERGY_CAPACITY[this.room.controller.level]*CONTROLLER_STRUCTURES.extension[this.room.controller.level] == this.room.energyAvailable){
    this.memory.hungry = true;
  }
  if(this.ticksToLive > 1400){
    this.memory.hungry = false;
  }
  if(this.memory.hungry){
    if (this.requestTask('eat')) {
      return this.eat();
    }
  }else{
    //primary tasks in order of importance inside of state logic
    if (this.requestTask('mine')) {
      return this.mine();
    }else
    if (this.requestTask('construct')) {
      return this.construct();
    }
    return Memory.emoji.frog;
  }
};
