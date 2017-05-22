function findSources(r) {
    return r.find(FIND_SOURCES);
}

ConstructionSite.prototype.debrief = function () {
 //add to gather object
 delete this.room.memory.jobs.build.tasks[this.id];
};

StructureContainer.prototype.report = function () {
 if (this.store.energy > 0) {
  //add to gather object
  this.room.memory.jobs.withdraw.tasks[this.id] = this.energy;
 }
};
StructureContainer.prototype.debrief = function () {
 if (this.store.energy === 0) {
  delete this.room.memory.withdraw.tasks[this.id];
 }
};

StructureController.prototype.debrief = function () {
 return true;
};

//assign task
Creep.prototype.assignTask = function (job) {
 //you know you can get objects by simulated index by getting the keys
 var tasksKeys = Object.keys(this.room.memory.jobs[job].tasks);
 if (!this.room.memory.jobs[job].workers[this.id]) {
  this.room.memory.jobs[job].workers[this.id] = this.id;
 }
 var workersKeys = Object.keys(this.room.memory.jobs[job].workers);
 //if there are actually tasks
 if (tasksKeys.length) {
  console.log('we have ' + workersKeys.length + ' workers and ' + tasksKeys.length + ' ' + job + ' jobs to do');
  //we need to run a different loop depending on the number of workers and tasks
  if (workersKeys.length > tasksKeys.length) {
   console.log('we have more workers than jobs');
   // if we have less tasks than workers we can assign bunch workers to the
   // bottommost task
   for (var w = 0; w < workersKeys.length; w++) {
    //only if the creep id is the one we want
    console.log(this.id + ' being assigned at index ' + w + ' for worker value ' + this.room.memory.jobs[job].workers[workersKeys[w]]);
    if (this.id == this.room.memory.jobs[job].workers[workersKeys[w]]) {
     //console.log(this.id + ' being assigned');
     //if the creep index accesses a job
     if (tasksKeys[w]) {
      //assign job at index i
      console.log('creep with id ' + this.id + ' being assigned to a ' + tasksKeys[w] + ' at index ' + w);
      this.room.memory.jobs[job].assignment[this.id] = tasksKeys[w];
      return this.room.memory.jobs[job].assignment[this.id];
     } else {
      //assign job at index tasks.length-1
      console.log('creep with id ' + this.id + ' being assigned to b ' + tasksKeys[tasksKeys.length - 1] + ' at index ' + w);
      this.room.memory.jobs[job].assignment[this.id] = tasksKeys[tasksKeys.length - 1];
      return this.room.memory.jobs[job].assignment[this.id];
     }
    }
   }
  } else {
   console.log('we have more jobs than workers');
   //if we have more or equal workers to tasks we simply assign them in order
   for (var i = 0; i < workersKeys.length; i++) {
    //only if the creep id is the one we want
    if (this.id == this.room.memory.jobs[job].workers[workersKeys[i]]) {
     //assign and return task id
     this.room.memory.jobs[job].assignment[this.id] = this.room.memory.jobs[job].tasks[tasksKeys[i]];
     console.log('creep with id ' + this.id + ' being assigned to ' + tasksKeys[i] + ' at index ' + i);
     return this.room.memory.jobs[job].assignment[workersKeys[i]];
    }
   }
  }
 } else {
  //if there are no jobs return null
  return null;
 }
};

//act
Creep.prototype.act = function (job) {
 //if the creep memory can't substantiate an object
 if (!Game.getObjectById(this.memory[job].id)) {
  //that isn't there any more
  console.log('can not instantiate target object for ' + job);
  this.memory[job].id = this.assignTask(job);
 }

 let project = Game.getObjectById(this.memory[job]);
 console.log('creep attempting to ' + job + ' with ' + this[job](project));
 switch (this[job](project)) {
 case 0:
  //creep successfuly acted
  this.say('ribbit', true);
  project.debrief();
  return true;
 case -1:
  //don't own the creep
  console.log('You do not own the creep being told to ' + job);
  break;
 case -4:
  //creep is being spawned
  this.say('Spawning', false);
  break;
 case -6:
  //no more energy to spend
  this.say('Empty', false);
  break;
 case -7:
  //invalid target
  this.say('Bad Target', false);
  this.memory[job] = this.assignTask(job);
  break;
 case -9:
  //set move
  this.moveByPath(creep.memory[job].path);
  break;
 case -12:
  //no work body parts
  this.say('¯\\_(ツ)_/¯', false);
  break;
 }
};

//eat action
Creep.prototype.eat = function (home) {
 return home.renewCreep(this);
};
//sacrifice action
Creep.prototype.sacrifice = function (home) {
 return home.recycleCreep(this);
};

