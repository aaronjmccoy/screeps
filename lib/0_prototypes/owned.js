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
