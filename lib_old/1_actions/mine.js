/*jshint -W008 */
//// HARVEST PLUS ////
Creep.prototype.mine = function () {
 //this.assignTask('mine');
 try {
  switch (this.harvest(Game.getObjectById(this.memory.jobs.mine))) {
  case 0:
   //no need to clear memory for mine, sources are permanent
   //upgrade if able
   if (this.room.rcl > 1) {
    if (this.upgradeController(this.room.controller) === 0) {
     return Memory.emoji.sogood;
    }
   }
   if (this.role == 'toad') {
    var source = Game.getObjectById(this.memory.jobs.mine);
    var container = source.pos.findInRange(FIND_STRUCTURES, 2, { filter: (c) => c.structureType == STRUCTURE_CONTAINER });
    if (container.length) {
     this.memory.container = container[0].id;
    }
    if (this.memory.container && !this.pos.isEqualTo(this.memory.container.pos)) {
     this.moveTo(Game.getObjectById(this.memory.container));
     return Memory.emoji.hop;
    }
   }
   return Memory.emoji.mine;
  case -5:
  case -7:
   //extractor not found OR
   //not a valid source object
   this.assignTask('mine');
   return Memory.emoji.oops + Memory.emoji.mine + Memory.emoji.oops;
  case -6:
   //source has no energy
   if (this.memory.role == 'toad') {
    //toads eat if no energy in source
    return this.eat();
   } else if (this.memory.role == 'frog') {
    //frogs look for dropped energy before eating
    return this.sweep();
   }
   return Memory.emoji.oops + Memory.emoji.mine + Memory.emoji.oops;
  case -9:
   //set move
   this.moveTo(Game.getObjectById(this.memory.jobs.mine), {
    visualizePathStyle: {
     reusePath: 10,
     fill: 'transparent',
     stroke: '#eeff99',
     lineStyle: 'solid',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return Memory.emoji.hop;
  case -12:
   //no work parts
   this.deleteWorker('mine');
   this.deleteAssignment('mine');
   return Memory.emoji.oops + Memory.emoji.mine + Memory.emoji.oops;
  }
 } catch (ex) {
  //console.log(ex);
  this.assignTask('mine');
 }
};