/*jshint -W008 */
//// RENEWCREEP PLUS ////
Creep.prototype.eat = function () {
 //any creep checking to eat with less hp thean 1400 should eat then
 if (this.ticksToLive < 420) {
  this.memory.hungry = true;
 } else {
  this.memory.hungry = false;
 }
 if (this.memory.jobs.eat) {
  if (Game.getObjectById(this.memory.jobs.eat).renewCreep(this) === 0) {
   this.depositAura();
   return Memory.emoji.eat;
  } else {
   //if hungry eat
   if (this.memory.hungry) {
    //set move
    CM.set(this.pos.x, this.pos.y, 0);
    this.moveTo(Game.getObjectById(this.memory.jobs.eat), {
     visualizePathStyle: {
      fill: 'transparent',
      stroke: '#00eeff',
      lineStyle: 'solid',
      strokeWidth: .15,
      opacity: .1
     }
    });
    return Memory.emoji.hop;
    //if not go back to a starting point
   } else {
    if (this.memory.role == 'toad') {
     this.moveTo(Game.getObjectById(this.memory.jobs.mine), {
      visualizePathStyle: {
       fill: 'transparent',
       stroke: '#eeff99',
       lineStyle: 'solid',
       strokeWidth: .15,
       opacity: .1
      }
     });
     return Memory.emoji.hop;
    } else {
     this.moveTo(Game.rooms[this.memory.room].storage);
     return Memory.emoji.hop;
    }
   }
  }
  return this.moveTo(Game.getObjectById(this.memory.jobs.eat), {
   visualizePathStyle: {
    fill: 'transparent',
    stroke: '#00eeff',
    lineStyle: 'solid',
    strokeWidth: .15,
    opacity: .1
   }
  });
 }
};
