Object.defineProperty(Array.prototype, 'add', {
 enumerable: false,
 value: function (element) {
  if (this.length) {
   var set = new Set(this);
   //console.log('set as array before splice');
   //console.log(this);
   //console.log([...set]);
   console.log('set size: ' + set.size);
   console.log('does set have ' + element + ': ' + set.has(element));
   if (!set.has(element)) {
    set = set.add(element);
   }
   console.log('set size after adding ' + element + ': ' + set.size);
   set.forEach(function (value1, value2, set) {
    //console.log('s[' + value1 + '] = ' + value2);
   });
   this.splice(0, this.length, ...set);
   console.log('after splice');
   console.log(...set);
   console.log(this);
  } else {
   this.push(element);
  }
 }
});

Object.defineProperty(Array.prototype, 'delete', {
 enumerable: false,
 value: function (element) {
  if (this.length) {
   var set = new Set(this);
   if (set.has(element)) {
    set = set.delete(element);
   }
   this.splice(0, this.length, ...set);
  }
  return this;
 }
});

Object.defineProperty(Array.prototype, 'has', {
 enumerable: false,
 value: function (element) {
  let arr = this;
  var set = new Set(arr);
  return set.has(element);
 }
});

ConstructionSite.prototype.report = function () {
 //add to sweep set
 this.createTask('construct');
};
//this gets called every time a creep uses build since the construction sites add themselves every tick
ConstructionSite.prototype.debrief = function (job) {
 this.deleteTask('construct');
};

//don't need to report because we do that in our main
//set a task
ConstructionSite.prototype.createTask = function (job) {
 this.room.memory.jobs[job].tasks.add(this.id);
 this.room.memory.jobs.list.add(this.id);
};
//delete a task
ConstructionSite.prototype.deleteTask = function (job) {
 this.room.memory.jobs[job].tasks.delete(this.id);
 this.room.memory.jobs.list.delete(this.id);
};
//check if a cs id is in our task set
ConstructionSite.prototype.isTask = function (job) {
 this.room.memory.jobs[job].tasks.has(this.id);
};
//get a particular task by converting the set to an array with the spread operator
ConstructionSite.prototype.getTaskAt = function (index, job) {
 return [...this.room.memory.jobs[job].tasks][index];
};
//get a tasks' index
ConstructionSite.prototype.getTaskIndex = function (job) {
 return [...this.room.memory.jobs[job].tasks].indexOf(this.id);
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
 if (this.store.energy === 0) {
  this.deleteTask('collect');
 }
 if (this.hits > 10000) {
  this.deleteTask('fix');
 }
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
 this.room.memory.jobs[job].workers.add(this.name);
};
//delete a worker
Creep.prototype.deleteWorker = function (job) {
 this.room.memory.jobs[job].workers.delete(this.name);
};
//check if a creep is in our worker set
Creep.prototype.isWorker = function (job) {
 this.room.memory.jobs[job].workers.has(this.name);
};
//get a particlar worker
Creep.prototype.getWorkerAt = function (index, job) {
 return this.room.memory.jobs[job].workers[index];
};
//get a worker's index
Creep.prototype.getWorkerIndex = function (job) {
 return this.room.memory.jobs[job].workers.indexOf(this.name);
};
//return the worker set in array form
function getWorkersArray(job, room) {
 return room.memory.jobs[job].workers;
}
//delete all a creep from all worker arrays
Creep.prototype.deleteWorkerAll = function () {
 for (var job in this.memory.jobs) {
  //delete the assignment entry
  this.deleteWorker(job);
 }
};

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

