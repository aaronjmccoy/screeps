ConstructionSite.prototype.report = function () {
 //add to sweep set
 this.createTask('construct');
};
//this gets called every time a creep uses build since the construction sites add themselves every tick
ConstructionSite.prototype.debrief = function () {
 return true;
};

//don't need to report because we do that in our main
//set a task
ConstructionSite.prototype.createTask = function (job) {
 this.room.memory.jobs.construct.tasks.push(this.id);
 this.room.memory.jobs.construct.tasks = [...new Set(this.room.memory.jobs.construct.tasks)];
};
//delete a task
ConstructionSite.prototype.deleteTask = function (job) {
 if (this.room.memory.jobs.construct.tasks.indexOf(this.id) > -1) {
  this.room.memory.jobs.construct.tasks.splice(this.room.memory.jobs.construct.tasks.indexOf(this.id), 1);
 }
};
//check if a cs id is in our task set
ConstructionSite.prototype.isTask = function (job) {
 return this.room.memory.jobs.construct.tasks.includes(this.id);
};
//get a particular task by converting the set to an array with the spread operator
ConstructionSite.prototype.getTaskAt = function (index, job) {
 return this.room.memory.jobs.construct.tasks[index];
};
//get a tasks' index
ConstructionSite.prototype.getTaskIndex = function (job) {
 return this.room.memory.jobs.construct.tasks.indexOf(this.id);
};

StructureContainer.prototype.report = function () {
 if (this.store.energy >= 50) {
  this.createTask('collect');
 }
 if (this.hits < 10000) {
  this.createTask('fix');
 }
};
StructureContainer.prototype.debrief = function () {
 if (this.store.energy < 50) {
  this.deleteTask('collect');
 }
 if (this.hits > 10000) {
  this.deleteTask('fix');
 }
};


//set a task
StructureContainer.prototype.createTask = function (job) {
 this.room.memory.jobs[job].tasks.push(this.id);
 this.room.memory.jobs[job].tasks = [...new Set(this.room.memory.jobs[job].tasks)];
};
//delete a task
StructureContainer.prototype.deleteTask = function (job) {
 if (!this.room.memory.jobs[job].tasks.indexOf(this.id)) {
  this.room.memory.jobs[job].tasks.splice(this.room.memory.jobs[job].tasks.indexOf(this.id), 1);
 }
};
//check if a cs id is in our task set
StructureContainer.prototype.isTask = function (job) {
 return this.room.memory.jobs[job].tasks.includes(this.id);
};
//get a particular task by converting the set to an array with the spread operator
StructureContainer.prototype.getTaskAt = function (index, job) {
 return this.room.memory.jobs[job].tasks[index];
};
//get a tasks' index
StructureContainer.prototype.getTaskIndex = function (job) {
 return this.room.memory.jobs[job].tasks.indexOf(this.id);
};

StructureController.prototype.report = function () {
 return true;
};

StructureExtension.prototype.debrief = function () {
 return true;
};

//// WORKER PROTOTYPES////

//set a worker
Creep.prototype.setWorker = function (job) {
 this.room.memory.jobs[job].workers.push(this.name);
 this.room.memory.jobs[job].workers = [...new Set(this.room.memory.jobs[job].workers)];
};
//get a worker's index
Creep.prototype.getWorkerIndex = function (job) {
 return this.room.memory.jobs[job].workers.indexOf(this.name);
};
//delete a worker
Creep.prototype.deleteWorker = function (job) {
 if (this.room.memory.jobs[job].workers.indexOf(this.name) > -1) {
  array.splice(this.room.memory.jobs[job].workers.indexOf(this.name), 1);
 }
};
//check if a creep id is in our worker set
Creep.prototype.isWorker = function (job) {
 return this.room.memory.jobs[job].workers.includes(this.name);
};
//get a particular worker
Creep.prototype.getWorkerAt = function (index, job) {
 return this.room.memory.jobs[job].workers[index];
};
//get a worker index
Creep.prototype.getWorkerIndex = function (job) {
 return this.room.memory.jobs[job].workers.indexOf(this.name);
};

//return the worker set in array form
function getWorkersArray(job, room) {
 return room.memory.jobs[job].workers;
}

//delete all a creep from all worker arrays
function deleteWorkerAll(obj, room, name) {
 for (var job in obj.jobs) {
  if (Memory.rooms[room].jobs[job].workers.indexOf(name) > -1) {
   Memory.rooms[room].jobs[job].workers.splice(Memory.rooms[room].jobs[job].workers.indexOf(name), 1);
  }
  if (Memory.rooms[room].jobs.deposit.tasks.indexOf(name) > -1) {
   Memory.rooms[room].jobs.deposit.tasks.splice(Memory.rooms[room].jobs.deposit.tasks.indexOf(name), 1);
  }
 }
}

//// TASK ASSIGNMENT ////

