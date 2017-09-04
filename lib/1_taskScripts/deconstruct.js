/*jshint -W008 */
//// BUILD PLUS ////
Creep.prototype.deconstruct = function () {
 if (this.memory.jobs.deconstruct) {
  switch (this.dismantle(Game.getObjectById(this.memory.jobs.deconstruct))) {
  case 0:
   return Memory.emoji.deconstruct;
  case -9:
   if (!this.deconstructAura()) {
    //set move
    CM.set(this.pos.x, this.pos.y, 0);
    this.moveTo(Game.getObjectById(this.memory.jobs.deconstruct), {
     visualizePathStyle: {
      fill: 'transparent',
      stroke: '#ff0000',
      lineStyle: 'solid',
      strokeWidth: .15,
      opacity: .4
     }
    });
    return Memory.emoji.hop;
   } else {
    return Memory.emoji.sogood;
   }

  }
 }
 return Memory.emoji.oops + Memory.emoji.deconstruct + Memory.emoji.oops;
};
