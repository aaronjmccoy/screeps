StructureWall.prototype.report = function () {
 if (this.hits < 1000) {
   this.room.memory.jobs.fix.tasks.push(this.id);
 }
};
