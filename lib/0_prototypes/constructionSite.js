ConstructionSite.prototype.debrief = function () {
 //add to gather object
 delete this.room.memory.jobs.build.tasks[this.id];
};
//don't need to report because we do that in our main