//assign a task in the task array to a creep in the corresponding worker array
Creep.prototype.assignTask = function (job) {
 //first be sure the creep is in the worker array
 if (!this.isWorker(job)) {
  //if not add it
  console.log('adding' + this.name + ' to ' + job);
  this.setWorker(job);
 }
 //then get the index of the worker, wIndex
 let wIndex = this.getWorkerIndex(job);
 let aIndex = 0;
 //get the task at wIndex
 let task = getTaskAt(wIndex, job, this.room);
 //if there is a job in the tasks set at wIndex
 if (task) {
  this.setAssignment(job, task);
  return true;
 } else {
  //there is no job at that index, we need to assign this creep to a job parallel to wIndex
  let tasksLength = getTasksArray(job, this.room).length;
  let workersLength = getWorkersArray(job, this.room).length;
  //if we have more workers to tasks
  if (workersLength > tasksLength) {
   aIndex = wIndex % tasksLength;
  } else {
   //we have less then or equal workers to tasks
   aIndex = wIndex;
  }
  //set assignment
  this.setAssignment(job, getTaskAt(aIndex, job, this.room));
  return true;
 }
 this.setAssignment(job, getTaskAt(aIndex, job, this.room));
 return true;
};

Creep.prototype.gatherAura = function () {
 var shinies = this.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {
  filter: r => r.resourceType == RESOURCE_ENERGY
 });
 var moarshinies = this.pos.findInRange(FIND_STRUCTURES, 1, {
  filter: s => s.structureType == STRUCTURE_CONTAINER
 });
 var evenmoarshinies = this.pos.findInRange(FIND_STRUCTURES, 1, {
  filter: s => s.structureType == STRUCTURE_STORAGE
 });
 if (this.memory.role != 'newt' && this.memory.role != 'toad') {
  if (this.withdraw(evenmoarshinies[0], RESOURCE_ENERGY) === 0) {
   this.say(Memory.emoji.sogood);
  }
 }
 if (this.memory.role != 'toad') {
  if (this.withdraw(moarshinies[0], RESOURCE_ENERGY) === 0) {
   this.say(Memory.emoji.sogood);
  }
 }
 if (this.pickup(shinies[0]) === 0) {
  this.say(Memory.emoji.sogood);
 }
};

Creep.prototype.depositAura = function () {
 var nearExt = this.pos.findInRange(FIND_MY_STRUCTURES, 1, {
  filter: s => s.structureType == STRUCTURE_EXTENSION
 });
 //console.log(nearExt);
 for (let e in nearExt) {
  //console.log(nearExt[e]);
  if (this.transfer(nearExt[e], RESOURCE_ENERGY) === 0) {
   this.say(Memory.emoji.sogood);
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
    this.room.sources[source].spots[spot] = this.name;
    this.room.lastAssignedSource = source;
    return source;
   } else if (this.memory.priority > Game.getObjectById(this.room.sources[source].spots[spot]).memory.priority) {
    Game.getObjectById(this.room.sources[source].spots[spot]).suicide();
    this.room.sources[source].spots[spot] = this.name;
    this.room.lastAssignedSource = source;
    return source;
   }
  }
 }
 return this.pos.findClosestByRange(FIND_SOURCES).id;
};

StructureExtension.prototype.report = function () {
 if (this.store.energy > this.energyCapacity) {
  this.createTask('deposit');
 }
 if (this.hits < this.hitsMax) {
  this.createTask('fix');
 }
};

StructureExtension.prototype.debrief = function () {
 if (this.store.energy === this.energyCapacity) {
  this.deleteTask('deposit');
 }
 if (this.hits === this.hitsMax) {
  this.deleteTask('fix');
 }
};

//// STRUCTURE TASK QUEUE SYSTEM ////

//set a task
OwnedStructure.prototype.createTask = function (job) {
 this.room.memory.jobs[job].tasks.add(this.id);
 this.room.memory.jobs.list.add(this.id);
};
//delete a task
OwnedStructure.prototype.deleteTask = function (job) {
 this.room.memory.jobs[job].tasks.delete(this.id);
 this.room.memory.jobs.list.delete(this.id);
};
//check if a structure id is in our task set
OwnedStructure.prototype.isTask = function (job) {
 this.room.memory.jobs[job].tasks.has(this.id);
};
//get a tasks' index
OwnedStructure.prototype.getTaskIndex = function (job) {
 return this.room.memory.jobs[job].tasks.indexOf(this.id);
};
//return the task set in array form
function getTasksArray(job, room) {
 return room.memory.jobs[job].tasks;
}
//get a particular task by converting the set to an array with the spread operator
function getTaskAt(index, job, room) {
 return room.memory.jobs[job].tasks[index];
}

