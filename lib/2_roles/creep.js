//// TASK ASSIGNMENT ////
//get current assignment with Room.releaseTask
Creep.prototype.requestTask = function(task) {
  //if you don't have this task in memory yet make a prop for it
  if (!this.memory.tasks) {
    this.memory.tasks = {};
  }
  //request a task from the Room object you are working for
  this.memory.tasks[task] = Game.rooms[this.memory.room].releaseTask(this.memory.role, task);
  //if it didn't return null
  if (this.memory.tasks[task]) {
    //push the task back to the array for reasons explained in _room.js
    this.room.memory[this.memory.role][task].push(this.memory.tasks[task]);
    return true;
  } else {
    this.memory.tasks[task] = null;
    return false;
  }
};

//aura utilities for preliminary actions pre-movement
/*
I don't know if I like these or not. The principle is that they rely on the
arrays of data to be so well organized and granular that even when iterating
through the entire data set to deposit before moving first, that cost will be
negligible. Since they return the second they find a compatible target it seems
as good a method as any if the goal is to prevent uneccessary movement. It also
enables us to focus on saving cpu when pathfinding over task completion, since
task completion is array fast. Still, I think there is a more elegant approach.
*/
Creep.prototype.aidAura = function() {
  //Two for-loops look gnarly, but this allows us to sort by distance at the same
  //time it is still array fast.
  for (let wounded in Memory.rooms[this.memory.room][this.memory.role].aid) {
    if (this.heal(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].aid[wounded])) === 0) {
      return true;
    }
  }
  for (let wounded in Memory.rooms[this.memory.room][this.memory.role].aid) {
    if (this.rangeHeal(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].aid[wounded])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.collectAura = function() {
  for (let loot in Memory.rooms[this.memory.room][this.memory.role].collect) {
    if (this.withdraw(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].collect[loot]), this.memory.resourceType) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.constructAura = function() {
  for (let site in Memory.rooms[this.memory.room][this.memory.role].construct) {
    if (this.build(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].construct[site])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.deconstructAura = function() {
  for (let debris in Memory.rooms[this.memory.room][this.memory.role].deconstruct) {
    if (this.dismantle(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].deconstruct[debris])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.depositAura = function() {
  for (let bank in Memory.rooms[this.memory.room][this.memory.role].deposit) {
    if (this.transfer(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].deposit[bank]), this.memory.resourceType) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.eatAura = function() {
  for (let dinner in Memory.rooms[this.memory.room][this.memory.role].eat) {
    if (Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].eat[dinner]).renewCreep(this) === 0) {
      this.depositAura();
      return true;
    }
  }
  return false;
};

Creep.prototype.fixAura = function() {
  for (let broken in Memory.rooms[this.memory.room][this.memory.role].fix) {
    if (this.repair(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].fix[broken])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.mineAura = function() {
  for (let source in Memory.rooms[this.memory.room][this.memory.role].mine) {
    if (this.harvest(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].mine[source])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.sweepAura = function() {
  for (let mote in Memory.rooms[this.memory.room][this.memory.role].sweep) {
    if (this.pickup(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].sweep[mote])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.upgradeAura = function() {
  for (let controller in Memory.rooms[this.memory.room][this.memory.role].upgrade) {
    this.signController(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].upgrade[controller]), "Ribbit");
    if (this.upgradeController(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].upgrade[controller]), RESOURCE_ENERGY) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.whackAura = function() {
  for (let enemy in Memory.rooms[this.memory.room][this.memory.role].whack) {
    if (this.attack(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].whack[enemy])) === 0) {
      this.rangedMassAttack(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].whack[enemy]));
      return true;
    }
  }
  for (let enemy in Memory.rooms[this.memory.room][this.memory.role].whack) {
    if (this.rangedAttack(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].whack[enemy])) === 0) {
      return true;
    }
  }
  return false;
};
