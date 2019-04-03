Creep.prototype.toad = function() {
    this.room.visual.circle(this.pos,
    {fill: 'transparent', radius: 3, stroke: 'yellow'});
  //state flipper
  if (this.carry.energy < this.carryCapacity) {
    this.memory.state = 0;
  }
  if (this.carry.energy === this.carryCapacity) {
    this.memory.state = 1;
  }
  this.sweepAura();
  this.depositAura();
  if (this.room.controller.my) {
    this.eatAura();
  }
  this.mineAura();
  var roomMaxed = this.room.energyAvailable == this.room.energyCapacityAvailable ? 1 : 0;
  if (this.memory.hungry) {
    if (this.requestTask('eat')) {
      this.requestTask('mine');
      return this.eat();
    }
  } else {
    if(!this.fixAura()){
      if(!this.constructAura()){

           this.upgradeAura();

      }else{
          this.mineAura();
      }
    }
    //
    //primary tasks in order of importance inside of state logic
    if (this.requestTask('mine')) {
      return this.mine();
    } else if (this.requestTask('fix')) {
      return this.fix();
    } else if (this.requestTask('eat')) {
      return this.eat();
    } else if (this.requestTask('upgrade')) {
      return this.upgrade();
    }
    return Memory.emoji.frog;
  }
};
