ConstructionSite.prototype.debrief = function () {
 //add to gather object
 delete this.room.memory.jobs.build.tasks[this.id];
};