StructureExtension.prototype.report = function () {
 if (this.energy < this.energyCapacity) {
  //add to deposit array
  this.room.memory.jobs.transfer.tasks[this.id] = this.energy;
 }
};
StructureExtension.prototype.debrief = function () {
 if (this.energy === this.energyCapacity) {
  delete this.room.memory.jobs.transfer.tasks[this.id];
 }
};

OwnedStructure.prototype.healthCheck = function () {
 if ((object.hitsMax / 2 > object.hits) && (object.hits < 10000)) {
  //add to gather object
  this.room.memory.jobs.repair.tasks[this.id] = this.hits;
 }
};

OwnedStructure.prototype.discharge = function () {
 if (this.room.memory.repair[this.id]) {
  delete this.room.memory.jobs.repair.tasks[this.id];
 }
};

Resource.prototype.report = function () {
 //add to sweep array
 this.room.memory.jobs.pickup.tasks[this.id] = this.amount;
};

Room.prototype.roleCount = function (roleString) {
 //console.log('counting '+roleString+'s in '+this.name);
 let count = this.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role == roleString });
 //console.log(count.length);
 return count.length;
};
//counts open spots around sources
Room.prototype.miningSpots = function (sources) {
 //initialize vars
 var r = this;
 var miningspots = 0;
 var area = [];
 //Peek at the result by uncommenting the line below
 //console.log("sources: "+JSON.stringify(sources));
 sources.forEach(
  function (source) {
   //Iterate over the source
   //console.log("source: "+source)
   //search the 3x3 grid with the source at the center
   var sid = source.id;
   //console.log(sid);
   area = (r.lookForAtArea('terrain', (source.pos.y) - 1, (source.pos.x) - 1, (source.pos.y) + 1, (source.pos.x) + 1, true));
   //console.log("result: "+JSON.stringify(area.length));
   for (var j = 0; j < area.length; j++) {
    //uncomment to see the grid printed
    //console.log(j+": "+JSON.stringify(area[j]));
    if (area[j].terrain == ('plain') || area[j].terrain == ('swamp')) {
     miningspots++;
     //console.log(miningspots);
     //if the terrain is swamp or plain add a mining spot
     if (!Memory.rooms[r.name].sources) {
      Memory.rooms[r.name].sources = {};
     }
     if (!Memory.rooms[r.name].sources[sid]) {
      Memory.rooms[r.name].sources[sid] = {};
      Memory.rooms[r.name].jobs.harvest.tasks[sid] = sid;
     }
     if (!Memory.rooms[r.name].sources[sid].spots) {
      Memory.rooms[r.name].sources[sid].spots = {};
     }
     if (!Memory.rooms[r.name].sources[sid].spots[miningspots]) {
      Memory.rooms[r.name].sources[sid].spots[miningspots] = 'empty';
     }
     //console.log(sid);
    }
   }
  }
 );
 //Peek at the result by uncommenting the line below
 //console.log("countMiningSpots: " + JSON.stringify(miningspots));
 return miningspots;
};

Source.prototype.debrief = function () {
 return true;
};

StructureSpawn.prototype.report = function () {
 if (this.energy < this.energyCapacity) {
  //add to deposit array
  this.room.memory.jobs.transfer.tasks[this.id] = this.energy;
 }
};

StructureSpawn.prototype.debrief = function () {
 if (this.energy === this.energyCapacity) {
  delete this.room.memory.jobs.transfer.tasks[this.id];
 }
};

StructureStorage.prototype.report = function () {
 if (this.store.energy > 0) {
  //add to gather object
  this.room.memory.jobs.withdraw.tasks[this.id] = this.energy;
 }
};
StructureStorage.prototype.debrief = function () {
 if (this.store.energy === 0) {
  delete this.room.memory.jobs.withdraw.tasks[this.id];
 }
};

StructureTower.prototype.report = function () {
 if (this.energy < this.energyCapacity) {
  //add to deposit array
  this.room.memory.jobs.transfer.tasks[this.id] = this.energy;
 }
};

StructureTower.prototype.debrief = function () {
 if (this.energy === this.energyCapacity) {
  delete this.room.memory.jobs.transfer.tasks[this.id];
 }
};

