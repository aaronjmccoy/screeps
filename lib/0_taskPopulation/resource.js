Resource.prototype.report = function () {
 this.room.memory.jobs.sweep.push(this.id);
};
