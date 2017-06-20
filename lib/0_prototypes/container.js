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


//don't need to report because we do that in our main
//set a task
StructureContainer.prototype.createTask = function (job) {
 this.room.memory.jobs[job].tasks.add(this.id);
 this.room.memory.jobs.list.add(this.id);
};
//delete a task
StructureContainer.prototype.deleteTask = function (job) {
 this.room.memory.jobs[job].tasks.delete(this.id);
 this.room.memory.jobs.list.delete(this.id);
};
//check if a cs id is in our task set
StructureContainer.prototype.isTask = function (job) {
 this.room.memory.jobs[job].tasks.has(this.id);
};
//get a particular task by converting the set to an array with the spread operator
StructureContainer.prototype.getTaskAt = function (index, job) {
 return this.room.memory.jobs[job].tasks[index];
};
//get a tasks' index
StructureContainer.prototype.getTaskIndex = function (job) {
 return this.room.memory.jobs[job].tasks.indexOf(this.id);
};