function assignSpot(creep) {
 for (let source in Memory.rooms[creep.room.name].sources) {
  if (Memory.rooms[creep.room.name].lastAssignedSource == source) {
   continue;
  }
  for (let spot in Memory.rooms[creep.room.name].sources[source].spots) {
   if (!Game.getObjectById(Memory.rooms[creep.room.name].sources[source].spots[spot])) {
    Memory.rooms[creep.room.name].sources[source].spots[spot] = creep.id;
    Memory.rooms[creep.room.name].lastAssignedSource = source;
    return source;
   } else if (creep.memory.priority > Game.getObjectById(Memory.rooms[creep.room.name].sources[source].spots[spot]).memory.priority) {
    Game.getObjectById(Memory.rooms[creep.room.name].sources[source].spots[spot]).suicide();
    Memory.rooms[creep.room.name].sources[source].spots[spot] = creep.id;
    Memory.rooms[creep.room.name].lastAssignedSource = source;
    return source;
   }
  }
 }
 return creep.pos.findClosestByRange(FIND_SOURCES).id;
}

function spawnCreep(spawn, creepRecipe, rcl) {
 switch (spawn.createCreep(creepRecipe.parts[rcl], Game.time, creepRecipe.options)) {
 case -1:
  //don't own the creep
  console.log('You do not own the spawn being told to create a creep');
  break;
 case -3:
  //creep name already taken
  console.log('There is already a creep with this name');
  break;
 case -4:
  //creep is being spawned
  console.log('Spawn is already spawning  creep');
  break;
 case -6:
  //no more energy to spend
  console.log('Not enough energy to spawn creep');
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
}

function gatherAura(creep) {
 var shinies = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {
  filter: r => r.resourceType == RESOURCE_ENERGY
 });
 var moarshinies = creep.pos.findInRange(FIND_STRUCTURES, 1, {
  filter: s => s.structureType == STRUCTURE_CONTAINER
 });
 var evenmoarshinies = creep.pos.findInRange(FIND_STRUCTURES, 1, {
  filter: s => s.structureType == STRUCTURE_STORAGE
 });
 if (creep.memory.role != 'newt' && creep.memory.role != 'toad') {
  if (creep.withdraw(evenmoarshinies[0], RESOURCE_ENERGY) === 0) {
   creep.say('shinies');
  }
 }
 if (creep.memory.role != 'toad') {
  if (creep.withdraw(moarshinies[0], RESOURCE_ENERGY) === 0) {
   creep.say('shinies');
  }
 }
 if (creep.pickup(shinies[0]) === 0) {
  creep.say('shinies');
 }
}

function depositAura(creep) {
 var nearExt = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {
  filter: s => s.structureType == STRUCTURE_EXTENSION
 });
 //console.log(nearExt);
 for (let e in nearExt) {
  //console.log(nearExt[e]);
  if (creep.transfer(nearExt[e], RESOURCE_ENERGY) === 0) {
   creep.say('teehee');
  }
 }
}

function frog(creep) {
 //if creep has no energy
 if (creep.carry.energy === 0) {
  creep.act('eat');
  creep.act('harvest');
  creep.act('withdraw');
 }
 //if creep has energy
 else if (creep.carry.energy === creep.carryCapacity) {
  creep.act('eat');
  creep.act('upgradeController');
  creep.act('repair');
  creep.act('build');
 }
}
if (!Memory.recipes) {
 Memory.recipes = {};
}
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
  resourceType: RESOURCE_ENERGY
 }
};

function newt(creep) {
 //if creep has no energy
 if (creep.carry.energy === 0) {
  creep.act('withdraw');
  creep.act('pickup');
 }
 //if creep has energy
 else if (creep.carry.energy === creep.carryCapacity) {
  creep.act('eat');
  creep.act('transfer');
 }
}

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
 }
};

//we currently have no interest in taking rooms we can't build spawns in, so
//initialize room goes here with our first building in any room
function initialize(r) {
 //initialize room if not already initialized
 Memory.rooms[r.name] = {};
 if (!Memory.rooms[r.name].sc) {
  Memory.rooms[r.name].sc = (r.find(FIND_SOURCES).length);
 }
 if (!Memory.rooms[r.name].pc) {
  Memory.rooms[r.name].pc = (Memory.rooms[r.name].sc * 3000);
 }
 if (!Memory.rooms[r.name].pt) {
  Memory.rooms[r.name].pt = Math.ceil(Memory.rooms[r.name].pc / 300);
 }
 if (!Memory.rooms[r.name].jobs) {
  Memory.rooms[r.name].jobs = {
   attack: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   build: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   transfer: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   withdraw: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   heal: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   repair: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   pickup: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   harvest: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   eat: {
    workers: {},
    tasks: {},
    assignment: {}
   },
   upgradeController: {
    workers: {},
    tasks: {},
    assignment: {}
   },
  };
 }
 if (!Memory.rooms[r.name].miningSpots) {
  Memory.rooms[r.name].miningSpots = r.miningSpots(r.find(FIND_SOURCES));
 }
}

