StructureSpawn.prototype.report = function () {
 if (this.store.energy > this.energyCapacity) {
   this.createTask('transfer');
 }
 if(this.hits < this.hitsMax){
   this.createTask('repair');
 }
};

StructureSpawn.prototype.debrief = function () {
  if (this.store.energy === this.energyCapacity) {
   this.deleteTask('transfer')
  }
  if (this.hits === this.hitsMax) {
   this.deleteTask('repair')
  }
};
