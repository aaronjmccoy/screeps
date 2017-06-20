//// WORKER PROTOTYPES////

//set a worker
Creep.prototype.setWorker = function (job) {
 this.room.memory.jobs[job].workers.add(this.name);
 this.memory.jobs[job] = null;
};
//delete a worker
Creep.prototype.deleteWorker = function (job) {
 this.room.memory.jobs[job].workers.delete(this.name);
};
//check if a creep is in our worker set
Creep.prototype.isWorker = function (job) {
 return this.room.memory.jobs[job].workers.has(this.name);
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
function deleteWorkerAll(obj, room, name) {
 for (var job in obj.jobs) {
  console.log(job + ':');
  console.log(JSON.stringify(Memory.rooms[room].jobs[job].workers));
  //delete the assignment entry
  Memory.rooms[room].jobs[job].workers.delete(name);
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
//// WHEN A CREEP IS A TASK TARGET ////
Creep.prototype.createTask = function (job) {
 this.room.memory.jobs[job].tasks.add(this.id);
 this.room.memory.jobs.list.add(this.id);
};
//delete a task
Creep.prototype.deleteTask = function (job) {
 this.room.memory.jobs[job].tasks.delete(this.id);
 this.room.memory.jobs.list.delete(this.id);
};
//check if a structure id is in our task set
Creep.prototype.isTask = function (job) {
 this.room.memory.jobs[job].tasks.has(this.id);
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
  console.log('adding ' + this.name + ' to ' + job);
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
  if (workersLength > tasksLength) {
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
 var nearSpawn = this.pos.findInRange(FIND_MY_STRUCTURES, 1, {
  filter: s => s.structureType == STRUCTURE_SPAWN
 });
 //console.log(nearExt);
 for (let e in nearExt) {
  //console.log(nearExt[e]);
  if (this.transfer(nearExt[e], RESOURCE_ENERGY) === 0) {
   this.say(Memory.emoji.sogood);
  }
 }
 for (let s in nearSpawn) {
  //console.log(nearExt[e]);
  if (this.transfer(nearSpawn[s], RESOURCE_ENERGY) === 0) {
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
