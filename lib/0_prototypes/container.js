StructureContainer.prototype.report = function () {
 if (this.store.energy >= 50) {
  this.createTask('collect');
 }
 if (this.hits < 10000) {
  this.createTask('fix');
 }
};
StructureContainer.prototype.debrief = function () {
 if (this.store.energy < 50) {
  this.deleteTask('collect');
 }
 if (this.hits > 10000) {
  this.deleteTask('fix');
 }
};


//set a task
StructureContainer.prototype.createTask = function (job) {
 this.room.memory.jobs[job].tasks.push(this.id);
 this.room.memory.jobs[job].tasks = [...new Set(this.room.memory.jobs[job].tasks)];
};
//delete a task
StructureContainer.prototype.deleteTask = function (job) {
 if (!this.room.memory.jobs[job].tasks.indexOf(this.id)) {
  this.room.memory.jobs[job].tasks.splice(this.room.memory.jobs[job].tasks.indexOf(this.id), 1);
 }
};
//check if a cs id is in our task set
StructureContainer.prototype.isTask = function (job) {
 return this.room.memory.jobs[job].tasks.includes(this.id);
};
//get a particular task by converting the set to an array with the spread operator
StructureContainer.prototype.getTaskAt = function (index, job) {
 return this.room.memory.jobs[job].tasks[index];
};
//get a tasks' index
StructureContainer.prototype.getTaskIndex = function (job) {
 return this.room.memory.jobs[job].tasks.indexOf(this.id);
};