Resource.prototype.report = function () {
 this.enumerable = "enum";
 Object.defineProperty(this, "nonEnum", {
  enumerable: false,
  value: 'noEum'
 });
 //add to sweep set
 this.createTask('sweep');
};

Resource.prototype.debrief = function (job) {
 this.deleteTask('sweep');
};


//set a task
Resource.prototype.createTask = function (job) {
 this.room.memory.jobs.sweep.tasks.add(this.id);
 this.room.memory.jobs.list.add(this.id);
};
//delete a task
Resource.prototype.deleteTask = function (job) {
 this.room.memory.jobs.sweep.tasks.delete(this.id);
 this.room.memory.jobs.list.delete(this.id);
};
//check if a resource id is in our task set
Resource.prototype.isTask = function (job) {
 this.room.memory.jobs.sweep.tasks.has(this.id);
};
//get a particular task by converting the set to an array with the spread operator
Resource.prototype.getTaskAt = function (index, job) {
 return [...this.room.memory.jobs.sweep.tasks][index];
};
//get a tasks' index
Resource.prototype.getTaskIndex = function (job) {
 return [...this.room.memory.jobs.sweep.tasks].indexOf(this.id);
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
   console.log('adding ' + sid + ' to jobs list');
   r.memory.jobs.mine.tasks.add(sid);
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
 if (this.energy > this.energyCapacity) {
  this.createTask('deposit');
 }
 if (this.hits < this.hitsMax) {
  this.createTask('fix');
 }
};

