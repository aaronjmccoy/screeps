StructureRampart.prototype.report = function () {
 if (this.hits < this.hitsMax) {
  this.room.memory.jobs.fix.push(this.id);
 }
 this.setPublic(true);
 for (let e in this.room.memory.jobs.whack) {
  let enemy = Game.getObjectById(e);
  if this.pos.isNearTo(enemy) {
   this.setPublic(false);
  }
 }
};
