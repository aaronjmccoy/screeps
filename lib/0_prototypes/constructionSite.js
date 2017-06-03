//this gets called every time a creep uses build since the construction sites add themselves every tick
ConstructionSite.prototype.debrief = function () {
 //add to build task set
 room.memory.jobs.build.tasks.delete(this.id);
};
//don't need to report because we do that in our main
