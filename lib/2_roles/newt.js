Creep.prototype.newt = function() {
  //state flipper
  if (_.sum(this.carry) === 0) {
    this.memory.state = //if creep has energy
    0;
  } else if (this.carry.energy >= 50) {
    this.memory.state = 1;
  }

  if (!this.memory.from) {
    this.sweepAura();
    this.collectAura();
  }

  if (!this.memory.to) {
    if(this.depositAura()){
      return Memory.emoji.sogood;
    }
  }
  //if this has energy
  if (this.memory.state) {
    if (this.memory.to) {
      for (let resourceType in this.carry) {
        if (this.transfer(Game.getObjectById(this.memory.to), resourceType) === 0) {
          return 'bibiibiii!';
        }
      }
      if (this.moveTo(Game.getObjectById(this.memory.to)) === 0) {
        return Memory.emoji.frog;
      }
    } else if (this.requestTask('deposit')) {
      return this.deposit();
    } else if (this.requestTask('eat')) {
      return this.eat();
      //if this has no energy;
    }
  } else {
    if (this.memory.from) {
      for (let resourceType in RESOURCES_ALL) {
        if (this.withdraw(Game.getObjectById(this.memory.from), RESOURCES_ALL[resourceType]) === 0) {
          return 'bibiibiii!';
        }
      }
      if (this.moveTo(Game.getObjectById(this.memory.from)) === 0) {
        return Memory.emoji.frog;
      }
    } else
    //primary tasks in order of importance inside of state logic
    if (this.requestTask('collect')) {
      return this.collect();
    } else if (this.requestTask('sweep')) {
      return this.sweep();
    } else if (this.requestTask('eat')) {
      return this.eat();
    }
  }
  return 'zzz';
};