//get current assignment
Creep.prototype.getAssignment = function (job, taskID) {
 return this.memory.jobs[job];
};
//set current assignment
Creep.prototype.setAssignment = function (job, taskID) {
 //assignments are stored creep local
 this.memory.jobs[job] = taskID;
};
//delete an assignment from room memory and creep memory
Creep.prototype.deleteAssignment = function (job) {
 //for the assignment reference
 this.memory.jobs[job] = null;
};
//delete all assignments a creep has
Creep.prototype.deleteAllAssignments = function () {
 for (var job in this.memory.jobs) {
  //delete the assignment entry
  this.deleteAssignment(job);
 }
};

Creep.prototype.debrief = function () {
 if (this.carry.energy === this.carryCapacity) {
  console.log(this + ' deleting ' + job);
  this.deleteTask('deposit');
 }
 if (this.hits === this.hitsMax) {
  this.deleteTask('fix');
 }
};

Creep.prototype.manualDelete = function (job, id) {
 this.room.memory.jobs[job].tasks.splice(this.room.memory.jobs[job].tasks.indexOf(id), 1);
 this.memory.jobs[job] = null;
};

////  WHEN A CREEP IS THE TARGET OF A TASK ////
Creep.prototype.createTask = function (job) {
 this.room.memory.jobs[job].tasks.push(this.id);
 this.room.memory.jobs[job].tasks = [...new Set(this.room.memory.jobs[job].tasks)];
};
//delete a task
Creep.prototype.deleteTask = function (job) {
 if (!this.room.memory.jobs[job].tasks.indexOf(this.id)) {
  this.room.memory.jobs[job].tasks.splice(this.room.memory.jobs[job].tasks.indexOf(this.id), 1);
 }
};
//check if a cs id is in our task set
Creep.prototype.isTask = function (job) {
 return this.room.memory.jobs[job].tasks.includes(this.id);
};
//get a particular task by converting the set to an array with the spread operator
Creep.prototype.getTaskAt = function (index, job) {
 return this.room.memory.jobs[job].tasks[index];
};
//get a tasks' index
Creep.prototype.getTaskIndex = function (job) {
 return this.room.memory.jobs[job].tasks.indexOf(this.id);
};

//assign a task in the task array to a creep in the corresponding worker array
Creep.prototype.assignTask = function (job) {
 //first be sure the creep is in the worker array
 if (!this.isWorker(job)) {
  //if not add it
  //console.log('adding ' + this.name + ' to ' + job);
  this.setWorker(job);
 }
 //then get the index of the worker, wIndex
 let wIndex = this.getWorkerIndex(job);
 let aIndex = 0;
 //console.log(job + ' a:w :: ' + aIndex + ':' + wIndex);
 //get the task at wIndex
 let task = getTaskAt(wIndex, job, this.room);
 //if there is a job in the tasks set at wIndex
 if (task) {
  this.setAssignment(job, task);
  return true;
 } else {
  //console.log('task at bad ' + job + ' index: ' + task);
  //there is no job at that index, we need to assign this creep to a job parallel to wIndex
  let tasksLength = getTasksArray(job, this.room).length;
  let workersLength = getWorkersArray(job, this.room).length;
  //if we have more workers than tasks
  if (workersLength > tasksLength && workersLength && tasksLength) {
   aIndex = wIndex % tasksLength;
   //console.log(job + ' a:w :: ' + aIndex + ':' + wIndex);
  } else {
   //we have equal to or less workers than tasks
   aIndex = wIndex;
  }
  //set assignment
  this.setAssignment(job, getTaskAt(aIndex, job, this.room));
  return true;
 }
 return false;
};

Creep.prototype.collectAura = function () {
 //console.log(nearExt);
 for (let e in this.room.memory.jobs.collect.tasks) {
  //console.log(this.room.memory.jobs.collect.tasks[e]);
  if (this.withdraw(Game.getObjectById(this.room.memory.jobs.collect.tasks[e]), RESOURCE_ENERGY) === 0) {
   return Memory.emoji.sogood;
  }
 }
};

Creep.prototype.sweepAura = function () {
 //console.log(nearExt);
 for (let e in this.room.memory.jobs.sweep.tasks) {
  //console.log(this.room.memory.jobs.collect.tasks[e]);
  if (this.pickup(Game.getObjectById(this.room.memory.jobs.sweep.tasks[e]), RESOURCE_ENERGY) === 0) {
   return Memory.emoji.sogood;
  }
 }
};

Creep.prototype.constructAura = function () {
 //console.log(nearExt);
 for (let e in this.room.memory.jobs.construct.tasks) {
  //console.log(this.room.memory.jobs.deposit.tasks[e]);
  if (this.build(Game.getObjectById(this.room.memory.jobs.construct.tasks[e]), RESOURCE_ENERGY) === 0) {
   return Memory.emoji.sogood;
  }
 }
};
Creep.prototype.depositAura = function () {
 for (let e in this.room.memory.jobs.deposit.tasks) {
  //console.log(this.room.memory.jobs.deposit.tasks[e]);
  if (Game.getObjectById(this.room.memory.jobs.deposit.tasks[e])) {
   if (this.transfer(Game.getObjectById(this.room.memory.jobs.deposit.tasks[e]), RESOURCE_ENERGY) === 0) {
    return Memory.emoji.sogood;
   }
  } else {
   this.manualDelete('deposit', e);
  }
 }
};

