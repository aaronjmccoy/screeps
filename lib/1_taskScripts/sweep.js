/*jshint -W008 */
/// PICKUP PLUS ///
Creep.prototype.sweep = function () {
 if (Game.getObjectById(this.memory.tasks.sweep).resourceType == 'energy') {
  switch (this.pickup(Game.getObjectById(this.memory.tasks.sweep))) {
  case 0:
   return Memory.emoji.sweep;
  case -9:
   if (!this.sweepAura()) {
    //set move
    CM.set(this.pos.x, this.pos.y, 0);
    this.moveTo(Game.getObjectById(this.memory.tasks.sweep), {
     reusePath: 10,
     visualizePathStyle: {
      fill: 'transparent',
      stroke: '#eecc00',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
     },
     costCallback: CM
    });
    return Memory.emoji.hop;
   } else {
    return Memory.emoji.sogood;
   }

  }
 }
 return Memory.emoji.oops + Memory.emoji.sweep + Memory.emoji.oops;
};
