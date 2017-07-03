//// TASK ASSIGNMENT ////
//get current assignment with Room.releaseTask
Creep.prototype.requestTask = function (job) {
  this.memory.jobs[job] = this.room.releaseTask(job);
  if(this.memory.jobs[job]){
    this.room.memory.jobs[job].tasks.push(this.memory.jobs[job]);
    return true;
  }else{
    return false;
  }
};

//aura utilities for preliminary actions pre-movement

Creep.prototype.aidAura = function () {
 //console.log(nearExt);
 for (let e in this.room.memory.jobs.aid.tasks) {
  //console.log(this.room.memory.jobs.collect.tasks[e]);
  if (this.heal(Game.getObjectById(this.room.memory.jobs.aid.tasks[e]), RESOURCE_ENERGY) === 0) {
   return true;
  }
  if (this.rangedHeal(Game.getObjectById(this.room.memory.jobs.aid.tasks[e]), RESOURCE_ENERGY) === 0) {
   return true;
  }
 }
 return false;
};

Creep.prototype.collectAura = function () {
 //console.log(nearExt);
 for (let e in this.room.memory.jobs.collect.tasks) {
  //console.log(this.room.memory.jobs.collect.tasks[e]);
  if (this.withdraw(Game.getObjectById(this.room.memory.jobs.collect.tasks[e]), RESOURCE_ENERGY) === 0) {
   return true;
  }
 }
 return false;
};

Creep.prototype.constructAura = function () {
 //console.log(nearExt);
 for (let e in this.room.memory.jobs.construct.tasks) {
  //console.log(this.room.memory.jobs.deposit.tasks[e]);
  if (this.build(this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES), RESOURCE_ENERGY) === 0) {
   return true;
  }
 }
 return false;
};

Creep.prototype.depositAura = function () {
 for (let e in this.room.memory.jobs.deposit.tasks) {
  //console.log(this.room.memory.jobs.deposit.tasks[e]);
  if (Game.getObjectById(this.room.memory.jobs.deposit.tasks[e])) {
   if (this.transfer(Game.getObjectById(this.room.memory.jobs.deposit.tasks[e]), RESOURCE_ENERGY) === 0) {
    return true;
   }
  }
 }
 if(this.memory.role == 'toad'){
   if (this.transfer(this.room.storage, RESOURCE_ENERGY) === 0) {
    return true;
   }
   if (this.transfer(this.room.terminal, RESOURCE_ENERGY) === 0) {
    return true;
   }
 }
 return false;
};

Creep.prototype.eatAura = function () {
 //console.log(nearExt);
 for (let e in this.room.memory.jobs.eat.tasks) {
  //console.log(this.room.memory.jobs.collect.tasks[e]);
  if (Game.getObjectById(this.room.memory.jobs.eat.tasks[e]).renewCreep(this) === 0) {
   return true;
  }
 }
 return false;
};

Creep.prototype.fixAura = function () {
 //console.log(nearExt);
 for (let e in this.room.memory.jobs.fix.tasks) {
  //console.log(this.room.memory.jobs.collect.tasks[e]);
  if (this.repair(Game.getObjectById(this.room.memory.jobs.fix.tasks[e])) === 0) {
   return true;
  }
 }
 return false;
};

Creep.prototype.mineAura = function () {
 //console.log(nearExt);
 for (let e in this.room.memory.jobs.mine.tasks) {
  //console.log(this.room.memory.jobs.collect.tasks[e]);
  if (this.harvest(Game.getObjectById(this.room.memory.jobs.mine.tasks[e])) === 0) {
   return true;
  }
 }
 return false;
};

Creep.prototype.sweepAura = function () {
 //console.log(nearExt);
 for (let e in this.room.memory.jobs.sweep.tasks) {
  //console.log(this.room.memory.jobs.collect.tasks[e]);
  if (this.pickup(Game.getObjectById(this.room.memory.jobs.sweep.tasks[e]), RESOURCE_ENERGY) === 0) {
   return true;
  }
 }
 return false;
};

Creep.prototype.upgradeAura = function () {
 for (let e in this.room.memory.jobs.upgrade.tasks) {
  //console.log(this.room.memory.jobs.deposit.tasks[e]);
  if (Game.getObjectById(this.room.memory.jobs.upgrade.tasks[e])) {
   if (this.upgradeController(Game.getObjectById(this.room.memory.jobs.upgrade.tasks[e]), RESOURCE_ENERGY) === 0) {
    return true;
   }
  }
 }
 return false;
};

Creep.prototype.whackAura = function () {
 for (let e in this.room.memory.jobs.whack.tasks) {
  //console.log(this.room.memory.jobs.deposit.tasks[e]);
  if (Game.getObjectById(this.room.memory.jobs.whack.tasks[e])) {
   if (this.attack(Game.getObjectById(this.room.memory.jobs.whack.tasks[e])) === 0) {
    return true;
  }else
   if (this.rangedAttack(Game.getObjectById(this.room.memory.jobs.whack.tasks[e])) === 0) {
    return true;
   }
  }
 }
 return false;
};
