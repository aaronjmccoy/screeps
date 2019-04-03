StructureSpawn.prototype.report = function() {
  if (this.room.controller.my && this.my) {
    //if I control the spawn
    //make sure everyone can eat
    Memory.rooms[this.room.name].frog.eat.push(this.id);
    Memory.rooms[this.room.name].toad.eat.push(this.id);
    Memory.rooms[this.room.name].newt.eat.push(this.id);
    Memory.rooms[this.room.name].shark.eat.push(this.id);

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
      Memory.rooms[this.room.name].newt.collect.push(this.id);
      Memory.rooms[this.room.name].toad.collect.push(this.id);

    }
    Memory.rooms[this.room.name].toad.deconstruct.push(this.id);
    Memory.rooms[this.room.name].frog.deconstruct.push(this.id);
    Memory.rooms[this.room.name].shark.whack.push(this.id);
  }
};

StructureSpawn.prototype.spawnCreep = function(creepRecipe, rcl) {
  //We make sure to give the creep memory of it's home room for census purposes
  creepRecipe.options.room = this.room.name;
  //console.log('SPAWN HAS CHILD FOR DEFAULT: '+Memory.rooms[this.room.name].childRoom);
  if (creepRecipe.options.role == 'squatter' && Memory.rooms[this.room.name].children) {
    //console.log('setting default squat target to '+Memory.rooms[this.room.name].childRoom+' for creep in '+this.room.name);
    //creepRecipe.options.squatTarget = Memory.rooms[this.room.name].children[0];
  }
  switch (this.createCreep(creepRecipe.parts[rcl], creepRecipe.options.role + "_" + Game.time + "_" + this.room.name, creepRecipe.options)) {
    case - 10:
      //invalid body
      console.log('Body part array not properly formed for '+creepRecipe.options.role+': ');
      console.log(rcl+'::'+JSON.stringify(creepRecipe.parts[rcl]));
      break;
    case - 14:
      //rcl dropped
      console.log('RCL no longer sufficient to use this spawn');
  }
};
