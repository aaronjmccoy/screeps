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
