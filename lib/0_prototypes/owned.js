//// STRUCTURE TASK QUEUE SYSTEM ////

OwnedStructure.prototype.createTask = function (job) {
 this.room.memory.jobs[job].tasks.push(this.id);
 this.room.memory.jobs[job].tasks = [...new Set(this.room.memory.jobs[job].tasks)];
};
//delete a task
OwnedStructure.prototype.deleteTask = function (job) {
 if (this.room.memory.jobs[job].tasks.indexOf(this.id) > -1) {
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
