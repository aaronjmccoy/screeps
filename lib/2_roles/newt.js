Creep.prototype.newt = function () {
 //state flipper
 if (_.sum(this.carry) === 0) {
  this.memory.state = 0;
 }
 //if creep has energy
 else if (_.sum(this.carry.energy) > 0) {
  this.memory.state = 1;
 }
 if (!this.memory.from) {
  if (!this.sweepAura()) {
   this.collectAura();
  }
 }
 if (!this.memory.to) {
  this.depositAura();
  //this.dumpAura();
 }
 //if this has energy
 if (this.memory.state) {
  if (this.memory.to) {
   for (let resourceType in this.carry) {
    if (this.transfer(Game.getObjectById(this.memory.to), resourceType) == 0) {
     return 'bibiibiii!';
    }
   }
   if (this.moveTo(Game.getObjectById(this.memory.to)) === 0) {
    return 'ribit';
   }
  } else
   //primary tasks in order of importance inside of state logic
   if (this.requestTask('deposit')) {
    return this.deposit();
   } else
  if (this.requestTask('eat')) {
   return this.eat();
  }
 }
 //if this has no energy
 else {
  if (this.memory.from) {
   if (Game.getObjectById(this.memory.from).store) {
    for (let resourceType in RESOURCES_ALL) {
     //console.log(this.withdraw(Game.getObjectById(this.memory.from), RESOURCES_ALL[resourceType]));
     if (this.withdraw(Game.getObjectById(this.memory.from), RESOURCES_ALL[resourceType]) === 0) {
      return 'bibiibiii!';
     }
    }
   } else if (Game.getObjectById(this.memory.from).carry) {
    for (let resourceType in Game.getObjectById(this.memory.from).carry) {
     if (Game.getObjectById(this.memory.from).transfer(this, resourceType) === 0) {
      return 'bibiibiii!';
     } else {
      if (this.moveTo(Game.getObjectById(this.memory.from)) === 0) {
       return 'ribit';
      }
     }
    }
   }
   if (this.moveTo(Game.getObjectById(this.memory.from)) === 0) {
    return 'ribit';
   }
  } else
   //primary tasks in order of importance inside of state logic

   if (this.requestTask('collect')) {
    return this.collect();
   } else
  if (this.requestTask('sweep')) {
   return this.sweep();
  } else
  if (this.requestTask('eat')) {
   return this.eat();
  }
 }
 return 'zzz';
};
