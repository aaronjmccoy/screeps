StructureContainer.prototype.report = function () {
 CM.set(this.pos.x, this.pos.y, 0);
 if (_.sum(this.store) >= 50) {
  this.room.memory.jobs.collect.push(this.id);
 }
 if (this.hits < 10000) {
  this.room.memory.jobs.fix.push(this.id);
 }
};

StructureController.prototype.report = function () {
 //if our max energy capacity has been reached for given rcl
 //if (this.room.energyCapacity == CONTROLLER_STRUCTURES.extension[this.room.rcl]*EXTENSION_ENERGY_CAPACITY[this.room.rcl]) {
 //push to task array
 CM.set(this.pos.x, this.pos.y, 255);
 this.room.memory.jobs.upgrade.push(this.id);
 //}
};

////  WHEN A CREEP IS THE TARGET OF A TASK ////
Creep.prototype.report = function (job) {
 this.room.memory.jobs[job].push(this.id);
};

StructureExtension.prototype.report = function () {
 CM.set(this.pos.x, this.pos.y, 255);
 if (this.room.controller.my) {
  if (this.energy < this.energyCapacity) {
   Memory.rooms[this.room.name].jobs.deposit.push(this.id);
  }
  if (this.hits < this.hitsMax) {
   Memory.rooms[this.room.name].memory.jobs.fix.push(this.id);
  }
 } else {
  if (this.energy > 0) {
   Memory.rooms[this.room.name].jobs.collect.push(this.id);
   if (this.room.memory.parentRoom) {
    Memory.rooms[this.room.memory.parentRoom].jobs.collect.push(this.id);
   }
  } else {
   Memory.rooms[this.room.name].jobs.deconstruct.push(this.id);
   if (this.room.memory.parentRoom) {
    Memory.rooms[this.room.memory.parentRoom].jobs.deconstruct.push(this.id);
   }
  }
 }
};

StructureLab.prototype.report = function () {
 CM.set(this.pos.x, this.pos.y, 255);
 if (this.room.controller.my) {
  if (this.energy < this.energyCapacity) {
   Memory.rooms[this.room.name].jobs.deposit.push(this.id);
  }
  if (this.hits < this.hitsMax) {
   Memory.rooms[this.room.name].memory.jobs.fix.push(this.id);
  }
 } else {
  if (this.energy > 0) {
   Memory.rooms[this.room.name].jobs.collect.push(this.id);
  } else {
   Memory.rooms[this.room.name].jobs.deconstruct.push(this.id);
  }
 }
};

StructurePowerSpawn.prototype.report = function () {
 CM.set(this.pos.x, this.pos.y, 255);
 if (this.room.controller.my) {
  if (this.energy < this.energyCapacity) {
   Memory.rooms[this.room.name].jobs.deposit.push(this.id);
  }
  if (this.hits < this.hitsMax) {
   Memory.rooms[this.room.name].memory.jobs.fix.push(this.id);
  }
 } else {
  if (this) {
   Memory.rooms[this.room.name].jobs.collect.push(this.id);
  } else {
   Memory.rooms[this.room.name].jobs.deconstruct.push(this.id);
  }
 }
};

StructureRampart.prototype.report = function () {
 if (this.room.controller.my) {
  if (this.hits < this.room.controller.level * 150000) {
   this.room.memory.jobs.fix.push(this.id);
  }
  if ([...this.room.lookAt(this.pos.x, this.pos.y)].length > 2) {
   this.setPublic(false);
  } else {
   this.setPublic(true);
  }
  if (this.room.memory.jobs.whack.length > 0) {
   for (let e in this.room.memory.jobs.whack) {
    let enemy = Game.getObjectById(this.room.memory.jobs.whack[e]);
    if (this.pos.inRangeTo(enemy, 1)) {
     this.setPublic(false);
    }
   }
  }
 } else {
  Memory.rooms[this.room.name].jobs.deconstruct.push(this.id);
 }
};

Resource.prototype.report = function () {
 CM.set(this.pos.x, this.pos.y, 255);
 if (this.resourceType == 'energy') {
  this.room.memory.jobs.sweep.push(this.id);
 }
 //  this.room.memory.jobs.sweep[this.resourceType].push(this.id);
};

