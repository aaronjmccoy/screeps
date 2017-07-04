/*jshint -W008 */
/// PICKUP PLUS ///
Creep.prototype.sweep = function() {
  if (Game.getObjectById(this.memory.jobs.sweep).resourceType == 'energy') {
    switch (this.pickup(Game.getObjectById(this.memory.jobs.sweep))) {
      case 0:
        return Memory.emoji.sweep;
      case -9:
        if (!this.sweepAura()) {
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
          return Memory.emoji.hop;
        } else {
          return Memory.emoji.sogood;
        }

    }
  }
  return Memory.emoji.oops + Memory.emoji.sweep + Memory.emoji.oops;
};
