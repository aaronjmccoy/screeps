OwnedStructure.prototype.healthCheck = function () {
 if ((object.hitsMax / 2 > object.hits) && (object.hits < 10000)) {
  //add to gather object
  this.room.memory.jobs.repair.tasks[this.id] = this.hits;
 }
};

OwnedStructure.prototype.discharge = function () {
 if (this.room.memory.repair[this.id]) {
  delete this.room.memory.jobs.repair.tasks[this.id];
 }
};
