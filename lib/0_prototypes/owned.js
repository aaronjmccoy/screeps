//// STRUCTURE TASK QUEUE SYSTEM ////

//set a task
OwnedStructure.prototype.createTask = function(job) {
    room.memory.jobs[job].tasks.add(this.id);
}
//delete a task
OwnedStructure.prototype.deleteTask = function(job) {
    room.memory.jobs[job].tasks.delete(this.id);
}
//check if a structure id is in our task set
OwnedStructure.prototype.isTask = function(job) {
    room.memory.jobs[job].tasks.has(this.id);
}
//get a particular task by converting the set to an array with the spread operator
OwnedStructure.prototype.getTaskAt = function(index, job) {
    return [...room.memory.jobs[job].tasks][index];
}
//get a tasks' index
OwnedStructure.prototype.getTaskIndex = function(job) {
    return [...room.memory.jobs[job].tasks].indexOf(this.id);
}
//return the task set in array form
function getTasksArray(job) {
    return [...room.memory.jobs[job].tasks];
}
