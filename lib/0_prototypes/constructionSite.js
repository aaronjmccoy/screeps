ConstructionSite.prototype.report = function () {
 //add to sweep set
 this.createTask('construct');
};
//this gets called every time a creep uses build since the construction sites add themselves every tick
ConstructionSite.prototype.debrief = function () {
 return true;
};

//don't need to report because we do that in our main
//set a task
ConstructionSite.prototype.createTask = function (job) {
 this.room.memory.jobs.construct.tasks.push(this.id);
 this.room.memory.jobs.construct.tasks = [...new Set(this.room.memory.jobs.construct.tasks)];
};
//delete a task
ConstructionSite.prototype.deleteTask = function (job) {
 if (this.room.memory.jobs.construct.tasks.indexOf(this.id) > -1) {
  this.room.memory.jobs.construct.tasks.splice(this.room.memory.jobs.construct.tasks.indexOf(this.id), 1);
 }
};
//check if a cs id is in our task set
ConstructionSite.prototype.isTask = function (job) {
 return this.room.memory.jobs.construct.tasks.includes(this.id);
};
//get a particular task by converting the set to an array with the spread operator
ConstructionSite.prototype.getTaskAt = function (index, job) {
 return this.room.memory.jobs.construct.tasks[index];
};
//get a tasks' index
ConstructionSite.prototype.getTaskIndex = function (job) {
 return this.room.memory.jobs.construct.tasks.indexOf(this.id);
};
