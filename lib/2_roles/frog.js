Creep.prototype.frog = function(constructed, upgraded) {
  //state flipper
  if (this.carry.energy === 0) {
    this.memory.state = 0;
  }
  if (this.carry.energy === this.carryCapacity) {
    this.memory.state = 1;
  }
  //attempt all non-exclusive action auras

  //if this has energy
  if (this.memory.state) {
    this.sweepAura();
    this.collectAura();
    //primary tasks in order of importance inside of state logic
    if (this.requestTask('construct')) {
      return this.construct();
    } else
    if (this.requestTask('upgrade')) {
        return this.upgrade();
    } else
    if (this.requestTask('eat')) {
      return this.eat();
    }else{
      return 'zzz';
    }
  }
  //if this has no energy
  else {
    //primary tasks in order of importance inside of state logic
    if (this.requestTask('collect')) {
      return this.collect();
    } else
    if (this.requestTask('sweep')) {
      return this.sweep();
    }else
    if (this.requestTask('mine')) {
      return this.mine();
    } else{
      return 'zzz';
    }
  }
};
