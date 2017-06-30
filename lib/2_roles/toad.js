Creep.prototype.toad = function () {
 //state flipper
 if (this.carry.energy === 0) {
  this.memory.state = 0;
 }
 //if creep has energy
 else if (this.carry.energy >= 40) {
  this.memory.state = 1;
 }

 //if this has energy
 if (this.memory.state) {
  //drop container on mine
  if (!this.memory.builtcontainer) {
   if (this.room.createConstructionSite(this.pos, STRUCTURE_CONTAINER) === 0 || this.room.lookForAt(LOOK_CONSTRUCTION_SITES, this.pos).length) {
    this.memory.builtcontainer = 1;
    return Memory.emoji.frog;
   } else {
    this.memory.builtcontainer = 2;
   }
  }
  if (this.memory.builtcontainer == 1) {
   if (this.room.memory.jobs.construct.tasks.length) {
    return this.construct();
   } else {
    this.memory.builtcontainer = null;
   }
  } else {
   return this.mine();
  }
  return Memory.emoji.frog;
 }
 //if this has no energy
 else {
  //console.log('frog this: ' + JSON.stringify(this));
  return this.mine();
 }
};
