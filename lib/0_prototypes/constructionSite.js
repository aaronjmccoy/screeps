ConstructionSite.prototype.report = function () {
 //add to sweep set
 this.createTask('construct');
};
//this gets called every time a creep uses build since the construction sites add themselves every tick
ConstructionSite.prototype.debrief = function (job) {
 return true;
};

//don't need to report because we do that in our main
//set a task
ConstructionSite.prototype.createTask = function (job) {
 this.room.memory.jobs.construct.tasks.add(this.id);
 this.room.memory.jobs.list.add(this.id);
};
//delete a task
ConstructionSite.prototype.deleteTask = function (job) {
 this.room.memory.jobs.construct.tasks.delete(this.id);
 this.room.memory.jobs.list.delete(this.id);
};
//check if a cs id is in our task set
ConstructionSite.prototype.isTask = function (job) {
 this.room.memory.jobs.construct.tasks.has(this.id);
};
//get a particular task by converting the set to an array with the spread operator
ConstructionSite.prototype.getTaskAt = function (index, job) {
 return this.room.memory.jobs.construct.tasks[index];
};
//get a tasks' index
ConstructionSite.prototype.getTaskIndex = function (job) {
 return this.room.memory.jobs.construct.tasks.indexOf(this.id);
};
