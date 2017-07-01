/*jshint -W008 */
/// PICKUP PLUS ///
Creep.prototype.sweep = function() {
  if (this.memory.jobs.sweep) {
    switch (this.pickup(Game.getObjectById(this.memory.jobs.sweep))) {
      case 0:
        //memory is already cleared
        return Memory.emoji.sweep;
      case -9:
        //set move
        this.moveTo(Game.getObjectById(this.memory.jobs.sweep), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#eecc00',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.frog;
    }
  }
  return Memory.emoji.oops + Memory.emoji.sweep + Memory.emoji.oops;
};
