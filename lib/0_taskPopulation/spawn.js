StructureSpawn.prototype.report = function () {
 this.room.memory.jobs.eat.push(this.id);
 if (this.energy < this.energyCapacity) {
  this.room.memory.jobs.deposit.push(this.id);
 }
 if (this.hits < this.hitsMax) {
  this.room.memory.jobs.fix.push(this.id);
 }
};

StructureSpawn.prototype.spawnCreep = function (creepRecipe, rcl) {
 switch (this.createCreep(creepRecipe.parts[rcl], creepRecipe.options.role + "_" + Game.time + "_" + this.room.name, creepRecipe.options)) {
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
};
