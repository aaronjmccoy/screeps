ConstructionSite.prototype.debrief = function () {
 //add to gather object
 delete this.room.memory.jobs.build.tasks[this.id];
};
//don't need to report because we do that in our main

StructureContainer.prototype.report = function () {
 if (this.store.energy > 0) {
  this.room.memory.jobs.withdraw.tasks[this.id] = this.id;
 }
};
StructureContainer.prototype.debrief = function () {
 if (this.store.energy === 0) {
  delete this.room.memory.jobs.withdraw.tasks[this.id];
 }
};

//eat action
Creep.prototype.eat = function () {
 return Game.getObjectById(this.memory.eat).renewCreep(this);
};
//sacrifice action
Creep.prototype.sacrifice = function () {
 return Game.getObjectById(this.memory.eat).recycleCreep(this);
};

Creep.prototype.clearJob = function (job) {
 if (Game.getObjectById(this.memory[job])) {
  Game.getObjectById(this.memory[job]).debrief();
 } else {
  delete this.room.memory.jobs[job].tasks[this.memory[job]];
 }
 delete this.room.memory.jobs[job].assignments[this.memory[job]];
};
Creep.prototype.clearCreep = function () {

}

/*

structures put jobs with priority, spawn assigns job and rank to creep, creep do jobs and take them down as they are completed

structure -> room.memory.jobs[job].tasks[structure.id] =  api return code form last attempted action or 0

spawn -> room.memory.jobs[job].workers[creep.name] = api code returning 

creep -> room.memory.jobs[job].assignment[]

*/

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
 this.room.memory.jobs.pickup.tasks[this.id] = this.id;
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

