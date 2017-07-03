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

Creep.prototype.newt = function () {
 //state flipper
 if (this.carry.energy == 0) {
  this.memory.state = 0;
 }
 //if creep has energy
 else if (this.carry.energy === this.carryCapacity) {
  this.memory.state = 1;
 }
 //if this has energy
 if (this.memory.state) {
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
  //primary tasks in order of importance inside of state logic
  if (this.requestTask('sweep')) {
   return this.sweep();
  } else
  if (this.requestTask('collect')) {
   return this.collect();
  }
 }
};

function queen(spawn) {
 const r = spawn.room;
 const rcl = r.controller.level;
 //spawn logic
 //rcl switch
 let frog = Memory.recipes.frog;
 let toad = Memory.recipes.toad;
 let newt = Memory.recipes.newt;
 let newtCap = Math.min(r.memory.jobs.collect.length, r.memory.jobs.deposit.length);
 let frogCap = Math.max(r.memory.jobs.construct.length, r.memory.jobs.sweep.length + r.memory.sc);
 let toadCap = r.memory.sc;
 //we want to spawn creeps based on tasks needing to be done

 //so we have a variable count for toads since it takes a while for max mining on a single toad
 if (r.roleCount('toad') < toadCap) {
  //console.log(toadCap);
  let creepName = spawn.spawnCreep(toad, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(toad, rcl);
  }
 } else
 if (r.roleCount('newt') < newtCap) {
  //console.log(newtCap);
  let creepName = spawn.spawnCreep(newt, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(newt, rcl);
  }
  if (!creepName) {
   creepName = spawn.spawnCreep(newt, 1);
  }
 } else
 if (r.roleCount('frog') < frogCap) {
  //console.log(frogCap);
  let creepName = spawn.spawnCreep(frog, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(frog, rcl);
  }
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
 this.depositAura();
 this.sweepAura();
 this.eatAura();
 let roomMaxed = (EXTENSION_ENERGY_CAPACITY[this.room.controller.level] * CONTROLLER_STRUCTURES.extension[this.room.controller.level] <= this.room.energyAvailable);
 if (this.ticksToLive < 200 && roomMaxed) {
  this.memory.hungry = true;
 }
 if (this.ticksToLive > 1400) {
  this.memory.hungry = false;
 }
 if (this.memory.hungry) {
   this.requestTask('mine');
  if (this.requestTask('eat')) {
   return this.eat();
  }
 } else {
  if (roomMaxed) {
   this.upgradeAura();
  }
  //primary tasks in order of importance inside of state logic
  if (this.requestTask('mine')) {
   return this.mine();
  } else
  if (this.requestTask('construct')) {
   return this.construct();
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
 var mode = structure.room.memory.towers[structure.id].mode;
 if (mode == 'alert') {
  var hurt = structure.room.find(FIND_MY_CREEPS, { filter: object => object.hits < object.hitsMax });
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
 } else {
  if (nearenemies.length > 0) {
   if (nearenemies.length > 1) {
    nearenemies.sort((a, b) => a.hits - b.hits);
   }
   structure.attack(nearenemies[0]);
  }
 }
}

StructureContainer.prototype.report = function () {
 if (this.store.energy >= 50) {
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
 this.room.memory.jobs.upgrade.push(this.id);
 //}
};

////  WHEN A CREEP IS THE TARGET OF A TASK ////
Creep.prototype.report = function (job) {
 this.room.memory.jobs[job].push(this.id);
};

StructureExtension.prototype.report = function () {
 if (this.energy < this.energyCapacity) {
  this.room.memory.jobs.deposit.push(this.id);
 }
 if (this.hits < this.hitsMax) {
  this.room.memory.jobs.fix.push(this.id);
 }
};

Resource.prototype.report = function () {
 this.room.memory.jobs.sweep.push(this.id);
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
}

Room.prototype.queueTasks = function () {
 this.storage.report();
 //structure tasks
 const structures = this.find(FIND_STRUCTURES);
 if (structures.length) {
  for (let structure in structures) {
   try {
    structures[structure].report();
   } catch (e) {
    console.log('No report method for ' + structures[structure] + structure.structureType);
   }
  }
 }
 //dropped resources
 const dust = this.find(FIND_DROPPED_RESOURCES);
 if (dust.length) {
  for (let d in dust) {
   var mote = dust[d];
   this.memory.jobs.sweep.push(mote.id);
  }
 }
 //construction sites
 for (let id in Game.constructionSites) {
  this.memory.jobs.construct.push(id);
 }
 //sources
 const sources = this.find(FIND_SOURCES_ACTIVE);
 if (sources.length) {
  for (let s in sources) {
   var source = sources[s];
   this.memory.jobs.mine.push(source.id);
  }
 }
 const frogs = this.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role == 'frog' });
 if (frogs.length) {
  for (let f in frogs) {
   var frog = frogs[f];
   if (frog.carry.energy < frog.carryCapacity) {
    this.memory.jobs.deposit.push(frog.id);
   }
  }
 }
}

Room.prototype.releaseTask = function (job) {
 if (!this.memory.jobs[job]) {
  this.memory.jobs[job] = [];
 }
 if (this.memory.jobs[job].length > 0) {
  return this.memory.jobs[job].shift();
 } else {
  return null;
 }
}

Room.prototype.roleCount = function (roleString) {
 //console.log('counting '+roleString+'s in '+this.name);
 let count = this.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role == roleString });
 //console.log(count.length);
 return count.length;
};

