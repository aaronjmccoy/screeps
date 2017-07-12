Room.prototype.initializeMemory = function () {
 this.memory.jobs = {};
 if (!this.memory.towers) {
  this.memory.towers = {};
 }
 if (!this.memory.sc) {
  this.memory.sc = (this.find(FIND_SOURCES).length);
 }
 if (!this.memory.storage) {
  if (this.storage) {
   this.memory.storage = { id: this.storage.id, pos: this.storage.pos };
  }
 }
 if (!this.memory.terminal) {
  if (this.terminal) {
   this.memory.terminal = { id: this.terminal.id, pos: this.terminal.pos };
  }
 }
 if (!this.memory.controller) {
  if (this.controller) {
   this.memory.controller = { id: this.controller.id, pos: this.controller.pos };
  }
 }
};

Room.prototype.queueTasks = function (parentRoom) {
 //independant items first
 //hostiles
 const enemies = this.find(FIND_HOSTILE_CREEPS);
 if (enemies.length) {
  for (let e in enemies) {
   var enemy = enemies[e];
   if (enemy.hits > 0) {
    this.memory.jobs.whack.push(enemy.id);
    if (parentRoom) {
     parentRoom.memory.jobs.whack.push(enemy.id);
    }
   }
  }
 }
 //dropped resources
 const dust = this.find(FIND_DROPPED_RESOURCES);
 if (dust.length) {
  for (let d in dust) {
   var mote = dust[d];
   this.memory.jobs.sweep.push(mote.id);
   if (parentRoom) {
    parentRoom.memory.jobs.sweep.push(mote.id);
   }
  }
 }
 //sources
 const sources = this.find(FIND_SOURCES);
 if (sources.length) {
  for (let s in sources) {
   var source = sources[s];
   this.memory.jobs.mine.push(source.id);
   if (parentRoom) {
    //console.log(parentRoom);
    parentRoom.memory.jobs.mine.push(source.id);
   }
  }
 }
 //construction sites
 for (let id in Game.constructionSites) {
  if (Game.getObjectById(id).room && Game.getObjectById(id).room.name == this.name) {
   this.memory.jobs.construct.push(id);
   if (parentRoom) {
    parentRoom.memory.jobs.construct.push(id);
   }
  }
 }
 //structure tasks
 const structures = this.find(FIND_STRUCTURES);
 if (structures.length) {
  for (let structure in structures) {
   try {
    structures[structure].report();
   } catch (e) {
    //console.log('No report method for ' + structures[structure] + structure.structureType);
   }
  }
 }
 if (this.storage) {
  this.storage.report();
 }
 const creeps = this.find(FIND_MY_CREEPS);
 if (creeps.length) {
  for (let c in creeps) {
   var creep = creeps[c];
   if (creep.hits < creep.hitsMax) {
    this.memory.jobs.aid.push(creep.id);
    if (parentRoom) {
     parentRoom.memory.jobs.aid.push(creep.id);
    }
   }
   if (Memory.rooms[creep.memory.room]) {
    if (!Memory.rooms[creep.memory.room].roles[creep.memory.role]) {
     Memory.rooms[creep.memory.room].roles[creep.memory.role] = 1;
    } else {
     Memory.rooms[creep.memory.room].roles[creep.memory.role] += 1;
    }
   }
   if (creep.memory.role == 'frog') {
    if (creep.carry.energy < creep.carryCapacity) {
     //console.log('frog pushing deposit to '+this.name);
     this.memory.jobs.deposit.push(creep.id);
     if (parentRoom) {
      parentRoom.memory.jobs.deposit.push(creep.id);
     }
    }
    if (creep.room.name != creep.memory.room && creep.memory.role == 'frog') {
     this.memory.roles.frog++;
    }
   }

  }
 }
};

Room.prototype.releaseTask = function (job) {
 if (!this.memory.jobs[job]) {
  this.memory.jobs[job] = [];
 }
 if (this.memory.jobs[job].length > 0) {
  return this.memory.jobs[job].shift();
 } else {
  return null;
 }
};

Room.prototype.roleCount = function (roleString) {
 return this.memory.roles[roleString];
};
