StructureSpawn.prototype.report = function () {
 CM.set(this.pos.x, this.pos.y, 255);
 if (this.room.controller.my) {
  this.room.memory.jobs.eat.push(this.id);
  //console.log(this.room.memory.jobs.eat.length);
  if (this.energy < this.energyCapacity) {
   this.room.memory.jobs.deposit.push(this.id);
  }
  if (this.hits < this.hitsMax) {
   this.room.memory.jobs.fix.push(this.id);
  }
 } else {
  if (this.energy > 0) {
   Memory.rooms[this.room.name].jobs.collect.push(this.id);
  } else {
   Memory.rooms[this.room.name].jobs.deconstruct.push(this.id);
  }
 }
};

StructureSpawn.prototype.spawnCreep = function (creepRecipe, rcl) {
 creepRecipe.options.room = this.room.name;
 switch (this.createCreep(creepRecipe.parts[rcl], creepRecipe.options.role + "_" + Game.time + "_" + this.room.name, creepRecipe.options)) {
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