StructureRoad.prototype.report = function () {
 if (this.hits < 4000) {
  this.room.memory.jobs.fix.push(this.id);
 }
};

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
   CM.set(Game.getObjectById(id).pos.x, Game.getObjectById(id).pos.y, 0);
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
    if (structures[structure].structureType != 'storage') {
     structures[structure].report();
    }
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
     //console.log('frog pushing deposit to ' + this.name);
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
 if (!Memory.rooms[this.name].roles[roleString]) {
  Memory.rooms[this.name].roles[roleString] = 0;
 }
 console.log(roleString + ' ' + this.name + ' ' + Memory.rooms[this.name].roles[roleString]);
 return Memory.rooms[this.name].roles[roleString];
};

Source.prototype.report = function () {
 CM.set(this.pos.x, this.pos.y, 255);
 this.room.memory.jobs.mine.push(this.id);
};

StructureSpawn.prototype.report = function () {
 CM.set(this.pos.x, this.pos.y, 255);
 if (this.room.controller.my) {
  this.room.memory.jobs.eat.push(this.id);
  //console.log(this.room.memory.jobs.eat.length);
  if (this.energy < this.energyCapacity) {
   this.room.memory.jobs.deposit.push(this.id);
  }
  if (this.hits < this.hitsMax) {
   this.room.memory.jobs.fix.push(this.id);
  }
 } else {
  if (this.energy > 0) {
   Memory.rooms[this.room.name].jobs.collect.push(this.id);
  } else {
   Memory.rooms[this.room.name].jobs.deconstruct.push(this.id);
  }
 }
};

StructureSpawn.prototype.spawnCreep = function (creepRecipe, rcl) {
 creepRecipe.options.room = this.room.name;
 switch (this.createCreep(creepRecipe.parts[rcl], creepRecipe.options.role + "_" + Game.time + "_" + this.room.name, creepRecipe.options)) {
 case -10:
  //invalid body
  console.log('Body part array not properly formed: ');
  console.log(JSON.stringify(creepRecipe.parts[rcl]));
  break;
 case -14:
  //rcl dropped
  console.log('RCL no longer sufficient to use this spawn');
 }
};

StructureStorage.prototype.report = function () {
 if (this.room.controller.my) {
  if (this.store.energy > 0) {
   this.room.memory.jobs.collect.push(this.id);
   if (this.room.memory.childRoom) {
    Memory.rooms[this.room.memory.childRoom].jobs.collect.push(this.id);
   }
  }
  if (this.hits < this.hitsMax) {
   this.room.memory.jobs.fix.push(this.id);
  }
 } else {
  if (this.store.energy > 0) {
   Memory.rooms[this.room.name].jobs.collect.push(this.id);
  } else {
   Memory.rooms[this.room.name].jobs.deconstruct.push(this.id);
  }
 }
};

StructureTerminal.prototype.report = function () {
 CM.set(this.pos.x, this.pos.y, 255);
 if (this.room.controller.my) {
  if (this.store.energy > 4000) {
   Memory.rooms[this.room.name].jobs.collect.push(this.id);
  } else {
   Memory.rooms[this.room.name].jobs.deposit.push(this.id);
  }
  if (this.hits < this.hitsMax) {
   Memory.rooms[this.room.name].memory.jobs.fix.push(this.id);
  }
 } else {
  if (_.sum(this.store) > 0) {
   Memory.rooms[this.room.name].jobs.collect.push(this.id);
  } else {
   Memory.rooms[this.room.name].jobs.deconstruct.push(this.id);
  }
 }
};

StructureTower.prototype.report = function () {
 if (this.room.controller.my) {
  if (this.energy < this.energyCapacity) {
   Memory.rooms[this.room.name].jobs.deposit.push(this.id);
  }
  if (this.hits < this.hitsMax) {
   Memory.rooms[this.room.name].memory.jobs.fix.push(this.id);
  }
 } else {
  if (this.energy > 0) {
   Memory.rooms[this.room.name].jobs.collect.push(this.id);
  } else {
   Memory.rooms[this.room.name].jobs.deconstruct.push(this.id);
  }
 }
};

StructureWall.prototype.report = function () {
 CM.set(this.pos.x, this.pos.y, 255);
 if (this.hits < 100) {
  this.room.memory.jobs.fix.push(this.id);
 }
};

Creep.prototype.frog = function () {
 //state flipper
 if (_.sum(this.carry) === 0) {
  this.memory.state = 0;
 }
 if (_.sum(this.carry) === this.carryCapacity) {
  this.memory.state = 1;
 }
 //attempt all non-exclusive action auras
 if (this.memory.hungry) {
  if (this.requestTask('eat')) {
   this.moveTo(Game.getObjectById(this.memory.jobs.eat));
   this.eatAura();
   return Memory.emoji.hop;
  }
 }
 //if this has energy
 if (this.memory.state) {
  this.sweepAura();
  this.collectAura();
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
  } else
  if (this.requestTask('mine')) {
   return this.mine();
  } else {
   return 'zzz';
  }
 }
};