Creep.prototype.assignSpot = function () {
 for (let source in this.room.sources) {
  if (this.room.lastAssignedSource == source) {
   continue;
  }
  for (let spot in this.room.sources[source].spots) {
   if (!Game.getObjectById(this.room.sources[source].spots[spot])) {
    this.room.sources[source].spots[spot] = this.id;
    this.room.lastAssignedSource = source;
    return source;
   } else if (this.memory.priority > Game.getObjectById(this.room.sources[source].spots[spot]).memory.priority) {
    Game.getObjectById(this.room.sources[source].spots[spot]).suicide();
    this.room.sources[source].spots[spot] = this.id;
    this.room.lastAssignedSource = source;
    return source;
   }
  }
 }
 return this.pos.findClosestByRange(FIND_SOURCES).id;
};

StructureExtension.prototype.report = function () {
 if (this.energy < this.energyCapacity) {
  this.createTask('deposit');
 }
 if (this.hits < this.hitsMax) {
  this.createTask('fix');
 }
};

StructureExtension.prototype.debrief = function () {
 if (this.energy === this.energyCapacity) {
  this.deleteTask('deposit');
 }
 if (this.hits === this.hitsMax) {
  this.deleteTask('fix');
 }
};

//// STRUCTURE TASK QUEUE SYSTEM ////

OwnedStructure.prototype.createTask = function (job) {
 this.room.memory.jobs[job].tasks.push(this.id);
 this.room.memory.jobs[job].tasks = [...new Set(this.room.memory.jobs[job].tasks)];
};
//delete a task
OwnedStructure.prototype.deleteTask = function (job) {
 if (!this.room.memory.jobs[job].tasks.indexOf(this.id)) {
  this.room.memory.jobs[job].tasks.splice(this.room.memory.jobs[job].tasks.indexOf(this.id), 1);
 }
};
//check if a cs id is in our task set
OwnedStructure.prototype.isTask = function (job) {
 return this.room.memory.jobs[job].tasks.includes(this.id);
};
//get a tasks' index
OwnedStructure.prototype.getTaskIndex = function (job) {
 return this.room.memory.jobs[job].tasks.indexOf(this.id);
};
//return the task set in array form
function getTasksArray(job, room) {
 return room.memory.jobs[job].tasks;
}
//get a particular task
function getTaskAt(index, job, room) {
 return room.memory.jobs[job].tasks[index];
}

Resource.prototype.report = function () {
 this.createTask('sweep');
};

Resource.prototype.debrief = function (job) {
 this.deleteTask('sweep');
};

