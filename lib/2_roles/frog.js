Creep.prototype.frog = function () {
 //state flipper
 if (_.sum(this.carry) === 0) {
  this.memory.state = 0;
 }
 if (_.sum(this.carry) === this.carryCapacity) {
  this.memory.state = 1;
 }
 //attempt all non-exclusive action auras
 this.sweepAura();
 this.collectAura();
 //if hungry eat
 if (this.memory.hungry) {
  if (this.requestTask('eat')) {
   this.moveTo(Game.getObjectById(this.memory.jobs.eat));
   this.eatAura();
   return Memory.emoji.hop;
  }
 }
 //if this has energy
 if (this.memory.state) {
  //primary tasks in order of importance inside of state logic
  if (this.requestTask('construct')) {
   return this.construct();
  } else
  if (this.requestTask('upgrade')) {
   this.mineAura();
   return this.upgrade();
  } else
  if (this.requestTask('eat')) {
   return this.eat();
  } else {
   return 'zzz';
  }
 }
 //if this has no energy
 else {
  //primary tasks in order of importance inside of state logic
  if (this.requestTask('sweep')) {
   return this.sweep();
  } else
  if (this.requestTask('collect')) {
   return this.collect();
  } else
  if (this.requestTask('deconstruct')) {
   return this.deconstruct();
  } else {
   return 'zzz';
  }
 }
};
