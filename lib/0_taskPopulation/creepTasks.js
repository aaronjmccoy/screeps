////  WHEN A CREEP IS THE TARGET OF A TASK ////
Creep.prototype.report = function (job) {
 this.room.memory.jobs[job].push(this.id);
};
