Resource.prototype.report = function () {
 this.enumerable = "enum";
 Object.defineProperty(this, "nonEnum", {
  enumerable: false,
  value: 'noEum'
 });
 //add to sweep set
 this.createTask('sweep');
};

Resource.prototype.debrief = function (job) {
 this.deleteTask('sweep');
};


//set a task
Resource.prototype.createTask = function (job) {
 this.room.memory.jobs.sweep.tasks.add(this.id);
 this.room.memory.jobs.list.add(this.id);
};
//delete a task
Resource.prototype.deleteTask = function (job) {
 this.room.memory.jobs.sweep.tasks.delete(this.id);
 this.room.memory.jobs.list.delete(this.id);
};
//check if a resource id is in our task set
Resource.prototype.isTask = function (job) {
 this.room.memory.jobs.sweep.tasks.has(this.id);
};
//get a particular task by converting the set to an array with the spread operator
Resource.prototype.getTaskAt = function (index, job) {
 return [...this.room.memory.jobs.sweep.tasks][index];
};
//get a tasks' index
Resource.prototype.getTaskIndex = function (job) {
 return [...this.room.memory.jobs.sweep.tasks].indexOf(this.id);
};