//minnows simply run resources between the minnow flag room and their room's storage
Creep.prototype.minnow = function () {
 //state flipper
 if (_.sum(this.carry) === 0) {
  this.memory.state = 0;
 }
 if (_.sum(this.carry) > this.carryCapacity / 2) {
  this.memory.state = 1;
 }

 //attempt all non-exclusive action auras
 //if this has energy
 if (this.room.controller && this.room.controller.my) {
  this.sweepAura();
  this.dumpAura();
 } else {
  this.vacuumAura();
 }

 if (this.memory.hungry) {
  if (this.requestTask('eat')) {
   this.moveTo(Game.getObjectById(this.memory.jobs.eat));
   this.eatAura();
   return Memory.emoji.hop;
  }
 }

 if (this.memory.state) {
  this.memory.checkpoint = 0;
  if (Game.cpu.tickLimit - Game.cpu.getUsed() > 20) {
   this.moveTo(Game.rooms[this.memory.room].storage);
  } else {
   this.moveTo(Game.rooms[this.memory.room].storage, { noPathFinding: true });
  }
  if (this.room.terminal) {
   for (let resourceType in this.carry) {
    this.transfer(Game.rooms[this.memory.room].terminal, resourceType);
   }
  }
  if (this.room.storage) {
   for (let resourceType in this.carry) {
    this.transfer(Game.rooms[this.memory.room].storage, resourceType);
   }
  }
  return Memory.emoji.hop;
 }
 //if this has no energy
 else {
  if (this.pos.isEqualTo(Game.flags.minnow.pos)) {
   this.memory.checkpoint = 1;
  }
  if (this.memory.checkpoint > 0) {
   if (!this.room.controller || !this.room.controller.my) {
    if (this.room.storage) {
     if (Game.cpu.tickLimit - Game.cpu.getUsed() > 20) {
      this.moveTo(this.room.storage);
     } else {
      this.moveTo(this.room.storage, { noPathFinding: true });
     }
     for (let resourceType in this.room.storage.store) {
      this.withdraw(this.room.storage, resourceType);
     }
    }
    if (this.room.terminal) {
     if (Game.cpu.tickLimit - Game.cpu.getUsed() > 20) {
      this.moveTo(this.room.terminal);
     } else {
      this.moveTo(this.room.terminal, { noPathFinding: true });
     }
     for (let resourceType in this.room.terminal.store) {
      this.withdraw(this.room.terminal, resourceType);
     }
    }
   }
  } else {
   // Perform pathfinding only if we have enough CPU
   if (Game.cpu.tickLimit - Game.cpu.getUsed() > 20) {
    this.moveTo(Game.flags.minnow);
   }
   this.moveTo(Game.flags.minnow, { noPathFinding: true });
  }
  return Memory.emoji.hop;
 }
};

