StructureSpawn.prototype.report = function () {
 if (this.room.controller.my) {
  //if I control the spawn
  Memory.rooms[this.room.name].frog.eat.push(this.id);
  Memory.rooms[this.room.name].toad.eat.push(this.id);
  Memory.rooms[this.room.name].newt.eat.push(this.id);
  Memory.rooms[this.room.name].minnow.eat.push(this.id);
  if (this.energy < this.energyCapacity) {
   Memory.rooms[this.room.name].newt.deposit.push(this.id);
   Memory.rooms[this.room.name].toad.deposit.push(this.id);
  }
  if (this.hits < this.hitsMax) {
   Memory.rooms[this.room.name].tower.fix.push(this.id);
   Memory.rooms[this.room.name].frog.fix.push(this.id);
  }
 } else {
  //if I do not control the spawn
  if (this.energy > 0) {
   if (Memory.rooms[this.room.name].parentRoom) {
    Memory.rooms[Memory.rooms[this.room.name].parentRoom].newt.collect.push(this.id);
   }
  } else {
   if (Memory.rooms[this.room.name].parentRoom) {
    Memory.rooms[Memory.rooms[this.room.name].parentRoom].frog.deconstruct.push(this.id);
   }
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
