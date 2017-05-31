Resource.prototype.report = function () {
 //add to sweep array
 this.room.memory.jobs.pickup.tasks[this.id] = this.id;
};
