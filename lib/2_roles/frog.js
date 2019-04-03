Creep.prototype.frog = function() {
  //state flipper
  if (_.sum(this.carry) === 0) {
    this.memory.state = 0;
  }
  //why do I want them to sit still until they are full? possible energy drains?
  if (_.sum(this.carry) === this.carryCapacity) {
    this.memory.state = 1;
  }
  //attempt all non-exclusive action auras
  this.sweepAura();
  this.collectAura();
  this.fixAura();
  this.deconstructAura();
  this.constructAura();
  //if hungry eat
  if (this.memory.hungry) {
    if (this.requestTask('eat')) {
      this.moveTo(Game.getObjectById(this.memory.tasks.eat));
      this.eatAura();
      return Memory.emoji.hop;
    } else if(this.requestTask('eat')){
      this.moveTo(Game.getObjectById(this.memory.tasks.eat));
      this.eatAura();
      return Memory.emoji.hop;
    }
  }
  //if this has energy
  if (this.memory.state) {
    //primary tasks in order of importance inside of state logic
    if (this.requestTask('fix')) {
      return this.fix();
    } else if (this.requestTask('construct')) {
      return this.construct();
    } else if (this.requestTask('upgrade')) {
      this.mineAura();
      return this.upgrade();
    } else if (this.requestTask('deconstruct')) {
      return this.deconstruct();
    } else if (this.requestTask('eat')) {
      return this.eat();
    } else {
      return 'zzz'; //if this has no energy;
    }
  } else {
    //primary tasks in order of importance inside of state logic
    if (this.requestTask('collect')) {
      return this.collect();
    } else if (this.requestTask('sweep')) {
      return this.sweep();
    } else if (this.requestTask('mine')) {
      return this.mine();
    } else if (this.requestTask('deconstruct')) {
      return this.deconstruct();
    } else if (this.requestTask('collect')) {
      return this.collect();
    } else{
        return 'zzz';
    }
  }
};
