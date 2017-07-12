/*jshint -W008 */
//// RENEWCREEP PLUS ////
Creep.prototype.eat = function () {
 if (this.memory.jobs.eat) {
  switch (Game.getObjectById(this.memory.jobs.eat).renewCreep(this)) {
  case 0:
   this.depositAura();
   return Memory.emoji.eat;
  case -9:
   if (!this.eatAura() && this.memory.hungry) {
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
   } else if (this.memory.role == 'toad') {
    this.moveTo(Game.getObjectById(this.memory.jobs.mine));
    return Memory.emoji.sogood;
   } else {
    this.moveTo(this.room.storage);
    return Memory.emoji.sogood;
   }
   break;
  case -6:
  case -7:
  case -8:
   if (this.memory.role == 'toad') {
    this.moveTo(Game.getObjectById(this.memory.jobs.mine));
    return Memory.emoji.hop;
   } else {
    this.moveTo(this.room.storage);
   }
  }
  return Memory.emoji.oops + Memory.emoji.eat + Memory.emoji.oops;
 }
};