StructureSpawn.prototype.report = function () {
 if (this.energy < this.energyCapacity) {
  //add to deposit array
  this.room.memory.jobs.transfer.tasks[this.id] = this.id;
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

//assign task takes string for creep action and assigns creep to corresponding task if any present in room.job[job].tasks
Creep.prototype.assignTask = function (job) {
  //you know you can get objects by simulated index by getting the keys
  var tasksKeys = Object.keys(this.room.memory.jobs[job].tasks);
  if (!this.room.memory.jobs[job].workers[this.id]) {
   this.room.memory.jobs[job].workers[this.id] = this.id;
  }
  var workersKeys = Object.keys(this.room.memory.jobs[job].workers);
  //if there are actually tasks
  if (tasksKeys.length) {
   console.log('we have ' + workersKeys.length + ' ' + job + 'ers and ' + tasksKeys.length + ' ' + job + ' jobs to do');
   //we need to run a different loop depending on the number of workers and tasks
   if (workersKeys.length > tasksKeys.length) {
    // if we have less tasks than workers we assign in parallel lists
    for (var w = 0; w < workersKeys.length; w++) {
     //if the creep index accesses a job
     if (tasksKeys[w]) {
      //only if the creep id is the one we want
      if (this.id == workersKeys[w]) {
       console.log(this.id + ' being assigned at index ' + w + ' for job ' + job);
       this.room.memory.jobs[job].assignment[this.id] = tasksKeys[w];
       return this.room.memory.jobs[job].assignment[this.id];
      }
     } else {
      if (this.id == workersKeys[w]) {
       //assign job at parallel index
       console.log('overflow assignment at index ' + ((w % tasksKeys.length) + ' for job ' + job); this.room.memory.jobs[job].assignment[this.id] = tasksKeys[(w + 1) % (tasksKeys.length + 1)];
        return this.room.memory.jobs[job].assignment[this.id];
       }
      }

     }
    } else {
     //console.log('we have more jobs than workers');
     //if we have more or equal workers to tasks we simply assign them in order
     for (var i = 0; i < workersKeys.length; i++) {
      //only if the creep id is the one we want
      //if (this.id == this.room.memory.jobs[job].workers[workersKeys[i]]) {
      //assign and return task id
      this.room.memory.jobs[job].assignment[this.id] = this.room.memory.jobs[job].tasks[tasksKeys[i]];
      console.log('perfect assignment of' + this.id + ' to ' + tasksKeys[i] + ' for ' + job);
      //}
     }
     return this.room.memory.jobs[job].assignment[this.id];
    }
   } else {
    //if there are no jobs return null
    return null;
   }
  };

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

//first clear memory
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
//export my loop logic
module.exports.loop = function () {
 //trigger reports for construction sites
 for (let id in Game.constructionSites) {
  Game.getObjectById(id).room.memory.jobs.build.tasks[id] = id;
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
  if (!Game.creeps[name]) {
   //clear creep work registration
   delete creep.room.memory.jobs.pickup.workers[creep.id];
   delete creep.room.memory.jobs.withdraw.workers[creep.id];
   delete creep.room.memory.jobs.transfer.workers[creep.id];
   delete creep.room.memory.jobs.build.workers[creep.id];
   delete creep.room.memory.jobs.upgradeController.workers[creep.id];
   delete creep.room.memory.jobs.eat.workers[creep.id];
   delete creep.room.memory.jobs.harvest.workers[creep.id];
   //clear creep assignment data
   delete creep.room.memory.jobs.pickup.assignment[creep.id];
   delete creep.room.memory.jobs.withdraw.assignment[creep.id];
   delete creep.room.memory.jobs.transfer.assignment[creep.id];
   delete creep.room.memory.jobs.build.assignment[creep.id];
   delete creep.room.memory.jobs.upgradeController.assignment[creep.id];
   delete creep.room.memory.jobs.eat.assignment[creep.id];
   delete creep.room.memory.jobs.harvest.assignment[creep.id];
   delete Memory.creeps[name];
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
   creep.say(frog(creep));

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
 //state flipper
 if (creep.carry.energy === 0) {
  creep.memory.state = 0;
 }
 //if creep has energy
 else if (creep.carry.energy === creep.carryCapacity) {
  creep.memory.state = 1;
 }

 //if creep has energy
 if (creep.memory.state) {
  switch (creep.build(Game.getObjectById(creep.memory.build))) {
  case 0:
   //creep successfuly acted
   creep.say('riBBit', true);
   if (!Game.getObjectById(creep.memory.build)) {
    //creep.clearJob('build');
   }
   return 0;
  case -7:
   //invalid target
   //creep.say('Bad Target', false);
   //remove old target from room memory and creep memory
   //creep.clearJob('build');
   if (!creep.memory.build) {
    creep.memory.build = creep.assignTask('build');
   }
   if (creep.memory.upgradeController !== null) {
    creep.memory.upgradeController = creep.assignTask('upgradeController');
   }
   if (creep.upgradeController(Game.getObjectById(creep.memory.upgradeController)) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.upgradeController), {
     visualizePathStyle: {
      fill: '#ccff66',
      stroke: '#ccff66',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   }
   //assign new target
   //head towards upgrader if this repeats
   //console.log(creep.upgradeController(Game.getObjectById(creep.memory.upgradeController)));
   return -7;
  case -9:
   //set move
   creep.moveTo(Game.getObjectById(creep.memory.build), {
    visualizePathStyle: {
     fill: '#ccff66',
     stroke: '#ccff66',
     lineStyle: 'dashed',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return -9;
  case -10:
   //invalid target
   //creep.say('Bad Target', false);
   //remove old target from room memory and creep memory
   //creep.clearJob('build');
   if (creep.memory.build !== null) {
    creep.memory.build = creep.assignTask('build');
   }
   if (creep.memory.upgradeController !== null) {
    creep.memory.upgradeController = creep.assignTask('upgradeController');
   }
   if (creep.upgradeController(Game.getObjectById(creep.memory.upgradeController)) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.upgradeController), {
     visualizePathStyle: {
      fill: '#ccff66',
      stroke: '#ccff66',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   }
   //assign new target
   //head towards upgrader if this repeats
   //console.log(creep.upgradeController(Game.getObjectById(creep.memory.upgradeController)));
   return 'state 1 -10';
  }
 }
 //if creep has no energy
 else {
  switch (creep.withdraw(Game.getObjectById(creep.memory.withdraw))) {
  case 0:
   //creep successfuly acted
   creep.say('RibbiT', true);
   Game.getObjectById(creep.memory.withdraw).debrief()
   return 0;
  case -6:
   //invalid target
   //remove withdraw target from memory
   if (!Game.getObjectById(creep.memory.withdraw)) {
    //creep.clearJob('withdraw');
    //assign new withdraw target
    creep.memory.withdraw = creep.assignTask('withdraw');
   }
   //head towards mining if this repeats
   if (creep.harvest(Game.getObjectById(creep.memory.harvest)) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.harvest), {
     visualizePathStyle: {
      fill: '#ccff66',
      stroke: '#ccff66',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   } else if (creep.harvest(creep.memory.harvest) == -6) {
    //if sources are out of energy harvest
    creep.memory.eat = creep.assignTask('eat');
    if (creep.eat(creep.memory.eat) == -9) {
     //bad target followed by empty sources = eat while you can
     creep.moveTo(Game.getObjectById(creep.memory.eat), {
      visualizePathStyle: {
       fill: '#ccff66',
       stroke: '#ccff66',
       lineStyle: 'dashed',
       strokeWidth: .15,
       opacity: .1
      }
     });
    }
   }
   return -6;
  case -7:
   //invalid target
   //remove withdraw target from memory
   if (!Game.getObjectById(creep.memory.withdraw)) {
    //creep.clearJob('withdraw');
    //assign new withdraw target
    creep.memory.withdraw = creep.assignTask('withdraw');
   }
   //head towards mining if this repeats
   if (creep.harvest(Game.getObjectById(creep.memory.harvest)) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.harvest), {
     visualizePathStyle: {
      fill: '#ccff66',
      stroke: '#ccff66',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   } else if (creep.harvest(creep.memory.harvest) == -6) {
    //if sources are out of energy harvest
    creep.memory.eat = creep.assignTask('eat');
    if (creep.eat(creep.memory.eat) == -9) {
     //bad target followed by empty sources = eat while you can
     creep.moveTo(Game.getObjectById(creep.memory.eat), {
      visualizePathStyle: {
       fill: '#ccff66',
       stroke: '#ccff66',
       lineStyle: 'dashed',
       strokeWidth: .15,
       opacity: .1
      }
     });
    }
   }
   return -7;
  case -9:
   //set move
   creep.moveTo(Game.getObjectById(creep.memory.withdraw), {
    visualizePathStyle: {
     fill: '#ccff66',
     stroke: '#ccff66',
     lineStyle: 'dashed',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return -9;
  case -10:
   //invalid target
   //remove withdraw target from memory
   if (!Game.getObjectById(creep.memory.withdraw)) {
    //creep.clearJob('withdraw');
    //assign new withdraw target
    creep.memory.withdraw = creep.assignTask('withdraw');
   }
   creep.memory.harvest = creep.assignTask('harvest');
   //head towards mining if this repeats
   if (creep.harvest(Game.getObjectById(creep.memory.harvest)) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.harvest), {
     visualizePathStyle: {
      fill: '#ccff66',
      stroke: '#ccff66',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   } else if (creep.harvest(creep.memory.harvest) == -6) {
    //if sources are out of energy harvest
    creep.memory.eat = creep.assignTask('eat');
    if (creep.eat(creep.memory.eat) == -9) {
     //bad target followed by empty sources = eat while you can
     creep.moveTo(Game.getObjectById(creep.memory.eat), {
      visualizePathStyle: {
       fill: '#ccff66',
       stroke: '#ccff66',
       lineStyle: 'dashed',
       strokeWidth: .15,
       opacity: .1
      }
     });
    }
   }
   return 'state0 -10';
  }
 }
}

function newt(creep) {
 //state flipper
 if (creep.carry.energy === 0) {
  creep.memory.state = 0;
 }
 //if creep has energy
 else if (creep.carry.energy === creep.carryCapacity) {
  creep.memory.state = 1;
 }

 //logic
 if (creep.memory.state) {
  switch (creep.transfer(Game.getObjectById(creep.memory.transfer), creep.memory.resourceType)) {
  case 0:
   //creep successfuly transferred
   creep.say('slink', true);
   Game.getObjectById(creep.memory.transfer).debrief();
   return 0;
  case -7:
   //invalid target
   creep.say('Bad Target', false);
   creep.memory.transfer = creep.assignTask('transfer');
   creep.memory.eat = creep.assignTask('eat');
   //head towards eating if this repeats
   if (creep.eat(Game.getObjectById(creep.memory.eat)) < 0) {
     creep.say(creep.eat(Game.getObjectById(creep.memory.eat)));
    creep.moveTo(Game.getObjectById(creep.memory.eat), {
     visualizePathStyle: {
      fill: '#ffcc00',
      stroke: '#ffcc00',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   }
   return -7;
  case -8:
   //full target
   //console.log(creep.eat(Game.getObjectById(creep.memory.eat)));
   creep.memory.transfer = creep.assignTask('transfer');
   creep.memory.eat = creep.assignTask('eat');
   //head towards eating if this repeats
   if (creep.eat(Game.getObjectById(creep.memory.eat)) < 0) {
    creep.moveTo(Game.getObjectById(creep.memory.eat), {
     visualizePathStyle: {
      fill: '#ffcc00',
      stroke: '#ffcc00',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   }
   return -8;
  case -9:
   //move in
   creep.moveTo(Game.getObjectById(creep.memory.transfer), {
    visualizePathStyle: {
     fill: '#ffcc00',
     stroke: '#ffcc00',
     lineStyle: 'dashed',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return creep.transfer(Game.getObjectById(creep.memory.transfer), creep.memory.resourceType);
  }
 }
 //if creep has energy
 else {
  switch (creep.withdraw(Game.getObjectById(creep.memory.withdraw), creep.memory.resourceType)) {
  case 0:
   //creep successfuly transferred
   creep.say('peep', true);
   Game.getObjectById(creep.memory.withdraw).debrief();
   return 0;
  case -6:
   //empty target
   //creep.say('Not Enough', false);
   creep.memory.withdraw = creep.assignTask('withdraw');
   //head towards eating if this repeats
   creep.memory.pickup = creep.assignTask('pickup');
   if (creep.pickup(Game.getObjectById(creep.memory.pickup)) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.pickup), {
     visualizePathStyle: {
      fill: '#ffcc00',
      stroke: '#ffcc00',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   }
   delete creep.room.memory.jobs.pickup.tasks[creep.memory.pickup];
   return -6;
  case -7:
   //invalid target
   //creep.say('Bad Target', false);
   creep.memory.withdraw = creep.assignTask('withdraw');
   creep.memory.pickup = creep.assignTask('pickup');
   //head towards eating if this repeats
   if (creep.pickup(Game.getObjectById(creep.memory.pickup)) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.pickup), {
     visualizePathStyle: {
      fill: '#ffcc00',
      stroke: '#ffcc00',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   }
   delete creep.room.memory.jobs.pickup.tasks[creep.id];
   return -7;
  case -9:
   //move in
   creep.moveTo(Game.getObjectById(creep.memory.withdraw), {
    visualizePathStyle: {
     fill: '#ffcc00',
     stroke: '#ffcc00',
     lineStyle: 'dashed',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return -9;
  }
 }
}

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
 const containers = r.find(FIND_STRUCTURES, {filter: (s) => s.structureType == 'container'});
 for(let container in containers){
   containers[container].report();
 }
 const dust = r.find(FIND_DROPPED_RESOURCES);
 for(let d in dust){
   dust[d].report();
 }
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
 let withdrawCap = (r.memory.jobs.withdraw.tasks ? Object.keys(r.memory.jobs.withdraw.tasks).length : 0);
 let frogCap = (r.memory.jobs.build.tasks ? Object.keys(r.memory.jobs.build.tasks).length : 0);
 let pickupCap = (r.memory.jobs.pickup.tasks ? Object.keys(r.memory.jobs.pickup.tasks).length : 0);
 //we want to spawn creeps based on tasks needing to be done
 //so we have a variable count for toads since it takes a while for max mining on a single toad
 if (r.roleCount('toad') < r.memory.sc) {
  spawnCreep(spawn, toad, rcl);
 } else if (r.roleCount('newt') < withdrawCap) {
  //we make newts based on the amount of gather tasks we have
  console.log(withdrawCap+":"+pickupCap);
  spawnCreep(spawn, newt, rcl);
 } else if (r.roleCount('frog') < frogCap) {
  //we make frogs based on the amount of build tasks we have
  spawnCreep(spawn, frog, rcl);
 }


}

function toad(creep) {
 //state flipper
 if (creep.carry.energy === 0) {
  creep.memory.state = 0;
 }
 //if creep has energy
 else if (creep.carry.energy > 10) {
  creep.memory.state = 1;
 }

 //if creep has energy
 if (creep.memory.state) {
  switch (creep.build(Game.getObjectById(creep.memory.build))) {
  case 0:
   //creep successfuly acted
   creep.say('riBBit', true);
   Game.getObjectById(creep.memory.build).debrief();
   return 0;
  case -7:
   //invalid target
   //creep.clearJob('build');
   if (!creep.memory.build) {
    creep.memory.build = creep.assignTask('build');
   }
   if (creep.memory.upgradeController !== null) {
    creep.memory.upgradeController = creep.assignTask('upgradeController');
   }
   //toad should harvest
   switch (creep.harvest(Game.getObjectById(creep.memory.harvest))) {
   case 0:
    //creep successfuly acted
    creep.say('BwaK', true);
    creep.upgradeController(Game.getObjectById(creep.room.controller));
    return 0;
   case -6:
    //not enough resources
    //head towards eating if this repeats
    creep.memory.eat = creep.assignTask('eat');
    if (creep.eat(creep.memory.eat) == -9) {
     creep.moveTo(Game.getObjectById(creep.memory.eat), {
      visualizePathStyle: {
       fill: '#ffcc66',
       stroke: '#ffcc66',
       lineStyle: 'dashed',
       strokeWidth: .15,
       opacity: .1
      }
     });
    }
    return -6;
   case -7:
    //invalid target
    creep.say('Bad Target', false);
    //assign new target
    creep.memory.harvest = creep.assignTask('harvest');
    //head towards eating if this repeats
    creep.memory.eat = creep.assignTask('eat');
    if (creep.eat(creep.memory.eat) == -9) {
     creep.moveTo(Game.getObjectById(creep.memory.eat), {
      visualizePathStyle: {
       fill: '#ffcc66',
       stroke: '#ffcc66',
       lineStyle: 'dashed',
       strokeWidth: .15,
       opacity: .1
      }
     });
    }
    return -7;
   case -9:
    //set move
    creep.moveTo(Game.getObjectById(creep.memory.harvest), {
     visualizePathStyle: {
      fill: '#ffcc66',
      stroke: '#ffcc66',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
    return -9;
   }
   return -7;
  case -9:
   //assign new target
   if (creep.memory.build !== null) {
    creep.memory.build = creep.assignTask('build');
   }
   switch (creep.harvest(Game.getObjectById(creep.memory.harvest))) {
   case 0:
    //creep successfuly acted
    creep.say('BwaK', true);
    creep.upgradeController(Game.getObjectById(creep.room.controller));
    return 0;
   case -6:
    //not enough resources
    //head towards eating if this repeats
    creep.memory.eat = creep.assignTask('eat');
    if (creep.eat(creep.memory.eat) == -9) {
     creep.moveTo(Game.getObjectById(creep.memory.eat), {
      visualizePathStyle: {
       fill: '#ffcc66',
       stroke: '#ffcc66',
       lineStyle: 'dashed',
       strokeWidth: .15,
       opacity: .1
      }
     });
    }
    return -6;
   case -7:
    //invalid target
    creep.say('Bad Target', false);
    //assign new target
    creep.memory.harvest = creep.assignTask('harvest');
    //head towards eating if this repeats
    creep.memory.eat = creep.assignTask('eat');
    if (creep.eat(creep.memory.eat) == -9) {
     creep.moveTo(Game.getObjectById(creep.memory.eat), {
      visualizePathStyle: {
       fill: '#ffcc66',
       stroke: '#ffcc66',
       lineStyle: 'dashed',
       strokeWidth: .15,
       opacity: .1
      }
     });
    }
    return -7;
   case -9:
    //set move
    creep.moveTo(Game.getObjectById(creep.memory.harvest), {
     visualizePathStyle: {
      fill: '#ffcc66',
      stroke: '#ffcc66',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
    return -9;
   }
  }
 }
 //if creep has no energy
 else {
  switch (creep.harvest(Game.getObjectById(creep.memory.harvest))) {
  case 0:
   //creep successfuly acted
   creep.say('BwaK', true);
   creep.upgradeController(Game.getObjectById(creep.room.controller));
   return 0;
  case -6:
   //not enough resources
   //head towards eating if this repeats
   creep.memory.eat = creep.assignTask('eat');
   if (creep.eat(creep.memory.eat) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.eat), {
     visualizePathStyle: {
      fill: '#ffcc66',
      stroke: '#ffcc66',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   }
   return -6;
  case -7:
   //invalid target
   creep.say('Bad Target', false);
   //assign new target
   creep.memory.harvest = creep.assignTask('harvest');
   //head towards eating if this repeats
   creep.memory.eat = creep.assignTask('eat');
   if (creep.eat(creep.memory.eat) == -9) {
    creep.moveTo(Game.getObjectById(creep.memory.eat), {
     visualizePathStyle: {
      fill: '#ffcc66',
      stroke: '#ffcc66',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     }
    });
   }
   return -7;
  case -9:
   //set move
   creep.moveTo(Game.getObjectById(creep.memory.harvest), {
    visualizePathStyle: {
     fill: '#ffcc66',
     stroke: '#ffcc66',
     lineStyle: 'dashed',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return -9;
  }
 }
}

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
