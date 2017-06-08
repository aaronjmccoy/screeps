//// HARVEST PLUS ////
Creep.prototype.mine = function () {
 switch (this.harvest(Game.getObjectById(this.memory.jobs.mine))) {
 case 0:
  //no need to clear memory for mine, sources are permanent
  //upgrade if able
  if (this.upgradeController(Game.getObjectById(this.room.controller))) {
   return Memory.emoji['sogood'];
  }
  return Memory.emoji['mine'];
 case -5:
 case -7:
  //extractor not found OR
  //not a valid source object
  return Memory.emoji['oops'] + Memory.emoji['mine'] + Memory.emoji['oops'];
 case -6:
  //source has no energy
  if (this.memory.role == 'toad') {
   //toads eat if no energy in source
   this.eat();
  } else if (this.memory.role == 'frog') {
   //frogs look for dropped energy before eating
   this.sweep();
  }
  return Memory.emoji['oops'] + Memory.emoji['mine'] + Memory.emoji['oops'];
 case -9:
  //set move
  this.moveTo(Game.getObjectById(this.memory.jobs.build), {
   visualizePathStyle: {
    fill: 'transparent',
    stroke: '#eeff99',
    lineStyle: 'solid',
    strokeWidth: .15,
    opacity: .1
   }
  });
  return Memory.emoji['frog'];
 case -12:
  //no work parts
  this.deleteWorker('mine');
  this.deleteAssignment('mine');
  return Memory.emoji['oops'] + Memory.emoji['mine'] + Memory.emoji['oops'];
 }
}