Resource.prototype.createTask = function (job) {
 this.room.memory.jobs.sweep.tasks.push(this.id);
 this.room.memory.jobs.sweep.tasks = [...new Set(this.room.memory.jobs.sweep.tasks)];
};
//delete a task
Resource.prototype.deleteTask = function (job) {
 if (this.room.memory.jobs.sweep.tasks.indexOf(this.id) > -1) {
  this.room.memory.jobs.sweep.tasks.splice(this.room.memory.jobs.sweep.tasks.indexOf(this.id), 1);
 }
};
//check if a cs id is in our task set
Resource.prototype.isTask = function (job) {
 return this.room.memory.jobs.sweep.tasks.includes(this.id);
};
//get a tasks' index
Resource.prototype.getTaskIndex = function (job) {
 return this.room.memory.jobs.sweep.tasks.indexOf(this.id);
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
 //var mt = r.memory.jobs.mine.tasks;
 //Peek at the result by uncommenting the line below
 //console.log("sources: "+JSON.stringify(sources));
 sources.forEach(
  function (source) {
   //Iterate over the source
   //console.log("source: "+source)
   //search the 3x3 grid with the source at the center
   var sid = source.id;
   //console.log('adding ' + sid + ' to jobs list');
   r.memory.jobs.mine.tasks.push(sid);
   //r.memory.jobs.list.add(sid);
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
     if (!r.memory.sources) {
      r.memory.sources = {};
     }
     if (!r.memory.sources[sid]) {
      r.memory.sources[sid] = {};
     }
     if (!r.memory.sources[sid].spots) {
      r.memory.sources[sid].spots = {};
     }
     if (!r.memory.sources[sid].spots[miningspots]) {
      r.memory.sources[sid].spots[miningspots] = 'empty';
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

StructureSpawn.prototype.report = function () {
 if (this.energy < this.energyCapacity) {
  this.createTask('deposit');
 }
 if (this.hits < this.hitsMax) {
  this.createTask('fix');
 }
};

StructureSpawn.prototype.debrief = function () {
 if (this.energy === this.energyCapacity) {
  this.deleteTask('deposit');
 }
 if (this.hits === this.hitsMax) {
  this.deleteTask('fix');
 }
};

StructureSpawn.prototype.spawnCreep = function (creepRecipe, rcl) {
 switch (this.createCreep(creepRecipe.parts[rcl], new Date().getUTCMilliseconds(), creepRecipe.options)) {
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
  this.createTask('collect');
 }
 if (this.hits < this.hitsMax) {
  this.createTask('fix');
 }
};
StructureStorage.prototype.debrief = function () {
 if (this.store.energy === 0) {
  this.deleteTask('collect');
 }
 if (this.hits === this.hitsMax) {
  this.deleteTask('fix');
 }
};

StructureTower.prototype.report = function () {
 if (this.energy < this.energyCapacity) {
  this.createTask('deposit');
 }
 if (this.hits < this.hitsMax) {
  this.createTask('fix');
 }
};

StructureTower.prototype.debrief = function () {
 if (this.energy === this.energyCapacity) {
  this.deleteTask('deposit');
 }
 if (this.hits === this.hitsMax) {
  this.deleteTask('fix');
 }
};

Creep.prototype.frog = function () {
 //state flipper
 if (this.carry.energy === 0) {
  this.memory.state = 0;
 }
 if (this.carry.energy < this.carryCapacity) {
  this.createTask('deposit');
 }
 //if this has energy
 else if (this.carry.energy === this.carryCapacity) {
  this.memory.state = 1;
  this.deleteTask('deposit');
 }
 this.constructAura();
 //if this has energy
 if (this.memory.state) {
  this.collectAura();
  this.sweepAura();
  this.depositAura();
  return this.construct();
 }
 //if this has no energy
 else {
  this.collectAura();
  this.sweepAura();
  return this.collect();
 }
};

Creep.prototype.newt = function () {
 //state flipper
 if (this.carry.energy < this.carryCapacity) {
  this.memory.state = 0;
 }
 //if creep has energy
 else if (this.carry.energy === this.carryCapacity) {
  this.memory.state = 1;
 }

 //if this has energy
 if (this.memory.state) {
  return this.deposit();
 }
 //if this has no energy
 else {
  return this.collect();
 }
};

//we currently have no interest in taking rooms we can't build spawns in, so
//initialize room goes here with our first building in any room
function initialize(r) {

 //initialize room if not already initialized
 if (Game.time % 5) {
  Memory.rooms[r.name] = {};
 }
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
   list: [],
   whack: {
    workers: [],
    tasks: []
   },
   construct: {
    workers: [],
    tasks: []
   },
   deposit: {
    workers: [],
    tasks: []
   },
   collect: {
    workers: [],
    tasks: []
   },
   aid: {
    workers: [],
    tasks: []
   },
   fix: {
    workers: [],
    tasks: []
   },
   sweep: {
    workers: [],
    tasks: []
   },
   mine: {
    workers: [],
    tasks: []
   },
   eat: {
    workers: [],
    tasks: []
   },
   upgrade: {
    workers: [],
    tasks: []
   },
  };
 }
 if (!Memory.rooms[r.name].miningSpots) {
  Memory.rooms[r.name].miningSpots = r.miningSpots(r.find(FIND_SOURCES));
 }
}

function queen(spawn) {
 const r = spawn.room;
 initialize(r);
 if (r.memory.jobs.upgrade.tasks) {
  r.memory.jobs.upgrade.tasks.push(r.controller.id);
  r.memory.jobs.deposit.tasks.push(spawn.id);
  r.memory.jobs.eat.tasks.push(spawn.id);
 }
 const containers = r.find(FIND_STRUCTURES, { filter: (s) => s.structureType == 'container' });
 if (containers.length) {
  //console.log(containers);
  for (let container in containers) {
   containers[container].report();
  }
 }
 const dust = r.find(FIND_DROPPED_RESOURCES);
 if (dust.length) {
  for (let d in dust) {
   var mote = dust[d];
   r.memory.jobs.sweep.tasks.push(dust[d].id);
  }
 }
 const rcl = r.controller.level;
 //spawn logic
 //rcl switch
 let frog = Memory.recipes.frog;
 let toad = Memory.recipes.toad;
 let newt = Memory.recipes.newt;
 let newtCap = (Math.min(r.memory.jobs.collect.tasks.length, r.memory.jobs.deposit.tasks.length) ? Math.min(r.memory.jobs.collect.tasks.length, r.memory.jobs.deposit.tasks.length) : 0);
 let frogCap = (Math.max(r.memory.jobs.construct.tasks.length, dust.length + r.memory.sc) ? Math.max(r.memory.jobs.construct.tasks.length, dust.length + r.memory.sc) : 1);
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
 if (r.roleCount('frog') < frogCap) {
  //console.log(frogCap);
  let creepName = spawn.spawnCreep(frog, rcl + 1);
  if (!creepName) {
   creepName = spawn.spawnCreep(frog, rcl);
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
 }
}

Creep.prototype.toad = function () {
 //state flipper
 if (this.carry.energy === 0) {
  this.memory.state = 0;
 }
 //if creep has energy
 else if (this.carry.energy >= 40) {
  this.memory.state = 1;
 }

 //if this has energy
 if (this.memory.state) {
  //drop container on mine
  if (!this.memory.builtcontainer) {
   if (this.room.createConstructionSite(this.pos, STRUCTURE_CONTAINER) === 0 || this.room.lookForAt(LOOK_CONSTRUCTION_SITES, this.pos).length) {
    this.memory.builtcontainer = 1;
    return Memory.emoji.frog;
   } else {
    this.memory.builtcontainer = 2;
   }
  }
  if (this.memory.builtcontainer == 1) {
   if (this.room.memory.jobs.construct.tasks.length) {
    return this.construct();
   } else {
    this.memory.builtcontainer = null;
   }
  } else {
   return this.mine();
  }
  return Memory.emoji.frog;
 }
 //if this has no energy
 else {
  //console.log('frog this: ' + JSON.stringify(this));
  return this.mine();
 }
};

function tower(structure) {
 var nearenemies = structure.pos.findInRange(FIND_HOSTILE_CREEPS, 15);
 if (!Memory.towers) {
  Memory.towers = {};
 }
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
  var damaged = structure.room.memory.jobs.fix.tasks;
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

//first set memory structures
if (!Memory.recipes) {
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
  pickup: '✨',
  suicide: '💮',
  sogood: '✨💨🐸✨',
  hop: '💨'
 };
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
//export my loop logic
module.exports.loop = function () {
 //start with the queen so initialization happens first
 for (let id in Game.structures) {
  var structure = Game.structures[id];
  switch (structure.structureType) {
  case 'spawn':
   if (structure.memory.queen) {
    queen(structure);
   }
   break;
  case 'tower':
   tower(structure);
   break;
  }
  structure.report();
 }
 //then trigger reports for construction sites
 for (let id in Game.constructionSites) {
  Game.getObjectById(id).room.memory.jobs.construct.tasks.push(id);
  Game.getObjectById(id).room.memory.jobs.construct.tasks = [...new Set(Game.getObjectById(id).room.memory.jobs.construct.tasks)];
 }
 //then trigger creep behavior
 for (let name in Memory.creeps) {
  if (!Game.creeps[name] && [...Game.creeps].length + 2 > [...Memory.creeps].length) {
   //clear creep work registration
   console.log('DEAD: ' + name);
   console.log(JSON.stringify(Memory.creeps[name]));
   deleteWorkerAll(Memory.creeps[name], Memory.creeps[name].room, name);
   delete Memory.creeps[name];
   continue;
  } else if (Game.creeps[name]) {
   var creep = Game.creeps[name];
   if (!creep.memory.room) {
    creep.memory.room = creep.room.name;
   }
   switch (creep.memory.role) {
   case 'redspawn':
    redspawn(creep);
    break;
   case 'tadpole':
    tadpole(creep);
    break;
   case 'frog':
    creep.say(creep.frog());
    break;
   case 'toad':
    creep.depositAura();
    creep.sweepAura();
    creep.say(creep.toad());
    break;
   case 'newt':
    creep.collectAura();
    creep.sweepAura();
    creep.say(creep.newt());
    creep.depositAura();
    break;
   case 'squatter':
    squatter(creep);
    break;
   case 'poliwog':
    poliwog(creep);
    break;
   }
  }
 }
};
//graphs
//collect_stats();

/*jshint -W008 */
//// HEAL PLUS ////
Creep.prototype.aid = function () {
 //debrief task first
 if (!this.room.memory.jobs.aid.tasks.indexOf(this.memory.jobs.aid)) {
  this.assignTask('aid');
 }
 try {
  Game.getObjectById(this.memory.jobs.aid).debrief();
 } catch (ex) {
  if (this.room.memory.jobs.aid.tasks.length) {
   Game.getObjectById(this.memory.jobs.aid).deleteTask('aid');
  }
 }
 //debrief only removes task from memory if appropriate and does not affect creep memory
 switch (this.heal(Game.getObjectById(this.memory.jobs.aid))) {
 case 0:
  return Memory.emoji.aid;
 case -7:
  //invalid target, remove room memory
  Game.getObjectById(this.memory.jobs.aid).deleteTask('aid');
  //we also need to clear the assignment on the creep memory
  this.deleteAssignment('aid');
  //last, we have to decide if we should assign a new task
  if (getTasksArray('aid').length) {
   this.assignTask('aid');
   return Memory.emoji.oops + Memory.emoji.aid + Memory.emoji.oops;
  } else {
   return this.eat();
  }
  return Memory.emoji.oops + Memory.emoji.aid + Memory.emoji.oops;
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
  return Memory.emoji.aid;
 case -12:
  //if for any reason the wrong creep is in the build workers
  this.deleteAssignment('aid');
  this.deleteWorker('aid');
  return Memory.emoji.oops + Memory.emoji.aid + Memory.emoji.oops;
 }
};

/*jshint -W008 */
/// WITHDRAW PLUS ///
Creep.prototype.collect = function () {
 //debrief task first
 if (!this.memory.jobs.collect) {
  this.assignTask('collect');
 }
 try {
  Game.getObjectById(this.memory.jobs.collect).debrief();
 } catch (ex) {
  if (this.room.memory.jobs.collect.tasks.length) {
   this.manualDelete('collect', this.memory.jobs.collect);
  }
 }
 //debrief only removes task from memory if appropriate and does not affect creep memory
 switch (this.withdraw(Game.getObjectById(this.memory.jobs.collect), RESOURCE_ENERGY)) {
 case 0:
  Game.getObjectById(this.memory.jobs.collect).debrief();
  return Memory.emoji.collect;
 case -6:
 case -7:
 case -10:
  //we need to clear the creep memory to completely remove the bad id
  this.deleteAssignment('collect');
  //assign a new task
  if (getTasksArray('collect', this.room).length) {
   return Memory.emoji.oops + Memory.emoji.collect + Memory.emoji.oops;
  } else {
   //if there are no tasks in the collect
   if (this.memory.role == 'frog' || this.role == 'toad') {
    //if the creep can mine do it
    return this.mine();
   } else {
    //otherwise attempt to sweep
    return this.sweep();
   }
   return Memory.emoji.oops + Memory.emoji.collect + Memory.emoji.oops;
  }
  return Memory.emoji.oops + Memory.emoji.collect + Memory.emoji.oops;
 case -8:
  //creep is full
  this.memory.state = 1;
  return Memory.emoji.frog;
 case -9:
  //set move
  if (this.moveTo(Game.getObjectById(this.memory.jobs.collect), {
    reusePath: 1,
    visualizePathStyle: {
     fill: 'transparent',
     stroke: '#eeff99',
     lineStyle: 'dashed',
     strokeWidth: .15,
     opacity: .1
    }
   }) == -2) {
   this.assignTask('collect');
  }
  return Memory.emoji.hop;
 }
 return Memory.emoji.oops;
};

/*jshint -W008 */
//// BUILD PLUS ////
Creep.prototype.construct = function () {
 //debrief task first
 if (!this.memory.jobs.construct) {
  this.assignTask('construct');
 }

 try {
  Game.getObjectById(this.memory.jobs.construct).debrief();
 } catch (ex) {
  if (this.room.memory.jobs.construct.tasks.length) {
   //console.log(this.name);
   this.manualDelete('construct', this.memory.jobs.construct);
  }
 }
 //debrief only removes task from memory if appropriate and does not affect creep memory
 switch (this.build(Game.getObjectById(this.memory.jobs.construct))) {
 case 0:
  return Memory.emoji.construct;
 case -6:
  //this should never occur but it's good to have preventative measures
  this.memory.state = 0;
  return Memory.emoji.frog;
 case -7:
  //if we get a -7 it means no target found
  //since construct tasks are pulled directly from Game.constructionSites we know our construct tasks are valid
  //this means the site was built successfully and we need to remove the task
  //we also need to clear the assignment
  this.deleteAssignment('construct');
  //last, we have to decide if we should assign a new task
  if (getTasksArray('construct', this.room).length) {
   this.assignTask('construct');
   return Memory.emoji.construct;
  } else {
   return this.upgrade();
  }
  return Memory.emoji.oops + Memory.emoji.construct + Memory.emoji.oops;
 case -9:
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
  return Memory.emoji.frog;
 case -12:
  //if for any reason the wrong creep is in the construct workers
  this.deleteAssignment('construct');
  this.deleteWorker('construct');
  return Memory.emoji.oops + Memory.emoji.construct + Memory.emoji.oops;
 case -14:
  //remove the construction site
  Game.getObjectById(this.memory.jobs.construct).remove();
  return Memory.emoji.oops + Memory.emoji.construct + Memory.emoji.oops;
 }
};

/*jshint -W008 */
/// TRANSFER PLUS ///
Creep.prototype.deposit = function () {
 //debrief task first
 if (!this.memory.jobs.deposit) {
  this.assignTask('deposit');
 }
 try {
  Game.getObjectById(this.memory.jobs.deposit).debrief();
 } catch (ex) {
  if (this.room.memory.jobs.deposit.tasks.length) {
   //console.log(this.name);
   this.manualDelete('deposit', this.memory.jobs.deposit);
  }
 }
 //debrief only removes task from memory if appropriate and does not affect creep memory
 switch (this.transfer(Game.getObjectById(this.memory.jobs.deposit), RESOURCE_ENERGY)) {
 case 0:
  return Memory.emoji.deposit;
 case -7:
 case -8:
 case -10:
  //assign a new task
  if (getTasksArray('deposit', this.room).length) {
   this.assignTask('deposit');
   //attempt to deposit again
   return Memory.emoji.oops + Memory.emoji.deposit + Memory.emoji.oops;
  } else {
   //if there are no tasks in the deposit set
   if (_.includes(this.body, WORK)) {
    //if the creep can upgrade do it
    return this.upgrade();
   } else {
    //otherwise attempt to eat
    return this.eat();
   }
   return Memory.emoji.oops + Memory.emoji.deposit + Memory.emoji.oops;
  }
  return Memory.emoji.oops + Memory.emoji.deposit + Memory.emoji.oops;
 case -6:
  //creep is empty
  this.memory.state = 0;
  return Memory.emoji.frog;
 case -9:
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
};

/*jshint -W008 */
//// RENEWCREEP PLUS ////
Creep.prototype.eat = function () {
 if (!this.memory.jobs.eat) {
  this.assignTask('eat');
 }
 this.transfer(Game.getObjectById(this.memory.jobs.eat), RESOURCE_ENERGY);
 switch (Game.getObjectById(this.memory.jobs.eat).renewCreep(this)) {
 case 0:
  //no need to clear memory for eat, creep eat at their convenience as an endpoint
  return Memory.emoji.eat;
 case -6:
 case -7:
 case -8:
  //creep timer is full OR
  //spawn doesn't have enough energy OR
  //object is not a creep
  //move at random for now
  this.move(Math.floor(Math.random() * (8)));
  return Memory.emoji.oops + Memory.emoji.eat + Memory.emoji.oops;
 case -9:
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
  return Memory.emoji.frog;
 }
};


// LAZINESS PROTOTYPES //

//sacrifice action
Creep.prototype.sacrifice = function () {
 return Game.getObjectById(this.memory.jobs.eat).recycleCreep(this);
};

/*jshint -W008 */
//// REPAIR PLUS ////
Creep.prototype.fix = function () {
 //debrief task first
 if (!this.memory.jobs.fix) {
  this.assignTask('fix');
 }
 try {
  Game.getObjectById(this.memory.jobs.fix).debrief();
 } catch (ex) {
  if (this.room.memory.jobs.fix.tasks.length) {
   Game.getObjectById(this.memory.jobs.construct).deleteTask('fix');
  }
 }
 //debrief only removes task from memory if appropriate and does not affect creep memory
 switch (this.repair(Game.getObjectById(this.memory.jobs.fix))) {
 case 0:
  return Memory.emoji.fix;
 case -6:
  //this should never occur but it's good to have preventative measures
  this.memory.state = 0;
  return Memory.emoji.frog;
 case -7:
  //invalid target, remove room memory
  Game.getObjectById(this.memory.jobs.fix).deleteTask('fix');
  //we also need to clear the assignment on the creep memory
  this.deleteAssignment('fix');
  //last, we have to decide if we should assign a new task
  if (getTasksArray('fix').length) {
   this.assignTask('fix');
   return Memory.emoji.oops + Memory.emoji.fix + Memory.emoji.oops;
  } else {
   this.memory.state = 0;
  }
  return Memory.emoji.oops + Memory.emoji.fix + Memory.emoji.oops;
 case -9:
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
 case -12:
  //if for any reason the wrong creep is in the build workers
  this.deleteAssignment('fix');
  this.deleteWorker('fix');
  return Memory.emoji.oops + Memory.emoji.fix + Memory.emoji.oops;
 }
};

/*jshint -W008 */
//// HARVEST PLUS ////
Creep.prototype.mine = function () {
 //this.assignTask('mine');
 try {
  switch (this.harvest(Game.getObjectById(this.memory.jobs.mine))) {
  case 0:
   //no need to clear memory for mine, sources are permanent
   //upgrade if able
   if (this.room.rcl > 1) {
    if (this.upgradeController(this.room.controller) === 0) {
     return Memory.emoji.sogood;
    }
   }
   if (this.role == 'toad') {
    var source = Game.getObjectById(this.memory.jobs.mine);
    var container = source.pos.findInRange(FIND_STRUCTURES, 2, { filter: (c) => c.structureType == STRUCTURE_CONTAINER });
    if (container.length) {
     this.memory.container = container[0].id;
    }
    if (this.memory.container && !this.pos.isEqualTo(this.memory.container.pos)) {
     this.moveTo(Game.getObjectById(this.memory.container));
     return Memory.emoji.hop;
    }
   }
   return Memory.emoji.mine;
  case -5:
  case -7:
   //extractor not found OR
   //not a valid source object
   this.assignTask('mine');
   return Memory.emoji.oops + Memory.emoji.mine + Memory.emoji.oops;
  case -6:
   //source has no energy
   if (this.memory.role == 'toad') {
    //toads eat if no energy in source
    return this.eat();
   } else if (this.memory.role == 'frog') {
    //frogs look for dropped energy before eating
    return this.sweep();
   }
   return Memory.emoji.oops + Memory.emoji.mine + Memory.emoji.oops;
  case -9:
   //set move
   this.moveTo(Game.getObjectById(this.memory.jobs.mine), {
    visualizePathStyle: {
     reusePath: 10,
     fill: 'transparent',
     stroke: '#eeff99',
     lineStyle: 'solid',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return Memory.emoji.hop;
  case -12:
   //no work parts
   this.deleteWorker('mine');
   this.deleteAssignment('mine');
   return Memory.emoji.oops + Memory.emoji.mine + Memory.emoji.oops;
  }
 } catch (ex) {
  //console.log(ex);
  this.assignTask('mine');
 }
};

/*jshint -W008 */
/// PICKUP PLUS ///
Creep.prototype.sweep = function () {
 //debrief task first
 if (!this.memory.jobs.sweep) {
  this.assignTask('sweep');
 }
 try {
  Game.getObjectById(this.memory.jobs.sweep).debrief();
 } catch (ex) {
  if (this.room.memory.jobs.sweep.tasks.length) {
   this.manualDelete('sweep', this.memory.sweep);
  }
 }
 //debrief only removes task from memory if appropriate and does not affect creep memory
 switch (this.pickup(Game.getObjectById(this.memory.jobs.sweep))) {
 case 0:
  //memory is already cleared
  return Memory.emoji.sweep;
 case -7:
 case -8:
  //we need to clear the assignment from the assignment list as well as the job list in room memory
  this.deleteAssignment('sweep');
  //assign a new task
  if (getTasksArray('sweep', this.room).length) {
   this.assignTask('sweep');
   return Memory.emoji.oops + Memory.emoji.sweep + Memory.emoji.oops;
  } else {
   //if there are no tasks in the sweep set
   if (_.includes(this.body, WORK)) {
    //if the creep can upgrade do it
    return this.upgrade();
   } else {
    //otherwise attempt to eat
    return this.eat();
   }
   return Memory.emoji.oops + Memory.emoji.sweep + Memory.emoji.oops;
  }
  return Memory.emoji.oops + Memory.emoji.sweep + Memory.emoji.oops;
 case -9:
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
  return Memory.emoji.frog;
 }
};

/*jshint -W008 */
//// UPGRADECONTROLLER PLUS ////
Creep.prototype.upgrade = function () {
 switch (this.upgradeController(Game.getObjectById(this.memory.jobs.upgrade))) {
 case 0:
  //no need to clear memory for upgrade, controller is permanent
  return Memory.emoji.upgrade;
 case -6:
  //this should never occur but it's good to have preventative measures
  this.memory.state = 0;
  return Memory.emoji.oops + Memory.emoji.upgrade + Memory.emoji.oops;
 case -7:
  //we need to clear the assignment
  this.deleteAssignment('upgrade');
  //reset task assignment
  if (getTasksArray('upgrade', this.room).length) {
   //task is there
   this.assignTask('upgrade');
   //try again
  }
  return Memory.emoji.oops + Memory.emoji.upgrade + Memory.emoji.oops;
 case -9:
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
  return Memory.emoji.frog;
 }
};

/*jshint -W008 */
//// ATTACK PLUS ////
Creep.prototype.whack = function () {
 //debrief task first
 if (!this.memory.jobs.whack) {
  this.assignTask('whack');
 }
 try {
  Game.getObjectById(this.memory.jobs.whack).debrief();
 } catch (ex) {
  if (this.room.memory.jobs.whack.tasks.length) {
   this.manualDelete('whack', this.memory.whack);
  }
 }
 //debrief only removes task from memory if appropriate and does not affect creep memory
 switch (this.attack(Game.getObjectById(this.memory.jobs.whack))) {
 case 0:
  //clear id from room's task set
  Game.getObjectById(this.memory.jobs.whack).deleteTask('whack');
  return Memory.emoji.whack;
 case -7:
  //invalid target
  Game.getObjectById(this.memory.jobs.whack).deleteTask('whack');
  //we also need to clear the assignment
  this.deleteAssignment('whack');
  //last, we have to decide if we should assign a new task
  if (getTasksArray('whack').length) {
   this.assignTask('whack');
   return Memory.emoji.oops + Memory.emoji.whack + Memory.emoji.oops;
  } else {
   this.eat();
   return Memory.emoji.oops + Memory.emoji.whack + Memory.emoji.oops;
  }
  return Memory.emoji.oops + Memory.emoji.whack + Memory.emoji.oops;
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
 case -12:
  //if for any reason the wrong creep is in the build workers
  this.deleteAssignment('whack');
  this.deleteWorker('whack');
  return Memory.emoji.oops + Memory.emoji.whack + Memory.emoji.oops;
 }
};
