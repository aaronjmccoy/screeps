StructureSpawn.prototype.report = function () {
 if (this.store.energy > this.energyCapacity) {
  this.createTask('deposit');
 }
 if (this.hits < this.hitsMax) {
  this.createTask('fix');
 }
};

StructureSpawn.prototype.debrief = function () {
 if (this.store.energy === this.energyCapacity) {
  this.deleteTask('deposit');
 }
 if (this.hits === this.hitsMax) {
  this.deleteTask('fix');
 }
};

StructureSpawn.prototype.spawnCreep = function (creepRecipe, rcl) {
 switch (this.createCreep(creepRecipe.parts[rcl], Date().getUTCMilliseconds(), creepRecipe.options)) {
 case -3:
  //creep name already taken
  console.log('There is already a creep with this name');
  break;
 case -10:
  //invalid body
  console.log('Body part array not properly formed: ');
  console.log(JSON.stringify(creepRecipe.parts[rcl]));
  break;
 case -14:
  //rcl dropped
  console.log('RCL no longer sufficient to use this spawn');
 }
}