function queen(spawn) {
 const r = spawn.room;
 if (!Memory.rooms[r.name]) {
  initialize(r);
  Memory.rooms[r.name].jobs.transfer.tasks[spawn.id] = spawn.id;
  Memory.rooms[r.name].jobs.eat.tasks[spawn.id] = spawn.id;
  Memory.rooms[r.name].jobs.upgradeController.tasks[r.controller.id] = r.controller.id;
 }
 const rcl = r.controller.level;
 //spawn logic
 //rcl switch
 let frog = Memory.recipes.frog;
 let toad = Memory.recipes.toad;
 let newt = Memory.recipes.newt;

 //we want to spawn creeps based on tasks needing to be done
 //so we have a variable count for toads since it takes a while for max mining on a single toad
 if (r.roleCount('toad') < r.memory.sc) {
  spawnCreep(spawn, toad, rcl);
 } //else if ((r.roleCount('newt') < Object.keys(r.gather).length) || (r.roleCount('newt') < Object.keys(r.sweep).length)) {
 //we make newts based on the amount of gather tasks we have
 //spawnCreep(spawn, newt);
 //} else if (r.roleCount('frog') < Object.keys(r.construct).length) {
 //we make frogs based on the amount of build tasks we have
 //spawnCreep(spawn, frog);
 //}


}

function toad(creep) {
 //if creep has no energy
 if (creep.carry.energy === 0) {
  //console.log('eat queued');
  creep.act('eat');
  //console.log('harvest queued');
  creep.act('harvest');
 }
 //if creep has energy
 else if (creep.carry.energy > 0) {
  creep.act('build');
  creep.act('upgradeController');
  creep.act('harvest');
 }
}

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
 }
};

function tower(structure) {
 var nearenemies = structure.pos.findInRange(FIND_HOSTILE_CREEPS, 15);
 if (!Memory.towers[structure.id]) {
  Memory.towers[structure.id] = {};
 }
 if (!Memory.towers[structure.id].mode) {
  Memory.towers[structure.id].mode = 'alert';
 }
 if (structure.energy <= 900 || nearenemies.length > 0) {
  Memory.towers[structure.id].mode = 'alert';
 } else if (structure.energy > 900) {
  Memory.towers[structure.id].mode = 'repair';
 }
 var mode = Memory.towers[structure.id].mode;
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
  var damaged = structure.room.find(FIND_STRUCTURES, { filter: object => (object.hitsMax / 2 > object.hits) && (object.hits < 100000) });
  //console.log('Detecting damaged structures');
  if (damaged.length > 0) {
   //console.log('Attempting to repair now');
   if (damaged.length > 1) {
    damaged.sort((a, b) => (a.hits - b.hits));
   }
   // console.log('check repair sort: ');
   //console.log(damaged);
   structure.repair(damaged[0]);
  }
 } else {
  if (nearenemies.length > 0) {
   if (nearenemies.length > 1) {
    nearenemies.sort((a, b) => a.hits - b.hits);
   }
   structure.attack(nearenemies[0]);
  }
 }
}

function eraseDead() {
 for (var i in Memory.creeps) {
  if (!Game.creeps[i]) {
   delete Memory.creeps[i];
  }
 }

}
//first clear memory
//erase dead creep
eraseDead();
//export my loop logic
module.exports.loop = function () {
 //trigger reports for construction sites
 for (let id in Game.ConstructionSites) {
  this.room.memory.jobs.build.tasks[id] = id;
 }
 //then trigger structure prototypes to populate energy delivery arrays
 for (let id in Game.structures) {
  var structure = Game.structures[id];
  switch (structure.structureType) {
  case 'spawn':
   if (structure.memory.queen) {
    queen(structure);
   }
   structure.report();
   break;
  case 'extension':
   structure.report();
   break;
  case 'container':
   structure.report();
   break;
  case 'storage':
   structure.report();
   break;
  case 'tower':
   tower(structure);
   structure.report();
   break;
  }
 }
 //then trigger creep behavior
 for (let name in Game.creeps) {
  var creep = Game.creeps[name];
  switch (creep.memory.role) {
  case 'redspawn':
   redspawn(creep);
   break;
  case 'tadpole':
   tadpole(creep);
   break;
  case 'frog':
   frog(creep);
   break;
  case 'toad':
   toad(creep);
   break;
  case 'newt':
   newt(creep);
   break;
  case 'squatter':
   squatter(creep);
   break;
  case 'poliwog':
   poliwog(creep);
   break;
  }
 }
};
//graphs
//collect_stats();
