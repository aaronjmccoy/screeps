//how do I want to create jobs?
creep.room.memory.sweep[objectId] = objectvalue;
//destroying jobs
delete creep.room.memory.sweep[objectId];
//creep worker object
creep.room.jobs.sweep[creepID] = relevantPartsCount;
//getting the index of a creep in the worker array
var index = Room.jobs.sweep.indexOf(creepID);

Object.keys(creep.room.jobs.sweep)
//produces value at index n
index = creep.room.jobs.sweep.map((s) => s[creep.id]).indexOf(creep.id);
//getting the job based on the creep index
var keys = Object.keys(creep.room.memory.sweep);
keys[index]; //key of sweep at position index, hopefully the objectID

//all together now:

//assigning a task to a creep
creep.sweep(Object.keys(creep.room.memory.sweep)[creep.room.jobs.sweep.map((s) => s[creep.id]).indexOf(creep.id)]);



object: { objectid, object value, object pos }
creep: { creepid, creep body parts, creep pos }

assigntask() {
 room.memory.sweep = {
  sweepers: { creepID: dustball[objectId] }
  dustballs: { objectId: objectValue }
 }
}

//then trigger structure prototypes to populate energy delivery arrays
for (let creep in creep.room.memory.sweepers) {
 creep.memory.sweep = creep.room.memory.sweep[creep];
}

room.memory.jobs: {
 sweep: {
  workers: { creepid: creepid },
  tasks: { dustid: dustamount },
  assignments: { creepid: dustid }
 }
}
//ok balls out now


//you know you can get objects by simulated index by getting the keys
var tasksKeys = Object.keys(tasks);
var taskAtIndex1 = tasks[tasksKeys[1]];

var workerKeys = Object.keys(workers);
var workerAtIndex1 = workers[workerKeys[1]];

//so we can use a god damn for loop to set the values
for (var i = 0; i < workersKeys.length; i++) {
 if (creep.id == workers[workersKeys[i];) {
   assignment[workers[workersKeys[i]]] = tasksObject[tasksKeys[i]];
  }
 }
 //how often will this have to run? every time a creep needs a new instruction
 //how do we prevent this from making creeps all switch jobs when one triggers this? we store the id in their memory and only update that when the job is done
 //does it suck we can't find any other way to do this? yes Pinky, yes it does
