Resource.prototype.report = function () {
 //add to sweep set
 this.createTask('sweep');
};

Resource.prototype.debrief = function (job) {
 this.deleteTask('sweep');
}


//set a task
Resource.prototype.createTask = function (job) {
 room.memory.jobs[job].tasks.add(this.id);
 room.memory.jobs.list.add(this.id);
}
//delete a task
Resource.prototype.deleteTask = function (job) {
 room.memory.jobs[job].tasks.delete(this.id);
 room.memory.jobs.list.delete(this.id);
}
//check if a resource id is in our task set
Resource.prototype.isTask = function (job) {
 room.memory.jobs[job].tasks.has(this.id);
}
//get a particular task by converting the set to an array with the spread operator
Resource.prototype.getTaskAt = function (index, job) {
 return [...room.memory.jobs[job].tasks][index];
}
//get a tasks' index
Resource.prototype.getTaskIndex = function (job) {
 return [...room.memory.jobs[job].tasks].indexOf(this.id);
}
