Resource.prototype.report = function () {
 CM.set(this.pos.x, this.pos.y, 255);
 if (this.resourceType == 'energy') {
  this.room.memory.jobs.sweep.push(this.id);
 }
 //  this.room.memory.jobs.sweep[this.resourceType].push(this.id);
};
