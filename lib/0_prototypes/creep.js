//// WORKER PROTOTYPES////

//set a worker
Creep.prototype.setWorker = function (job) {
 this.room.memory.jobs[job].workers.add(this.id);
}
//delete a worker
Creep.prototype.deleteWorker = function (job) {
 this.room.memory.jobs[job].workers.delete(this.id);
}
//check if a creep is in our worker set
Creep.prototype.isWorker = function (job) {
 this.room.memory.jobs[job].workers.has(this.id);
}
//get a particlar worker
Creep.prototype.getWorkerAt = function (index, job) {
 return [...this.room.memory.jobs[job].workers][index];
}
//get a worker's index
Creep.prototype.getWorkerIndex = function (job) {
 return [...this.room.memory.jobs[job].workers].indexOf(this.id);
}
//return the worker set in array form
function getWorkersArray(job) {
 return [...this.room.memory.jobs[job].workers];
}

//// TASK ASSIGNMENT ////

//get an assignment
Creep.prototype.getAssignment = function (job, taskID) {
 return this.memory.jobs[job];
}
//set an assignment
Creep.prototype.setAssignment = function (job, taskID) {
 //assignments are stored creep local
 this.memory.jobs[job] = taskID;
}
//delete an assignment from room memory and creep memory
Creep.prototype.deleteAssignment = function (job) {
 //for the assignment reference
 delete this.memory.jobs[job];
}
//delete all assignments a creep has
Creep.prototype.deleteAllAssignments = function () {
 for (var job in this.memory.jobs) {
  //delete the assignment entry
  this.deleteAssignment(job);
  //delete the worker entry
  this.deleteWorker(job);
 };
}

//assign a task in the task array to a creep in the corresponding worker array
Creep.prototype.assignTask = function (job) {
 //first be sure the creep is in the worker array
 if (!this.isWorker(job)) {
  //if not add it
  this.setWorker(job);
 };
 //then get the index of the worker, wIndex
 let wIndex = this.getWorkerIndex(job);
 let aIndex = 0;
 //get the task at wIndex
 let task = getTaskAt(wIndex, job);
 //if there is a job in the tasks set at wIndex
 if (task) {
  this.setAssignment(job, task);
  return true;
 } else {
  //there is no job at that index, we need to assign this creep to a job parallel to wIndex
  let tasksLength = getTasksArray(job).length;
  let workersLength = getWorkersArray(job).length;
  //if we have more workers to tasks
  if (workersLength > tasksLength) {
   aIndex = wIndex % tasksLength;
  } else {
   //we have less then or equal workers to tasks
   aIndex = wIndex;
  }
  //set assignment
  this.setAssignment(job, getTaskAt(aIndex, job));
  return true;
 }
 this.setAssignment(job, getTaskAt(aIndex, job));
 return true;
}

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
   this.say(Memory.emoji['sogood']);
  }
 }
 if (this.memory.role != 'toad') {
  if (this.withdraw(moarshinies[0], RESOURCE_ENERGY) === 0) {
   this.say(Memory.emoji['sogood']);
  }
 }
 if (this.pickup(shinies[0]) === 0) {
  this.say(Memory.emoji['sogood']);
 }
}

Creep.prototype.depositAura = function () {
 var nearExt = this.pos.findInRange(FIND_MY_STRUCTURES, 1, {
  filter: s => s.structureType == STRUCTURE_EXTENSION
 });
 //console.log(nearExt);
 for (let e in nearExt) {
  //console.log(nearExt[e]);
  if (this.transfer(nearExt[e], RESOURCE_ENERGY) === 0) {
   this.say(Memory.emoji['sogood']);
  }
 }
}

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
}