StructureSpawn.prototype.debrief = function () {
 if (this.store.energy === this.energyCapacity) {
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
 if (this.store.energy > this.energyCapacity) {
  this.createTask('deposit');
 }
 if (this.hits < this.hitsMax) {
  this.createTask('fix');
 }
};

StructureTower.prototype.debrief = function () {
 if (this.store.energy === this.energyCapacity) {
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
 //if this has energy
 else if (this.carry.energy === this.carryCapacity) {
  this.memory.state = 1;
 }

 //if this has energy
 if (this.memory.state) {
  this.construct();
 }
 //if this has no energy
 else {
  this.collect();
 }
};

Creep.prototype.newt = function () {
 //state flipper
 if (this.carry.energy === 0) {
  this.memory.state = 0;
 }
 //if creep has energy
 else if (this.carry.energy === this.carryCapacity) {
  this.memory.state = 1;
 }

 //if this has energy
 if (this.memory.state) {
  this.deposit();
 }
 //if this has no energy
 else {
  this.collect();
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
 const containers = r.find(FIND_STRUCTURES, { filter: (s) => s.structureType == 'container' });
 if (containers.length) {
  console.log(containers);
  for (let container in containers) {
   containers[container].report();
  }
 }
 const dust = r.find(FIND_DROPPED_RESOURCES);
 if (dust.length) {
  for (let d in dust) {
   var mote = dust[d];
   mote.report();
  }
 }
 if (!Memory.rooms[r.name]) {
  initialize(r);
  r.memory.jobs.upgrade.tasks.add(r.controller.id);
  r.memory.jobs.deposit.tasks.add(spawn.id);
  r.memory.jobs.eat.tasks.add(spawn.id);
 }
 const rcl = r.controller.level;
 //spawn logic
 //rcl switch
 let frog = Memory.recipes.frog;
 let toad = Memory.recipes.toad;
 let newt = Memory.recipes.newt;
 let withdrawCap = (r.memory.jobs.collect.tasks ? r.memory.jobs.collect.tasks.size : 0);
 let frogCap = (r.memory.jobs.construct.tasks ? r.memory.jobs.construct.tasks.size : 0);
 let pickupCap = (r.memory.jobs.sweep.tasks ? r.memory.jobs.sweep.tasks.size : 0);
 //we want to spawn creeps based on tasks needing to be done
 //so we have a variable count for toads since it takes a while for max mining on a single toad
 if (r.roleCount('toad') < r.memory.sc) {
  let creepName = spawn.spawnCreep(toad, rcl);
  //assign toad jobs

 } else if (r.roleCount('newt') < withdrawCap) {
  //we make newts based on the amount of gather tasks we have
  console.log(withdrawCap + ":" + pickupCap);
  let creepName = spawn.spawnCreep(newt, rcl);
 } else if (r.roleCount('frog') < frogCap) {
  //we make frogs based on the amount of build tasks we have
  let creepName = spawn.spawnCreep(frog, rcl);
 }


}

Creep.prototype.toad = function () {
 //state flipper
 if (this.carry.energy === 0) {
  this.memory.state = 0;
 }
 //if creep has energy
 else if (this.carry.energy > 49) {
  this.memory.state = 1;
 }

 //if this has energy
 if (this.memory.state) {
  //console.log('frog this: ' + JSON.stringify(this));
  return this.construct();
 }
 //if this has no energy
 else {
  //console.log('frog this: ' + JSON.stringify(this));
  return this.mine();
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
  sogood: '✨🐸✨'
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
 //trigger structure prototypes to populate energy delivery arrays
 for (let id in Game.structures) {
  var structure = Game.structures[id];
  structure.report();
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
 }
 //then trigger reports for construction sites
 for (let id in Game.constructionSites) {
  Game.getObjectById(id).room.memory.jobs.construct.tasks.add(id);
 }
 //then trigger creep behavior
 for (let name in Game.creeps) {
  if (!Game.creeps[name]) {
   //clear creep work registration
   Game.creeps[name].deleteWorkerAll();
   //delete creep from memory
   delete Game.creeps[name];
  }
  var creep = Game.creeps[name];
  creep.memory.room = creep.room.name;
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
   creep.say(creep.toad());
   break;
  case 'newt':
   creep.say(creep.newt());
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

/*jshint -W008 */
//// HEAL PLUS ////
Creep.prototype.aid = function () {
 //we need to clear the task manually from room task memory without harming the creep memory
 Game.getObjectById(this.memory.jobs.aid).debrief('aid');
 //now we can switch
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
   this.aid();
   return Memory.emoji.oops + Memory.emoji.aid + Memory.emoji.oops;
  } else {
   this.eat();
   return Memory.emoji.oops + Memory.emoji.aid + Memory.emoji.oops;
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
 Game.getObjectById(this.memory.jobs.collect).debrief();
 //debrief only removes task from memory if appropriate and does not affect creep memory
 switch (this.withdraw(Game.getObjectById(this.memory.jobs.collect))) {
 case 0:
  return Memory.emoji.collect;
 case -6:
 case -7:
 case -10:
  //we need to clear the creep memory to completely remove the bad id
  this.deleteAssignment('collect');
  //assign a new task
  if (getTasksArray('collect').length) {
   this.assignTask('collect');
   //attempt to collect again
   this.collect();
   return Memory.emoji.oops + Memory.emoji.collect + Memory.emoji.oops;
  } else {
   //if there are no tasks in the collect
   if (_.includes(this.body, WORK)) {
    //if the creep can mine do it
    this.mine();
   } else {
    //otherwise attempt to sweep
    this.sweep();
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
  this.moveTo(Game.getObjectById(this.memory.jobs.collect), {
   visualizePathStyle: {
    fill: 'transparent',
    stroke: '#eeff99',
    lineStyle: 'dashed',
    strokeWidth: .15,
    opacity: .1
   }
  });
  return Memory.emoji.frog;
 }
};

/*jshint -W008 */
//// BUILD PLUS ////
Creep.prototype.construct = function () {
 //debrief task first
 if (!this.memory.jobs.construct || !Game.getObjectById(this.memory.jobs.construct)) {
  this.assignTask('construct');
 }
 Game.getObjectById(this.memory.jobs.construct).debrief();
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
  Game.getObjectById(this.memory.jobs.construct).deleteTask('construct');
  //we also need to clear the assignment
  this.deleteAssignment('construct');
  //last, we have to decide if we should assign a new task
  if (getTasksArray('construct').length) {
   this.assignTask('construct');
   this.construct();
   return Memory.emoji.oops + Memory.emoji.construct + Memory.emoji.oops;
  } else {
   this.upgrade();
   return Memory.emoji.oops + Memory.emoji.construct + Memory.emoji.oops;
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
  console.log('bingbingbing');
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
 Game.getObjectById(this.memory.jobs.deposit).debrief();
 //debrief only removes task from memory if appropriate and does not affect creep memory
 switch (this.transfer(Game.getObjectById(this.memory.jobs.deposit))) {
 case 0:
  return Memory.emoji.deposit;
 case -7:
 case -8:
 case -10:
  //we need to clear the assignment
  this.deleteAssignment('deposit');
  //assign a new task
  if (getTasksArray('deposit').length) {
   this.assignTask('deposit');
   //attempt to deposit again
   this.deposit();
   return Memory.emoji.oops + Memory.emoji.deposit + Memory.emoji.oops;
  } else {
   //if there are no tasks in the deposit set
   if (_.includes(this.body, WORK)) {
    //if the creep can upgrade do it
    this.upgrade();
   } else {
    //otherwise attempt to eat
    this.eat();
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
 this.transfer(Game.getObjectById(this.memory.eat), RESOURCE_ENERGY);
 switch (Game.getObjectById(this.memory.eat).renewCreep(this)) {
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
  this.moveTo(Game.getObjectById(this.memory.eat), {
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
 return Game.getObjectById(this.memory.eat).recycleCreep(this);
};

/*jshint -W008 */
//// REPAIR PLUS ////
Creep.prototype.fix = function () {
 //we need to clear the task manually from room task memory without harming the creep memory
 Game.getObjectById(this.memory.jobs.fix).debrief('fix');
 //now we can switch
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
   this.fix();
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
 try {
  switch (this.harvest(Game.getObjectById(this.memory.jobs.mine))) {
  case 0:
   //no need to clear memory for mine, sources are permanent
   //upgrade if able
   if (this.upgradeController(this.room.controller) === 0) {
    return Memory.emoji.sogood;
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
    this.eat();
   } else if (this.memory.role == 'frog') {
    //frogs look for dropped energy before eating
    this.sweep();
   }
   return Memory.emoji.oops + Memory.emoji.mine + Memory.emoji.oops;
  case -9:
   //set move
   this.moveTo(Game.getObjectById(this.memory.jobs.mine), {
    visualizePathStyle: {
     reusePath: 100,
     fill: 'transparent',
     stroke: '#eeff99',
     lineStyle: 'solid',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return Memory.emoji.frog;
  case -12:
   //no work parts
   this.deleteWorker('mine');
   this.deleteAssignment('mine');
   return Memory.emoji.oops + Memory.emoji.mine + Memory.emoji.oops;
  }
 } catch (ex) {
  console.log(ex);
  this.assignTask('mine');
 }
};

/*jshint -W008 */
/// PICKUP PLUS ///
Creep.prototype.sweep = function () {
 //debrief first
 Game.getObjectById(this.memory.jobs.sweep).debrief('sweep');
 //now we can switch
 switch (this.pickup(Game.getObjectById(this.memory.jobs.sweep))) {
 case 0:
  //memory is already cleared
  return Memory.emoji.sweep;
 case -7:
 case -8:
  //we need to clear the assignment from the assignment list as well as the job list in room memory
  this.deleteAssignment('sweep');
  //assign a new task
  if (getTasksArray('sweep').length) {
   this.assignTask('sweep');
   //attempt to sweep again
   this.sweep();
   return Memory.emoji.oops + Memory.emoji.sweep + Memory.emoji.oops;
  } else {
   //if there are no tasks in the sweep set
   if (_.includes(this.body, WORK)) {
    //if the creep can upgrade do it
    this.upgrade();
   } else {
    //otherwise attempt to eat
    this.eat();
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
  if (getTasksArray('upgrade').length) {
   //task is there
   this.assignTask('upgrade');
   //try again
   this.upgrade();
  }
  return Memory.emoji.oops + Memory.emoji.upgrade + Memory.emoji.oops;
 case -9:
  //set move
  this.moveTo(Game.getObjectById(this.memory.jobs.build), {
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
 //we need to clear the task manually from room task memory without harming the creep memory
 Game.getObjectById(this.memory.jobs.whack).debrief('whack');
 //now we can switch
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
   this.whack();
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
