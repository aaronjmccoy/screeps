//// TASK ASSIGNMENT ////
//get current assignment with Room.releaseTask
Creep.prototype.requestTask = function (job) {
 if (!this.memory.jobs) {
  this.memory.jobs = {};
 }
 this.memory.jobs[job] = Game.rooms[this.memory.room].releaseTask(job);
 if (this.memory.jobs[job]) {

  this.room.memory.jobs[job].push(this.memory.jobs[job]);
  return true;
 } else {
  this.memory.jobs = {};
  return false;
 }
};

//aura utilities for preliminary actions pre-movement

Creep.prototype.aidAura = function () {
 //console.log(nearExt);
 for (let e in this.room.memory.jobs.aid) {
  //console.log(this.room.memory.jobs.collect[e]);
  if (this.heal(Game.getObjectById(this.room.memory.jobs.aid[e]), RESOURCE_ENERGY) === 0) {
   return true;
  }
  if (this.rangedHeal(Game.getObjectById(this.room.memory.jobs.aid[e]), RESOURCE_ENERGY) === 0) {
   return true;
  }
 }
 return false;
};

Creep.prototype.collectAura = function () {
 //console.log(nearExt);
 for (let e in Memory.rooms[this.room.name].jobs.collect) {
  //console.log(this.room.memory.jobs.collect[e]);
  if (this.withdraw(Game.getObjectById(Memory.rooms[this.room.name].jobs.collect[e]), RESOURCE_ENERGY) === 0) {
   return true;
  }
 }
 return false;
};


Creep.prototype.constructAura = function () {
 //console.log(nearExt);
 for (let e in this.room.memory.jobs.construct) {
  //console.log(this.room.memory.jobs.deposit[e]);
  if (this.build(this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES), RESOURCE_ENERGY) === 0) {
   return true;
  }
 }
 return false;
};

Creep.prototype.deconstructAura = function () {
 //console.log(nearExt);
 for (let e in this.room.memory.jobs.deconstruct) {
  //console.log(this.room.memory.jobs.deposit[e]);
  if (this.dismantle(this.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES)) === 0) {
   return true;
  }
 }
 return false;
};

Creep.prototype.depositAura = function () {
 for (let e in this.room.memory.jobs.deposit) {
  //console.log(this.room.memory.jobs.deposit[e]);
  if (Game.getObjectById(this.room.memory.jobs.deposit[e])) {
   if (this.transfer(Game.getObjectById(this.room.memory.jobs.deposit[e]), RESOURCE_ENERGY) === 0) {
    for (let resource in this.carry) {
     this.transfer(Game.getObjectById(this.memory.jobs.deposit), resource);
     return true;
    }
   }
  }
 }
 if (this.memory.role == 'toad') {
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
 for (let e in this.room.memory.jobs.eat) {
  //console.log(this.room.memory.jobs.collect[e]);
  if (Game.getObjectById(this.room.memory.jobs.eat[e]).renewCreep(this) === 0) {
   this.depositAura();
   return true;
  }
 }
 return false;
};

Creep.prototype.fixAura = function () {
 //console.log(nearExt);
 for (let e in this.room.memory.jobs.fix) {
  //console.log(this.room.memory.jobs.collect[e]);
  if (this.repair(Game.getObjectById(this.room.memory.jobs.fix[e])) === 0) {
   return true;
  }
 }
 return false;
};

Creep.prototype.mineAura = function () {
 //console.log(nearExt);
 for (let e in this.room.memory.jobs.mine) {
  //console.log(this.room.memory.jobs.collect[e]);
  if (this.harvest(Game.getObjectById(this.room.memory.jobs.mine[e])) === 0) {
   return true;
  }
 }
 return false;
};

Creep.prototype.sweepAura = function () {
 //console.log(nearExt);
 for (let e in this.room.memory.jobs.sweep) {
  //console.log(this.room.memory.jobs.collect[e]);
  if (this.pickup(Game.getObjectById(this.room.memory.jobs.sweep[e])) === 0) {
   return true;
  }
 }
 return false;
};

Creep.prototype.upgradeAura = function () {
 for (let e in this.room.memory.jobs.upgrade) {
  //console.log(this.room.memory.jobs.deposit[e]);
  if (Game.getObjectById(this.room.memory.jobs.upgrade[e])) {
   this.signController(Game.getObjectById(this.room.memory.jobs.upgrade[e]), "Ribbit");
   if (this.upgradeController(Game.getObjectById(this.room.memory.jobs.upgrade[e]), RESOURCE_ENERGY) === 0) {
    return true;
   }
  }
 }
 return false;
};

Creep.prototype.vacuumAura = function () {
 //console.log(nearExt);
 for (let e in this.room.memory.jobs.collect) {
  for (let resource in Game.getObjectById(this.room.memory.jobs.collect[e]).store) {
   this.withdraw(Game.getObjectById(this.room.memory.jobs.collect[e]), resource);
  }
 }
 for (let e in this.room.memory.jobs.sweep) {
  this.pickup(Game.getObjectById(this.room.memory.jobs.sweep[e]));
 }
};

Creep.prototype.whackAura = function () {
 for (let e in this.room.memory.jobs.whack) {
  //console.log(this.room.memory.jobs.deposit[e]);
  if (Game.getObjectById(this.room.memory.jobs.whack[e])) {
   if (this.attack(Game.getObjectById(this.room.memory.jobs.whack[e])) === 0) {
    return true;
   } else
   if (this.rangedAttack(Game.getObjectById(this.room.memory.jobs.whack[e])) === 0) {
    return true;
   }
  }
 }
 return false;
};