Creep.prototype.newt = function () {
 //state flipper
 if (_.sum(this.carry) === 0) {
  this.memory.state = 0;
 }
 //if creep has energy
 else if (_.sum(this.carry) > 0) {
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

function queen(spawn) {
 const r = spawn.room;
 const rcl = r.controller.level;
 //spawn logic
 //rcl switch
 let frog = Memory.recipes.frog;
 let toad = Memory.recipes.toad;
 let newt = Memory.recipes.newt;
 let minnow = Memory.recipes.minnow;
 let newtCap = r.memory.sc;
 let frogCap = r.memory.jobs.construct.length ? r.memory.jobs.construct.length : 1;
 let toadCap = r.memory.sc;
 let minnowCap = (r.storage && Game.flags.minnow ? 2 : 0);
 //we want to spawn creeps based on tasks needing to be done
 let toads = r.roleCount('toad');
 //console.log(spawn.room.name + ' toads: ' + toads + ' toadcap: ' + toadCap);
 let frogs = r.roleCount('frog');
 console.log(spawn.room.name + ' frogs: ' + frogs + ' frogcap: ' + frogCap);
 let newts = r.roleCount('newt');
 //console.log(spawn.room.name+' newts: '+newts+' newtCap: '+newtCap);
 let minnows = r.roleCount('minnow');
 //console.log(spawn.room.name + ' minnows: ' + minnows + ' minnowCap: ' + minnowCap);
 if (toads < toadCap) {
  //console.log(toadCap);
  let creepName = spawn.spawnCreep(toad, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(toad, rcl);
  }
 } else
 if (newts < newtCap) {
  //console.log(newtCap);
  let creepName = spawn.spawnCreep(newt, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(newt, rcl);
  }
  if (!creepName) {
   creepName = spawn.spawnCreep(newt, rcl - 1);
  }
 } else
 if (frogs < frogCap) {
  //console.log(frogCap);
  let creepName = spawn.spawnCreep(frog, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(frog, rcl);
  }
 } else
 if (minnows < minnowCap) {
  //console.log(frogCap);
  let creepName = spawn.spawnCreep(minnow, rcl);
 }
}

Creep.prototype.toad = function () {
 //state flipper
 if (this.carry.energy < this.carryCapacity) {
  this.memory.state = 0;
 }
 if (this.carry.energy === this.carryCapacity) {
  this.memory.state = 1;
 }
 if (!this.depositAura()) {
  this.dumpAura();
 };
 if (!this.constructAura()) {
  this.fixAura();
 }
 this.sweepAura();
 this.eatAura();
 this.mineAura();
 //this.collectAura();
 let roomMaxed = (EXTENSION_ENERGY_CAPACITY[this.room.controller.level] * CONTROLLER_STRUCTURES.extension[this.room.controller.level] <= this.room.energyAvailable);
 if (this.memory.hungry) {
  if (this.requestTask('eat')) {
   this.requestTask('mine');
   return this.eat();
  }
 } else {
  if (roomMaxed) {
   if (!this.constructAura()) {
    this.upgradeAura();
   }
  }
  //primary tasks in order of importance inside of state logic
  if (this.requestTask('mine')) {
   return this.mine();
  } else
  if (this.requestTask('eat')) {
   return this.eat();
  }
  return Memory.emoji.frog;
 }
};

function tower(structure) {
 var nearenemies = structure.pos.findInRange(FIND_HOSTILE_CREEPS, 15);
 if (!structure.room.memory.towers) {
  structure.room.memory.towers = {};
 }
 if (!structure.room.memory.towers[structure.id]) {
  structure.room.memory.towers[structure.id] = {};
 }
 if (!structure.room.memory.towers[structure.id].mode) {
  structure.room.memory.towers[structure.id].mode = 'alert';
 }
 if (structure.energy <= 100 || nearenemies.length > 0) {
  structure.room.memory.towers[structure.id].mode = 'alert';
 } else if (structure.energy > 100) {
  structure.room.memory.towers[structure.id].mode = 'repair';
 }
 var hurt;
 var mode = structure.room.memory.towers[structure.id].mode;
 if (mode == 'alert') {
  hurt = structure.room.find(FIND_MY_CREEPS, { filter: object => object.hits < object.hitsMax });
  if (nearenemies.length > 0) {
   if (nearenemies.length > 1) {
    nearenemies.sort((a, b) => a.hits - b.hits);
   }
   structure.attack(nearenemies[0]);
  } else if (hurt.length > 0) {
   if (hurt.length > 1) {
    hurt.sort((a, b) => a.hits - b.hits);
   }
   structure.heal(hurt[0]);
  }


 } else if (mode == 'repair') {
  var damaged = structure.room.memory.jobs.fix;
  //console.log('Detecting damaged structures');
  structure.repair(Game.getObjectById(damaged[0]));
  hurt = structure.room.memory.jobs.aid;
  structure.heal(Game.getObjectById(hurt[0]));
 } else {
  if (nearenemies.length > 0) {
   if (nearenemies.length > 1) {
    nearenemies.sort((a, b) => a.hits - b.hits);
   }
   structure.attack(nearenemies[0]);
  }
 }
}

/*jshint -W008 */
//// HEAL PLUS ////
Creep.prototype.aid = function() {
  if (this.memory.jobs.aid) {
    switch (this.heal(Game.getObjectById(this.memory.jobs.aid))) {
      case 0:
        return Memory.emoji.aid;
      case -9:
        //set move
        CM.set(this.pos.x, this.pos.y, 0);
        this.moveTo(Game.getObjectById(this.memory.jobs.aid), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ffaaaa',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
    }
  }
  return Memory.emoji.oops+Memory.emoji.aid+Memory.emoji.oops;
};

/*jshint -W008 */
/// WITHDRAW PLUS ///
Creep.prototype.collect = function () {
 if (this.memory.jobs.collect) {
  switch (this.withdraw(Game.getObjectById(this.memory.jobs.collect), RESOURCE_ENERGY)) {
  case 0:
   return Memory.emoji.collect;
  case -9:
   if (!this.collectAura()) {
    //set move
    CM.set(this.pos.x, this.pos.y, 0);
    this.moveTo(Game.getObjectById(this.memory.jobs.collect), {
     reusePath: 10,
     visualizePathStyle: {
      fill: 'transparent',
      stroke: '#eeff99',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     },
     costCallback: CM
    });
    return Memory.emoji.hop;
   } else {
    return Memory.emoji.sogood;
   }
  }
 }
 return Memory.emoji.oops + Memory.emoji.collect + Memory.emoji.oops;
};

/*jshint -W008 */
//// BUILD PLUS ////
Creep.prototype.construct = function () {
 if (this.memory.jobs.construct) {
  CM.set(this.pos.x, this.pos.y, 0);
  this.moveTo(Game.getObjectById(this.memory.jobs.construct), {
   visualizePathStyle: {
    fill: 'transparent',
    stroke: '#aacc66',
    lineStyle: 'solid',
    strokeWidth: .15,
    opacity: .1
   }
  });
  switch (this.build(Game.getObjectById(this.memory.jobs.construct))) {
  case 0:
   return Memory.emoji.construct;
  case -9:
   if (!this.constructAura()) {
    //set move
    return Memory.emoji.hop;
   } else {
    return Memory.emoji.sogood;
   }

  }
 }
 return Memory.emoji.oops + Memory.emoji.construct + Memory.emoji.oops;
};

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

Creep.prototype.dumpAura = function () {
 for (let e in this.room.memory.jobs.deposit) {
  //console.log(this.room.memory.jobs.deposit[e]);
  if (Game.getObjectById(this.room.memory.jobs.deposit[e])) {
   for (let resource in this.carry) {
    if (this.transfer(this.room.terminal, resource) === 0) {
     return true;
    } else if (this.transfer(this.room.storage, resource) === 0) {
     return true;
    } else
    if (this.transfer(Game.getObjectById(this.memory.jobs.deposit), resource) === 0) {
     return true;
    }
   }
  }
 }
 if (this.memory.role == 'toad') {
  if (this.transfer(this.room.storage, RESOURCE_ENERGY) === 0) {
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
  if (this.room.memory.jobs.collect[e].store) {
   for (let resource in Game.getObjectById(this.room.memory.jobs.collect[e]).store) {
    return this.withdraw(Game.getObjectById(this.room.memory.jobs.collect[e]), resource);
   }
  } else {
   this.withdraw(Game.getObjectById(this.room.memory.jobs.collect[e]), RESOURCE_ENERGY);
   this.withdraw(Game.getObjectById(this.room.memory.jobs.collect[e]), RESOURCE_POWER);
   this.withdraw(Game.getObjectById(this.room.memory.jobs.collect[e]), RESOURCE_GHODIUM);
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

/*jshint -W008 */
//// BUILD PLUS ////
Creep.prototype.deconstruct = function () {
 if (this.memory.jobs.deconstruct) {
  switch (this.dismantle(Game.getObjectById(this.memory.jobs.deconstruct))) {
  case 0:
   return Memory.emoji.deconstruct;
  case -9:
   if (!this.deconstructAura()) {
    //set move
    CM.set(this.pos.x, this.pos.y, 0);
    this.moveTo(Game.getObjectById(this.memory.jobs.deconstruct), {
     visualizePathStyle: {
      fill: 'transparent',
      stroke: '#ff0000',
      lineStyle: 'solid',
      strokeWidth: .15,
      opacity: .4
     }
    });
    return Memory.emoji.hop;
   } else {
    return Memory.emoji.sogood;
   }

  }
 }
 return Memory.emoji.oops + Memory.emoji.deconstruct + Memory.emoji.oops;
};

/*jshint -W008 */
/// TRANSFER PLUS ///
Creep.prototype.deposit = function () {
 if (this.memory.jobs.deposit) {
  switch (this.transfer(Game.getObjectById(this.memory.jobs.deposit), RESOURCE_ENERGY)) {
  case 0:
   return Memory.emoji.deposit;
  case -9:
   this.depositAura();
   //set move
   CM.set(this.pos.x, this.pos.y, 0);
   this.moveTo(Game.getObjectById(this.memory.jobs.deposit), {
    reusePath: 5,
    visualizePathStyle: {
     fill: 'transparent',
     stroke: '#eecc00',
     lineStyle: 'dashed',
     strokeWidth: .15,
     opacity: .1
    },
    costCallback: CM
   });
   return Memory.emoji.frog;
  }
 }
 this.moveTo(this.room.storage, {
  reusePath: 5,
  ignoreCreeps: false,
  visualizePathStyle: {
   fill: 'transparent',
   stroke: '#eecc00',
   lineStyle: 'dashed',
   strokeWidth: .15,
   opacity: .1
  },
  costCallback: CM
 });
 return Memory.emoji.sogood;
};

/*jshint -W008 */
//// RENEWCREEP PLUS ////
Creep.prototype.eat = function () {
 //any creep checking to eat with less hp thean 1400 should eat then
 if (this.ticksToLive < 420) {
  this.memory.hungry = true;
 } else {
  this.memory.hungry = false;
 }
 if (this.memory.jobs.eat) {
  if (Game.getObjectById(this.memory.jobs.eat).renewCreep(this) === 0) {
   this.depositAura();
   return Memory.emoji.eat;
  } else {
   //if hungry eat
   if (this.memory.hungry) {
    //set move
    CM.set(this.pos.x, this.pos.y, 0);
    this.moveTo(Game.getObjectById(this.memory.jobs.eat), {
     visualizePathStyle: {
      fill: 'transparent',
      stroke: '#00eeff',
      lineStyle: 'solid',
      strokeWidth: .15,
      opacity: .1
     }
    });
    return Memory.emoji.hop;
    //if not go back to a starting point
   } else {
    if (this.memory.role == 'toad') {
     this.moveTo(Game.getObjectById(this.memory.jobs.mine), {
      visualizePathStyle: {
       fill: 'transparent',
       stroke: '#eeff99',
       lineStyle: 'solid',
       strokeWidth: .15,
       opacity: .1
      }
     });
     return Memory.emoji.hop;
    } else {
     this.moveTo(Game.rooms[this.memory.room].storage);
     return Memory.emoji.hop;
    }
   }
  }
  return this.moveTo(Game.getObjectById(this.memory.jobs.eat), {
   visualizePathStyle: {
    fill: 'transparent',
    stroke: '#00eeff',
    lineStyle: 'solid',
    strokeWidth: .15,
    opacity: .1
   }
  });
 }
};

/*jshint -W008 */
//// REPAIR PLUS ////
Creep.prototype.fix = function() {
  if (this.memory.jobs.fix) {
    switch (this.repair(Game.getObjectById(this.memory.jobs.fix))) {
      case 0:
        return Memory.emoji.fix;
      case -9:
        if (!this.fixAura()) {
          //set move
          CM.set(this.pos.x, this.pos.y, 0);
          this.moveTo(Game.getObjectById(this.memory.jobs.fix), {
            visualizePathStyle: {
              fill: 'transparent',
              stroke: '#ffaaaa',
              lineStyle: 'solid',
              strokeWidth: .15,
              opacity: .1
            }
          });
          return Memory.emoji.fix;
        }
        return Memory.emoji.sogood;
    }
  }
  return Memory.emoji.oops + Memory.emoji.fix + Memory.emoji.oops;
};

/*jshint -W008 */
//// HARVEST PLUS ////
Creep.prototype.mine = function () {
 if (this.memory.jobs.mine) {
  switch (this.harvest(Game.getObjectById(this.memory.jobs.mine))) {
  case 0:
   let look = this.pos.look();
   let resourceCount = 0;
   look.forEach(function (lookObject) {
    if (lookObject.type == LOOK_RESOURCES) {
     resourceCount += 1;
    }
   });
   if (resourceCount > 0) {
    this.moveTo(Game.getObjectById(this.memory.jobs.mine));
   }
   return Memory.emoji.mine;
  case -9:
   //set move
   CM.set(this.pos.x, this.pos.y, 0);
   this.moveTo(Game.getObjectById(this.memory.jobs.mine), {
    reusePath: 20,
    visualizePathStyle: {
     fill: 'transparent',
     stroke: '#eeff99',
     lineStyle: 'solid',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return Memory.emoji.hop;
  case -6:
   //if the mine is empty go eat
   if (this.requestTask('eat')) {
    return this.eat();
   } else {
    return 'zzz';
   }
  }

 }
 return this.harvest(Game.getObjectById(this.memory.jobs.mine));
};

/*jshint -W008 */
/// PICKUP PLUS ///
Creep.prototype.sweep = function () {
 if (Game.getObjectById(this.memory.jobs.sweep).resourceType == 'energy') {
  switch (this.pickup(Game.getObjectById(this.memory.jobs.sweep))) {
  case 0:
   return Memory.emoji.sweep;
  case -9:
   if (!this.sweepAura()) {
    //set move
    CM.set(this.pos.x, this.pos.y, 0);
    this.moveTo(Game.getObjectById(this.memory.jobs.sweep), {
     reusePath: 10,
     visualizePathStyle: {
      fill: 'transparent',
      stroke: '#eecc00',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     },
     costCallback: CM
    });
    return Memory.emoji.hop;
   } else {
    return Memory.emoji.sogood;
   }

  }
 }
 return Memory.emoji.oops + Memory.emoji.sweep + Memory.emoji.oops;
};

/*jshint -W008 */
//// UPGRADECONTROLLER PLUS ////
Creep.prototype.upgrade = function () {
 if (this.memory.jobs.upgrade) {
  this.signController("Ribbit");
  switch (this.upgradeController(Game.getObjectById(this.memory.jobs.upgrade))) {
  case 0:
   //CM.set(this.pos.x, this.pos.y, 255);
   //this.move(Math.random() * (8 - 1) + 1);
   //no need to clear memory for upgrade, controller is permanent
   return Memory.emoji.upgrade;
  case -9:
   //set move
   CM.set(this.pos.x, this.pos.y, 0);
   this.moveTo(Game.getObjectById(this.memory.jobs.upgrade), {
    visualizePathStyle: {
     fill: 'transparent',
     stroke: '#ffffff',
     lineStyle: 'solid',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return Memory.emoji.hop;
  }
 }
 return Memory.emoji.oops + Memory.emoji.upgrade + Memory.emoji.oops;
};

/*jshint -W008 */
//// ATTACK PLUS ////
Creep.prototype.whack = function() {
  if (this.memory.jobs.whack) {
    switch (this.attack(Game.getObjectById(this.memory.jobs.whack))) {
      case 0:
        //clear id from room's task set
        Game.getObjectById(this.memory.jobs.whack).deleteTask('whack');
        return Memory.emoji.whack;
      case -9:
        //set move
        CM.set(this.pos.x, this.pos.y, 0);
        this.moveTo(Game.getObjectById(this.memory.jobs.whack), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ff0000',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.whack;
    }
  }
  return Memory.emoji.oops + Memory.emoji.whack + Memory.emoji.oops;
};

//first set memory structures
if (!Memory.recipes) {
 Memory.recipes = {};
 Memory.recipes.frog = {
  parts: {
   //rcl1 300 energy
   1: [MOVE, CARRY, MOVE, WORK],
   //rcl2 300 - 550
   2: [MOVE, CARRY, MOVE, WORK],
   //rcl3 550 - 800
   3: [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK],
   //rcl 4 800 - 1300
   4: [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK],
   //rcl 5 1300 - 1800
   5: [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK],
   //rcl 6 1800 - 2300
   6: [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK],
   //rcl 7 2300 - 5600
   7: [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK],
   //rcl 8 5600 - 12900
   8: [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK]

  },
  options: {
   //add role for creep function call
   role: 'frog',
   //limit resource type to avoid chemical poisoning
   resourceType: RESOURCE_ENERGY,
   jobs: {
    construct: null,
    collect: null,
    fix: null,
    sweep: null,
    mine: null,
    eat: null,
    upgrade: null
   }
  }
 };
 Memory.recipes.newt = {
  parts: {
   //rcl1 300 energy
   1: [MOVE, CARRY, MOVE, CARRY],
   //rcl2 300 - 550
   2: [MOVE, CARRY, MOVE, CARRY],
   //rcl3 550 - 800
   3: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 4 800 - 1300
   4: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 5 1300 - 1800
   5: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 6 1800 - 2300
   6: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 7 2300 - 5600
   7: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 8 5600 - 12900
   8: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]

  },
  options: {
   //add role for creep function call
   role: 'newt',
   //limit resource type to avoid chemical poisoning
   resourceType: RESOURCE_ENERGY,
   jobs: {
    deposit: null,
    collect: null,
    sweep: null,
    eat: null
   }
  }
 };
 Memory.recipes.minnow = {
  parts: {
   //rcl1 300 energy
   1: [MOVE, CARRY, MOVE, CARRY],
   //rcl2 300 - 550
   2: [MOVE, CARRY, MOVE, CARRY],
   //rcl3 550 - 800
   3: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 4 800 - 1300
   4: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 5 1300 - 1800
   5: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 6 1800 - 2300
   6: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 7 2300 - 5600
   7: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 8 5600 - 12900
   8: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]

  },
  options: {
   //add role for creep function call
   role: 'minnow',
   jobs: {
    eat: null
   },
   to: null,
   from: null
  }
 };
 Memory.recipes.toad = {
  parts: {
   //rcl1 300 energy
   1: [MOVE, WORK, CARRY, WORK],
   //rcl2 300 - 550
   2: [MOVE, WORK, CARRY, WORK],
   //rcl3 550 - 800
   3: [MOVE, WORK, WORK, MOVE, WORK, WORK, CARRY],
   //rcl 4 800 - 1300
   4: [MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, CARRY],
   //rcl 5 1300 - 1800
   5: [MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, CARRY],
   //rcl 6 1800 - 2300
   6: [MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, CARRY, CARRY],
   //rcl 7 2300 - 5600
   7: [MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY],
   //rcl 8 5600 - 12900
   8: [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE]

  },
  options: {
   //add role for creep function call
   role: 'toad',
   //limit resource type to avoid chemical poisoning
   resourceType: RESOURCE_ENERGY,
   builtcontainer: 0,
   jobs: {
    construct: null,
    fix: null,
    sweep: null,
    mine: null,
    eat: null,
    upgrade: null
   }
  }
 };
}
Memory.emoji = {
 //EMOJI CAUSE YOLO
 frog: '🐸',
 construct: '🛠️️',
 deconstruct: '⛏',
 fix: '🏚️',
 mine: '💰',
 upgrade: '⚡',
 eat: '🍽️',
 deposit: '✨',
 collect: '✨',
 oops: '☠️',
 whack: '⚔️',
 pew: '🔫',
 aid: '💊',
 sweep: '✨',
 suicide: '💮',
 sogood: '✨🐸✨',
 hop: '💨'
};
Memory.costMatrix = new PathFinder.CostMatrix();
let CM = Memory.costMatrix;
//export my loop logic
module.exports.loop = function () {
 //start by initializing memory and cost matrixes per room
 CM._bits.fill(255);
 for (let r in Memory.rooms) {
  var room = Game.rooms[r];
  if (room) {
   room.initializeMemory();
   room.memory.roles = {
    frog: 0,
    newt: 0,
    toad: 0,
    squatter: 0
   };
   room.memory.jobs = {
    whack: [],
    construct: [],
    deconstruct: [],
    deposit: [],
    collect: [],
    aid: [],
    fix: [],
    sweep: [],
    mine: [],
    eat: [],
    upgrade: [],
   };

   if (room.memory.parentRoom) {
    room.queueTasks(Game.rooms[room.memory.parentRoom]);
   } else {
    room.queueTasks();
   }
  }
 }
 for (let s in Game.structures) {
  let structure = Game.structures[s];
  switch (structure.structureType) {
  case 'tower':
   tower(structure);
   break;
  case 'spawn':
   if (Memory.spawns[structure.name].queen) {
    queen(structure);
   }
   break;
  }
 }
 for (let name in Memory.creeps) {
  //clearing of the dead from memory
  if (!Game.creeps[name]) {
   //clear creep work registration
   delete Memory.creeps[name];
   //then keep iterating over other creeps
  } else
  if (Game.creeps[name]) {
   var creep = Game.creeps[name];
   let roomMaxed = false;
   if (EXTENSION_ENERGY_CAPACITY[Game.rooms[creep.memory.room].controller.level] * CONTROLLER_STRUCTURES.extension[Game.rooms[creep.memory.room].controller.level] <= Game.rooms[creep.memory.room].energyAvailable) {
    roomMaxed = true;
   }
   if (creep.ticksToLive < 420) {
    creep.memory.hungry = true;
   }
   if (creep.ticksToLive > 1400) {
    creep.memory.hungry = false;
   }
   if (!creep.memory.room) {
    creep.memory.room = creep.name.split('_')[2];
   }
   switch (creep.memory.role) {
   case 'frog':
    creep.say(creep.frog());
    break;
   case 'toad':
    creep.say(creep.toad());
    break;
   case 'newt':
    creep.say(creep.newt());
    break;
   case 'minnow':
    creep.say(creep.minnow());
    break;
   }
  }
 }
};
//graphs
//collect_stats();