Source.prototype.report = function () {
 if (this.energy > 0) {
  this.room.memory.jobs.mine.push(this.id);
 }
};

StructureSpawn.prototype.report = function () {
 this.room.memory.jobs.eat.push(this.id);
 if (this.energy < this.energyCapacity) {
  this.room.memory.jobs.deposit.push(this.id);
 }
 if (this.hits < this.hitsMax) {
  this.room.memory.jobs.fix.push(this.id);
 }
};

StructureSpawn.prototype.spawnCreep = function (creepRecipe, rcl) {
 switch (this.createCreep(creepRecipe.parts[rcl], creepRecipe.options.role + "_" + Game.time + "_" + this.room.name, creepRecipe.options)) {
 case -3:
  //creep name already taken
  console.log('There is already a creep with this name');
  break;
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
 if (this.store.energy >= 50) {
  this.room.memory.jobs.collect.push(this.id);
 }
 if (this.hits < this.hitsMax) {
  this.room.memory.jobs.fix.push(this.id);
 }
};

StructureTower.prototype.report = function () {
 if (this.energy < this.energyCapacity) {
  this.room.memory.jobs.deposit.push(this.id);
 }
 if (this.hits < this.hitsMax) {
  this.room.memory.jobs.fix.push(this.id);
 }
};

StructureWall.prototype.report = function () {
 if (this.hits < 1000) {
  this.room.memory.jobs.fix.push(this.id);
 }
};

/*jshint -W008 */
//// HEAL PLUS ////
Creep.prototype.aid = function() {
  if (this.memory.jobs.aid) {
    switch (this.heal(Game.getObjectById(this.memory.jobs.aid))) {
      case 0:
        return Memory.emoji.aid;
      case -9:
        //set move
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
Creep.prototype.collect = function() {
  if (this.memory.jobs.collect) {
    switch (this.withdraw(Game.getObjectById(this.memory.jobs.collect), RESOURCE_ENERGY)) {
      case 0:
        return Memory.emoji.collect;
      case -9:
      if(!this.collectAura()){
        //set move
        this.moveTo(Game.getObjectById(this.memory.jobs.collect), {
          reusePath: 10,
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#eeff99',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: .1
          }
        })
        return Memory.emoji.hop;
      }else{
        return Memory.emoji.sogood;
      }
    }
  }
  return Memory.emoji.oops + Memory.emoji.collect + Memory.emoji.oops;
};

/*jshint -W008 */
//// BUILD PLUS ////
Creep.prototype.construct = function() {
  if (this.memory.jobs.construct) {
    switch (this.build(Game.getObjectById(this.memory.jobs.construct))) {
      case 0:
        return Memory.emoji.construct;
      case -9:
      if(!this.constructAura()){
        //set move
        this.moveTo(Game.getObjectById(this.memory.jobs.construct), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#aacc66',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
      }else{
        return Memory.emoji.sogood;
      }

    }
  }
  return Memory.emoji.oops + Memory.emoji.construct + Memory.emoji.oops;
};

//// TASK ASSIGNMENT ////
//get current assignment with Room.releaseTask
Creep.prototype.requestTask = function (job) {
 this.memory.jobs[job] = this.room.releaseTask(job);
 if (this.memory.jobs[job]) {
  this.room.memory.jobs[job].push(this.memory.jobs[job]);
  return true;
 } else {
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
 for (let e in this.room.memory.jobs.collect) {
  //console.log(this.room.memory.jobs.collect[e]);
  if (this.withdraw(Game.getObjectById(this.room.memory.jobs.collect[e]), RESOURCE_ENERGY) === 0) {
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

Creep.prototype.depositAura = function () {
 for (let e in this.room.memory.jobs.deposit) {
  //console.log(this.room.memory.jobs.deposit[e]);
  if (Game.getObjectById(this.room.memory.jobs.deposit[e])) {
   if (this.transfer(Game.getObjectById(this.room.memory.jobs.deposit[e]), RESOURCE_ENERGY) === 0) {
    return true;
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
  if (this.pickup(Game.getObjectById(this.room.memory.jobs.sweep[e]), RESOURCE_ENERGY) === 0) {
   return true;
  }
 }
 return false;
};

Creep.prototype.upgradeAura = function () {
 for (let e in this.room.memory.jobs.upgrade) {
  //console.log(this.room.memory.jobs.deposit[e]);
  if (Game.getObjectById(this.room.memory.jobs.upgrade[e])) {
   if (this.upgradeController(Game.getObjectById(this.room.memory.jobs.upgrade[e]), RESOURCE_ENERGY) === 0) {
    return true;
   }
  }
 }
 return false;
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
/// TRANSFER PLUS ///
Creep.prototype.deposit = function () {
 if (this.memory.jobs.deposit) {
  switch (this.transfer(Game.getObjectById(this.memory.jobs.deposit), RESOURCE_ENERGY)) {
  case 0:
   return Memory.emoji.deposit;
  case -9:
   this.depositAura();
   //set move
   this.moveTo(Game.getObjectById(this.memory.jobs.deposit), {
    reusePath: 10,
    visualizePathStyle: {
     fill: 'transparent',
     stroke: '#eecc00',
     lineStyle: 'dashed',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return Memory.emoji.frog;
  }
 }
 return Memory.emoji.oops + Memory.emoji.deposit + Memory.emoji.oops;
};

/*jshint -W008 */
//// RENEWCREEP PLUS ////
Creep.prototype.eat = function () {
 if (this.memory.jobs.eat) {
  switch (Game.getObjectById(this.memory.jobs.eat).renewCreep(this)) {
  case 0:
   return Memory.emoji.eat;
  case -9:
   if (!this.eatAura()) {
    //set move
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
   } else {
    return Memory.emoji.sogood;
   }
  }
 }
 return Memory.emoji.oops + Memory.emoji.eat + Memory.emoji.oops;
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
Creep.prototype.mine = function() {
  if (this.memory.jobs.mine) {
    switch (this.harvest(Game.getObjectById(this.memory.jobs.mine))) {
      case 0:
        return Memory.emoji.mine;
      case -9:
        //set move
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
    }
  }
  return Memory.emoji.oops + Memory.emoji.mine + Memory.emoji.oops;
};

/*jshint -W008 */
/// PICKUP PLUS ///
Creep.prototype.sweep = function() {
  if (this.memory.jobs.sweep) {
    switch (this.pickup(Game.getObjectById(this.memory.jobs.sweep))) {
      case 0:
        return Memory.emoji.sweep;
      case -9:
        if (!this.sweepAura()) {
          //set move
          this.moveTo(Game.getObjectById(this.memory.jobs.sweep), {
            visualizePathStyle: {
              fill: 'transparent',
              stroke: '#eecc00',
              lineStyle: 'dashed',
              strokeWidth: .15,
              opacity: .1
            }
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
Creep.prototype.upgrade = function() {
  if (this.memory.jobs.upgrade) {
    switch (this.upgradeController(Game.getObjectById(this.memory.jobs.upgrade))) {
      case 0:
        this.moveTo(Game.getObjectById(this.memory.jobs.upgrade), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ffffff',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        //no need to clear memory for upgrade, controller is permanent
        return Memory.emoji.upgrade;
      case -9:
        if (!this.upgradeAura()) {
          //set move
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
        return Memory.emoji.sogood;
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
   6: [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE, WORK],
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
   5: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 6 1800 - 2300
   6: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 7 2300 - 5600
   7: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
   //rcl 8 5600 - 12900
   8: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]

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
   6: [MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, CARRY],
   //rcl 7 2300 - 5600
   7: [MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, CARRY],
   //rcl 8 5600 - 12900
   8: [MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, WORK, WORK, MOVE, CARRY]

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
 fix: '🏗️🏚️',
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
//export my loop logic
module.exports.loop = function () {
 //start by initializing memory per room
 for (let r in Memory.rooms) {
  var room = Game.rooms[r];
  room.initializeMemory();
  room.memory.jobs = {
   whack: [],
   construct: [],
   deposit: [],
   collect: [],
   aid: [],
   fix: [],
   sweep: [],
   mine: [],
   eat: [],
   upgrade: [],
  };
  room.queueTasks();
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
   if (!creep.memory.room) {
    creep.memory.room = creep.room.name;
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
   }
  }
 }
};
//graphs
//collect_stats();
